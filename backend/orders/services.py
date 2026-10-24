"""
Order and Financial Processing Services.

OOP / ARCHITECTURAL PURPOSE:
Implements the Service Layer pattern for the Procurement, Sales, and Financial Reconciliation workflows.
Orchestrates multi-model state changes within transaction boundaries, enforces domain invariants,
and generates operational dashboard analytics.
"""

from decimal import Decimal
from datetime import timedelta
from django.db import transaction
from django.db.models import Sum, Count, F
from django.utils import timezone
from django.core.exceptions import ValidationError

from .models import PurchaseOrder, SalesOrder, Payment
from inventory.models import Product, Customer, Supplier, Stock


class OrderProcessingService:
    """
    Service responsible for orchestrating Order confirmation workflows (Single Responsibility Principle).
    """

    @classmethod
    def confirm_purchase_order(cls, order: PurchaseOrder) -> PurchaseOrder:
        """
        Orchestrates purchase order confirmation and goods receiving.
        Delegates the atomic mutation logic to the model's domain method.
        """
        order.confirm()
        return order

    @classmethod
    def confirm_sales_order(cls, order: SalesOrder) -> SalesOrder:
        """
        Orchestrates sales order validation and stock deduction.
        Ensures all items are available before mutating any stock in the database.
        """
        order.confirm()
        return order


class PaymentProcessingService:
    """
    Service responsible for handling customer receipts and accounts receivable reconciliation.
    """

    @classmethod
    @transaction.atomic
    def record_sales_payment(cls, sales_order: SalesOrder, amount: Decimal, payment_method: str) -> Payment:
        """
        Validates payment amount and records transaction against a Sales Order.
        If the total paid equals or exceeds the order total, automatically transitions
        sales order status to 'completed'.
        """
        if amount <= 0:
            raise ValidationError("Payment amount must be greater than zero.")

        payment = Payment.objects.create(
            sales_order=sales_order,
            amount=amount,
            payment_method=payment_method,
            status='completed'
        )

        # Check total payments recorded against this order
        total_paid = sales_order.payments.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
        if total_paid >= sales_order.total_amount and sales_order.status == 'confirmed':
            sales_order.status = 'completed'
            sales_order.save(update_fields=['status', 'updated_at'])

        return payment


class DashboardMetricsService:
    """
    Service responsible for aggregating real-time operational and financial KPIs.
    """

    @staticmethod
    def get_dashboard_metrics() -> dict:
        """
        Aggregates operational counts, revenue sums, recent records, and historical charts.
        """
        from .serializers import SalesOrderSerializer, PurchaseOrderSerializer

        # 1. Operational Counts
        total_products = Product.objects.count()
        total_customers = Customer.objects.count()
        total_suppliers = Supplier.objects.count()
        total_orders = SalesOrder.objects.count()
        total_purchases = PurchaseOrder.objects.count()

        # 2. Financial Aggregations
        sales_total = SalesOrder.objects.filter(
            status__in=['confirmed', 'completed']
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or Decimal('0.00')

        purchases_total = PurchaseOrder.objects.filter(
            status='confirmed'
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or Decimal('0.00')

        # 3. Recent Transactions
        recent_orders = SalesOrderSerializer(
            SalesOrder.objects.select_related('customer', 'created_by').order_by('-created_at')[:5], 
            many=True
        ).data

        recent_purchases = PurchaseOrderSerializer(
            PurchaseOrder.objects.select_related('supplier', 'created_by').order_by('-created_at')[:5], 
            many=True
        ).data

        # 4. Low Stock Alerts
        low_stock_query = Stock.objects.filter(
            quantity__lte=F('product__reorder_level')
        ).select_related('product')
        low_stock_count = low_stock_query.count()

        low_stock_items = [
            {
                'id': stock.product.id,
                'name': stock.product.name,
                'quantity': stock.quantity,
                'minimum': stock.product.reorder_level,
                'status': 'Critical' if stock.quantity == 0 else 'Low'
            }
            for stock in low_stock_query.order_by('quantity')[:5]
        ]

        # 5. Sales Order Status Distribution (For Donut/Pie Chart)
        status_counts = SalesOrder.objects.values('status').annotate(count=Count('id'))
        order_status_breakdown = [
            {'name': item['status'].capitalize(), 'value': item['count']} 
            for item in status_counts
        ]

        # 6. 6-Month Rolling Revenue History (For Line Chart)
        now = timezone.now()
        revenue_history = []
        for i in range(5, -1, -1):
            month_date = now - timedelta(days=30 * i)
            month_name = month_date.strftime('%b')
            month_sales = SalesOrder.objects.filter(
                status__in=['confirmed', 'completed'],
                created_at__month=month_date.month,
                created_at__year=month_date.year
            ).aggregate(Sum('total_amount'))['total_amount__sum'] or Decimal('0.00')
            revenue_history.append({'name': month_name, 'revenue': float(month_sales)})

        return {
            'total_products': total_products,
            'total_customers': total_customers,
            'total_suppliers': total_suppliers,
            'total_orders': total_orders,
            'total_purchases': total_purchases,
            'sales_total': float(sales_total),
            'revenue': float(sales_total),  # Frontend compatibility alias
            'purchases_total': float(purchases_total),
            'low_stock_count': low_stock_count,
            'low_stock_items': low_stock_items,
            'recent_orders': recent_orders,
            'recent_purchases': recent_purchases,
            'order_status_breakdown': order_status_breakdown,
            'revenue_history': revenue_history,
        }
