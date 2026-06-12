# Undangan Pernikahan Digital

Platform undangan pernikahan digital **multi-template** dengan **akun pengguna**
dan **alur publikasi berbayar**. Dibangun dengan **Django REST Framework**
(backend / API + superadmin) dan **React + Vite** (frontend: landing, dashboard
pengguna, dan tampilan undangan).

## Konsep

- **Pengunjung** bisa register / login.
- Setelah login, pengguna membuat undangan sendiri di **dashboard**, mengunggah
  foto sendiri, dan mengisi semua detail.
- Setiap undangan awalnya berstatus **Draft** — link-nya **belum bisa dibuka**
  publik (API mengembalikan 402).
- Untuk mengaktifkan link, pengguna **membayar**. Harga mengikuti **jumlah link**
  yang diaktifkan (1 link, 2 link, dst — tiap paket beda harga).
- Setelah pembayaran sukses (simulasi gateway), undangan otomatis
  **dipublikasikan** dan link-nya aktif.
- **Superadmin** mengelola semuanya lewat Django admin: pengguna, undangan,
  paket harga, pesanan (bisa tandai lunas manual), dan galeri foto.

## Multi-template

| Template | Nuansa | Demo slug |
| --- | --- | --- |
| **Elegant Gold** | Mewah, emas, klasik | `rina-dimas` |
| **Floral Botanical** | Lembut, hijau botani, romantis | `sasha-bagas` |
| **Luxury Dark Gold** | Gelap, premium, emas, mewah | `intan-reza` |
| **Modern Minimalist** | Bersih, modern, tipografi tegas | `maya-arif` |

## Informasi pada undangan

Selain mempelai, acara, love story, galeri, hadiah, RSVP, dan buku tamu,
undangan kini mendukung info tambahan premium:

- **Tagar pernikahan** (wedding hashtag)
- **Dress code** lengkap dengan **swatch warna**
- **Live streaming** acara (tombol tonton langsung)
- **Alamat pengiriman kado** fisik
- **Teks penutup** yang dapat disesuaikan

Semua field ini bisa diisi pengguna di editor dashboard maupun oleh superadmin
di Django admin, dan tampil otomatis di keempat template.



## Fitur Undangan

- Halaman sampul (cover) dengan tombol **Buka Undangan**
- Nama tamu personal lewat query string: `?to=Nama Tamu`
- Pembukaan / ayat / quote
- Profil kedua mempelai + tautan Instagram
- **Hitung mundur** (countdown) menuju hari-H
- **Love story** (timeline perjalanan cinta)
- Detail acara (Akad / Resepsi) + tombol Google Maps
- **Galeri** foto
- **Wedding gift** (rekening bank) dengan tombol salin nomor
- **RSVP** konfirmasi kehadiran + ringkasan statistik
- **Buku tamu** (ucapan & doa) realtime ke database
- **Musik latar** dengan kontrol mengambang
- Animasi scroll reveal, fully responsive (mobile-first)

## Cara Cepat (Windows / file .bat)

Cukup klik dua kali file berikut:

| File | Fungsi |
| --- | --- |
| `setup.bat` | Sekali jalan: buat venv, install dependency backend & frontend, migrasi DB, isi data contoh |
| `start.bat` | Menjalankan backend + frontend sekaligus (otomatis setup bila belum), lalu membuka browser |
| `run-backend.bat` | Menjalankan server Django saja (port 8000) |
| `run-frontend.bat` | Menjalankan server React saja (port 5173) |

Langkah pertama kali: jalankan **`setup.bat`** dahulu, lalu **`start.bat`**.
Selanjutnya cukup `start.bat` saja.

## Struktur Proyek

```
pernikahan_digital/
├── backend/            # Django + DRF (API only)
│   ├── config/         # settings, urls, wsgi
│   ├── invitations/    # app: models, serializers, views, admin, seed
│   └── requirements.txt
└── frontend/           # React + Vite
    └── src/
        ├── api/         # client API
        ├── components/  # Countdown, RsvpForm, Guestbook, GiftSection, AudioPlayer
        ├── hooks/       # useCountdown, useScrollReveal
        ├── pages/       # Home, InvitationPage
        ├── templates/   # ElegantTemplate, FloralTemplate
        ├── styles/      # global.css, elegant.css, floral.css
        └── utils/       # format.js
```

## Menjalankan Backend (Django)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo        # mengisi 2 undangan contoh
python manage.py runserver 8000
```

API berjalan di `http://127.0.0.1:8000`.

- Admin panel: `http://127.0.0.1:8000/admin/` (user: `admin`, pass: `admin123`)
- Daftar endpoint: buka root `http://127.0.0.1:8000/`

### Endpoint utama

| Method | Endpoint | Auth | Keterangan |
| --- | --- | --- | --- |
| POST | `/api/auth/register/` | - | Daftar akun, mengembalikan token |
| POST | `/api/auth/login/` | - | Login, mengembalikan token |
| GET | `/api/auth/me/` | token | Info user saat ini |
| GET | `/api/templates/` | - | Daftar template |
| GET | `/api/pricing/` | - | Daftar paket harga |
| GET | `/api/invitations/` | - | Daftar undangan terpublikasi |
| GET | `/api/invitations/<slug>/` | - | Detail (402 jika belum dibayar) |
| GET/POST/PUT/DELETE | `/api/my/invitations/` | token | CRUD undangan milik sendiri |
| GET/POST/DELETE | `/api/my/photos/` | token | Upload & kelola foto sendiri |
| POST | `/api/my/orders/quote/` | token | Hitung harga untuk N link |
| POST | `/api/my/orders/checkout/` | token | Buat pesanan (pending) |
| POST | `/api/my/orders/<id>/pay/` | token | Simulasi bayar → publikasi |
| GET/POST | `/api/invitations/<slug>/rsvps/` | - | RSVP |
| GET/POST | `/api/invitations/<slug>/wishes/` | - | Ucapan |

> Autentikasi memakai **Token** DRF. Kirim header `Authorization: Token <token>`.

## Alur Pengguna (Frontend)

1. **Daftar / Masuk** di `/register` atau `/login`.
2. **Dashboard** (`/dashboard`): daftar undangan, status Draft/Published.
3. **Buat Undangan**: form lengkap (mempelai, acara, love story, galeri,
   rekening, musik) + pemilih foto dari galeri pribadi.
4. **Galeri Foto** (`/dashboard/photos`): unggah banyak foto, salin link, hapus.
5. **Harga & Publikasi** (`/dashboard/pricing`): pilih undangan draft → lihat
   harga sesuai jumlah link → checkout → bayar (simulasi) → undangan aktif.
6. **Pesanan** (`/dashboard/orders`): riwayat transaksi.

## Menjalankan Frontend (React)

```powershell
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`. Request `/api/*` otomatis
di-proxy ke Django (lihat `vite.config.js`), jadi pastikan backend juga aktif.

### Tautan contoh

- Beranda: `http://localhost:5173/`
- Undangan Elegant: `http://localhost:5173/undangan/rina-dimas?to=Bapak Andi`
- Undangan Floral: `http://localhost:5173/undangan/sasha-bagas?to=Ibu Sari`

## Mengelola Lewat Django Admin

Buka `http://127.0.0.1:8000/admin/` (user: `admin`, pass: `admin123`).
Panel admin sudah memakai tema kustom: header berbranding emas, section
berbentuk kartu, dan **field input yang jelas terlihat** (border tegas, padding
lega, highlight emas saat fokus). Mendukung mode terang & gelap bawaan Django.

### Menyalin link undangan
Pada halaman edit **Invitation**, di bagian paling atas (**Link Undangan**)
tersedia link siap bagikan lengkap dengan tombol **Salin** — termasuk versi
dengan nama tamu (`?to=Nama Tamu`). Kolom **Link** juga muncul di daftar
undangan.

### Upload foto + salin link foto
Buka menu **Galeri Upload Foto** di admin:

**Upload banyak sekaligus:** klik tombol **Upload Banyak Foto** di kanan atas
daftar. Seret-dan-lepas atau pilih beberapa file sekaligus, lihat pratinjaunya,
lalu klik **Upload Semua** — tiap foto tersimpan sebagai entri terpisah.

**Upload satu per satu:** klik **Add**, beri judul (opsional), pilih file, **Save**.

Setelah tersimpan, tiap foto punya **pratinjau** dan kotak **Link Foto** dengan
tombol **Salin Link**. Tempel link itu ke field undangan mana pun (Cover Photo,
foto mempelai, galeri, dll). Di daftar foto juga ada tombol **Salin** cepat.

> Foto tersimpan di `backend/media/` dan disajikan di
> `http://127.0.0.1:8000/media/...`. Saat sebuah foto **dihapus** (termasuk
> hapus massal lewat "delete selected"), file fisiknya **ikut terhapus** dari
> folder media agar tidak menumpuk. Mengganti file pada foto yang sudah ada juga
> otomatis menghapus file lama.

### Musik latar
Isi field **Music URL** pada undangan dengan tautan file audio (mp3). Musik
mulai otomatis saat tamu menekan tombol **Buka Undangan**, dan ada tombol
musik mengambang untuk play/pause. Data contoh sudah memakai musik bawaan.

### Edit undangan di admin (section, preview, on/off)
Halaman edit **Invitation** kini terbagi jelas per section bertanda:
`🔗 LINK & PREVIEW`, `⚙️ PENGATURAN UMUM`, `👁️ TAMPILAN SECTION`,
`🤵 MEMPELAI PRIA`, `👰 MEMPELAI WANITA`, `📝 KONTEN UTAMA`, dan
`✨ INFO TAMBAHAN`.

- **Pratinjau langsung**: di bagian atas ada iframe berbentuk ponsel yang
  menampilkan undangan secara live — **bisa dilihat walau belum dipublikasikan**
  (memakai preview token rahasia). Klik **Save** lalu **Muat Ulang** untuk
  melihat perubahan terbaru, atau **Buka di Tab Baru**.
- **Aktif/nonaktif section**: di grup `👁️ TAMPILAN SECTION` ada centang untuk
  tiap bagian (Quote, Mempelai, Hitung Mundur, Love Story, Acara, Galeri,
  Wedding Gift, Info Tambahan, RSVP, Buku Tamu). Hilangkan centang untuk
  menyembunyikan section dari undangan. Toggle yang sama juga tersedia di editor
  dashboard pengguna.

### Kelola harga & pesanan (superadmin)
- **Paket Harga**: atur harga per jumlah link (1 link, 2 link, dst). Pengguna
  melihat paket ini saat akan publikasi.
- **Pesanan**: lihat semua transaksi. Ada aksi **"Tandai sudah dibayar &
  publikasikan undangan"** untuk konfirmasi pembayaran manual (mis. transfer),
  yang langsung mengaktifkan link undangan terkait.
- **Invitation**: kolom **is_published** bisa diubah langsung dari daftar untuk
  publikasi/menonaktifkan manual.

## Menambah Undangan Baru

Lewat Django admin (`/admin/`): buat objek **Invitation**, pilih template,
lalu tambahkan Event, Love Story, Gallery, dan Bank Account secara inline.
Slug akan dibuat otomatis dari nama mempelai bila dikosongkan.

## Menambah Template Baru (untuk pengembang)

1. Buat komponen baru di `frontend/src/templates/NamaTemplate.jsx`.
2. Tambahkan stylesheet `frontend/src/styles/nama.css` dan impor di `main.jsx`.
3. Daftarkan di `TEMPLATES` pada `frontend/src/pages/InvitationPage.jsx`.
4. Tambahkan pilihan di `TEMPLATE_CHOICES` pada `backend/invitations/models.py`
   lalu jalankan `makemigrations` + `migrate`.

Komponen interaktif (Countdown, RsvpForm, Guestbook, GiftSection, AudioPlayer)
dapat dipakai ulang dan otomatis mengikuti warna template melalui CSS variables.
