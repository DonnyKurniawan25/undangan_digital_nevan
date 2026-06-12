from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils.text import slugify


class Invitation(models.Model):
    """The main wedding invitation record. Each invitation has a unique slug
    that is used as the public URL, e.g. /undangan/rina-dimas."""

    TEMPLATE_CHOICES = [
        ("elegant", "Elegant Gold"),
        ("floral", "Floral Botanical"),
        ("luxury", "Luxury Dark Gold"),
        ("modern", "Modern Minimalist"),
    ]

    slug = models.SlugField(max_length=120, unique=True, blank=True)
    template = models.CharField(
        max_length=30, choices=TEMPLATE_CHOICES, default="elegant"
    )
    owner = models.ForeignKey(
        User,
        related_name="invitations",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    is_published = models.BooleanField(
        default=False,
        help_text="Undangan hanya bisa dibuka publik setelah dipublikasikan (dibayar).",
    )

    # Groom
    groom_name = models.CharField(max_length=120)
    groom_full_name = models.CharField(max_length=200, blank=True)
    groom_father = models.CharField(max_length=200, blank=True)
    groom_mother = models.CharField(max_length=200, blank=True)
    groom_order = models.CharField(
        max_length=120, blank=True, help_text="Putra ke- dari ..."
    )
    groom_photo = models.URLField(blank=True)
    groom_instagram = models.CharField(max_length=120, blank=True)

    # Bride
    bride_name = models.CharField(max_length=120)
    bride_full_name = models.CharField(max_length=200, blank=True)
    bride_father = models.CharField(max_length=200, blank=True)
    bride_mother = models.CharField(max_length=200, blank=True)
    bride_order = models.CharField(
        max_length=120, blank=True, help_text="Putri ke- dari ..."
    )
    bride_photo = models.URLField(blank=True)
    bride_instagram = models.CharField(max_length=120, blank=True)

    # General
    cover_photo = models.URLField(blank=True)
    main_date = models.DateField(null=True, blank=True)
    quote = models.TextField(blank=True)
    quote_source = models.CharField(max_length=200, blank=True)
    music_url = models.URLField(blank=True)
    opening_text = models.TextField(
        blank=True, default="Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami."
    )

    # Extra info (premium)
    wedding_hashtag = models.CharField(
        max_length=80, blank=True, help_text="Contoh: #DimasRinaForever"
    )
    dresscode = models.CharField(
        max_length=200, blank=True, help_text="Contoh: Earth tone / Formal"
    )
    dresscode_colors = models.CharField(
        max_length=200,
        blank=True,
        help_text="Daftar warna dipisah koma, contoh: #c9a063,#6a6253,#ffffff",
    )
    live_stream_url = models.URLField(
        blank=True, help_text="Tautan live streaming acara (YouTube/Zoom/IG)"
    )
    gift_address = models.TextField(
        blank=True, help_text="Alamat pengiriman kado/hadiah fisik (opsional)"
    )
    closing_text = models.TextField(
        blank=True,
        default="Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(f"{self.groom_name}-{self.bride_name}")
            slug = base
            counter = 1
            while Invitation.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                counter += 1
                slug = f"{base}-{counter}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.groom_name} & {self.bride_name}"


class Event(models.Model):
    """A wedding event such as Akad Nikah or Resepsi."""

    invitation = models.ForeignKey(
        Invitation, related_name="events", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=120)
    date = models.DateField(null=True, blank=True)
    time_start = models.TimeField(null=True, blank=True)
    time_end = models.TimeField(null=True, blank=True)
    venue_name = models.CharField(max_length=200, blank=True)
    venue_address = models.TextField(blank=True)
    maps_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.name} - {self.invitation}"


class GalleryImage(models.Model):
    invitation = models.ForeignKey(
        Invitation, related_name="gallery", on_delete=models.CASCADE
    )
    image = models.URLField()
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Image {self.id} - {self.invitation}"


class LoveStory(models.Model):
    """Timeline entry telling the couple's love story."""

    invitation = models.ForeignKey(
        Invitation, related_name="love_story", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    date_label = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class BankAccount(models.Model):
    """Digital gift / bank transfer account."""

    invitation = models.ForeignKey(
        Invitation, related_name="bank_accounts", on_delete=models.CASCADE
    )
    bank_name = models.CharField(max_length=120)
    account_number = models.CharField(max_length=120)
    account_holder = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.bank_name} - {self.account_number}"


class RSVP(models.Model):
    ATTENDANCE_CHOICES = [
        ("yes", "Hadir"),
        ("no", "Tidak Hadir"),
        ("maybe", "Masih Ragu"),
    ]

    invitation = models.ForeignKey(
        Invitation, related_name="rsvps", on_delete=models.CASCADE
    )
    guest_name = models.CharField(max_length=200)
    attendance = models.CharField(
        max_length=10, choices=ATTENDANCE_CHOICES, default="yes"
    )
    guest_count = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.guest_name} ({self.attendance})"


class Wish(models.Model):
    """Guestbook message / ucapan & doa."""

    invitation = models.ForeignKey(
        Invitation, related_name="wishes", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name}: {self.message[:30]}"


class Photo(models.Model):
    """Media library. Upload a photo here, then copy its public URL and paste
    it into any invitation field (cover photo, mempelai photo, gallery, etc.)."""

    title = models.CharField(
        max_length=200, blank=True, help_text="Nama/keterangan foto (opsional)"
    )
    image = models.ImageField(upload_to="photos/")
    owner = models.ForeignKey(
        User,
        related_name="photos",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Foto"
        verbose_name_plural = "Galeri Upload Foto"

    def __str__(self):
        return self.title or f"Foto #{self.pk}"


@receiver(post_delete, sender=Photo)
def delete_photo_file_on_delete(sender, instance, **kwargs):
    """Remove the physical file from /media when a Photo is deleted.
    Works for single deletes, admin bulk 'delete selected', and queryset
    deletes (Django fires post_delete for each collected object)."""
    if instance.image:
        instance.image.delete(save=False)


@receiver(pre_save, sender=Photo)
def delete_old_photo_on_change(sender, instance, **kwargs):
    """If the image of an existing Photo is replaced, delete the old file so
    leftovers do not pile up in the media folder."""
    if not instance.pk:
        return
    try:
        old = Photo.objects.get(pk=instance.pk)
    except Photo.DoesNotExist:
        return
    old_file = old.image
    if old_file and old_file != instance.image:
        old_file.delete(save=False)


class PricingTier(models.Model):
    """Harga publikasi berdasarkan jumlah link/undangan. Dikelola superadmin."""

    link_count = models.PositiveIntegerField(
        unique=True, help_text="Jumlah link undangan yang diaktifkan"
    )
    price = models.DecimalField(
        max_digits=12, decimal_places=0, help_text="Harga dalam Rupiah"
    )
    label = models.CharField(max_length=120, blank=True)
    description = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["link_count"]
        verbose_name = "Paket Harga"
        verbose_name_plural = "Paket Harga"

    def __str__(self):
        return f"{self.link_count} link - Rp{self.price:,.0f}"


class Order(models.Model):
    """Pesanan publikasi undangan. Setelah dibayar, undangan yang dipilih
    otomatis dipublikasikan sehingga link-nya bisa dibuka publik."""

    STATUS_CHOICES = [
        ("pending", "Menunggu Pembayaran"),
        ("paid", "Sudah Dibayar"),
        ("cancelled", "Dibatalkan"),
    ]

    user = models.ForeignKey(User, related_name="orders", on_delete=models.CASCADE)
    invitations = models.ManyToManyField(Invitation, related_name="orders", blank=True)
    link_count = models.PositiveIntegerField(default=0)
    amount = models.DecimalField(max_digits=12, decimal_places=0, default=0)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="pending")
    payment_method = models.CharField(max_length=60, blank=True)
    reference = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Pesanan"
        verbose_name_plural = "Pesanan"

    def __str__(self):
        return f"Order #{self.pk} - {self.user.username} - {self.status}"

    def mark_paid(self, method="mock"):
        from django.utils import timezone

        self.status = "paid"
        self.payment_method = method
        self.paid_at = timezone.now()
        if not self.reference:
            self.reference = f"PAY-{self.pk}-{int(self.paid_at.timestamp())}"
        self.save()
        # Publish all invitations in this order
        self.invitations.update(is_published=True)
