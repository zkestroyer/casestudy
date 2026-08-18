from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Product, Stock, Supplier, Customer
from .serializers import CategorySerializer, ProductSerializer, StockSerializer, SupplierSerializer, CustomerSerializer
from django.db.models import F

class CategoryViewSet(viewsets.ModelViewSet):
    """
    Category ViewSet.
    PURPOSE: Provides CRUD operations for product categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    """
    Product ViewSet.
    PURPOSE: Manages products. Uses select_related to optimize database queries,
    preventing N+1 query problems when accessing category and stock info.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'sku']

    def get_queryset(self):
        """
        Queryset overridden to allow filtering by category via query parameters,
        while maintaining optimized select_related joins.
        """
        queryset = Product.objects.select_related('category', 'stock').all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
        return queryset

class SupplierViewSet(viewsets.ModelViewSet):
    """
    Supplier ViewSet.
    """
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]

class CustomerViewSet(viewsets.ModelViewSet):
    """
    Customer ViewSet.
    Includes searching capabilities by name and email.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email']

class StockViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Stock ViewSet.
    PURPOSE: Read-only access to stock levels. Stock is modified via Purchase/Sales orders, 
    not directly, ensuring auditability.
    """
    queryset = Stock.objects.select_related('product', 'product__category').all()
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def low(self, request):
        """
        Custom action to quickly retrieve products below their reorder threshold.
        Using F() expressions allows the database to perform the comparison natively.
        """
        low_stock = Stock.objects.select_related('product', 'product__category').filter(quantity__lt=F('product__reorder_level'))
        serializer = self.get_serializer(low_stock, many=True)
        return Response(serializer.data)
