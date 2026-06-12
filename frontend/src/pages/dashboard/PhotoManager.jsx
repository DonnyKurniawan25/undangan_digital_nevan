import { useEffect, useRef, useState } from "react";
import { api } from "../../api/client.js";
import DashboardLayout from "../../components/DashboardLayout.jsx";

export default function PhotoManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(null);
  const inputRef = useRef(null);

  const load = () => {
    setLoading(true);
    api.myPhotos().then(setPhotos).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("title", file.name.replace(/\.[^.]+$/, ""));
        fd.append("image", file);
        await api.uploadPhoto(fd);
      }
      load();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async (id) => {
    if (!confirm("Hapus foto ini? File akan terhapus permanen.")) return;
    await api.deletePhoto(id);
    load();
  };

  const copy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <DashboardLayout>
      <div className="dash-head">
        <div>
          <h1>Galeri Foto</h1>
          <p className="dash-subtitle">
            Unggah foto, lalu salin link-nya untuk dipakai di undangan.
          </p>
        </div>
      </div>

      <div
        className={`dropzone ${uploading ? "uploading" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="dropzone-icon">📷</div>
        <strong>{uploading ? "Mengunggah..." : "Klik atau seret foto ke sini"}</strong>
        <span>Bisa pilih beberapa foto sekaligus</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {loading ? (
        <p className="dash-muted">Memuat...</p>
      ) : photos.length === 0 ? (
        <p className="dash-muted">Belum ada foto.</p>
      ) : (
        <div className="photo-grid">
          {photos.map((p) => (
            <div className="photo-card" key={p.id}>
              <img src={p.url} alt={p.title} />
              <div className="photo-card-body">
                <span className="photo-title">{p.title || "Tanpa judul"}</span>
                <div className="photo-actions">
                  <button onClick={() => copy(p.url, p.id)}>
                    {copied === p.id ? "Tersalin ✓" : "Salin Link"}
                  </button>
                  <button className="danger" onClick={() => remove(p.id)}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
