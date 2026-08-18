from django.db import models

class Category(models.Model):
    """
    Product Category Model.
    WHY IT EXISTS: Organizes products into logical groupings, allowing for structured 
    cataloging, filtering, and reporting in the business workflow.
    """
    name = models.CharField(max_length=100, help_text="Category name, chosen as CharField for short textual data.")
    description = models.TextField(blank=True, help_text="TextField for potentially long textual descriptions.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Tracks the exact time of creation.")

    class Meta:
        """
        Meta Class Explanation:
        - ordering: Ensures categories are fetched alphabetically by default to maintain consistency in UI drop-downs.
        """
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(models.Model):
    """
    Product Model.
    WHY IT EXISTS: Represents the core entity of the business's inventory system. 
    It tracks the goods available for purchase or sale.
    """
    # WHY ForeignKey: A product belongs to one category, but a category can have many products. 
    # SET_NULL allows keeping the product if the category is deleted, avoiding cascading deletions.
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    name = models.CharField(max_length=200, help_text="Product name, max 200 chars for comprehensive titles.")
    sku = models.CharField(max_length=50, unique=True, help_text="Stock Keeping Unit. Unique CharField to uniquely identify inventory items.")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="DecimalField ensures exact precision for financial data.")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    reorder_level = models.IntegerField(default=10, help_text="Integer to trigger low stock alerts when quantity falls below this.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """
        ordering = ['name']: Keeps product lists alphabetically sorted by default.
        """
        ordering = ['name']

    def __str__(self):
        return f"{self.sku} - {self.name}"

class Stock(models.Model):
    """
    Stock Model.
    WHY IT EXISTS: Segregates stock quantity from the Product model. This allows for frequent 
    quantity updates without causing unnecessary locks or overhead on the main Product record.
    """
    # WHY OneToOneField: Each product has exactly one canonical stock record. 
    # CASCADE is appropriate here: if a product ceases to exist, its stock naturally ceases to exist.
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='stock')
    quantity = models.IntegerField(default=0, help_text="Integer chosen for discrete item counts.")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['product__name']

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"

class Supplier(models.Model):
    """
    Supplier Model.
    WHY IT EXISTS: Tracks external entities from which the business purchases its inventory, enabling procurement tracking.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, help_text="EmailField automatically validates email format.")
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Customer(models.Model):
    """
    Customer Model.
    WHY IT EXISTS: Stores data for entities purchasing from the business, essential for generating Sales Orders.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
