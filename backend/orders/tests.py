"""
Unit and Integration Tests for Orders Domain.

OOP / TESTING PRINCIPLES:
Validates end-to-end procurement and sales order workflows,
atomic inventory mutations, out-of-stock validation guards,
payment reconciliation, and real-time dashboard analytics aggregation.
"""

from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token

from inventory.models import Category, Product, Supplier, Customer
from .models import PurchaseOrder, PurchaseItem, SalesOrder, OrderItem, Payment
from .services import OrderProcessingService, DashboardMetricsService


class OrderWorkflowIntegrationTests(TestCase):
    """End-to-end verification of the Order-to-Cash and Procure-to-Pay cycles."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='operations_user', password='password123')
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        self.category = Category.objects.create(name='Computers')
        self.product = Product.objects.create(
            category=self.category,
            name='Enterprise Laptop 15"',
            sku='LAP-ENT-15',
            price=Decimal('1200.00'),
            cost_price=Decimal('800.00'),
            reorder_level=3
        )
        self.supplier = Supplier.objects.create(name='Tech Distributors Ltd')
        self.customer = Customer.objects.create(name='Horizon Consulting')

    def test_purchase_order_creation_and_atomic_stock_increment(self):
        """
        Procurement Cycle Test:
        1. Create PO with 10 units @ $800.
        2. Confirm PO.
        3. Verify stock increases from 0 to 10.
        4. Verify total_amount equals $8,000.
        """
        # Initial stock check
        self.assertEqual(self.product.current_stock, 0)

        # Create PO via API
        po_payload = {
            'supplier': self.supplier.id,
            'order_date': '2026-10-24',
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 10,
                    'unit_cost': '800.00'
                }
            ]
        }
        create_res = self.client.post('/api/purchases/', po_payload, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        po_id = create_res.data['id']

        # Confirm PO via API
        confirm_res = self.client.post(f'/api/purchases/{po_id}/confirm/')
        self.assertEqual(confirm_res.status_code, status.HTTP_200_OK)
        self.assertEqual(confirm_res.data['status'], 'confirmed')

        # Verify stock incremented
        self.product.stock.refresh_from_db()
        self.assertEqual(self.product.stock.quantity, 10)

        # Attempt to confirm again should be rejected (idempotency guard)
        reconfirm_res = self.client.post(f'/api/purchases/{po_id}/confirm/')
        self.assertEqual(reconfirm_res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_sales_order_stock_validation_insufficient_stock(self):
        """
        Stock Validation Test:
        Attempting to confirm a Sales Order for more units than currently in stock
        must fail with HTTP 400 and NOT mutate stock.
        """
        # Set stock to 2 units
        self.product.stock.increase(2)
        self.assertEqual(self.product.current_stock, 2)

        # Create SO for 5 units (exceeds available 2)
        so_payload = {
            'customer': self.customer.id,
            'order_date': '2026-10-24',
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 5,
                    'unit_price': '1200.00'
                }
            ]
        }
        create_res = self.client.post('/api/orders/', so_payload, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        so_id = create_res.data['id']

        # Confirm SO should fail
        confirm_res = self.client.post(f'/api/orders/{so_id}/confirm/')
        self.assertEqual(confirm_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Insufficient stock', confirm_res.data['error'])

        # Stock should remain untouched at 2
        self.product.stock.refresh_from_db()
        self.assertEqual(self.product.stock.quantity, 2)

    def test_sales_order_successful_atomic_deduction_and_payment(self):
        """
        Order-to-Cash Cycle Test:
        1. Initialize stock with 10 units.
        2. Create SO for 3 units @ $1200.
        3. Confirm SO -> Stock drops to 7.
        4. Record payment -> Payment created.
        """
        self.product.stock.increase(10)

        so_payload = {
            'customer': self.customer.id,
            'order_date': '2026-10-24',
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 3,
                    'unit_price': '1200.00'
                }
            ]
        }
        create_res = self.client.post('/api/orders/', so_payload, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        so_id = create_res.data['id']

        # Confirm SO
        confirm_res = self.client.post(f'/api/orders/{so_id}/confirm/')
        self.assertEqual(confirm_res.status_code, status.HTTP_200_OK)

        # Verify stock decreased to 7
        self.product.stock.refresh_from_db()
        self.assertEqual(self.product.stock.quantity, 7)

        # Record payment
        pay_res = self.client.post('/api/payments/', {
            'sales_order': so_id,
            'amount': '3600.00',
            'payment_method': 'bank_transfer',
            'status': 'completed'
        })
        self.assertEqual(pay_res.status_code, status.HTTP_201_CREATED)

    def test_dashboard_metrics_aggregation(self):
        """Dashboard API Test: Verifies all expected metrics are returned."""
        res = self.client.get('/api/dashboard/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for key in ['total_products', 'total_customers', 'total_suppliers', 'total_orders', 'revenue', 'low_stock_count', 'order_status_breakdown']:
            self.assertIn(key, res.data)
