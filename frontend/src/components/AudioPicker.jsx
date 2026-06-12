import { useEffect, useState } from "react";
import { api } from "../api/client.js";

// Modal that lists the user's uploaded MP3 tracks and returns the chosen
// track URL via onSelect. Used inside the invitation editor's MusicField.
export default function AudioPicker({ open, onClose, onSelect }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .myAudio()
      .then(setTracks)
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Pilih Musik dari Galeri</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {loading ? (
          <p className="dash-muted">Memuat...</p>
        ) : tracks.length === 0 ? (
          <p className="dash-muted">
            Belum ada musik. Unggah dulu lewat tombol "Unggah MP3".
          </p>
        ) : (
          <div className="audio-picker-list">
            {tracks.map((t) => (
              <div className="audio-picker-item" key={t.id}>
                <div className="audio-picker-info">
                  <span className="audio-picker-title">
                    🎵 {t.title || `Musik #${t.id}`}
                  </span>
                  <audio controls src={t.url} preload="none" />
                </div>
                <button
                  type="button"
                  className="pick-btn"
                  onClick={() => {
                    onSelect(t.url);
                    onClose();
                  }}
                >
                  Pilih
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
