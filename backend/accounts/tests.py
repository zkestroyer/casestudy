"""
Unit and Integration Tests for Accounts Domain.

OOP / TESTING PRINCIPLES:
Validates authentication flows, token lifecycle, authorization roles,
and Django signal-driven UserProfile creation.
"""

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import UserProfile


class UserProfileSignalTests(TestCase):
    """Verifies that User creation triggers profile creation via signals."""

    def test_user_creation_auto_creates_profile(self):
        user = User.objects.create_user(username='teststaff', password='password123')
        self.assertTrue(hasattr(user, 'profile'))
        self.assertEqual(user.profile.role, 'staff')
        self.assertTrue(user.profile.is_staff_user())
        self.assertFalse(user.profile.is_admin_user())

    def test_admin_role_evaluation(self):
        admin_user = User.objects.create_superuser(username='superadmin', password='password123')
        self.assertTrue(admin_user.profile.is_admin_user())


class AuthenticationAPITests(TestCase):
    """Tests Login, Logout, and Token Authentication endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.username = 'opsmanager'
        self.password = 'StrongP@ssw0rd'
        self.user = User.objects.create_user(username=self.username, password=self.password)

    def test_login_successful(self):
        response = self.client.post('/api/auth/login/', {
            'username': self.username,
            'password': self.password
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], self.username)

    def test_login_invalid_credentials(self):
        response = self.client.post('/api/auth/login/', {
            'username': self.username,
            'password': 'WrongPassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authenticated_me_endpoint(self):
        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.username)

    def test_unauthenticated_me_endpoint_rejected(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_invalidates_token(self):
        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        logout_res = self.client.post('/api/auth/logout/')
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)
        # Verify token was removed
        self.assertFalse(Token.objects.filter(key=token.key).exists())
