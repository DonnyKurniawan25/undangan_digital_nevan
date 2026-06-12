import { useState } from "react";
import { api } from "../api/client.js";

export default function RsvpForm({ slug, summary, onSubmitted }) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("yes");
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus("loading");
    setError("");
    try {
      await api.createRsvp(slug, {
        guest_name: name.trim(),
        attendance,
        guest_count: Number(guestCount) || 1,
      });
      setStatus("done");
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <div className="rsvp-box">
      <form className="rsvp-form" onSubmit={submit}>
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
          <span>Kehadiran</span>
          <select value={attendance} onChange={(e) => setAttendance(e.target.value)}>
            <option value="yes">Hadir</option>
            <option value="maybe">Masih Ragu</option>
            <option value="no">Tidak Hadir</option>
          </select>
        </label>

        {attendance === "yes" && (
          <label className="field">
            <span>Jumlah Tamu</span>
            <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option value={n} key={n}>
                  {n} orang
                </option>
              ))}
            </select>
          </label>
        )}

        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" ? "Mengirim..." : "Kirim Konfirmasi"}
        </button>

        {status === "done" && (
          <p className="form-msg success">Terima kasih, konfirmasi Anda telah kami terima.</p>
        )}
        {status === "error" && <p className="form-msg error">{error}</p>}
      </form>

      {summary && (
        <div className="rsvp-summary">
          <div className="rsvp-stat">
            <strong>{summary.yes}</strong>
            <span>Hadir</span>
          </div>
          <div className="rsvp-stat">
            <strong>{summary.maybe}</strong>
            <span>Ragu</span>
          </div>
          <div className="rsvp-stat">
            <strong>{summary.no}</strong>
            <span>Tidak Hadir</span>
          </div>
        </div>
      )}
    </div>
  );
}
