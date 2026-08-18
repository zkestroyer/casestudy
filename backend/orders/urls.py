from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseOrderViewSet, SalesOrderViewSet, PaymentViewSet, dashboard

router = DefaultRouter()
router.register(r'purchases', PurchaseOrderViewSet, basename='purchases')
router.register(r'orders', SalesOrderViewSet, basename='orders')
router.register(r'payments', PaymentViewSet, basename='payments')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard, name='dashboard'),
]
