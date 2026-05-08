from django.urls import path
from . import views

app_name = 'guides'

urlpatterns = [
    # Public endpoints
    path('featured/', views.FeaturedGuideView.as_view(), name='featured-guide'),
    path('', views.TutorialListView.as_view(), name='tutorial-list'),
    path('<uuid:id>/', views.TutorialDetailView.as_view(), name='tutorial-detail'),
    
    # Admin endpoints
    path('admin/', views.AdminTutorialListView.as_view(), name='admin-tutorial-list'),
    path('admin/create/', views.AdminTutorialCreateView.as_view(), name='admin-tutorial-create'),
    path('admin/<uuid:id>/', views.AdminTutorialDetailView.as_view(), name='admin-tutorial-detail'),
    path('admin/<uuid:id>/toggle/', views.toggle_published, name='admin-toggle-published'),
    
    # Hero Settings endpoints
    path('hero-settings/', views.HeroSettingsPublicView.as_view(), name='hero-settings-public'),
    path('admin/hero-settings/', views.HeroSettingsAdminView.as_view(), name='hero-settings-admin'),
    
    # Social Links endpoints
    path('social-links/', views.SocialLinksPublicView.as_view(), name='social-links-public'),
    path('admin/social-links/', views.SocialLinksAdminView.as_view(), name='social-links-admin'),
]
