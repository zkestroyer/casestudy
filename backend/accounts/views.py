from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from .serializers import UserSerializer, LoginSerializer

class LoginView(APIView):
    """
    Login View.
    PURPOSE: Authenticates a user and issues a token.
    FLOW: Uses LoginSerializer to validate credentials, logs the user in via Django's session,
    and returns a persistent Token for future API authentication.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": UserSerializer(user).data
        })

class LogoutView(APIView):
    """
    Logout View.
    PURPOSE: Safely terminates a user's session.
    FLOW: Deletes the API token to invalidate future requests from that client,
    then logs out of the Django session.
    """
    def post(self, request, *args, **kwargs):
        # BUG FIX: Safely delete tokens using filter to avoid errors if token doesn't exist
        Token.objects.filter(user=request.user).delete()
        logout(request)
        return Response({"success": "Successfully logged out."})

class UserView(generics.RetrieveAPIView):
    """
    User Information View.
    PURPOSE: Endpoint for the client to retrieve the currently authenticated user's profile.
    """
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
