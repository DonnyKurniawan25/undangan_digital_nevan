import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client.js";
import DashboardLayout from "../../components/DashboardLayout.jsx";

const rupiah = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

const STATUS_LABEL = {
  pending: "Menunggu Pembayaran",
  paid: "Lunas",
  cancelled: "Dibatalkan",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payFor, setPayFor] = useState(null); // order being paid
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const reload = () =>
    api.myOrders().then(setOrders);

  useEffect(() => {
    Promise.all([api.myOrders(), api.getPaymentInfo()])
      .then(([o, p]) => {
        setOrders(o);
        setPayment(p);
      })
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (order) => {
    if (!window.confirm(`Batalkan pesanan #${order.id}?`)) return;
    setBusy(true);
    setError("");
    try {
      await api.cancelOrder(order.id);
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const waLink = useMemo(() => {
    if (!payment?.whatsapp_number || !payFor) return "";
    const names = payFor.invitations_detail
      .map((i) => `${i.groom_name} & ${i.bride_name}`)
      .join(", ");
    const msg =
      `Halo, saya sudah melakukan pembayaran untuk publikasi undangan.\n\n` +
      `Order ID: #${payFor.id}\n` +
      `Jumlah link: ${payFor.link_count}\n` +
      `Total: ${rupiah(payFor.amount)}\n` +
      `Undangan: ${names}\n\n` +
      `Berikut saya lampirkan bukti pembayarannya.`;
    return `https://wa.me/${payment.whatsapp_number}?text=${encodeURIComponent(msg)}`;
  }, [payment, payFor]);

  return (
    <DashboardLayout>
      <div className="dash-head">
        <div>
          <h1>Pesanan</h1>
          <p className="dash-subtitle">Riwayat pesanan publikasi undangan.</p>
        </div>
      </div>

      {error && <p className="form-msg error">{error}</p>}

      {loading ? (
        <p className="dash-muted">Memuat...</p>
      ) : orders.length === 0 ? (
        <p className="dash-muted">Belum ada pesanan.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Jumlah Link</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.link_count}</td>
                <td>{rupiah(o.amount)}</td>
                <td>
                  <span className={`order-status ${o.status}`}>
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                </td>
                <td>{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                <td>
                  {o.status === "pending" ? (
                    <div className="order-actions">
                      <button
                        className="btn-small btn-pay"
                        onClick={() => setPayFor(o)}
                      >
                        Bayar
                      </button>
                      <button
                        className="btn-small btn-cancel"
                        disabled={busy}
                        onClick={() => cancel(o)}
                      >
                        Batalkan
                      </button>
                    </div>
                  ) : (
                    <span className="dash-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Payment modal */}
      {payFor && (
        <div className="modal-backdrop" onClick={() => setPayFor(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Bayar Pesanan #{payFor.id}</h3>
              <button className="modal-close" onClick={() => setPayFor(null)}>✕</button>
            </div>

            <div className="pay-summary">
              <div><span>Jumlah Link</span><strong>{payFor.link_count}</strong></div>
              <div><span>Total</span><strong>{rupiah(payFor.amount)}</strong></div>
            </div>

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

            {payment?.instructions && (
              <div className="pay-instructions">
                {payment.instructions.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}

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
      )}
    </DashboardLayout>
  );
}
