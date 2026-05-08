import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from admin_auth.models import AdminUser

# Create admin user
admin_user = AdminUser.objects.create_superuser(
    username='benbenadmin',
    email='benjojo47@gmail.com',
    password='@Benson100'
)

print(f"Admin user created successfully!")
print(f"Username: {admin_user.username}")
print(f"Email: {admin_user.email}")
print(f"Is Admin: {admin_user.is_admin}")