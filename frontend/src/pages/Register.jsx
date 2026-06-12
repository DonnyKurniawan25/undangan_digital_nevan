import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", first_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Gagal mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">♥ Undangan Digital</Link>
        <h1>Daftar Akun</h1>
        <p className="auth-sub">Buat undangan pernikahan Anda sendiri.</p>
        <form onSubmit={submit}>
          <label className="field">
            <span>Nama Lengkap</span>
            <input value={form.first_name} onChange={change("first_name")} />
          </label>
          <label className="field">
            <span>Username</span>
            <input value={form.username} onChange={change("username")} required />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={change("email")} />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={change("password")}
              required
            />
          </label>
          {error && <p className="form-msg error">{error}</p>}
          <button className="btn-primary" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>
        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
