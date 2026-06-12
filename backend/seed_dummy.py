from datetime import date, time
from invitations.models import (
    Invitation, Event, GalleryImage, LoveStory, BankAccount, RSVP, Wish,
)

# Idempotent: hapus dummy lama kalau ada
Invitation.objects.filter(slug__startswith="dimas-rina").delete()

inv = Invitation.objects.create(
    template="elegant",
    is_published=True,
    groom_name="Dimas",
    groom_full_name="Dimas Aryasatya Pratama, S.T.",
    groom_father="Bapak Hendro Pratama",
    groom_mother="Ibu Sri Wahyuni",
    groom_order="Putra pertama dari pasangan",
    groom_photo="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    groom_instagram="@dimas.arya",
    bride_name="Rina",
    bride_full_name="Rina Anggraini Putri, S.Ked.",
    bride_father="Bapak Sutrisno Hadi",
    bride_mother="Ibu Maria Ulfa",
    bride_order="Putri kedua dari pasangan",
    bride_photo="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    bride_instagram="@rina.anggraini",
    cover_photo="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    main_date=date(2026, 9, 20),
    quote="Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.",
    quote_source="QS. Ar-Rum: 21",
    music_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    wedding_hashtag="#DimasRinaForever",
    dresscode="Earth Tone / Formal",
    dresscode_colors="#c9a063,#6a6253,#3d3a32,#ffffff",
    live_stream_url="https://youtube.com/live/dummy-stream",
    gift_address="Jl. Melati Indah No. 12, Sleman, Yogyakarta 55281 (a.n. Rina Anggraini)",
)

# Events
Event.objects.create(
    invitation=inv, name="Akad Nikah", date=date(2026, 9, 20),
    time_start=time(8, 0), time_end=time(10, 0),
    venue_name="Masjid Agung Kauman",
    venue_address="Jl. Kauman, Ngupasan, Gondomanan, Kota Yogyakarta",
    maps_url="https://maps.google.com/?q=Masjid+Agung+Kauman+Yogyakarta", order=1,
)
Event.objects.create(
    invitation=inv, name="Resepsi", date=date(2026, 9, 20),
    time_start=time(11, 0), time_end=time(14, 0),
    venue_name="Royal Ambarrukmo Ballroom",
    venue_address="Jl. Laksda Adisucipto No.81, Caturtunggal, Depok, Sleman",
    maps_url="https://maps.google.com/?q=Royal+Ambarrukmo+Yogyakarta", order=2,
)

# Gallery
gallery = [
    ("https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80", "Prewedding di pantai"),
    ("https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80", "Senja bersama"),
    ("https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80", "Momen bahagia"),
    ("https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", "Tukar cincin"),
]
for i, (url, cap) in enumerate(gallery, 1):
    GalleryImage.objects.create(invitation=inv, image=url, caption=cap, order=i)

# Love Story
stories = [
    ("Pertama Bertemu", "2019", "Berawal dari satu kepanitiaan kampus, kami dipertemukan tanpa sengaja dan langsung merasa nyaman."),
    ("Mulai Dekat", "2021", "Setelah lama berteman, kami memutuskan menjalani hubungan yang lebih serius."),
    ("Lamaran", "Maret 2026", "Dengan restu kedua keluarga, Dimas melamar Rina di hari yang penuh haru."),
]
for i, (t, d, desc) in enumerate(stories, 1):
    LoveStory.objects.create(invitation=inv, title=t, date_label=d, description=desc, order=i)

# Bank accounts
BankAccount.objects.create(invitation=inv, bank_name="BCA", account_number="1234567890", account_holder="Rina Anggraini Putri")
BankAccount.objects.create(invitation=inv, bank_name="Mandiri", account_number="0987654321", account_holder="Dimas Aryasatya Pratama")

# RSVP
RSVP.objects.create(invitation=inv, guest_name="Budi Santoso", attendance="yes", guest_count=2)
RSVP.objects.create(invitation=inv, guest_name="Siti Nurhaliza", attendance="maybe", guest_count=1)
RSVP.objects.create(invitation=inv, guest_name="Andre Wijaya", attendance="no", guest_count=1)

# Wishes
Wish.objects.create(invitation=inv, name="Budi Santoso", message="Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.")
Wish.objects.create(invitation=inv, name="Maya Putri", message="Bahagia selalu untuk kalian berdua. Barakallahu lakuma!")
Wish.objects.create(invitation=inv, name="Rio Ferdinand", message="Akhirnya nikah juga! Selamat ya, semoga langgeng sampai kakek nenek.")

print("OK slug:", inv.slug)
print("URL: https://balesourcecode.app/undangan/" + inv.slug)
print("events:", inv.events.count(), "gallery:", inv.gallery.count(), "love:", inv.love_story.count(), "bank:", inv.bank_accounts.count(), "rsvp:", inv.rsvps.count(), "wishes:", inv.wishes.count())
