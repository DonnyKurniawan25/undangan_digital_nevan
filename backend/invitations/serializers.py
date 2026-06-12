from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

from .models import (
    Invitation,
    Event,
    GalleryImage,
    LoveStory,
    BankAccount,
    RSVP,
    Wish,
    Photo,
    PricingTier,
    Order,
)


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "date",
            "time_start",
            "time_end",
            "venue_name",
            "venue_address",
            "maps_url",
            "order",
        ]


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ["id", "image", "caption", "order"]


class LoveStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoveStory
        fields = ["id", "title", "date_label", "description", "order"]


class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ["id", "bank_name", "account_number", "account_holder"]


class RSVPSerializer(serializers.ModelSerializer):
    class Meta:
        model = RSVP
        fields = ["id", "guest_name", "attendance", "guest_count", "created_at"]
        read_only_fields = ["id", "created_at"]


class WishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wish
        fields = ["id", "name", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class InvitationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = [
            "id",
            "slug",
            "template",
            "groom_name",
            "bride_name",
            "cover_photo",
            "main_date",
        ]


class InvitationDetailSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)
    gallery = GalleryImageSerializer(many=True, read_only=True)
    love_story = LoveStorySerializer(many=True, read_only=True)
    bank_accounts = BankAccountSerializer(many=True, read_only=True)
    wishes = WishSerializer(many=True, read_only=True)
    rsvp_summary = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = [
            "id",
            "slug",
            "template",
            "groom_name",
            "groom_full_name",
            "groom_father",
            "groom_mother",
            "groom_order",
            "groom_photo",
            "groom_instagram",
            "bride_name",
            "bride_full_name",
            "bride_father",
            "bride_mother",
            "bride_order",
            "bride_photo",
            "bride_instagram",
            "cover_photo",
            "main_date",
            "quote",
            "quote_source",
            "music_url",
            "opening_text",
            "wedding_hashtag",
            "dresscode",
            "dresscode_colors",
            "live_stream_url",
            "gift_address",
            "closing_text",
            "events",
            "gallery",
            "love_story",
            "bank_accounts",
            "wishes",
            "rsvp_summary",
        ]

    def get_rsvp_summary(self, obj):
        rsvps = obj.rsvps.all()
        return {
            "total": rsvps.count(),
            "yes": rsvps.filter(attendance="yes").count(),
            "no": rsvps.filter(attendance="no").count(),
            "maybe": rsvps.filter(attendance="maybe").count(),
        }


# ============================================================
#  AUTH
# ============================================================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name"]

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username sudah digunakan.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "is_staff"]


# ============================================================
#  PHOTO
# ============================================================
class PhotoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = ["id", "title", "image", "url", "uploaded_at"]
        read_only_fields = ["id", "url", "uploaded_at"]
        extra_kwargs = {"image": {"write_only": True}}

    def get_url(self, obj):
        if not obj.image:
            return ""
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


# ============================================================
#  WRITABLE NESTED INVITATION (for the user dashboard)
# ============================================================
class InvitationWriteSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, required=False)
    gallery = GalleryImageSerializer(many=True, required=False)
    love_story = LoveStorySerializer(many=True, required=False)
    bank_accounts = BankAccountSerializer(many=True, required=False)

    class Meta:
        model = Invitation
        fields = [
            "id",
            "slug",
            "template",
            "is_published",
            "groom_name",
            "groom_full_name",
            "groom_father",
            "groom_mother",
            "groom_order",
            "groom_photo",
            "groom_instagram",
            "bride_name",
            "bride_full_name",
            "bride_father",
            "bride_mother",
            "bride_order",
            "bride_photo",
            "bride_instagram",
            "cover_photo",
            "main_date",
            "quote",
            "quote_source",
            "music_url",
            "opening_text",
            "wedding_hashtag",
            "dresscode",
            "dresscode_colors",
            "live_stream_url",
            "gift_address",
            "closing_text",
            "events",
            "gallery",
            "love_story",
            "bank_accounts",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "is_published", "created_at", "updated_at"]

    _NESTED = {
        "events": Event,
        "gallery": GalleryImage,
        "love_story": LoveStory,
        "bank_accounts": BankAccount,
    }

    def create(self, validated_data):
        nested = {key: validated_data.pop(key, []) for key in self._NESTED}
        invitation = Invitation.objects.create(**validated_data)
        self._write_nested(invitation, nested, replace=False)
        return invitation

    def update(self, instance, validated_data):
        nested = {
            key: validated_data.pop(key, None) for key in self._NESTED
        }
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self._write_nested(instance, nested, replace=True)
        return instance

    def _write_nested(self, invitation, nested, replace):
        for key, model in self._NESTED.items():
            items = nested.get(key)
            if items is None:
                continue
            if replace:
                getattr(invitation, key).all().delete()
            for item in items:
                item.pop("id", None)
                model.objects.create(invitation=invitation, **item)


# ============================================================
#  PRICING & ORDERS
# ============================================================
class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = ["id", "link_count", "price", "label", "description", "is_active"]


class OrderInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ["id", "slug", "groom_name", "bride_name", "is_published"]


class OrderSerializer(serializers.ModelSerializer):
    invitations_detail = OrderInvitationSerializer(
        source="invitations", many=True, read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "link_count",
            "amount",
            "status",
            "payment_method",
            "reference",
            "created_at",
            "paid_at",
            "invitations_detail",
        ]
        read_only_fields = fields
