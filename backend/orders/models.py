from django.db import models, transaction
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from inventory.models import Supplier, Customer, Product, Stock

class PurchaseOrder(models.Model):
    """
    Purchase Order Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Encapsulates a procurement request to a supplier. Encapsulates order state transitions
    (draft -> confirmed -> received) and triggers atomic stock increments upon goods receipt.
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='purchase_orders')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='purchase_orders_created')
    order_date = models.DateField(help_text="Date the order was initiated.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"PO-{self.id} - {self.supplier.name}"

    # --- Domain Methods (OOP Encapsulation) ---
    def recalculate_total(self) -> None:
        """Aggregates subtotals of all related line items into total_amount."""
        total = sum(item.subtotal for item in self.items.all())
        self.total_amount = total
        self.save(update_fields=['total_amount', 'updated_at'])

    def can_confirm(self) -> bool:
        """Determines if the order is in a valid state to be confirmed."""
        return self.status in ['draft', 'pending']

    @transaction.atomic
    def confirm(self) -> None:
        """
        Executes order confirmation within an atomic transaction.
        Increments stock for all line items and transitions order status to 'confirmed'.
        """
        if not self.can_confirm():
            raise ValidationError(f"Cannot confirm purchase order with status '{self.status}'.")

        total = 0
        for item in self.items.select_related('product__stock').all():
            total += item.subtotal
            item.product.stock.increase(item.quantity)

        self.total_amount = total
        self.status = 'confirmed'
        self.save(update_fields=['total_amount', 'status', 'updated_at'])


class PurchaseItem(models.Model):
    """
    Purchase Item Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Associative entity resolving the Many-to-Many relationship between PurchaseOrder and Product.
    Preserves historical unit cost at transaction time.
    """
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='purchase_items')
    quantity = models.IntegerField(default=1)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, blank=True)

    class Meta:
        ordering = ['id']

    def save(self, *args, **kwargs):
        """Auto-computes subtotal to preserve data integrity and prevent client manipulation."""
        self.subtotal = self.quantity * self.unit_cost
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class SalesOrder(models.Model):
    """
    Sales Order Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Encapsulates customer order agreements, manages status transitions, and enforces
    atomic inventory deductions to prevent negative stock and race conditions.
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='sales_orders')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sales_orders_created')
    order_date = models.DateField(help_text="Date order was placed.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"SO-{self.id} - {self.customer.name}"

    # --- Domain Methods (OOP Encapsulation) ---
    def recalculate_total(self) -> None:
        """Aggregates subtotals of all child line items."""
        total = sum(item.subtotal for item in self.items.all())
        self.total_amount = total
        self.save(update_fields=['total_amount', 'updated_at'])

    def can_fulfill(self) -> tuple[bool, list[str]]:
        """
        Validates inventory availability across all items before making any stock changes.
        Returns (is_fulfillable, list_of_error_messages).
        """
        errors = []
        for item in self.items.select_related('product__stock').all():
            stock = item.product.stock
            if stock.quantity < item.quantity:
                errors.append(
                    f"Insufficient stock for {item.product.name}. Available: {stock.quantity}, Requested: {item.quantity}"
                )
        return len(errors) == 0, errors

    @transaction.atomic
    def confirm(self) -> None:
        """
        Confirms the sales order atomically.
        Validates stock first, then deducts stock across all line items and updates order status.
        """
        if self.status not in ['draft', 'pending']:
            raise ValidationError(f"Cannot confirm sales order with status '{self.status}'.")

        is_fulfillable, errors = self.can_fulfill()
        if not is_fulfillable:
            raise ValidationError("; ".join(errors))

        total = 0
        for item in self.items.select_related('product__stock').all():
            total += item.subtotal
            item.product.stock.deduct(item.quantity)

        self.total_amount = total
        self.status = 'confirmed'
        self.save(update_fields=['total_amount', 'status', 'updated_at'])


class OrderItem(models.Model):
    """
    Order Item Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Associative entity resolving the Many-to-Many relationship between SalesOrder and Product.
    Locks in the sale price at the moment of order creation.
    """
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='sales_items')
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, blank=True)

    class Meta:
        ordering = ['id']

    def save(self, *args, **kwargs):
        """Auto-computes subtotal to preserve historical accuracy."""
        self.subtotal = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class Payment(models.Model):
    """
    Payment Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Encapsulates monetary receipts against specific sales orders, facilitating
    accounts receivable reconciliation and cash-flow reporting.
    """
    PAYMENT_METHOD_CHOICES = (
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('bank_transfer', 'Bank Transfer'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    payment_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-payment_date']

    def __str__(self):
        return f"Payment #{self.id} - ${self.amount} ({self.get_payment_method_display()}) on SO-{self.sales_order.id}"
