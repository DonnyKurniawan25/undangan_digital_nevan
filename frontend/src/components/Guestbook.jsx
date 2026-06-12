import { useState } from "react";
import { api } from "../api/client.js";
import { relativeTime } from "../utils/format.js";

export default function Guestbook({ slug, wishes, onAdded }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const created = await api.createWish(slug, {
        name: name.trim(),
        message: message.trim(),
      });
      setName("");
      setMessage("");
      setStatus("idle");
      if (onAdded) onAdded(created);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <div className="guestbook">
      <form className="guestbook-form" onSubmit={submit}>
        <label className="field">
          <span>Nama</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            required
          />
        </label>
        <label className="field">
          <span>Ucapan & Doa</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan ucapan dan doa terbaik Anda..."
            rows={3}
            required
          />
        </label>
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" ? "Mengirim..." : "Kirim Ucapan"}
        </button>
        {status === "error" && <p className="form-msg error">{error}</p>}
      </form>

      <div className="wishes-list">
        {wishes && wishes.length === 0 && (
          <p className="wishes-empty">Jadilah yang pertama memberikan ucapan.</p>
        )}
        {wishes &&
          wishes.map((w) => (
            <div className="wish-item" key={w.id}>
              <div className="wish-head">
                <span className="wish-name">{w.name}</span>
                <span className="wish-time">{relativeTime(w.created_at)}</span>
              </div>
              <p className="wish-message">{w.message}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
