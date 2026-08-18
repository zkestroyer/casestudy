from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    """
    UserProfile Model.
    WHY IT EXISTS: Extends the default Django User model to include additional information 
    such as role and phone number without altering the core authentication schema.
    
    WHY OneToOneField: Used instead of subclassing AbstractUser because it keeps the default 
    authentication system intact and ensures forward compatibility with third-party apps, 
    while establishing a strict 1:1 mapping with the built-in User.
    """
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='staff')
    phone = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ['user__username']

    def __str__(self):
        return f"{self.user.username} - {self.role}"
