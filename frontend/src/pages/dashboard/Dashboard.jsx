import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import DashboardLayout from "../../components/DashboardLayout.jsx";

const FRONTEND = window.location.origin;

export default function Dashboard() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .myInvitations()
      .then(setInvitations)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm("Hapus undangan ini?")) return;
    await api.deleteInvitation(id);
    load();
  };

  const copyLink = (slug) => {
    const url = `${FRONTEND}/undangan/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <DashboardLayout>
      <div className="dash-head">
        <div>
          <h1>Undangan Saya</h1>
          <p className="dash-subtitle">Buat, ubah, dan publikasikan undangan Anda.</p>
        </div>
        <Link to="/dashboard/invitations/new" className="btn-primary">
          + Buat Undangan
        </Link>
      </div>

      {loading ? (
        <p className="dash-muted">Memuat...</p>
      ) : invitations.length === 0 ? (
        <div className="dash-empty">
          <p>Belum ada undangan. Mulai dengan membuat undangan pertama Anda.</p>
          <Link to="/dashboard/invitations/new" className="btn-primary">
            + Buat Undangan
          </Link>
        </div>
      ) : (
        <div className="inv-grid">
          {invitations.map((inv) => (
            <div className="inv-card" key={inv.id}>
              <div
                className="inv-card-cover"
                style={{ backgroundImage: `url(${inv.cover_photo})` }}
              >
                <span className={`inv-status ${inv.is_published ? "published" : "draft"}`}>
                  {inv.is_published ? "Dipublikasikan" : "Draft"}
                </span>
              </div>
              <div className="inv-card-body">
                <h3>
                  {inv.groom_name} &amp; {inv.bride_name}
                </h3>
                <p className="inv-card-tpl">Template: {inv.template}</p>

                {inv.is_published ? (
                  <div className="inv-link-row">
                    <input readOnly value={`${FRONTEND}/undangan/${inv.slug}`} />
                    <button onClick={() => copyLink(inv.slug)}>
                      {copied === inv.slug ? "✓" : "Salin"}
                    </button>
                  </div>
                ) : (
                  <p className="inv-locked">🔒 Publikasikan untuk mendapatkan link aktif.</p>
                )}

                <div className="inv-actions">
                  <Link to={`/dashboard/invitations/${inv.id}`} className="ia-btn">
                    Edit
                  </Link>
                  {inv.is_published && (
                    <a
                      href={`/undangan/${inv.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ia-btn"
                    >
                      Lihat
                    </a>
                  )}
                  <button onClick={() => remove(inv.id)} className="ia-btn danger">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {invitations.some((i) => !i.is_published) && (
        <div className="dash-cta">
          <span>Punya undangan draft? Publikasikan agar link-nya bisa dibuka tamu.</span>
          <Link to="/dashboard/pricing" className="btn-primary">
            Publikasikan Sekarang
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
