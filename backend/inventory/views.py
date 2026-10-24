"""
Inventory Domain Views.

OOP / ARCHITECTURAL PURPOSE:
Provides RESTful controllers for Categories, Products, Suppliers, Customers, and Stock.
Employs select_related and prefetch_related for optimal SQL query execution,
and delegates domain queries to the InventoryService.
"""

from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Product, Stock, Supplier, Customer
from .serializers import (
    CategorySerializer, 
    ProductSerializer, 
    StockSerializer, 
    SupplierSerializer, 
    CustomerSerializer
)
from .services import InventoryService


class CategoryViewSet(viewsets.ModelViewSet):
    """Provides standard CRUD operations for product categories."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductViewSet(viewsets.ModelViewSet):
    """
    Manages catalog items.
    Applies eager loading (select_related) to eradicate N+1 database queries.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'sku']

    def get_queryset(self):
        queryset = Product.objects.select_related('category', 'stock').all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
        return queryset


class SupplierViewSet(viewsets.ModelViewSet):
    """Manages vendor profiles."""
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email', 'phone']


class CustomerViewSet(viewsets.ModelViewSet):
    """Manages customer client records."""
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email', 'phone']


class StockViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to inventory levels.
    Stock changes are strictly governed by order confirmations or explicit service adjustments.
    """
    queryset = Stock.objects.select_related('product', 'product__category').all()
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def low(self, request):
        """
        Retrieves all inventory items currently at or below their reorder threshold.
        Delegates the query to InventoryService for encapsulated domain logic.
        """
        low_stock = InventoryService.get_low_stock_queryset()
        serializer = self.get_serializer(low_stock, many=True)
        return Response(serializer.data)
