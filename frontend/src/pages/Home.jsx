import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";

const TEMPLATE_LABELS = {
  elegant: "Elegant Gold",
  floral: "Floral Botanical",
  luxury: "Luxury Dark Gold",
  modern: "Modern Minimalist",
};

export default function Home() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listInvitations()
      .then((data) => {
        setInvitations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <nav className="home-nav">
        <span className="home-nav-brand">♥ Undangan Digital</span>
        <div className="home-nav-links">
          {user ? (
            <Link to="/dashboard" className="home-nav-btn primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="home-nav-btn">Masuk</Link>
              <Link to="/register" className="home-nav-btn primary">Daftar</Link>
            </>
          )}
        </div>
      </nav>

      <header className="home-hero">
        <div className="home-hero-inner">
          <p className="home-pre">Undangan Pernikahan Digital</p>
          <h1 className="home-headline">
            Bagikan Momen Bahagia Anda dengan Elegan
          </h1>
          <p className="home-desc">
            Undangan digital yang indah, modern, dan mudah dibagikan. Buat
            sendiri, pilih template, lalu publikasikan dan kirim tautan kepada
            para tamu undangan Anda.
          </p>
          <div className="home-cta-group">
            <Link to={user ? "/dashboard" : "/register"} className="btn-primary home-cta">
              {user ? "Buka Dashboard" : "Mulai Buat Undangan"}
            </Link>
            <a href="#templates" className="home-cta-ghost">Lihat Template</a>
          </div>
        </div>
      </header>

      <section className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Multi Template</h3>
          <p>Beragam pilihan desain undangan yang dapat disesuaikan dengan tema Anda.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Responsif</h3>
          <p>Tampil sempurna di ponsel, tablet, maupun desktop.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💌</div>
          <h3>RSVP & Ucapan</h3>
          <p>Tamu dapat mengonfirmasi kehadiran dan mengirimkan doa secara langsung.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎵</div>
          <h3>Musik & Galeri</h3>
          <p>Lengkap dengan musik latar, galeri foto, dan hitung mundur acara.</p>
        </div>
      </section>

      <section className="home-templates" id="templates">
        <h2 className="home-section-title">Contoh Undangan</h2>
        <p className="home-section-sub">
          Klik untuk melihat pratinjau undangan dengan template berbeda.
        </p>

        {loading ? (
          <p className="home-loading">Memuat...</p>
        ) : (
          <div className="home-grid">
            {invitations.map((inv) => (
              <Link
                to={`/undangan/${inv.slug}?to=Tamu Undangan`}
                className="home-tpl-card"
                key={inv.id}
              >
                <div
                  className="home-tpl-thumb"
                  style={{ backgroundImage: `url(${inv.cover_photo})` }}
                >
                  <span className={`home-tpl-badge badge-${inv.template}`}>
                    {TEMPLATE_LABELS[inv.template] || inv.template}
                  </span>
                </div>
                <div className="home-tpl-body">
                  <h3>
                    {inv.groom_name} &amp; {inv.bride_name}
                  </h3>
                  <span className="home-tpl-open">Lihat Undangan →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Undangan Digital · Dibuat dengan ♥ menggunakan Django &amp; React</p>
      </footer>
    </div>
  );
}
