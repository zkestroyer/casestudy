from django.contrib import admin
from .models import PurchaseOrder, PurchaseItem, SalesOrder, OrderItem, Payment

class PurchaseItemInline(admin.TabularInline):
    model = PurchaseItem
    extra = 1

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    """Admin interface for PurchaseOrder."""
    list_display = ('id', 'supplier', 'status', 'total_amount', 'order_date')
    list_filter = ('status', 'order_date')
    search_fields = ('supplier__name',)
    inlines = [PurchaseItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(SalesOrder)
class SalesOrderAdmin(admin.ModelAdmin):
    """Admin interface for SalesOrder."""
    list_display = ('id', 'customer', 'status', 'total_amount', 'order_date')
    list_filter = ('status', 'order_date')
    search_fields = ('customer__name',)
    inlines = [OrderItemInline]

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin interface for Payment."""
    list_display = ('id', 'sales_order', 'amount', 'payment_method', 'status')
    list_filter = ('status', 'payment_method')
