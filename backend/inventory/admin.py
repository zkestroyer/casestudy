from django.contrib import admin
from .models import Category, Product, Stock, Supplier, Customer

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin interface for Category."""
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin interface for Product."""
    list_display = ('name', 'sku', 'category', 'price', 'reorder_level')
    search_fields = ('name', 'sku')
    list_filter = ('category',)

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    """Admin interface for Stock."""
    list_display = ('product', 'quantity', 'updated_at')
    search_fields = ('product__name', 'product__sku')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    """Admin interface for Supplier."""
    list_display = ('name', 'email', 'phone')
    search_fields = ('name', 'email')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    """Admin interface for Customer."""
    list_display = ('name', 'email', 'phone')
    search_fields = ('name', 'email')
