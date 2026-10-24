"""
Order & Financial API Views.

OOP / ARCHITECTURAL PURPOSE:
These ViewSets act as thin controllers in MVC/MVT architecture.
They handle HTTP request parsing, authentication checks, and response formatting,
while delegating core business logic to models and the service layer.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.core.exceptions import ValidationError

from .models import PurchaseOrder, SalesOrder, Payment
from .serializers import PurchaseOrderSerializer, SalesOrderSerializer, PaymentSerializer
from .services import OrderProcessingService, DashboardMetricsService


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """
    Purchase Order ViewSet.
    Manages procurement transactions with suppliers.
    """
    queryset = PurchaseOrder.objects.prefetch_related('items__product').select_related('supplier', 'created_by').all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        CONFIRM ACTION:
        Finalizes goods receipt for a Purchase Order.
        Delegates atomic stock increments to OrderProcessingService.
        """
        order = self.get_object()
        try:
            OrderProcessingService.confirm_purchase_order(order)
            return Response({
                'status': 'confirmed',
                'total_amount': str(order.total_amount),
                'message': 'Purchase order confirmed and stock incremented successfully.'
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'error': str(e.message if hasattr(e, 'message') else e)}, status=status.HTTP_400_BAD_REQUEST)


class SalesOrderViewSet(viewsets.ModelViewSet):
    """
    Sales Order ViewSet.
    Manages customer sales transactions and order fulfillment.
    """
    queryset = SalesOrder.objects.prefetch_related('items__product').select_related('customer', 'created_by').all()
    serializer_class = SalesOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        CONFIRM ACTION:
        Finalizes a sales order.
        Validates inventory across all line items and performs atomic stock deductions.
        """
        order = self.get_object()
        try:
            OrderProcessingService.confirm_sales_order(order)
            return Response({
                'status': 'confirmed',
                'total_amount': str(order.total_amount),
                'message': 'Sales order confirmed and stock deducted successfully.'
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            error_msg = "; ".join(e.messages) if hasattr(e, 'messages') else str(e)
            return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)


class PaymentViewSet(viewsets.ModelViewSet):
    """
    Payment ViewSet.
    Records financial payments against sales orders.
    """
    queryset = Payment.objects.select_related('sales_order').all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard(request):
    """
    Dashboard Aggregation API.
    Calls DashboardMetricsService to fetch unified operational metrics in a single network round-trip.
    """
    metrics = DashboardMetricsService.get_dashboard_metrics()
    return Response(metrics)
