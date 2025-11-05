from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# API Documentation with Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Squid Game API",
        default_version='v1',
        description="API documentation for Squid Game TV Show application",
        contact=openapi.Contact(email="contact@squidgame.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('tvshow.urls')),  # Versioned API

    # API Documentation
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # Maintain backward compatibility with old API paths
    path('api/', include('tvshow.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
