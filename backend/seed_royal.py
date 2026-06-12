from datetime import date, time
from invitations.models import (
    Invitation, Event, GalleryImage, LoveStory, BankAccount, RSVP, Wish,
)

SLUG = "haryo-dina"
Invitation.objects.filter(slug=SLUG).delete()

inv = Invitation.objects.create(
    slug=SLUG,
    template="royal",
    is_published=True,
    groom_name="Haryo",
    bride_name="Dina",
    groom_full_name="Haryo Zherio Pambudi, S.Tr.K",
    bride_full_name="Dina Amalinda, S.Pd",
    groom_order="Putra Pertama",
    bride_order="Putri Kedua",
    groom_father="Bapak Sudarmaji",
    groom_mother="Ibu Sri Wahyuni",
    bride_father="Bapak Mulyadi",
    bride_mother="Ibu Kartini",
    groom_instagram="hr.mbdi_",
    bride_instagram="dnamlinda_",
    groom_photo="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    bride_photo="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    cover_photo="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80",
    main_date=date(2026, 9, 20),
    opening_text=(
        "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud "
        "menyelenggarakan acara pernikahan putra-putri kami."
    ),
    quote=(
        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan "
        "untukmu pasangan hidup dari jenismu sendiri."
    ),
    quote_source="QS. Ar-Rum: 21",
    closing_text=(
        "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila "
        "Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu."
    ),
    wedding_hashtag="#HaryoDinaSakinah",
    dresscode="Maroon & Cream",
    gift_address="Jl. Melati No. 12, Yogyakarta",
    music_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
)

Event.objects.create(
    invitation=inv, name="Akad Nikah",
    date=date(2026, 9, 20), time_start=time(8, 0), time_end=time(10, 0),
    venue_name="Masjid Agung", venue_address="Jl. Malioboro, Yogyakarta",
    maps_url="https://maps.google.com/?q=Masjid+Agung+Yogyakarta",
)
Event.objects.create(
    invitation=inv, name="Resepsi",
    date=date(2026, 9, 20), time_start=time(11, 0), time_end=time(14, 0),
    venue_name="Gedung Mandala Bhakti", venue_address="Jl. Diponegoro, Yogyakarta",
    maps_url="https://maps.google.com/?q=Yogyakarta",
)

for i, url in enumerate([
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
]):
    GalleryImage.objects.create(invitation=inv, image=url, order=i)

stories = [
    ("2019", "Pertama Bertemu", "Dipertemukan saat masa pendidikan."),
    ("2023", "Lamaran", "Haryo melamar Dina di hadapan keluarga."),
    ("2026", "Menikah", "Memutuskan untuk melanjutkan ke jenjang pernikahan."),
]
for i, (d, t, desc) in enumerate(stories):
    LoveStory.objects.create(invitation=inv, date_label=d, title=t, description=desc, order=i)

BankAccount.objects.create(invitation=inv, bank_name="BCA", account_number="1234567890", account_holder="Dina Amalinda")
BankAccount.objects.create(invitation=inv, bank_name="Mandiri", account_number="0987654321", account_holder="Haryo Zherio")

RSVP.objects.create(invitation=inv, guest_name="Olga", attendance="yes", guest_count=2)
RSVP.objects.create(invitation=inv, guest_name="Budi", attendance="yes", guest_count=1)
Wish.objects.create(invitation=inv, name="Olga", message="Selamat menempuh hidup baru!")
Wish.objects.create(invitation=inv, name="Rina", message="Semoga sakinah mawaddah warahmah.")

print("OK slug:", inv.slug)
print("URL: https://balesourcecode.app/undangan/" + inv.slug)
