from django.db import models
from django.contrib.auth.models import User
from inventory.models import Supplier, Customer, Product

class PurchaseOrder(models.Model):
    """
    Purchase Order Model.
    WHY IT EXISTS: Represents a formal request/transaction to purchase goods from a Supplier.
    
    STATUS_CHOICES Explanation:
    - 'draft': Initial creation, still being edited, no stock impact.
    - 'pending': Sent to supplier, waiting for fulfillment.
    - 'confirmed': Goods received, stock officially updated.
    - 'cancelled': Order aborted, no further action.
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )
    # WHY PROTECT: We must not delete a supplier if there are historical purchase orders linked to it (audit trail).
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='purchase_orders')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='purchase_orders_created')
    order_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at'] # Shows newest orders first

    def __str__(self):
        return f"PO-{self.id} - {self.supplier.name}"

class PurchaseItem(models.Model):
    """
    Purchase Item Model.
    WHY IT EXISTS: Resolves the Many-to-Many relationship between PurchaseOrder and Product, 
    storing the specific quantity and cost at the exact time of the order.
    """
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    # WHY PROTECT: Cannot delete a product if it's referenced in historical purchase items.
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='purchase_items')
    quantity = models.IntegerField(default=1)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, blank=True)

    class Meta:
        ordering = ['id']

    def save(self, *args, **kwargs):
        """
        WHY subtotal is auto-calculated:
        Ensures consistency between quantity, unit_cost, and subtotal. Prevents data integrity 
        issues where an API or client might send an incorrect subtotal.
        """
        self.subtotal = self.quantity * self.unit_cost
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

class SalesOrder(models.Model):
    """
    Sales Order Model.
    WHY IT EXISTS: Tracks customer purchases.
    
    STATUS_CHOICES Explanation:
    - 'draft': Initial entry, no stock deduction.
    - 'pending': Awaiting payment or confirmation.
    - 'confirmed': Stock is deducted, finalizing the sale.
    - 'completed': Order fulfilled and closed.
    - 'cancelled': Order negated.
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    # WHY PROTECT: Historical sales data must be retained even if the customer record is deleted.
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='sales_orders')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sales_orders_created')
    order_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"SO-{self.id} - {self.customer.name}"

class OrderItem(models.Model):
    """
    Order Item Model.
    WHY IT EXISTS: Resolves the Many-to-Many relationship between SalesOrder and Product.
    Stores the specific price the item was sold at.
    """
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='items')
    # WHY PROTECT: Historical sales must keep their product references for auditing.
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='sales_items')
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, blank=True)

    class Meta:
        ordering = ['id']

    def save(self, *args, **kwargs):
        """Auto-calculate subtotal for data integrity, preventing client-side spoofing."""
        self.subtotal = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

class Payment(models.Model):
    """
    Payment Model.
    WHY IT EXISTS: Records financial transactions against a specific Sales Order.
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
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-payment_date']

    def __str__(self):
        return f"Payment {self.id} - {self.sales_order}"
