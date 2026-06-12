from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    InvitationViewSet,
    MyInvitationViewSet,
    MyPhotoViewSet,
    MyAudioViewSet,
    OrderViewSet,
    RSVPCreateView,
    WishCreateView,
    templates_list,
    pricing_list,
    register,
    login,
    me,
)

router = DefaultRouter()
router.register(r"invitations", InvitationViewSet, basename="invitation")
router.register(r"my/invitations", MyInvitationViewSet, basename="my-invitation")
router.register(r"my/photos", MyPhotoViewSet, basename="my-photo")
router.register(r"my/audio", MyAudioViewSet, basename="my-audio")
router.register(r"my/orders", OrderViewSet, basename="my-order")

urlpatterns = [
    path("templates/", templates_list, name="templates-list"),
    path("pricing/", pricing_list, name="pricing-list"),
    path("auth/register/", register, name="auth-register"),
    path("auth/login/", login, name="auth-login"),
    path("auth/me/", me, name="auth-me"),
    path(
        "invitations/<slug:slug>/rsvps/",
        RSVPCreateView.as_view(),
        name="rsvp-list-create",
    ),
    path(
        "invitations/<slug:slug>/wishes/",
        WishCreateView.as_view(),
        name="wish-list-create",
    ),
]

urlpatterns += router.urls
