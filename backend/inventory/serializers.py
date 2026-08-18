from rest_framework import serializers
from .models import Category, Product, Stock, Supplier, Customer

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.
    PURPOSE: Converts Category model instances into JSON representation.
    """
    class Meta:
        model = Category
        fields = '__all__'

class StockSerializer(serializers.ModelSerializer):
    """
    Serializer for the Stock model.
    PURPOSE: Provides stock quantities and optionally related product info.
    Includes flattened product details to minimize extra lookups on the frontend.
    """
    product = serializers.PrimaryKeyRelatedField(read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    category_name = serializers.CharField(source='product.category.name', read_only=True)
    reorder_level = serializers.IntegerField(source='product.reorder_level', read_only=True)

    class Meta:
        model = Stock
        fields = ('id', 'product', 'product_name', 'product_sku', 'category_name', 'quantity', 'reorder_level', 'updated_at')

class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for the Product model.
    PURPOSE: Represents complete product information.
    NESTED RELATIONSHIPS: Includes `stock` (nested) and `category_name` to provide a rich 
    payload in a single API call, reducing the number of requests needed by the client.
    """
    stock = StockSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    """
    Serializer for the Supplier model.
    """
    class Meta:
        model = Supplier
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    """
    Serializer for the Customer model.
    """
    class Meta:
        model = Customer
        fields = '__all__'
