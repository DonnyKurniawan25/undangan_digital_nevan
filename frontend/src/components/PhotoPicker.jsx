import { useEffect, useState } from "react";
import { api } from "../api/client.js";

// A small modal that lists the user's uploaded photos and returns the chosen
// photo URL via onSelect. Used inside the invitation editor.
export default function PhotoPicker({ open, onClose, onSelect }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .myPhotos()
      .then(setPhotos)
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Pilih Foto dari Galeri</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {loading ? (
          <p className="dash-muted">Memuat...</p>
        ) : photos.length === 0 ? (
          <p className="dash-muted">
            Belum ada foto. Unggah dulu di menu Galeri Foto.
          </p>
        ) : (
          <div className="picker-grid">
            {photos.map((p) => (
              <button
                key={p.id}
                className="picker-item"
                onClick={() => {
                  onSelect(p.url);
                  onClose();
                }}
              >
                <img src={p.url} alt={p.title} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
