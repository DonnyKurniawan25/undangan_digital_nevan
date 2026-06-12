from django.contrib import admin
from django.conf import settings
from django.urls import path
from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils.html import format_html
from django.utils.safestring import mark_safe
import os

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


def copy_field(value, label="Salin"):
    """Render a read-only input with a one-click copy button for the admin."""
    return format_html(
        '<div style="display:flex;gap:6px;align-items:center;max-width:560px">'
        '<input type="text" value="{0}" readonly '
        'style="flex:1;padding:7px 10px;border:1px solid #ccc;border-radius:6px;'
        'font-size:13px;background:#fafafa" onclick="this.select()">'
        '<button type="button" class="button" '
        "onclick=\"navigator.clipboard.writeText('{0}');"
        "this.textContent='Tersalin!';"
        "setTimeout(function(b){{return function(){{b.textContent='{1}'}}}}(this),1500);\""
        'style="cursor:pointer">{1}</button>'
        "</div>",
        value,
        label,
    )


class EventInline(admin.TabularInline):
    model = Event
    extra = 1


class GalleryInline(admin.TabularInline):
    model = GalleryImage
    extra = 1


class LoveStoryInline(admin.TabularInline):
    model = LoveStory
    extra = 1


class BankAccountInline(admin.TabularInline):
    model = BankAccount
    extra = 1


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "owner",
        "template",
        "is_published",
        "main_date",
        "invitation_link_short",
    )
    list_filter = ("template", "is_published")
    list_editable = ("is_published",)
    search_fields = ("groom_name", "bride_name", "slug", "owner__username")
    prepopulated_fields = {"slug": ("groom_name", "bride_name")}
    readonly_fields = ("invitation_link", "created_at", "updated_at")
    inlines = [EventInline, LoveStoryInline, GalleryInline, BankAccountInline]

    fieldsets = (
        ("Link Undangan", {"fields": ("invitation_link",)}),
        (
            "Pengaturan",
            {"fields": ("owner", "slug", "template", "main_date", "is_published")},
        ),
        (
            "Mempelai Pria",
            {
                "fields": (
                    "groom_name",
                    "groom_full_name",
                    "groom_order",
                    "groom_father",
                    "groom_mother",
                    "groom_photo",
                    "groom_instagram",
                )
            },
        ),
        (
            "Mempelai Wanita",
            {
                "fields": (
                    "bride_name",
                    "bride_full_name",
                    "bride_order",
                    "bride_father",
                    "bride_mother",
                    "bride_photo",
                    "bride_instagram",
                )
            },
        ),
        (
            "Konten",
            {
                "fields": (
                    "cover_photo",
                    "opening_text",
                    "quote",
                    "quote_source",
                    "music_url",
                    "closing_text",
                )
            },
        ),
        (
            "Info Tambahan (Premium)",
            {
                "fields": (
                    "wedding_hashtag",
                    "dresscode",
                    "dresscode_colors",
                    "live_stream_url",
                    "gift_address",
                )
            },
        ),
        ("Info", {"fields": ("created_at", "updated_at")}),
    )

    def _public_url(self, obj):
        base = getattr(settings, "FRONTEND_BASE_URL", "").rstrip("/")
        return f"{base}/undangan/{obj.slug}"

    @admin.display(description="Link Undangan (klik Salin untuk membagikan)")
    def invitation_link(self, obj):
        if not obj.pk or not obj.slug:
            return "Simpan undangan terlebih dahulu untuk mendapatkan link."
        url = self._public_url(obj)
        url_guest = f"{url}?to=Nama Tamu"
        return mark_safe(
            "<p style='margin:0 0 6px;font-weight:600'>Link undangan:</p>"
            + str(copy_field(url))
            + "<p style='margin:14px 0 6px;font-weight:600'>Link dengan nama tamu "
            "(ganti <em>Nama Tamu</em>):</p>"
            + str(copy_field(url_guest))
            + format_html(
                "<p style='margin:12px 0 0'>"
                "<a href='{0}' target='_blank' class='button'>Buka Undangan &#8599;</a>"
                "</p>",
                url,
            )
        )

    @admin.display(description="Link")
    def invitation_link_short(self, obj):
        if not obj.slug:
            return "-"
        url = self._public_url(obj)
        return format_html("<a href='{0}' target='_blank'>{0}</a>", url)


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("preview", "title", "owner", "uploaded_at", "copy_url")
    list_filter = ("owner",)
    readonly_fields = ("big_preview", "photo_url")
    search_fields = ("title",)
    list_display_links = ("title",)
    change_list_template = "admin/invitations/photo/change_list.html"

    fields = ("title", "image", "big_preview", "photo_url")

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                "upload-multiple/",
                self.admin_site.admin_view(self.upload_multiple_view),
                name="invitations_photo_upload_multiple",
            ),
        ]
        return custom + urls

    def upload_multiple_view(self, request):
        if request.method == "POST":
            files = request.FILES.getlist("images")
            count = 0
            for f in files:
                title = os.path.splitext(f.name)[0]
                Photo.objects.create(title=title, image=f)
                count += 1
            if count:
                self.message_user(
                    request, f"{count} foto berhasil diunggah.", messages.SUCCESS
                )
            else:
                self.message_user(
                    request, "Tidak ada foto yang dipilih.", messages.WARNING
                )
            return redirect("admin:invitations_photo_changelist")

        context = {
            **self.admin_site.each_context(request),
            "title": "Upload Banyak Foto Sekaligus",
            "opts": self.model._meta,
        }
        return render(
            request, "admin/invitations/photo/upload_multiple.html", context
        )

    def _abs_url(self, obj):
        if not obj.image:
            return ""
        base = getattr(settings, "BACKEND_BASE_URL", "").rstrip("/")
        return f"{base}{obj.image.url}"

    @admin.display(description="Pratinjau")
    def preview(self, obj):
        if not obj.image:
            return "-"
        return format_html(
            "<img src='{0}' style='height:54px;width:54px;object-fit:cover;"
            "border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,.2)'>",
            self._abs_url(obj),
        )

    @admin.display(description="Pratinjau Foto")
    def big_preview(self, obj):
        if not obj.image:
            return "Belum ada foto. Unggah dan simpan untuk melihat pratinjau."
        return format_html(
            "<img src='{0}' style='max-height:280px;max-width:100%;"
            "border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.18)'>",
            self._abs_url(obj),
        )

    @admin.display(description="Link Foto (salin & tempel ke field undangan)")
    def photo_url(self, obj):
        if not obj.image:
            return "Unggah foto lalu simpan untuk mendapatkan link."
        return copy_field(self._abs_url(obj), label="Salin Link")

    @admin.display(description="Link")
    def copy_url(self, obj):
        if not obj.image:
            return "-"
        return copy_field(self._abs_url(obj), label="Salin")


@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ("guest_name", "invitation", "attendance", "guest_count", "created_at")
    list_filter = ("attendance",)


@admin.register(Wish)
class WishAdmin(admin.ModelAdmin):
    list_display = ("name", "invitation", "created_at")
    search_fields = ("name", "message")


@admin.register(PricingTier)
class PricingTierAdmin(admin.ModelAdmin):
    list_display = ("link_count", "price", "label", "is_active")
    list_editable = ("price", "label", "is_active")
    ordering = ("link_count",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "link_count",
        "amount",
        "status",
        "created_at",
        "paid_at",
    )
    list_filter = ("status",)
    search_fields = ("user__username", "reference")
    filter_horizontal = ("invitations",)
    readonly_fields = ("created_at", "paid_at", "reference")
    actions = ["mark_as_paid"]

    @admin.action(description="Tandai sudah dibayar & publikasikan undangan")
    def mark_as_paid(self, request, queryset):
        count = 0
        for order in queryset:
            if order.status != "paid":
                order.mark_paid(method="admin")
                count += 1
        self.message_user(request, f"{count} pesanan ditandai lunas & dipublikasikan.")
