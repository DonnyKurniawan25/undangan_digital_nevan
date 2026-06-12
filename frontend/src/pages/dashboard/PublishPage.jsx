import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";
import DashboardLayout from "../../components/DashboardLayout.jsx";

const rupiah = (n) =>
  "Rp" + Number(n || 0).toLocaleString("id-ID");

export default function PublishPage() {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState("select"); // select | pay | done
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getPricing(), api.myInvitations()])
      .then(([t, inv]) => {
        setTiers(t);
        setInvitations(inv);
      })
      .finally(() => setLoading(false));
  }, []);

  const drafts = invitations.filter((i) => !i.is_published);

  const priceFor = (count) => {
    if (count <= 0) return 0;
    const exact = tiers.find((t) => t.link_count === count);
    if (exact) return Number(exact.price);
    const base = tiers.find((t) => t.link_count === 1);
    const perLink = base ? Number(base.price) : 50000;
    const lower = [...tiers]
      .filter((t) => t.link_count < count)
      .sort((a, b) => b.link_count - a.link_count)[0];
    if (lower) return Number(lower.price) + perLink * (count - lower.link_count);
    return perLink * count;
  };

  const amount = useMemo(() => priceFor(selected.length), [selected, tiers]);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const goPay = async () => {
    setError("");
    setProcessing(true);
    try {
      const created = await api.checkoutOrder(selected);
      setOrder(created);
      setStep("pay");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const pay = async (method) => {
    setProcessing(true);
    setError("");
    try {
      const paid = await api.payOrder(order.id, method);
      setOrder(paid);
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return <DashboardLayout><p className="dash-muted">Memuat...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="dash-head">
        <div>
          <h1>Harga & Publikasi</h1>
          <p className="dash-subtitle">
            Pilih undangan yang ingin diaktifkan. Harga mengikuti jumlah link.
          </p>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="tier-grid">
        {tiers.map((t) => (
          <div className="tier-card" key={t.id}>
            <div className="tier-count">{t.link_count}</div>
            <div className="tier-label">{t.label || `${t.link_count} Link`}</div>
            <div className="tier-price">{rupiah(t.price)}</div>
            <div className="tier-desc">{t.description}</div>
          </div>
        ))}
      </div>

      {step === "select" && (
        <div className="publish-box">
          <h2>Pilih Undangan untuk Dipublikasikan</h2>
          {drafts.length === 0 ? (
            <p className="dash-muted">
              Tidak ada undangan draft. Semua undangan Anda sudah dipublikasikan.
            </p>
          ) : (
            <>
              <div className="select-list">
                {drafts.map((inv) => (
                  <label className="select-item" key={inv.id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(inv.id)}
                      onChange={() => toggle(inv.id)}
                    />
                    <span>
                      {inv.groom_name} &amp; {inv.bride_name}
                    </span>
                    <small>{inv.template}</small>
                  </label>
                ))}
              </div>
              <div className="checkout-bar">
                <div>
                  <span className="co-count">{selected.length} link dipilih</span>
                  <span className="co-amount">{rupiah(amount)}</span>
                </div>
                <button
                  className="btn-primary"
                  disabled={selected.length === 0 || processing}
                  onClick={goPay}
                >
                  {processing ? "Memproses..." : "Lanjut ke Pembayaran"}
                </button>
              </div>
            </>
          )}
          {error && <p className="form-msg error">{error}</p>}
        </div>
      )}

      {step === "pay" && order && (
        <div className="publish-box">
          <h2>Pembayaran</h2>
          <div className="pay-summary">
            <div><span>Jumlah Link</span><strong>{order.link_count}</strong></div>
            <div><span>Total</span><strong>{rupiah(order.amount)}</strong></div>
            <div><span>Order ID</span><strong>#{order.id}</strong></div>
          </div>
          <p className="dash-muted">
            Pilih metode pembayaran (simulasi gateway untuk demo).
          </p>
          <div className="pay-methods">
            {["Transfer Bank", "QRIS", "E-Wallet"].map((m) => (
              <button key={m} className="pay-method" disabled={processing} onClick={() => pay(m)}>
                {m}
              </button>
            ))}
          </div>
          {error && <p className="form-msg error">{error}</p>}
        </div>
      )}

      {step === "done" && order && (
        <div className="publish-box success-box">
          <div className="success-icon">✓</div>
          <h2>Pembayaran Berhasil!</h2>
          <p>{order.link_count} undangan Anda telah dipublikasikan. Link siap dibagikan.</p>
          <div className="done-links">
            {order.invitations_detail.map((inv) => (
              <div className="done-link-row" key={inv.id}>
                <span>{inv.groom_name} &amp; {inv.bride_name}</span>
                <a href={`/undangan/${inv.slug}`} target="_blank" rel="noreferrer">
                  Buka Link →
                </a>
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => navigate("/dashboard")}>
            Kembali ke Dashboard
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
