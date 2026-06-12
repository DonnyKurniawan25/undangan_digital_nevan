import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <div className="dash-brand">♥ Undangan</div>
        <nav className="dash-nav">
          <NavLink to="/dashboard" end>📋 Undangan Saya</NavLink>
          <NavLink to="/dashboard/photos">🖼️ Galeri Foto</NavLink>
          <NavLink to="/dashboard/pricing">💳 Harga & Publikasi</NavLink>
          <NavLink to="/dashboard/orders">🧾 Pesanan</NavLink>
        </nav>
        <div className="dash-user">
          <div className="dash-user-name">{user?.first_name || user?.username}</div>
          <button onClick={doLogout} className="dash-logout">Keluar</button>
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
