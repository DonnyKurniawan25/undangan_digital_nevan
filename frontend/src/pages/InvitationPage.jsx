import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { api } from "../api/client.js";
import ElegantTemplate from "../templates/ElegantTemplate.jsx";
import FloralTemplate from "../templates/FloralTemplate.jsx";
import LuxuryTemplate from "../templates/LuxuryTemplate.jsx";
import ModernTemplate from "../templates/ModernTemplate.jsx";

const TEMPLATES = {
  elegant: ElegantTemplate,
  floral: FloralTemplate,
  luxury: LuxuryTemplate,
  modern: ModernTemplate,
};

export default function InvitationPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName =
    searchParams.get("to") || searchParams.get("kepada") || "";

  const [data, setData] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unpublished, setUnpublished] = useState(null);

  const loadWishes = async () => {
    try {
      const w = await api.getWishes(slug);
      setWishes(w);
    } catch (_) {
      /* ignore */
    }
  };

  const reloadInvitation = async () => {
    try {
      const inv = await api.getInvitation(slug);
      setData(inv);
    } catch (_) {
      /* ignore */
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getInvitation(slug)
      .then((inv) => {
        if (!mounted) return;
        setData(inv);
        setWishes(inv.wishes || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        if (err.status === 402) {
          setUnpublished(err.data || {});
        } else {
          setError(err.message);
        }
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="page-state">
        <div className="loader-heart">♥</div>
        <p>Memuat undangan...</p>
      </div>
    );
  }

  if (unpublished) {
    return (
      <div className="page-state">
        <div className="loader-heart" style={{ animation: "none" }}>🔒</div>
        <h2>Undangan Belum Aktif</h2>
        <p>
          Undangan{" "}
          {unpublished.groom_name && unpublished.bride_name
            ? `${unpublished.groom_name} & ${unpublished.bride_name}`
            : "ini"}{" "}
          belum dipublikasikan oleh pemiliknya.
        </p>
        <Link to="/" className="btn-primary">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-state">
        <h2>Undangan tidak ditemukan</h2>
        <p>Maaf, undangan yang Anda cari tidak tersedia.</p>
        <Link to="/" className="btn-primary">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const Template = TEMPLATES[data.template] || ElegantTemplate;

  return (
    <Template
      data={data}
      guestName={guestName}
      wishes={wishes}
      onWishAdded={loadWishes}
      onRsvpSubmitted={reloadInvitation}
    />
  );
}
