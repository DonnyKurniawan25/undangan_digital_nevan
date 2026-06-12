import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import InvitationPage from "./pages/InvitationPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import InvitationEditor from "./pages/dashboard/InvitationEditor.jsx";
import PhotoManager from "./pages/dashboard/PhotoManager.jsx";
import PublishPage from "./pages/dashboard/PublishPage.jsx";
import Orders from "./pages/dashboard/Orders.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function NotFound() {
  return (
    <div className="page-state">
      <h2>404</h2>
      <p>Halaman tidak ditemukan.</p>
      <a href="/" className="btn-primary">
        Kembali ke Beranda
      </a>
    </div>
  );
}

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/undangan/:slug" element={<InvitationPage />} />

      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route
        path="/dashboard/invitations/new"
        element={<Protected><InvitationEditor /></Protected>}
      />
      <Route
        path="/dashboard/invitations/:id"
        element={<Protected><InvitationEditor /></Protected>}
      />
      <Route
        path="/dashboard/photos"
        element={<Protected><PhotoManager /></Protected>}
      />
      <Route
        path="/dashboard/pricing"
        element={<Protected><PublishPage /></Protected>}
      />
      <Route path="/dashboard/orders" element={<Protected><Orders /></Protected>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
