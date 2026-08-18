from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from django.contrib.auth import authenticate

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile.
    Provides extended fields for the user.
    """
    class Meta:
        model = UserProfile
        fields = ('role', 'phone')

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the main User model.
    PURPOSE: Represents the authenticated user, nesting their profile data.
    """
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')

class LoginSerializer(serializers.Serializer):
    """
    Login Serializer.
    PURPOSE: Validates credentials and returns an authenticated user object if valid.
    """
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        """
        Validates login credentials.
        authenticate() checks the database for the given username and password.
        """
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
