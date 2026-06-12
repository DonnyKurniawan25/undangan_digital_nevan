import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.myOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="dash-head">
        <div>
          <h1>Pesanan</h1>
          <p className="dash-subtitle">Riwayat pesanan publikasi undangan.</p>
        </div>
      </div>

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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
}
