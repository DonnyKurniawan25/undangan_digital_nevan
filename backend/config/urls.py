from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def api_root(request):
    return JsonResponse(
        {
            "message": "Wedding Invitation API",
            "endpoints": {
                "templates": "/api/templates/",
                "invitations": "/api/invitations/",
                "invitation_detail": "/api/invitations/<slug>/",
                "rsvps": "/api/invitations/<slug>/rsvps/",
                "wishes": "/api/invitations/<slug>/wishes/",
            },
        }
    )


urlpatterns = [
    path("", api_root),
    path("admin/", admin.site.urls),
    path("api/", include("invitations.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
