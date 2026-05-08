# Freelance Tutorial Guide Platform

A full-stack web application for publishing and managing freelance tutorial guides. Built with Django (backend) and React (frontend).

## Features

### Public Side
- Browse all published tutorial guides
- View detailed guide content with external links
- Clean, responsive design
- No authentication required

### Admin Side
- Custom admin login interface (not default Django admin)
- Create, edit, and delete tutorial guides
- Manage external links for each guide
- Toggle publish/unpublish status
- Secure JWT-based authentication

## Tech Stack

### Backend
- **Django 6.0.5** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **JWT (Simple JWT)** - Authentication
- **UUID** - Primary keys for all models
- **psycopg2-binary** - PostgreSQL adapter
- **django-cors-headers** - CORS handling

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

## Project Structure

```
tutorial guide/
├── backend/
│   ├── config/          # Django project settings
│   ├── guides/          # Tutorial guide app
│   │   ├── models.py    # Tutorial and ExternalLink models
│   │   ├── serializers.py
│   │   ├── views.py     # API views
│   │   └── urls.py
│   ├── admin_auth/      # Custom admin authentication
│   │   ├── models.py    # AdminUser model
│   │   ├── views.py     # Login/verify views
│   │   └── urls.py
│   ├── .env             # Environment variables
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   │   ├── GuideCard.jsx
    │   │   └── GuideForm.jsx
    │   ├── pages/       # Page components
    │   │   ├── Home.jsx
    │   │   ├── GuideDetail.jsx
    │   │   └── admin/
    │   │       ├── AdminLogin.jsx
    │   │       ├── AdminDashboard.jsx
    │   │       ├── CreateGuide.jsx
    │   │       └── EditGuide.jsx
    │   ├── api.js      # API service layer
    │   ├── App.jsx     # Main app with routing
    │   └── App.css     # Global styles
    └── package.json
```

## Setup Instructions

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL 14+

### 1. Database Setup

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE tutorial_guide_db;

# Exit
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit .env file and update:
# - DATABASE_PASSWORD (your PostgreSQL password)
# - SECRET_KEY (generate a random secret key)

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start Django development server
python manage.py runserver
```

Backend will run on: `http://localhost:8000`

### 3. Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start React development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## API Endpoints

### Public Endpoints
- `GET /api/guides/` - List all published guides
- `GET /api/guides/{uuid}/` - Get single guide by UUID

### Admin Endpoints (Authentication Required)
- `POST /api/auth/login/` - Admin login
- `GET /api/guides/admin/` - List all guides (including drafts)
- `GET /api/guides/admin/{uuid}/` - Get single guide
- `POST /api/guides/admin/create/` - Create new guide
- `PUT /api/guides/admin/{uuid}/` - Update guide
- `DELETE /api/guides/admin/{uuid}/` - Delete guide
- `POST /api/guides/admin/{uuid}/toggle/` - Toggle publish status
- `POST /api/token/refresh/` - Refresh JWT token

## Usage

### Accessing Public Site
1. Navigate to `http://localhost:5173`
2. View all published tutorial guides
3. Click on any guide to see full content and external links

### Accessing Admin Panel
1. Navigate to `http://localhost:5173/admin/login`
2. Login with your admin credentials
3. Use the dashboard to manage guides:
   - Create new guides
   - Edit existing guides
   - Delete guides
   - Toggle publish/unpublish status

### Creating a Guide
1. Login to admin panel
2. Click "Create New Guide"
3. Fill in the form:
   - Title, Description, Content (required)
   - Image URL (optional)
   - Category, Order (optional)
   - Add external links (title, URL, description)
4. Check "Publish" to make visible to public
5. Click "Save Guide"

## Database Models

### Tutorial
- `id` (UUID, Primary Key)
- `title` (CharField)
- `description` (TextField)
- `content` (TextField)
- `image_url` (URLField, optional)
- `category` (CharField, optional)
- `is_published` (BooleanField)
- `order` (IntegerField)
- `created_at` (DateTimeField)
- `updated_at` (DateTimeField)

### ExternalLink
- `id` (UUID, Primary Key)
- `tutorial` (ForeignKey to Tutorial)
- `title` (CharField)
- `url` (URLField)
- `description` (TextField, optional)
- `created_at` (DateTimeField)

### AdminUser
- `id` (UUID, Primary Key)
- `email` (EmailField, unique)
- `username` (CharField)
- `password` (hashed)
- `is_admin` (BooleanField)
- `created_at` (DateTimeField)

## Security Features

- **JWT Authentication**: Secure token-based authentication for admin
- **UUID Primary Keys**: Non-guessable IDs for security
- **CORS Configuration**: Controlled cross-origin requests
- **Password Hashing**: Django's built-in password hashing
- **Separate Admin Routes**: Admin URLs not exposed to public navigation
- **Environment Variables**: Sensitive data stored in .env file

## Customization

### Changing Database
Edit `backend/.env`:
```
DATABASE_NAME=your_database_name
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### Changing JWT Token Expiry
Edit `backend/config/settings.py`:
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    # ... other settings
}
```

### Changing Frontend API URL
Edit `frontend/src/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Deployment Notes

### Production Checklist
1. Set `DEBUG=False` in `.env`
2. Change `SECRET_KEY` to a secure random value
3. Update `ALLOWED_HOSTS` with your domain
4. Use environment variables for all sensitive data
5. Configure production database
6. Set up static file serving
7. Use HTTPS
8. Configure CORS for production domain
9. Use a production WSGI server (Gunicorn, uWSGI)
10. Build React for production: `npm run build`

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### CORS Error
- Check `CORS_ALLOWED_ORIGINS` in Django settings
- Ensure frontend URL is correctly configured

### Authentication Error
- Clear browser localStorage
- Check JWT token configuration
- Verify admin user exists

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please refer to the Django and React documentation.