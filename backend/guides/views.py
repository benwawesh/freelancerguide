from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Tutorial, ExternalLink, HeroSettings, SocialLinks
from .serializers import (
    TutorialSerializer, 
    TutorialListSerializer,
    TutorialCreateUpdateSerializer,
    HeroSettingsSerializer,
    SocialLinksSerializer
)


# ==================== PUBLIC VIEWS ====================

class FeaturedGuideView(generics.RetrieveAPIView):
    """
    Public API endpoint to get the featured guide.
    Returns the guide marked as is_featured.
    No authentication required.
    """
    serializer_class = TutorialSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        try:
            return Tutorial.objects.get(is_featured=True, is_published=True)
        except Tutorial.DoesNotExist:
            return None


class TutorialListView(generics.ListAPIView):
    """
    Public API endpoint to list all published tutorials.
    No authentication required.
    """
    queryset = Tutorial.objects.filter(is_published=True)
    serializer_class = TutorialListSerializer
    permission_classes = [AllowAny]
    ordering_fields = ['order', 'created_at', 'title']
    filterset_fields = ['category']


class TutorialDetailView(generics.RetrieveAPIView):
    """
    Public API endpoint to retrieve a single tutorial by UUID.
    No authentication required.
    """
    queryset = Tutorial.objects.filter(is_published=True)
    serializer_class = TutorialSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


# ==================== ADMIN VIEWS ====================

class AdminTutorialListView(generics.ListAPIView):
    """
    Admin API endpoint to list all tutorials (including unpublished).
    Requires authentication.
    """
    queryset = Tutorial.objects.all()
    serializer_class = TutorialListSerializer
    permission_classes = [IsAuthenticated]
    ordering_fields = ['order', 'created_at', 'title', 'is_published']
    filterset_fields = ['category', 'is_published']


class AdminTutorialCreateView(generics.CreateAPIView):
    """
    Admin API endpoint to create a new tutorial with file upload support.
    Requires authentication.
    """
    queryset = Tutorial.objects.all()
    serializer_class = TutorialCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]


class AdminTutorialDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin API endpoint to retrieve, update, or delete a tutorial by UUID.
    Supports file uploads for updates.
    Requires authentication.
    """
    queryset = Tutorial.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return TutorialCreateUpdateSerializer
        return TutorialSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_published(request, id):
    """
    Toggle the is_published status of a tutorial.
    Requires authentication.
    """
    try:
        tutorial = Tutorial.objects.get(id=id)
        tutorial.is_published = not tutorial.is_published
        tutorial.save()
        
        return Response({
            'id': str(tutorial.id),
            'title': tutorial.title,
            'is_published': tutorial.is_published
        }, status=status.HTTP_200_OK)
    
    except Tutorial.DoesNotExist:
        return Response(
            {'error': 'Tutorial not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


# ==================== HERO SETTINGS VIEWS ====================

class HeroSettingsPublicView(generics.RetrieveAPIView):
    """
    Public API endpoint to get hero settings.
    No authentication required.
    """
    serializer_class = HeroSettingsSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        return HeroSettings.get_settings()


class HeroSettingsAdminView(generics.RetrieveUpdateAPIView):
    """
    Admin API endpoint to get and update hero settings.
    Requires authentication.
    """
    serializer_class = HeroSettingsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return HeroSettings.get_settings()


# ==================== SOCIAL LINKS VIEWS ====================

class SocialLinksPublicView(generics.RetrieveAPIView):
    """
    Public API endpoint to get social links.
    No authentication required.
    """
    serializer_class = SocialLinksSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        return SocialLinks.get_settings()


class SocialLinksAdminView(generics.RetrieveUpdateAPIView):
    """
    Admin API endpoint to get and update social links.
    Requires authentication.
    """
    serializer_class = SocialLinksSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return SocialLinks.get_settings()
