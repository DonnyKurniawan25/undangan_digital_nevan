from datetime import date, time
from invitations.models import (
    Invitation, Event, GalleryImage, LoveStory, BankAccount, RSVP, Wish,
)

slug = "raka-gendis"
Invitation.objects.filter(slug=slug).delete()

inv = Invitation.objects.create(
    slug=slug,
    template="aurora",
    is_published=True,
    groom_name="Raka",
    bride_name="Gendis",
    groom_full_name="Raka Adiwangsa",
    bride_full_name="Gendis Ayu Pramesti",
    groom_order="Putra pertama",
    bride_order="Putri kedua",
    groom_father="Bapak Suryo Adiwangsa",
    groom_mother="Ibu Larasati",
    bride_father="Bapak Wisnu Pramono",
    bride_mother="Ibu Sekar Arum",
    groom_instagram="raka.adiwangsa",
    bride_instagram="gendis.ayu",
    groom_photo="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    bride_photo="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    cover_photo="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
    main_date=date(2026, 11, 8),
    opening_text=(
        "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud "
        "menyelenggarakan pernikahan putra-putri kami."
    ),
    quote=(
        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu "
        "pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa "
        "tenteram kepadanya."
    ),
    quote_source="QS. Ar-Rum: 21",
    closing_text=(
        "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila "
        "Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."
    ),
    wedding_hashtag="#RakaMeetsGendis",
    dresscode="Earth tone & deep navy",
    gift_address="Jl. Cendana No. 12, Yogyakarta — Raka & Gendis",
)

Event.objects.create(
    invitation=inv, name="Akad Nikah", date=date(2026, 11, 8),
    time_start=time(8, 0), time_end=time(10, 0),
    venue_name="Pendopo Royal Ambarrukmo",
    venue_address="Jl. Laksda Adisucipto No.81, Yogyakarta",
    maps_url="https://maps.google.com/?q=Royal+Ambarrukmo+Yogyakarta",
)
Event.objects.create(
    invitation=inv, name="Resepsi", date=date(2026, 11, 8),
    time_start=time(11, 0), time_end=time(14, 0),
    venue_name="Ballroom Royal Ambarrukmo",
    venue_address="Jl. Laksda Adisucipto No.81, Yogyakarta",
    maps_url="https://maps.google.com/?q=Royal+Ambarrukmo+Yogyakarta",
)

stories = [
    ("2019", "Pertama Bertemu", "Dipertemukan di sebuah acara kampus, obrolan singkat yang berujung panjang."),
    ("2022", "Menjalin Hubungan", "Memutuskan untuk saling melengkapi dan tumbuh bersama."),
    ("2026", "Melamar", "Raka melamar Gendis di tepi pantai saat matahari terbenam."),
]
for d, t, desc in stories:
    LoveStory.objects.create(invitation=inv, date_label=d, title=t, description=desc)

gallery = [
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=900&q=80",
]
for i, url in enumerate(gallery):
    GalleryImage.objects.create(invitation=inv, image=url, caption=f"Foto {i+1}", order=i)

BankAccount.objects.create(invitation=inv, bank_name="BCA", account_number="1234567890", account_holder="Raka Adiwangsa")
BankAccount.objects.create(invitation=inv, bank_name="Mandiri", account_number="0987654321", account_holder="Gendis Ayu Pramesti")

RSVP.objects.create(invitation=inv, guest_name="Budi & Sari", attendance="yes", guest_count=2)
RSVP.objects.create(invitation=inv, guest_name="Keluarga Wijaya", attendance="yes", guest_count=4)

Wish.objects.create(invitation=inv, name="Dewi", message="Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah!")
Wish.objects.create(invitation=inv, name="Arif", message="Bahagia selalu untuk kalian berdua.")

print("OK slug:", inv.slug)
print("URL: https://balesourcecode.app/undangan/" + inv.slug)
