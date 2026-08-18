from rest_framework import serializers
from .models import PurchaseOrder, PurchaseItem, SalesOrder, OrderItem, Payment

class PurchaseItemSerializer(serializers.ModelSerializer):
    """
    Serializer for PurchaseItem.
    PURPOSE: Validates individual item entries within a Purchase Order.
    READ_ONLY: 'subtotal' is read-only because it is automatically calculated in the model's save() method.
    """
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = PurchaseItem
        fields = ('id', 'product', 'product_name', 'quantity', 'unit_cost', 'subtotal')
        read_only_fields = ('subtotal',)

class PurchaseOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for PurchaseOrder.
    NESTED PATTERN: Items are nested because a PurchaseOrder isn't logically complete without them.
    This serializer handles creating both the parent order and its child items in one request.
    READ_ONLY: 'total_amount' is calculated on confirmation, 'created_by' is set automatically from request.
    """
    items = PurchaseItemSerializer(many=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = ('id', 'supplier', 'supplier_name', 'created_by', 'order_date', 'status', 'total_amount', 'created_at', 'items')
        read_only_fields = ('total_amount', 'created_by')

    def create(self, validated_data):
        """
        Nested creation logic:
        Pops the nested items data, creates the main PurchaseOrder instance, 
        and then iterates over the items to create them and link them to the parent order.
        """
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        purchase_order = PurchaseOrder.objects.create(created_by=user, **validated_data)
        for item_data in items_data:
            PurchaseItem.objects.create(purchase_order=purchase_order, **item_data)
        return purchase_order

class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for OrderItem.
    PURPOSE: Handles individual item entries within a Sales Order.
    READ_ONLY: 'subtotal' to prevent client-side tampering.
    """
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'quantity', 'unit_price', 'subtotal')
        read_only_fields = ('subtotal',)

class SalesOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for SalesOrder.
    NESTED PATTERN: Like PurchaseOrder, manages order and items transactionally from a single payload.
    """
    items = OrderItemSerializer(many=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = SalesOrder
        fields = ('id', 'customer', 'customer_name', 'created_by', 'order_date', 'status', 'total_amount', 'created_at', 'items')
        read_only_fields = ('total_amount', 'created_by')

    def create(self, validated_data):
        """
        Nested creation logic for Sales Orders and their corresponding Items.
        """
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        sales_order = SalesOrder.objects.create(created_by=user, **validated_data)
        for item_data in items_data:
            OrderItem.objects.create(sales_order=sales_order, **item_data)
        return sales_order

class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payments."""
    class Meta:
        model = Payment
        fields = '__all__'
