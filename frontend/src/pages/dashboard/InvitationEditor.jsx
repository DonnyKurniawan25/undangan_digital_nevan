import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../api/client.js";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import PhotoPicker from "../../components/PhotoPicker.jsx";
import AudioPicker from "../../components/AudioPicker.jsx";

const EMPTY = {
  template: "elegant",
  groom_name: "",
  groom_full_name: "",
  groom_father: "",
  groom_mother: "",
  groom_order: "",
  groom_photo: "",
  groom_instagram: "",
  bride_name: "",
  bride_full_name: "",
  bride_father: "",
  bride_mother: "",
  bride_order: "",
  bride_photo: "",
  bride_instagram: "",
  cover_photo: "",
  main_date: "",
  quote: "",
  quote_source: "",
  music_url: "",
  opening_text: "",
  wedding_hashtag: "",
  dresscode: "",
  dresscode_colors: "",
  live_stream_url: "",
  gift_address: "",
  closing_text: "",
  show_quote: true,
  show_couple: true,
  show_countdown: true,
  show_love_story: true,
  show_events: true,
  show_gallery: true,
  show_gift: true,
  show_info: true,
  show_rsvp: true,
  show_guestbook: true,
  events: [],
  gallery: [],
  love_story: [],
  bank_accounts: [],
};

// Field that supports typing a URL or picking from the gallery.
function PhotoField({ label, value, onChange }) {
  const [picker, setPicker] = useState(false);
  return (
    <label className="field">
      <span>{label}</span>
      <div className="photo-field">
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL foto atau pilih dari galeri"
        />
        <button type="button" className="pick-btn" onClick={() => setPicker(true)}>
          Galeri
        </button>
      </div>
      {value ? <img className="photo-field-preview" src={value} alt="" /> : null}
      <PhotoPicker open={picker} onClose={() => setPicker(false)} onSelect={onChange} />
    </label>
  );
}

// Field that supports typing a music URL or uploading an MP3 directly.
function MusicField({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [picker, setPicker] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setErr("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", file.name.replace(/\.[^.]+$/, ""));
      fd.append("audio", file);
      const track = await api.uploadAudio(fd);
      onChange(track.url);
    } catch (e) {
      setErr(e.message || "Gagal mengunggah musik.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <label className="field">
      <span>Musik (URL mp3 atau unggah file)</span>
      <div className="photo-field">
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://...mp3 atau unggah file di sebelah"
        />
        <button
          type="button"
          className="pick-btn"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Mengunggah..." : "Unggah MP3"}
        </button>
        <button
          type="button"
          className="pick-btn"
          onClick={() => setPicker(true)}
        >
          Galeri Musik
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/*,.mp3,.m4a,.ogg,.wav"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {err ? <span className="field-error">{err}</span> : null}
      {value ? (
        <audio controls src={value} style={{ width: "100%", marginTop: "0.5rem" }} />
      ) : null}
      <AudioPicker open={picker} onClose={() => setPicker(false)} onSelect={onChange} />
    </label>
  );
}

export default function InvitationEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getTemplates().then(setTemplates).catch(() => {});
    if (!isNew) {
      api
        .getMyInvitation(id)
        .then((data) => setForm({ ...EMPTY, ...data, main_date: data.main_date || "" }))
        .catch(() => setError("Undangan tidak ditemukan."))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const setInput = (k) => (e) => set(k)(e.target.value);

  // dynamic list helpers
  const addItem = (key, item) =>
    setForm((f) => ({ ...f, [key]: [...f[key], item] }));
  const updateItem = (key, idx, field, value) =>
    setForm((f) => {
      const arr = [...f[key]];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...f, [key]: arr };
    });
  const removeItem = (key, idx) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = { ...form, main_date: form.main_date || null };
    try {
      if (isNew) {
        const created = await api.createInvitation(payload);
        navigate(`/dashboard/invitations/${created.id}`, { replace: true });
      } else {
        await api.updateInvitation(id, payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout><p className="dash-muted">Memuat...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="dash-head">
        <div>
          <h1>{isNew ? "Buat Undangan" : "Edit Undangan"}</h1>
          <p className="dash-subtitle">Lengkapi data undangan Anda.</p>
        </div>
        <Link to="/dashboard" className="ia-btn">← Kembali</Link>
      </div>

      <form onSubmit={save} className="editor">
        <section className="editor-section">
          <h2>Pengaturan</h2>
          <div className="grid-2">
            <label className="field">
              <span>Template</span>
              <select value={form.template} onChange={setInput("template")}>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Tanggal Acara Utama</span>
              <input type="date" value={form.main_date} onChange={setInput("main_date")} />
            </label>
          </div>
          <PhotoField label="Foto Cover" value={form.cover_photo} onChange={set("cover_photo")} />
          <MusicField value={form.music_url} onChange={set("music_url")} />
        </section>

        <section className="editor-section">
          <h2>Tampilan Section</h2>
          <p className="dash-muted" style={{ marginBottom: "0.8rem" }}>
            Matikan untuk menyembunyikan section dari undangan.
          </p>
          <div className="toggle-grid">
            {[
              ["show_quote", "Quote / Ayat"],
              ["show_couple", "Mempelai"],
              ["show_countdown", "Hitung Mundur"],
              ["show_love_story", "Love Story"],
              ["show_events", "Acara"],
              ["show_gallery", "Galeri"],
              ["show_gift", "Wedding Gift"],
              ["show_info", "Info Tambahan"],
              ["show_rsvp", "RSVP"],
              ["show_guestbook", "Buku Tamu"],
            ].map(([key, label]) => (
              <label className="toggle-item" key={key}>
                <input
                  type="checkbox"
                  checked={form[key] !== false}
                  onChange={(e) => set(key)(e.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="editor-section">
          <h2>Mempelai Pria</h2>
          <div className="grid-2">
            <label className="field"><span>Nama Panggilan</span>
              <input value={form.groom_name} onChange={setInput("groom_name")} required /></label>
            <label className="field"><span>Nama Lengkap</span>
              <input value={form.groom_full_name} onChange={setInput("groom_full_name")} /></label>
            <label className="field"><span>Ayah</span>
              <input value={form.groom_father} onChange={setInput("groom_father")} /></label>
            <label className="field"><span>Ibu</span>
              <input value={form.groom_mother} onChange={setInput("groom_mother")} /></label>
            <label className="field"><span>Anak ke-</span>
              <input value={form.groom_order} onChange={setInput("groom_order")} /></label>
            <label className="field"><span>Instagram</span>
              <input value={form.groom_instagram} onChange={setInput("groom_instagram")} /></label>
          </div>
          <PhotoField label="Foto Mempelai Pria" value={form.groom_photo} onChange={set("groom_photo")} />
        </section>

        <section className="editor-section">
          <h2>Mempelai Wanita</h2>
          <div className="grid-2">
            <label className="field"><span>Nama Panggilan</span>
              <input value={form.bride_name} onChange={setInput("bride_name")} required /></label>
            <label className="field"><span>Nama Lengkap</span>
              <input value={form.bride_full_name} onChange={setInput("bride_full_name")} /></label>
            <label className="field"><span>Ayah</span>
              <input value={form.bride_father} onChange={setInput("bride_father")} /></label>
            <label className="field"><span>Ibu</span>
              <input value={form.bride_mother} onChange={setInput("bride_mother")} /></label>
            <label className="field"><span>Anak ke-</span>
              <input value={form.bride_order} onChange={setInput("bride_order")} /></label>
            <label className="field"><span>Instagram</span>
              <input value={form.bride_instagram} onChange={setInput("bride_instagram")} /></label>
          </div>
          <PhotoField label="Foto Mempelai Wanita" value={form.bride_photo} onChange={set("bride_photo")} />
        </section>

        <section className="editor-section">
          <h2>Pembukaan & Quote</h2>
          <label className="field"><span>Teks Pembukaan</span>
            <textarea rows={3} value={form.opening_text} onChange={setInput("opening_text")} /></label>
          <label className="field"><span>Quote / Ayat</span>
            <textarea rows={2} value={form.quote} onChange={setInput("quote")} /></label>
          <label className="field"><span>Sumber Quote</span>
            <input value={form.quote_source} onChange={setInput("quote_source")} /></label>
          <label className="field"><span>Teks Penutup</span>
            <textarea rows={2} value={form.closing_text} onChange={setInput("closing_text")} /></label>
        </section>

        <section className="editor-section">
          <h2>Info Tambahan</h2>
          <div className="grid-2">
            <label className="field"><span>Tagar Pernikahan</span>
              <input value={form.wedding_hashtag} onChange={setInput("wedding_hashtag")} placeholder="#NamaKalian" /></label>
            <label className="field"><span>Dress Code</span>
              <input value={form.dresscode} onChange={setInput("dresscode")} placeholder="Earth tone / Formal" /></label>
          </div>
          <label className="field"><span>Warna Dress Code (pisahkan dengan koma)</span>
            <input value={form.dresscode_colors} onChange={setInput("dresscode_colors")} placeholder="#c9a063,#6a6253,#ffffff" /></label>
          {form.dresscode_colors && (
            <div className="color-preview">
              {form.dresscode_colors.split(",").map((c, i) => (
                <span key={i} style={{ background: c.trim() }} title={c.trim()} />
              ))}
            </div>
          )}
          <label className="field"><span>Link Live Streaming</span>
            <input value={form.live_stream_url} onChange={setInput("live_stream_url")} placeholder="https://youtube.com/live/..." /></label>
          <label className="field"><span>Alamat Pengiriman Kado (opsional)</span>
            <textarea rows={2} value={form.gift_address} onChange={setInput("gift_address")} placeholder="Alamat lengkap untuk kirim hadiah fisik" /></label>
        </section>

        {/* EVENTS */}
        <section className="editor-section">
          <div className="editor-section-head">
            <h2>Acara</h2>
            <button type="button" className="ia-btn" onClick={() =>
              addItem("events", { name: "", date: "", time_start: "", time_end: "", venue_name: "", venue_address: "", maps_url: "" })
            }>+ Tambah Acara</button>
          </div>
          {form.events.map((ev, i) => (
            <div className="repeat-item" key={i}>
              <div className="grid-2">
                <label className="field"><span>Nama Acara</span>
                  <input value={ev.name} onChange={(e) => updateItem("events", i, "name", e.target.value)} /></label>
                <label className="field"><span>Tanggal</span>
                  <input type="date" value={ev.date || ""} onChange={(e) => updateItem("events", i, "date", e.target.value)} /></label>
                <label className="field"><span>Mulai</span>
                  <input type="time" value={ev.time_start || ""} onChange={(e) => updateItem("events", i, "time_start", e.target.value)} /></label>
                <label className="field"><span>Selesai</span>
                  <input type="time" value={ev.time_end || ""} onChange={(e) => updateItem("events", i, "time_end", e.target.value)} /></label>
                <label className="field"><span>Nama Tempat</span>
                  <input value={ev.venue_name} onChange={(e) => updateItem("events", i, "venue_name", e.target.value)} /></label>
                <label className="field"><span>Link Maps</span>
                  <input value={ev.maps_url} onChange={(e) => updateItem("events", i, "maps_url", e.target.value)} /></label>
              </div>
              <label className="field"><span>Alamat</span>
                <input value={ev.venue_address} onChange={(e) => updateItem("events", i, "venue_address", e.target.value)} /></label>
              <button type="button" className="ia-btn danger" onClick={() => removeItem("events", i)}>Hapus Acara</button>
            </div>
          ))}
        </section>

        {/* LOVE STORY */}
        <section className="editor-section">
          <div className="editor-section-head">
            <h2>Love Story</h2>
            <button type="button" className="ia-btn" onClick={() =>
              addItem("love_story", { title: "", date_label: "", description: "" })
            }>+ Tambah Cerita</button>
          </div>
          {form.love_story.map((s, i) => (
            <div className="repeat-item" key={i}>
              <div className="grid-2">
                <label className="field"><span>Judul</span>
                  <input value={s.title} onChange={(e) => updateItem("love_story", i, "title", e.target.value)} /></label>
                <label className="field"><span>Waktu (label)</span>
                  <input value={s.date_label} onChange={(e) => updateItem("love_story", i, "date_label", e.target.value)} /></label>
              </div>
              <label className="field"><span>Deskripsi</span>
                <textarea rows={2} value={s.description} onChange={(e) => updateItem("love_story", i, "description", e.target.value)} /></label>
              <button type="button" className="ia-btn danger" onClick={() => removeItem("love_story", i)}>Hapus</button>
            </div>
          ))}
        </section>

        {/* GALLERY */}
        <section className="editor-section">
          <div className="editor-section-head">
            <h2>Galeri Foto</h2>
            <button type="button" className="ia-btn" onClick={() => addItem("gallery", { image: "", caption: "" })}>+ Tambah Foto</button>
          </div>
          <div className="gallery-edit-grid">
            {form.gallery.map((g, i) => (
              <div className="repeat-item" key={i}>
                <PhotoField label={`Foto ${i + 1}`} value={g.image} onChange={(v) => updateItem("gallery", i, "image", v)} />
                <button type="button" className="ia-btn danger" onClick={() => removeItem("gallery", i)}>Hapus</button>
              </div>
            ))}
          </div>
        </section>

        {/* BANK */}
        <section className="editor-section">
          <div className="editor-section-head">
            <h2>Rekening Hadiah</h2>
            <button type="button" className="ia-btn" onClick={() =>
              addItem("bank_accounts", { bank_name: "", account_number: "", account_holder: "" })
            }>+ Tambah Rekening</button>
          </div>
          {form.bank_accounts.map((b, i) => (
            <div className="repeat-item" key={i}>
              <div className="grid-3">
                <label className="field"><span>Bank</span>
                  <input value={b.bank_name} onChange={(e) => updateItem("bank_accounts", i, "bank_name", e.target.value)} /></label>
                <label className="field"><span>Nomor Rekening</span>
                  <input value={b.account_number} onChange={(e) => updateItem("bank_accounts", i, "account_number", e.target.value)} /></label>
                <label className="field"><span>Atas Nama</span>
                  <input value={b.account_holder} onChange={(e) => updateItem("bank_accounts", i, "account_holder", e.target.value)} /></label>
              </div>
              <button type="button" className="ia-btn danger" onClick={() => removeItem("bank_accounts", i)}>Hapus</button>
            </div>
          ))}
        </section>

        {error && <p className="form-msg error">{error}</p>}

        <div className="editor-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Undangan"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
