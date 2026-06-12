from datetime import date, time

from django.core.management.base import BaseCommand

from invitations.models import (
    Invitation,
    Event,
    GalleryImage,
    LoveStory,
    BankAccount,
    Wish,
    PricingTier,
)

UNSPLASH = "https://images.unsplash.com/"


class Command(BaseCommand):
    help = "Seed the database with demo wedding invitations (one per template)."

    def handle(self, *args, **options):
        Invitation.objects.all().delete()
        self.stdout.write("Cleared existing invitations.")

        self._create_pricing()
        self._create_elegant()
        self._create_floral()
        self._create_luxury()
        self._create_modern()

        self.stdout.write(self.style.SUCCESS("Demo data created successfully."))
        self.stdout.write(
            "Try: /undangan/rina-dimas, /undangan/sasha-bagas, "
            "/undangan/intan-reza, /undangan/maya-arif"
        )

    def _create_pricing(self):
        tiers = [
            (1, 50000, "Paket 1 Link", "Cocok untuk satu acara pernikahan."),
            (2, 90000, "Paket 2 Link", "Hemat untuk dua undangan berbeda."),
            (3, 125000, "Paket 3 Link", "Untuk beberapa acara sekaligus."),
            (5, 195000, "Paket 5 Link", "Paling hemat per link."),
        ]
        for count, price, label, desc in tiers:
            PricingTier.objects.update_or_create(
                link_count=count,
                defaults={
                    "price": price,
                    "label": label,
                    "description": desc,
                    "is_active": True,
                },
            )
        self.stdout.write("Pricing tiers created.")

    def _create_elegant(self):
        inv = Invitation.objects.create(
            slug="rina-dimas",
            template="elegant",
            is_published=True,
            groom_name="Dimas",
            groom_full_name="Dimas Aryasatya, S.T.",
            groom_father="Bapak Suryanto",
            groom_mother="Ibu Wulandari",
            groom_order="Putra pertama",
            groom_photo=UNSPLASH + "photo-1507003211169-0a1dd7228f2d?w=600&q=80",
            groom_instagram="dimas.arya",
            bride_name="Rina",
            bride_full_name="Rina Maharani, S.Ds.",
            bride_father="Bapak Hendarto",
            bride_mother="Ibu Sukmawati",
            bride_order="Putri kedua",
            bride_photo=UNSPLASH + "photo-1494790108377-be9c29b29330?w=600&q=80",
            bride_instagram="rina.maharani",
            cover_photo=UNSPLASH + "photo-1519741497674-611481863552?w=1200&q=80",
            main_date=date(2026, 9, 12),
            music_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            quote="Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.",
            quote_source="QS. Ar-Rum: 21",
            opening_text="Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.",
            wedding_hashtag="#DimasRinaForever",
            dresscode="Earth Tone / Formal",
            dresscode_colors="#c9a063,#a07d3e,#6a6253,#33302b",
            live_stream_url="https://youtube.com/live/example-dimas-rina",
            gift_address="Kirim kado ke: Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan (Rina/Dimas, 0812-3456-7890)",
        )

        Event.objects.create(
            invitation=inv,
            name="Akad Nikah",
            date=date(2026, 9, 12),
            time_start=time(8, 0),
            time_end=time(10, 0),
            venue_name="Masjid Agung Al-Azhar",
            venue_address="Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan",
            maps_url="https://maps.google.com/?q=Masjid+Agung+Al-Azhar",
            order=1,
        )
        Event.objects.create(
            invitation=inv,
            name="Resepsi",
            date=date(2026, 9, 12),
            time_start=time(11, 0),
            time_end=time(14, 0),
            venue_name="Ballroom Hotel Mulia",
            venue_address="Jl. Asia Afrika No.8, Senayan, Jakarta Pusat",
            maps_url="https://maps.google.com/?q=Hotel+Mulia+Senayan",
            order=2,
        )

        stories = [
            ("Pertemuan Pertama", "2019", "Kami pertama kali bertemu di sebuah acara kampus dan saling berkenalan."),
            ("Mulai Dekat", "2021", "Setelah sekian lama berteman, kami memutuskan untuk menjalin hubungan yang lebih serius."),
            ("Lamaran", "Maret 2026", "Dimas melamar Rina di hadapan kedua keluarga dengan penuh kebahagiaan."),
        ]
        for i, (t, d, desc) in enumerate(stories):
            LoveStory.objects.create(
                invitation=inv, title=t, date_label=d, description=desc, order=i
            )

        gallery_ids = [
            "photo-1606800052052-a08af7148866",
            "photo-1519225421980-715cb0215aed",
            "photo-1511285560929-80b456fea0bc",
            "photo-1583939003579-730e3918a45a",
            "photo-1465495976277-4387d4b0b4c6",
            "photo-1520854221256-17451cc331bf",
        ]
        for i, gid in enumerate(gallery_ids):
            GalleryImage.objects.create(
                invitation=inv, image=f"{UNSPLASH}{gid}?w=800&q=80", order=i
            )

        BankAccount.objects.create(
            invitation=inv,
            bank_name="BCA",
            account_number="1234567890",
            account_holder="Rina Maharani",
        )
        BankAccount.objects.create(
            invitation=inv,
            bank_name="Mandiri",
            account_number="0987654321",
            account_holder="Dimas Aryasatya",
        )

        Wish.objects.create(
            invitation=inv,
            name="Keluarga Besar Suryanto",
            message="Selamat menempuh hidup baru. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
        )
        Wish.objects.create(
            invitation=inv,
            name="Andi & Sari",
            message="Bahagia selalu untuk kalian berdua! Barakallah.",
        )

    def _create_floral(self):
        inv = Invitation.objects.create(
            slug="sasha-bagas",
            template="floral",
            is_published=True,
            groom_name="Bagas",
            groom_full_name="Bagas Pratama",
            groom_father="Bapak Raharjo",
            groom_mother="Ibu Kartika",
            groom_order="Putra kedua",
            groom_photo=UNSPLASH + "photo-1500648767791-00dcc994a43e?w=600&q=80",
            groom_instagram="bagas.pratama",
            bride_name="Sasha",
            bride_full_name="Sasha Amelia",
            bride_father="Bapak Wijaya",
            bride_mother="Ibu Lestari",
            bride_order="Putri pertama",
            bride_photo=UNSPLASH + "photo-1438761681033-6461ffad8d80?w=600&q=80",
            bride_instagram="sasha.amelia",
            cover_photo=UNSPLASH + "photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
            main_date=date(2026, 11, 8),
            music_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
            quote="Cinta sejati bukan tentang menemukan seseorang yang sempurna, tetapi tentang melihat seseorang dengan sempurna.",
            quote_source="",
            opening_text="Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk berbagi kebahagiaan di hari istimewa kami.",
            wedding_hashtag="#SashaBagasJourney",
            dresscode="Botanical Green",
            dresscode_colors="#8a9a6b,#6f8052,#dde3cf,#ffffff",
            live_stream_url="https://youtube.com/live/example-sasha-bagas",
            gift_address="",
        )

        Event.objects.create(
            invitation=inv,
            name="Pemberkatan",
            date=date(2026, 11, 8),
            time_start=time(9, 0),
            time_end=time(11, 0),
            venue_name="Gereja Katedral",
            venue_address="Jl. Katedral No.7B, Sawah Besar, Jakarta Pusat",
            maps_url="https://maps.google.com/?q=Gereja+Katedral+Jakarta",
            order=1,
        )
        Event.objects.create(
            invitation=inv,
            name="Resepsi",
            date=date(2026, 11, 8),
            time_start=time(18, 0),
            time_end=time(21, 0),
            venue_name="The Glass House",
            venue_address="Jl. Boulevard Raya, Kelapa Gading, Jakarta Utara",
            maps_url="https://maps.google.com/?q=The+Glass+House+Jakarta",
            order=2,
        )

        stories = [
            ("Awal Mula", "2020", "Berkenalan lewat seorang teman di sebuah kafe kecil."),
            ("Perjalanan", "2022", "Menjalani banyak suka dan duka bersama, semakin yakin satu sama lain."),
            ("Tunangan", "Mei 2026", "Bagas melamar Sasha di tepi pantai saat matahari terbenam."),
        ]
        for i, (t, d, desc) in enumerate(stories):
            LoveStory.objects.create(
                invitation=inv, title=t, date_label=d, description=desc, order=i
            )

        gallery_ids = [
            "photo-1522673607200-164d1b6ce486",
            "photo-1469371670807-013ccf25f16a",
            "photo-1535254973040-607b474cb50d",
            "photo-1525258810847-c1d40c4 adda?",
            "photo-1606216794074-735e91aa2c92",
            "photo-1519671482749-fd09be7ccebf",
        ]
        clean_ids = [
            "photo-1522673607200-164d1b6ce486",
            "photo-1469371670807-013ccf25f16a",
            "photo-1535254973040-607b474cb50d",
            "photo-1606216794074-735e91aa2c92",
            "photo-1519671482749-fd09be7ccebf",
            "photo-1511285560929-80b456fea0bc",
        ]
        for i, gid in enumerate(clean_ids):
            GalleryImage.objects.create(
                invitation=inv, image=f"{UNSPLASH}{gid}?w=800&q=80", order=i
            )

        BankAccount.objects.create(
            invitation=inv,
            bank_name="BNI",
            account_number="5566778899",
            account_holder="Sasha Amelia",
        )

        Wish.objects.create(
            invitation=inv,
            name="Teman Kantor",
            message="Selamat ya! Semoga langgeng sampai kakek nenek.",
        )

    def _create_luxury(self):
        inv = Invitation.objects.create(
            slug="intan-reza",
            template="luxury",
            is_published=True,
            groom_name="Reza",
            groom_full_name="Reza Mahendra, B.Sc.",
            groom_father="Bapak Iskandar",
            groom_mother="Ibu Halimah",
            groom_order="Putra pertama",
            groom_photo=UNSPLASH + "photo-1492562080023-ab3db95bfbce?w=600&q=80",
            groom_instagram="reza.mahendra",
            bride_name="Intan",
            bride_full_name="Intan Permatasari",
            bride_father="Bapak Gunawan",
            bride_mother="Ibu Saraswati",
            bride_order="Putri kedua",
            bride_photo=UNSPLASH + "photo-1524504388940-b1c1722653e1?w=600&q=80",
            bride_instagram="intan.permata",
            cover_photo=UNSPLASH + "photo-1511285560929-80b456fea0bc?w=1200&q=80",
            main_date=date(2027, 1, 24),
            quote="Two souls with but a single thought, two hearts that beat as one.",
            quote_source="Friedrich Halm",
            opening_text="With great joy and gratitude, we invite you to celebrate the beginning of our forever.",
            music_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
            wedding_hashtag="#TheArtOfIntanReza",
            dresscode="Black Tie / Cocktail",
            dresscode_colors="#0e0e10,#1f1c16,#c9a063,#e9c98a",
            live_stream_url="https://youtube.com/live/example-intan-reza",
            gift_address="The St. Regis Jakarta, Setiabudi, Jakarta Selatan",
            closing_text="It would be an honour to share our most precious day with you.",
        )

        Event.objects.create(
            invitation=inv,
            name="The Holy Matrimony",
            date=date(2027, 1, 24),
            time_start=time(16, 0),
            time_end=time(17, 30),
            venue_name="Grand Ballroom, The St. Regis",
            venue_address="Jl. HR. Rasuna Said, Setiabudi, Jakarta Selatan",
            maps_url="https://maps.google.com/?q=The+St+Regis+Jakarta",
            order=1,
        )
        Event.objects.create(
            invitation=inv,
            name="Gala Dinner",
            date=date(2027, 1, 24),
            time_start=time(19, 0),
            time_end=time(22, 0),
            venue_name="Grand Ballroom, The St. Regis",
            venue_address="Jl. HR. Rasuna Said, Setiabudi, Jakarta Selatan",
            maps_url="https://maps.google.com/?q=The+St+Regis+Jakarta",
            order=2,
        )

        stories = [
            ("Where It Began", "2018", "A chance meeting at an art gallery opening in Singapore."),
            ("Falling Deeper", "2021", "Travelling the world together, one city at a time."),
            ("The Proposal", "Desember 2026", "Reza proposed under the northern lights in Iceland."),
        ]
        for i, (t, d, desc) in enumerate(stories):
            LoveStory.objects.create(
                invitation=inv, title=t, date_label=d, description=desc, order=i
            )

        gallery_ids = [
            "photo-1519741497674-611481863552",
            "photo-1469371670807-013ccf25f16a",
            "photo-1606800052052-a08af7148866",
            "photo-1465495976277-4387d4b0b4c6",
            "photo-1520854221256-17451cc331bf",
            "photo-1583939003579-730e3918a45a",
        ]
        for i, gid in enumerate(gallery_ids):
            GalleryImage.objects.create(
                invitation=inv, image=f"{UNSPLASH}{gid}?w=800&q=80", order=i
            )

        BankAccount.objects.create(
            invitation=inv,
            bank_name="BCA",
            account_number="8800123456",
            account_holder="Intan Permatasari",
        )

        Wish.objects.create(
            invitation=inv,
            name="The Mahendra Family",
            message="Wishing you a lifetime of love and elegance. Congratulations!",
        )

    def _create_modern(self):
        inv = Invitation.objects.create(
            slug="maya-arif",
            template="modern",
            is_published=True,
            groom_name="Arif",
            groom_full_name="Arif Nugroho",
            groom_father="Bapak Santoso",
            groom_mother="Ibu Ningsih",
            groom_order="Putra kedua",
            groom_photo=UNSPLASH + "photo-1463453091185-61582044d556?w=600&q=80",
            groom_instagram="arif.ngrh",
            bride_name="Maya",
            bride_full_name="Maya Anggraini",
            bride_father="Bapak Bambang",
            bride_mother="Ibu Retno",
            bride_order="Putri pertama",
            bride_photo=UNSPLASH + "photo-1502823403499-6ccfcf4fb453?w=600&q=80",
            bride_instagram="maya.anggraini",
            cover_photo=UNSPLASH + "photo-1522413452208-996ff3f3e740?w=1200&q=80",
            main_date=date(2026, 10, 18),
            quote="Together is a beautiful place to be.",
            quote_source="",
            opening_text="We're getting married, and we'd love for you to be part of our celebration.",
            music_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            wedding_hashtag="#MayaAndArif",
            dresscode="Smart Casual",
            dresscode_colors="#111111,#f5f3ee,#d98c6a,#8a8a8a",
            live_stream_url="https://youtube.com/live/example-maya-arif",
            gift_address="",
            closing_text="Your presence and blessings would mean the world to us.",
        )

        Event.objects.create(
            invitation=inv,
            name="Akad Nikah",
            date=date(2026, 10, 18),
            time_start=time(9, 0),
            time_end=time(11, 0),
            venue_name="Pendopo Kayu",
            venue_address="Jl. Damai No. 21, Sleman, Yogyakarta",
            maps_url="https://maps.google.com/?q=Sleman+Yogyakarta",
            order=1,
        )
        Event.objects.create(
            invitation=inv,
            name="Resepsi",
            date=date(2026, 10, 18),
            time_start=time(18, 30),
            time_end=time(21, 0),
            venue_name="The Atrium",
            venue_address="Jl. Magelang KM 6, Yogyakarta",
            maps_url="https://maps.google.com/?q=Jalan+Magelang+Yogyakarta",
            order=2,
        )

        stories = [
            ("Hello", "2020", "Matched on an app and talked until sunrise."),
            ("Us", "2023", "Moved in together and adopted a cat named Kopi."),
            ("Forever", "Agustus 2026", "Arif proposed during a quiet morning hike."),
        ]
        for i, (t, d, desc) in enumerate(stories):
            LoveStory.objects.create(
                invitation=inv, title=t, date_label=d, description=desc, order=i
            )

        gallery_ids = [
            "photo-1522413452208-996ff3f3e740",
            "photo-1511285560929-80b456fea0bc",
            "photo-1525258810847-c1d40c4adda4",
            "photo-1519225421980-715cb0215aed",
            "photo-1496843916299-590492c751f4",
            "photo-1460978812857-470ed1c77af0",
        ]
        for i, gid in enumerate(gallery_ids):
            GalleryImage.objects.create(
                invitation=inv, image=f"{UNSPLASH}{gid}?w=800&q=80", order=i
            )

        BankAccount.objects.create(
            invitation=inv,
            bank_name="Jago",
            account_number="101938475",
            account_holder="Maya Anggraini",
        )
        BankAccount.objects.create(
            invitation=inv,
            bank_name="GoPay",
            account_number="0856-1122-3344",
            account_holder="Arif Nugroho",
        )

        Wish.objects.create(
            invitation=inv,
            name="Sahabat Kuliah",
            message="Finally! So happy for you both. Can't wait to celebrate!",
        )
