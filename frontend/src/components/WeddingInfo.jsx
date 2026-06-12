// Renders the premium "extra info" of an invitation: live streaming link,
// dress code (with color swatches), and wedding hashtag. Uses generic class
// names that every template styles via its own theme.
export default function WeddingInfo({ data }) {
  const colors = (data.dresscode_colors || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const hasAny = data.live_stream_url || data.dresscode || data.wedding_hashtag;
  if (!hasAny) return null;

  return (
    <div className="winfo-grid">
      {data.live_stream_url && (
        <div className="winfo-card">
          <div className="winfo-icon">📺</div>
          <h4>Live Streaming</h4>
          <p>Saksikan acara kami secara langsung dari mana saja.</p>
          <a
            className="winfo-btn"
            href={data.live_stream_url}
            target="_blank"
            rel="noreferrer"
          >
            Tonton Live
          </a>
        </div>
      )}

      {data.dresscode && (
        <div className="winfo-card">
          <div className="winfo-icon">👗</div>
          <h4>Dress Code</h4>
          <p>{data.dresscode}</p>
          {colors.length > 0 && (
            <div className="winfo-colors">
              {colors.map((c, i) => (
                <span key={i} style={{ background: c }} title={c} />
              ))}
            </div>
          )}
        </div>
      )}

      {data.wedding_hashtag && (
        <div className="winfo-card">
          <div className="winfo-icon">#️⃣</div>
          <h4>Tagar Pernikahan</h4>
          <p className="winfo-hashtag">{data.wedding_hashtag}</p>
          <p>Bagikan momen Anda dengan tagar ini.</p>
        </div>
      )}
    </div>
  );
}
