"""
Inventory Service Layer.

OOP / ARCHITECTURAL PURPOSE:
Implements the Service Layer pattern for the inventory domain (Single Responsibility Principle).
Isolates business logic for stock querying, valuation, and adjustments away from
DRF views and serializers, allowing for reusability across APIs, CLI scripts, and background tasks.
"""

from django.db import transaction
from django.db.models import F, Sum, DecimalField, ExpressionWrapper
from django.core.exceptions import ValidationError
from .models import Product, Stock

class InventoryService:
    """
    Encapsulates domain operations on products and warehouse stock levels.
    """

    @staticmethod
    def get_low_stock_queryset():
        """
        Retrieves products whose current inventory is strictly below or equal to their reorder level.
        Uses Django's F() expression to perform database-level column comparison for high efficiency.
        """
        return Stock.objects.select_related('product', 'product__category').filter(
            quantity__lte=F('product__reorder_level')
        )

    @staticmethod
    def calculate_total_inventory_value():
        """
        Calculates total inventory holding value: SUM(quantity * cost_price).
        """
        valuation = Stock.objects.annotate(
            item_value=ExpressionWrapper(
                F('quantity') * F('product__cost_price'),
                output_field=DecimalField(max_digits=14, decimal_places=2)
            )
        ).aggregate(total=Sum('item_value'))['total']
        return valuation or 0.00

    @classmethod
    @transaction.atomic
    def manual_stock_adjustment(cls, product_id: int, new_quantity: int, reason: str = "") -> Stock:
        """
        Allows authorized warehouse managers to perform cycle counts and adjust stock.
        Guarantees that adjustments are performed inside an atomic transaction.
        """
        if new_quantity < 0:
            raise ValidationError("Stock quantity cannot be adjusted below zero.")

        try:
            stock = Stock.objects.select_for_update().get(product_id=product_id)
        except Stock.DoesNotExist:
            raise ValidationError(f"Stock record for product ID {product_id} does not exist.")

        stock.quantity = new_quantity
        stock.save(update_fields=['quantity', 'updated_at'])
        return stock
