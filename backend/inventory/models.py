from django.db import models
from django.core.exceptions import ValidationError

class Category(models.Model):
    """
    Product Category Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Encapsulates hierarchical catalog grouping. Grouping products logically allows
    efficient querying, UI filtering, and granular inventory valuation.
    """
    name = models.CharField(max_length=100, help_text="Category name.")
    description = models.TextField(blank=True, help_text="Optional descriptive summary.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp of creation.")

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    """
    Product Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Core entity representing catalog items. Encapsulates pricing, stock identification (SKU),
    and reorder threshold logic.
    
    NORMALISATION (3NF):
    Separates product metadata from dynamic stock counts (`Stock` model) to prevent 
    row-locking contention during high-velocity checkout operations.
    """
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='products',
        help_text="Associated category (set to NULL on category deletion)."
    )
    name = models.CharField(max_length=200, help_text="Product name.")
    sku = models.CharField(max_length=50, unique=True, help_text="Stock Keeping Unit (Unique Identifier).")
    description = models.TextField(blank=True, help_text="Product description.")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Selling price.")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Cost price paid to supplier.")
    reorder_level = models.IntegerField(default=10, help_text="Threshold quantity triggering low-stock alert.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.sku} - {self.name}"

    # --- Domain Methods (OOP Encapsulation) ---
    @property
    def current_stock(self) -> int:
        """Returns the current inventory count from the associated Stock entity."""
        return getattr(self.stock, 'quantity', 0) if hasattr(self, 'stock') else 0

    def is_low_stock(self) -> bool:
        """Evaluates whether the item's current inventory is at or below its reorder threshold."""
        return self.current_stock <= self.reorder_level

    @property
    def gross_margin(self):
        """Calculates expected margin per unit: price - cost_price."""
        return self.price - self.cost_price


class Stock(models.Model):
    """
    Stock Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Isolates quantity mutability from static product definition. Encapsulates inventory
    mutation rules (increments, decrements, and stock-out validation).
    """
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='stock')
    quantity = models.IntegerField(default=0, help_text="Current available inventory on hand.")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['product__name']
        verbose_name_plural = 'Stock'

    def __str__(self):
        return f"{self.product.name} (Qty: {self.quantity})"

    # --- Domain Methods (OOP Encapsulation) ---
    def is_low(self) -> bool:
        """Checks if current quantity is at or below the product reorder level."""
        return self.quantity <= self.product.reorder_level

    def increase(self, amount: int) -> None:
        """
        Increases stock by a non-negative amount.
        Raises ValidationError if amount is non-positive.
        """
        if amount <= 0:
            raise ValidationError("Stock increment must be a positive integer.")
        self.quantity += amount
        self.save(update_fields=['quantity', 'updated_at'])

    def deduct(self, amount: int) -> None:
        """
        Decreases stock by a positive amount, preventing negative inventory.
        Raises ValidationError if insufficient stock is available.
        """
        if amount <= 0:
            raise ValidationError("Stock deduction must be a positive integer.")
        if self.quantity < amount:
            raise ValidationError(
                f"Insufficient stock for {self.product.name}. Available: {self.quantity}, Requested: {amount}"
            )
        self.quantity -= amount
        self.save(update_fields=['quantity', 'updated_at'])


class Supplier(models.Model):
    """
    Supplier Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Encapsulates vendor profiles supplying goods into the procurement pipeline.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, help_text="Contact email.")
    phone = models.CharField(max_length=20, blank=True, help_text="Contact phone.")
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Customer(models.Model):
    """
    Customer Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Encapsulates purchasing entities for sales orders and payment reconciliation.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, help_text="Customer email address.")
    phone = models.CharField(max_length=20, blank=True, help_text="Contact phone number.")
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
