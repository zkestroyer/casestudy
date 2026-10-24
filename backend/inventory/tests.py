"""
Unit and Integration Tests for Inventory Domain.

OOP / TESTING PRINCIPLES:
Validates catalog entities, auto-initialized 1:1 Stock records,
domain constraints (non-negative stock, low stock thresholds),
and inventory query filtering services.
"""

from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token

from .models import Category, Product, Stock, Supplier, Customer
from .services import InventoryService


class ProductAndStockDomainTests(TestCase):
    """Tests model-level OOP behavior and signal automation for Product and Stock."""

    def setUp(self):
        self.category = Category.objects.create(name='Electronics', description='Gadgets and hardware')
        self.product = Product.objects.create(
            category=self.category,
            name='Ergonomic Mechanical Keyboard',
            sku='KB-MECH-01',
            price=Decimal('120.00'),
            cost_price=Decimal('70.00'),
            reorder_level=5
        )

    def test_stock_auto_created_by_signal(self):
        """Verifies that creating a Product automatically initializes a Stock record with quantity=0."""
        self.assertTrue(hasattr(self.product, 'stock'))
        self.assertEqual(self.product.stock.quantity, 0)
        self.assertEqual(self.product.current_stock, 0)

    def test_product_domain_calculations(self):
        """Verifies gross margin and low-stock evaluation."""
        self.assertEqual(self.product.gross_margin, Decimal('50.00'))
        self.assertTrue(self.product.is_low_stock())  # 0 <= 5

    def test_stock_mutation_methods(self):
        """Verifies Stock OOP domain methods: increase and deduct."""
        stock = self.product.stock
        stock.increase(20)
        self.assertEqual(stock.quantity, 20)
        self.assertFalse(stock.is_low())  # 20 > 5

        stock.deduct(8)
        self.assertEqual(stock.quantity, 12)

    def test_stock_deduct_insufficient_raises_validation_error(self):
        """Verifies that attempting to deduct more stock than available triggers ValidationError."""
        stock = self.product.stock
        stock.increase(5)
        with self.assertRaises(ValidationError):
            stock.deduct(10)
        # Quantity should remain untouched after failure
        self.assertEqual(stock.quantity, 5)

    def test_inventory_service_low_stock_query(self):
        """Tests that InventoryService correctly identifies low stock products."""
        low_items = InventoryService.get_low_stock_queryset()
        self.assertIn(self.product.stock, low_items)

        # Increase stock above reorder level
        self.product.stock.increase(10)
        low_items_after = InventoryService.get_low_stock_queryset()
        self.assertNotIn(self.product.stock, low_items_after)


class InventoryAPITests(TestCase):
    """Tests REST endpoints for Category, Product, Stock, Supplier, Customer."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='warehouse_staff', password='pass')
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        self.category = Category.objects.create(name='Office Supplies')
        self.product = Product.objects.create(
            category=self.category,
            name='Ballpoint Pen Box',
            sku='PEN-BLU-100',
            price=Decimal('15.00'),
            cost_price=Decimal('8.00'),
            reorder_level=10
        )

    def test_get_products_list(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['sku'], 'PEN-BLU-100')

    def test_product_search_filter(self):
        response = self.client.get('/api/products/?search=PEN-BLU')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        empty_search = self.client.get('/api/products/?search=NONEXISTENT')
        self.assertEqual(len(empty_search.data), 0)

    def test_stock_low_endpoint(self):
        response = self.client.get('/api/stock/low/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(item['product'] == self.product.id for item in response.data))

    def test_supplier_and_customer_crud(self):
        # Create Supplier
        sup_res = self.client.post('/api/suppliers/', {
            'name': 'Global Paper Co.',
            'email': 'sales@globalpaper.com',
            'phone': '123456789'
        })
        self.assertEqual(sup_res.status_code, status.HTTP_201_CREATED)

        # Create Customer
        cust_res = self.client.post('/api/customers/', {
            'name': 'Acme Corporation',
            'email': 'orders@acme.com',
            'phone': '987654321'
        })
        self.assertEqual(cust_res.status_code, status.HTTP_201_CREATED)
