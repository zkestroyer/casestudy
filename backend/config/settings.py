"""
Django settings for config project.
"""

from pathlib import Path

# BASE_DIR: The root directory of the project.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECRET_KEY: A secret key for cryptographic signing. Should be kept secret in production.
SECRET_KEY = 'django-insecure-mt&5tmdm!$ab+_f)w=m_)+k!i6t^r1ia@d&i!kcj$m%nf0f8#%'

# DEBUG: Turn off in production. When True, detailed error pages are displayed.
DEBUG = True

ALLOWED_HOSTS = []

# INSTALLED_APPS: All the applications enabled in this Django installation.
INSTALLED_APPS = [
    # Built-in Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # 3rd Party Apps
    'rest_framework',         # Django REST Framework for API creation
    'rest_framework.authtoken', # Built-in token authentication for DRF
    'corsheaders',            # Handles Cross-Origin Resource Sharing (CORS)

    # Local Apps
    'accounts',
    'inventory',
    'orders',
]

# MIDDLEWARE: Hooks into Django's request/response processing.
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Placed high up to intercept CORS preflight requests
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# REST_FRAMEWORK Configuration:
# - Authentication: Use Token-based auth natively provided by DRF.
# - Permissions: Require authentication by default to protect endpoints.
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

# CORS Settings: Allowed origins for Cross-Origin Resource Sharing
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", # Allow frontend development server
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database Setup: Using SQLite3 for simple local development.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# AUTH_PASSWORD_VALIDATORS: Enforce password strength rules.
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Localization and Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files mapping
STATIC_URL = 'static/'
