from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import PurchaseOrder, SalesOrder, Payment
from .serializers import PurchaseOrderSerializer, SalesOrderSerializer, PaymentSerializer
from inventory.models import Stock, Product
from django.db import transaction
from django.db.models import Sum, F

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """
    Purchase Order ViewSet.
    PURPOSE: Manages supplier purchase orders.
    """
    queryset = PurchaseOrder.objects.prefetch_related('items__product').select_related('supplier', 'created_by').all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        CONFIRM ACTION:
        Finalizes a purchase order. Uses transaction.atomic() to ensure that stock increments
        and order status updates either all succeed or all fail, preserving data consistency.
        """
        order = self.get_object()
        if order.status != 'draft' and order.status != 'pending':
            return Response({'error': 'Can only confirm draft or pending orders'}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            total = 0
            for item in order.items.select_related('product__stock').all():
                total += item.subtotal
                stock = item.product.stock
                stock.quantity += item.quantity
                stock.save()
            order.total_amount = total
            order.status = 'confirmed'
            order.save()
        
        return Response({'status': 'confirmed', 'total_amount': order.total_amount})

class SalesOrderViewSet(viewsets.ModelViewSet):
    """
    Sales Order ViewSet.
    PURPOSE: Manages customer sales orders.
    """
    queryset = SalesOrder.objects.prefetch_related('items__product').select_related('customer', 'created_by').all()
    serializer_class = SalesOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        CONFIRM ACTION:
        Finalizes a sales order. Uses transaction.atomic() to prevent race conditions.
        CRITICAL FIX: Validates all items' stock availability BEFORE mutating any stock,
        so early returns don't accidentally commit partial stock deductions.
        """
        order = self.get_object()
        if order.status != 'draft' and order.status != 'pending':
            return Response({'error': 'Can only confirm draft or pending orders'}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            total = 0
            # VALIDATION PASS - check stock before any mutations
            for item in order.items.select_related('product__stock').all():
                stock = item.product.stock
                if stock.quantity < item.quantity:
                    return Response(
                        {'error': f'Insufficient stock for {item.product.name}. Available: {stock.quantity}, Requested: {item.quantity}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # MUTATION PASS - safe to deduct stock now
            for item in order.items.select_related('product__stock').all():
                total += item.subtotal
                stock = item.product.stock
                stock.quantity -= item.quantity
                stock.save()
            
            order.total_amount = total
            order.status = 'confirmed'
            order.save()
        
        return Response({'status': 'confirmed', 'total_amount': order.total_amount})

class PaymentViewSet(viewsets.ModelViewSet):
    """
    Payment ViewSet.
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard(request):
    """
    Dashboard API.
    PURPOSE: Aggregates high-level metrics for the main application interface.
    Provides total counts, financial sums, and recent activity in one unified call.
    """
    from inventory.models import Product, Customer, Supplier
    
    total_products = Product.objects.count()
    total_customers = Customer.objects.count()
    total_suppliers = Supplier.objects.count()
    total_orders = SalesOrder.objects.count()
    total_purchases = PurchaseOrder.objects.count()
    
    sales_total = SalesOrder.objects.filter(status__in=['confirmed', 'completed']).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    purchases_total = PurchaseOrder.objects.filter(status='confirmed').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    
    recent_orders = SalesOrderSerializer(SalesOrder.objects.select_related('customer', 'created_by').order_by('-created_at')[:5], many=True).data
    recent_purchases = PurchaseOrderSerializer(PurchaseOrder.objects.select_related('supplier', 'created_by').order_by('-created_at')[:5], many=True).data
    
    low_stock_count = Stock.objects.filter(quantity__lt=F('product__reorder_level')).count()

    return Response({
        'total_products': total_products,
        'total_customers': total_customers,
        'total_suppliers': total_suppliers,
        'total_orders': total_orders,
        'total_purchases': total_purchases,
        'sales_total': sales_total,
        'purchases_total': purchases_total,
        'low_stock_count': low_stock_count,
        'recent_orders': recent_orders,
        'recent_purchases': recent_purchases,
    })
