from django.urls import path
from . import views

app_name = 'admin_auth'

urlpatterns = [
    path('login/', views.admin_login, name='admin-login'),
    path('verify/', views.verify_token, name='verify-token'),
]