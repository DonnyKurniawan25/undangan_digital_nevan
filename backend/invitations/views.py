from decimal import Decimal

from django.shortcuts import get_object_or_404
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Invitation, RSVP, Wish, Photo, PricingTier, Order
from .serializers import (
    InvitationListSerializer,
    InvitationDetailSerializer,
    InvitationWriteSerializer,
    RSVPSerializer,
    WishSerializer,
    RegisterSerializer,
    UserSerializer,
    PhotoSerializer,
    PricingTierSerializer,
    OrderSerializer,
)


# ============================================================
#  PUBLIC
# ============================================================
class InvitationViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access. The list only shows published invitations.
    Detail returns 402 (Payment Required) when the invitation is not yet
    published / paid."""

    lookup_field = "slug"
    permission_classes = [AllowAny]

    def get_queryset(self):
        if self.action == "list":
            return Invitation.objects.filter(is_published=True)
        return Invitation.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return InvitationListSerializer
        return InvitationDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.is_published:
            return Response(
                {
                    "detail": "Undangan ini belum dipublikasikan.",
                    "status": "unpublished",
                    "groom_name": instance.groom_name,
                    "bride_name": instance.bride_name,
                },
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class RSVPCreateView(generics.ListCreateAPIView):
    serializer_class = RSVPSerializer
    permission_classes = [AllowAny]

    def get_invitation(self):
        return get_object_or_404(Invitation, slug=self.kwargs["slug"])

    def get_queryset(self):
        return RSVP.objects.filter(invitation__slug=self.kwargs["slug"])

    def perform_create(self, serializer):
        serializer.save(invitation=self.get_invitation())


class WishCreateView(generics.ListCreateAPIView):
    serializer_class = WishSerializer
    permission_classes = [AllowAny]

    def get_invitation(self):
        return get_object_or_404(Invitation, slug=self.kwargs["slug"])

    def get_queryset(self):
        return Wish.objects.filter(invitation__slug=self.kwargs["slug"])

    def perform_create(self, serializer):
        serializer.save(invitation=self.get_invitation())


@api_view(["GET"])
@permission_classes([AllowAny])
def templates_list(request):
    data = [{"id": key, "name": label} for key, label in Invitation.TEMPLATE_CHOICES]
    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
def pricing_list(request):
    tiers = PricingTier.objects.filter(is_active=True)
    return Response(PricingTierSerializer(tiers, many=True).data)


# ============================================================
#  AUTH
# ============================================================
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {"token": token.key, "user": UserSerializer(user).data},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    from django.contrib.auth import authenticate

    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if not user:
        return Response(
            {"detail": "Username atau password salah."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "user": UserSerializer(user).data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


# ============================================================
#  USER DASHBOARD (owner-scoped)
# ============================================================
class MyInvitationViewSet(viewsets.ModelViewSet):
    serializer_class = InvitationWriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Invitation.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MyPhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        return Photo.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


def price_for_count(count):
    """Resolve the price for publishing `count` links from the pricing tiers."""
    if count <= 0:
        return Decimal(0)
    tier = PricingTier.objects.filter(link_count=count, is_active=True).first()
    if tier:
        return tier.price
    # Fallback: use the closest lower tier + per-link price of tier 1.
    base = PricingTier.objects.filter(link_count=1, is_active=True).first()
    per_link = base.price if base else Decimal(50000)
    lower = (
        PricingTier.objects.filter(link_count__lt=count, is_active=True)
        .order_by("-link_count")
        .first()
    )
    if lower:
        return lower.price + per_link * (count - lower.link_count)
    return per_link * count


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def quote(self, request):
        """Return the price for a given set of the user's invitation ids."""
        ids = request.data.get("invitation_ids", [])
        invitations = Invitation.objects.filter(owner=request.user, id__in=ids)
        count = invitations.count()
        amount = price_for_count(count)
        return Response({"link_count": count, "amount": amount})

    @action(detail=False, methods=["post"])
    def checkout(self, request):
        """Create a pending order for the chosen invitations."""
        ids = request.data.get("invitation_ids", [])
        invitations = list(
            Invitation.objects.filter(
                owner=request.user, id__in=ids, is_published=False
            )
        )
        if not invitations:
            return Response(
                {"detail": "Pilih minimal satu undangan yang belum dipublikasikan."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        count = len(invitations)
        amount = price_for_count(count)
        order = Order.objects.create(
            user=request.user, link_count=count, amount=amount, status="pending"
        )
        order.invitations.set(invitations)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def pay(self, request, pk=None):
        """Simulate a successful payment and publish the invitations."""
        order = self.get_object()
        if order.status == "paid":
            return Response(OrderSerializer(order).data)
        if order.status == "cancelled":
            return Response(
                {"detail": "Pesanan sudah dibatalkan."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        method = request.data.get("payment_method", "mock")
        order.mark_paid(method=method)
        return Response(OrderSerializer(order).data)
