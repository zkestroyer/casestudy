from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UserProfile(models.Model):
    """
    UserProfile Model.
    
    OOP / ARCHITECTURAL PURPOSE:
    Extends the default Django User model to encapsulate domain-specific metadata
    such as roles and contact information without mutating Django's internal authentication schema.
    
    RELATIONAL DESIGN:
    Uses a 1:1 relationship with User (OneToOneField) with CASCADE deletion, ensuring that
    profile lifecycle is strictly coupled to the authentication principal.
    """
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='staff', help_text="User authorization role.")
    phone = models.CharField(max_length=20, blank=True, help_text="Contact telephone number.")
    created_at = models.DateTimeField(default=timezone.now, help_text="Timestamp of profile creation.")
    updated_at = models.DateTimeField(auto_now=True, help_text="Timestamp of last update.")

    class Meta:
        ordering = ['user__username']
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

    # --- Domain Methods (OOP Encapsulation) ---
    def is_admin_user(self) -> bool:
        """Determines if the user has administrative privileges."""
        return self.role == 'admin' or self.user.is_superuser

    def is_staff_user(self) -> bool:
        """Determines if the user is a standard operational staff member."""
        return self.role == 'staff'
