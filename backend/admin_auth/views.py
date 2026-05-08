from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AdminUser


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """
    Custom admin login endpoint.
    Accepts username and password, returns JWT tokens.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authenticate user
    user = authenticate(request, username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Check if user is an admin
    if not user.is_admin:
        return Response(
            {'error': 'Access denied. Admin access only.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': str(user.id),
            'email': user.email,
            'username': user.username,
            'is_admin': user.is_admin
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_token(request):
    """
    Verify if the provided token is valid.
    Used by frontend to check authentication status.
    """
    token = request.data.get('token')
    
    if not token:
        return Response(
            {'error': 'Token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Token verification is handled by JWT authentication middleware
        # This endpoint is mainly for frontend to check if user is authenticated
        user = request.user
        
        if user.is_authenticated:
            return Response({
                'authenticated': True,
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'username': user.username,
                    'is_admin': user.is_admin
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'authenticated': False
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response(
            {'error': 'Token verification failed'},
            status=status.HTTP_401_UNAUTHORIZED
        )