import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";
import DashboardLayout from "../../components/DashboardLayout.jsx";

const rupiah = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

export default function PublishPage() {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [payment, setPayment] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState("select"); // select | pay
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getPricing(), api.myInvitations(), api.getPaymentInfo()])
      .then(([t, inv, pay]) => {
        setTiers(t);
        setInvitations(inv);
        setPayment(pay);
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

  // Build a WhatsApp confirmation link with a prefilled message.
  const waLink = useMemo(() => {
    if (!payment?.whatsapp_number || !order) return "";
    const names = order.invitations_detail
      .map((i) => `${i.groom_name} & ${i.bride_name}`)
      .join(", ");
    const msg =
      `Halo, saya sudah melakukan pembayaran untuk publikasi undangan.\n\n` +
      `Order ID: #${order.id}\n` +
      `Jumlah link: ${order.link_count}\n` +
      `Total: ${rupiah(order.amount)}\n` +
      `Undangan: ${names}\n\n` +
      `Berikut saya lampirkan bukti pembayarannya.`;
    return `https://wa.me/${payment.whatsapp_number}?text=${encodeURIComponent(msg)}`;
  }, [payment, order]);

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
          <h2>Pembayaran via QRIS</h2>
          <div className="pay-summary">
            <div><span>Jumlah Link</span><strong>{order.link_count}</strong></div>
            <div><span>Total</span><strong>{rupiah(order.amount)}</strong></div>
            <div><span>Order ID</span><strong>#{order.id}</strong></div>
          </div>

          <div className="qris-pay">
            {payment?.qris_url ? (
              <div className="qris-box">
                <img className="qris-img" src={payment.qris_url} alt="QRIS Pembayaran" />
                <p className="dash-muted">Scan QRIS di atas untuk membayar</p>
              </div>
            ) : (
              <p className="form-msg error">
                QRIS belum diatur admin. Silakan hubungi penjual untuk pembayaran.
              </p>
            )}

            <div className="qris-info">
              {payment?.instructions && (
                <div className="pay-instructions">
                  {payment.instructions.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
              {payment?.account_info && (
                <div className="pay-account">
                  <strong>Info Pembayaran Lain:</strong>
                  {payment.account_info.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              <div className="pay-steps">
                <p><strong>Langkah pembayaran:</strong></p>
                <ol>
                  <li>Scan QRIS & bayar sesuai total {rupiah(order.amount)}</li>
                  <li>Simpan bukti pembayaran (screenshot)</li>
                  <li>Klik tombol di bawah → konfirmasi & kirim bukti via WhatsApp</li>
                  <li>Akun Anda diaktifkan setelah pembayaran diverifikasi</li>
                </ol>
              </div>

              {waLink ? (
                <a
                  className="btn-primary wa-confirm"
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Konfirmasi & Kirim Bukti via WhatsApp
                </a>
              ) : (
                <p className="form-msg error">
                  Nomor WhatsApp konfirmasi belum diatur admin.
                </p>
              )}
            </div>
          </div>

          <div className="pay-pending-note">
            <p>
              Pesanan <strong>#{order.id}</strong> berstatus <em>Menunggu Pembayaran</em>.
              Undangan akan otomatis aktif setelah pembayaran Anda diverifikasi penjual.
            </p>
            <button className="btn-secondary" onClick={() => navigate("/dashboard/orders")}>
              Lihat Status Pesanan
            </button>
          </div>
          {error && <p className="form-msg error">{error}</p>}
        </div>
      )}
    </DashboardLayout>
  );
}
