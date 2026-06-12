from datetime import date, time
from invitations.models import (
    Invitation, Event, GalleryImage, LoveStory, BankAccount, RSVP, Wish,
)

DATA = [
    {
        "template": "floral",
        "slug_prefix": "rangga-saraswati",
        "groom": dict(
            groom_name="Rangga",
            groom_full_name="Rangga Mahendra Wibowo, S.Kom.",
            groom_father="Bapak Joko Wibowo",
            groom_mother="Ibu Lestari Ningsih",
            groom_order="Putra kedua dari pasangan",
            groom_photo="https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80",
            groom_instagram="@rangga.mahendra",
        ),
        "bride": dict(
            bride_name="Saraswati",
            bride_full_name="Saraswati Dewi Maharani, S.Pd.",
            bride_father="Bapak Bambang Suryadi",
            bride_mother="Ibu Endang Susanti",
            bride_order="Putri pertama dari pasangan",
            bride_photo="https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=800&q=80",
            bride_instagram="@sara.maharani",
        ),
        "cover_photo": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80",
        "main_date": date(2026, 10, 11),
        "quote": "Cinta yang tumbuh dari kesabaran akan berbuah kebahagiaan yang abadi.",
        "quote_source": "Pepatah Jawa",
        "hashtag": "#RanggaSaraBersatu",
        "dresscode": "Botanical Green / Pastel",
        "dresscode_colors": "#7a8b6f,#c9d6bd,#f3ede2,#ffffff",
        "city": "Semarang",
    },
    {
        "template": "luxury",
        "slug_prefix": "arkananta-velove",
        "groom": dict(
            groom_name="Arkananta",
            groom_full_name="Arkananta Bramantyo, M.B.A.",
            groom_father="Bapak Reza Bramantyo",
            groom_mother="Ibu Diana Kusuma",
            groom_order="Putra tunggal dari pasangan",
            groom_photo="https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&q=80",
            groom_instagram="@arkananta.b",
        ),
        "bride": dict(
            bride_name="Velove",
            bride_full_name="Velove Annisa Ramadhani, S.H.",
            bride_father="Bapak Fauzan Ramadhani",
            bride_mother="Ibu Sintya Rahmawati",
            bride_order="Putri ketiga dari pasangan",
            bride_photo="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80",
            bride_instagram="@velove.annisa",
        ),
        "cover_photo": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
        "main_date": date(2026, 11, 22),
        "quote": "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?",
        "quote_source": "QS. Ar-Rahman: 13",
        "hashtag": "#ArkaVeloveForever",
        "dresscode": "Black Tie / Gold Accent",
        "dresscode_colors": "#1a1a1a,#c9a063,#2d2d2d,#ffffff",
        "city": "Jakarta",
    },
    {
        "template": "modern",
        "slug_prefix": "bagas-kirana",
        "groom": dict(
            groom_name="Bagas",
            groom_full_name="Bagas Pradipta Nugroho",
            groom_father="Bapak Agus Nugroho",
            groom_mother="Ibu Wati Handayani",
            groom_order="Putra pertama dari pasangan",
            groom_photo="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80",
            groom_instagram="@bagas.pradipta",
        ),
        "bride": dict(
            bride_name="Kirana",
            bride_full_name="Kirana Ayu Lestari",
            bride_father="Bapak Hadi Lestari",
            bride_mother="Ibu Ratna Sari",
            bride_order="Putri kedua dari pasangan",
            bride_photo="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80",
            bride_instagram="@kirana.ayu",
        ),
        "cover_photo": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80",
        "main_date": date(2026, 12, 6),
        "quote": "Two souls, one heart. Memulai babak baru bersama orang yang tepat.",
        "quote_source": "",
        "hashtag": "#BagasKiranaJourney",
        "dresscode": "Minimalist Monochrome",
        "dresscode_colors": "#2c2c2c,#8a8a8a,#e0e0e0,#ffffff",
        "city": "Bandung",
    },
]

GALLERY_URLS = [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=1200&q=80",
]

for d in DATA:
    Invitation.objects.filter(slug__startswith=d["slug_prefix"]).delete()
    inv = Invitation.objects.create(
        template=d["template"],
        is_published=True,
        cover_photo=d["cover_photo"],
        main_date=d["main_date"],
        quote=d["quote"],
        quote_source=d["quote_source"],
        music_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        wedding_hashtag=d["hashtag"],
        dresscode=d["dresscode"],
        dresscode_colors=d["dresscode_colors"],
        live_stream_url="https://youtube.com/live/dummy-stream",
        gift_address=f"Jl. Mawar No. 8, {d['city']} (a.n. {d['bride']['bride_name']})",
        **d["groom"],
        **d["bride"],
    )

    Event.objects.create(
        invitation=inv, name="Akad Nikah", date=d["main_date"],
        time_start=time(8, 0), time_end=time(10, 0),
        venue_name=f"Masjid Raya {d['city']}",
        venue_address=f"Pusat Kota {d['city']}",
        maps_url=f"https://maps.google.com/?q=Masjid+Raya+{d['city']}", order=1,
    )
    Event.objects.create(
        invitation=inv, name="Resepsi", date=d["main_date"],
        time_start=time(11, 0), time_end=time(14, 0),
        venue_name=f"Grand Ballroom Hotel {d['city']}",
        venue_address=f"Jl. Protokol No. 1, {d['city']}",
        maps_url=f"https://maps.google.com/?q=Grand+Ballroom+{d['city']}", order=2,
    )

    for i, url in enumerate(GALLERY_URLS, 1):
        GalleryImage.objects.create(invitation=inv, image=url, caption=f"Momen {i}", order=i)

    stories = [
        ("Pertama Bertemu", "2020", "Takdir mempertemukan kami di waktu yang tepat."),
        ("Mulai Serius", "2022", "Kami memutuskan melangkah ke hubungan yang lebih serius."),
        ("Lamaran", "April 2026", "Dengan restu keluarga, lamaran berlangsung penuh haru."),
    ]
    for i, (t, dl, desc) in enumerate(stories, 1):
        LoveStory.objects.create(invitation=inv, title=t, date_label=dl, description=desc, order=i)

    BankAccount.objects.create(invitation=inv, bank_name="BCA", account_number="1122334455", account_holder=d["bride"]["bride_full_name"])
    BankAccount.objects.create(invitation=inv, bank_name="BNI", account_number="5544332211", account_holder=d["groom"]["groom_full_name"])

    RSVP.objects.create(invitation=inv, guest_name="Tamu Satu", attendance="yes", guest_count=2)
    RSVP.objects.create(invitation=inv, guest_name="Tamu Dua", attendance="maybe", guest_count=1)

    Wish.objects.create(invitation=inv, name="Sahabat", message="Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah!")
    Wish.objects.create(invitation=inv, name="Keluarga", message="Bahagia selalu untuk kalian berdua. Barakallah!")

    print(f"{d['template']:8s} -> slug: {inv.slug}  URL: https://balesourcecode.app/undangan/{inv.slug}")

print("DONE")
