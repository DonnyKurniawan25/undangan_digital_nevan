import { useEffect, useState } from "react";
import Countdown from "../components/Countdown.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import GiftSection from "../components/GiftSection.jsx";
import WeddingInfo from "../components/WeddingInfo.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import Guestbook from "../components/Guestbook.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { formatDate, formatFullDate, timeRange, mapEmbedUrl } from "../utils/format.js";

function SectionTitle({ sub, title }) {
  return (
    <div className="el-section-head reveal">
      {sub && <span className="el-sub">{sub}</span>}
      <h2 className="el-title">{title}</h2>
      <div className="el-divider">
        <span>❧</span>
      </div>
    </div>
  );
}

export default function ElegantTemplate({
  data,
  guestName,
  wishes,
  onWishAdded,
  onRsvpSubmitted,
}) {
  const [opened, setOpened] = useState(false);
  const [music, setMusic] = useState(false);

  useScrollReveal([opened]);

  useEffect(() => {
    document.body.style.overflow = opened ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [opened]);

  const open = () => {
    setOpened(true);
    setMusic(true);
    window.scrollTo({ top: 0 });
  };

  const show = (key) => data[key] !== false;

  return (
    <div className="tpl-elegant">
      <AudioPlayer src={data.music_url} playing={music} onToggle={setMusic} />

      {/* COVER */}
      <section className={`el-cover ${opened ? "is-open" : ""}`}>
        <div
          className="el-cover-bg"
          style={{ backgroundImage: `url(${data.cover_photo})` }}
        />
        <div className="el-cover-overlay" />
        <div className="el-cover-content">
          <p className="el-cover-pre">The Wedding Of</p>
          <h1 className="el-cover-names">
            {data.groom_name} <span>&amp;</span> {data.bride_name}
          </h1>
          <p className="el-cover-date">{formatDate(data.main_date)}</p>
          <div className="el-cover-guest">
            <p>Kepada Yth.</p>
            <strong>{guestName || "Bapak/Ibu/Saudara/i"}</strong>
          </div>
          <button className="el-open-btn" onClick={open}>
            <span>✉</span> Buka Undangan
          </button>
        </div>
      </section>

      {opened && (
        <div className="el-body">
          {/* OPENING */}
          <section className="el-section el-opening">
            <div className="el-opening-inner reveal">
              <p className="el-bismillah">بِسْمِ اللهِ الرَّحْمنِ الرَّحِيْمِ</p>
              <p className="el-opening-text">{data.opening_text}</p>
              {show("show_quote") && data.quote && (
                <blockquote className="el-quote">
                  “{data.quote}”
                  {data.quote_source && <cite>— {data.quote_source}</cite>}
                </blockquote>
              )}
            </div>
          </section>

          {/* COUPLE */}
          {show("show_couple") && (
          <section className="el-section el-couple">
            <SectionTitle sub="Kami Yang Berbahagia" title="Mempelai" />
            <div className="el-couple-grid">
              <div className="el-person reveal">
                <div className="el-person-photo">
                  <img src={data.groom_photo} alt={data.groom_name} />
                </div>
                <h3>{data.groom_full_name || data.groom_name}</h3>
                <p className="el-person-order">{data.groom_order}</p>
                <p className="el-person-parents">
                  Putra dari {data.groom_father}
                  {data.groom_mother && <> &amp; {data.groom_mother}</>}
                </p>
                {data.groom_instagram && (
                  <a
                    className="el-ig"
                    href={`https://instagram.com/${data.groom_instagram}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{data.groom_instagram}
                  </a>
                )}
              </div>

              <div className="el-amp reveal">&amp;</div>

              <div className="el-person reveal">
                <div className="el-person-photo">
                  <img src={data.bride_photo} alt={data.bride_name} />
                </div>
                <h3>{data.bride_full_name || data.bride_name}</h3>
                <p className="el-person-order">{data.bride_order}</p>
                <p className="el-person-parents">
                  Putri dari {data.bride_father}
                  {data.bride_mother && <> &amp; {data.bride_mother}</>}
                </p>
                {data.bride_instagram && (
                  <a
                    className="el-ig"
                    href={`https://instagram.com/${data.bride_instagram}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{data.bride_instagram}
                  </a>
                )}
              </div>
            </div>
          </section>
          )}

          {/* COUNTDOWN */}
          {show("show_countdown") && (
          <section
            className="el-section el-countdown-sec"
            style={{ backgroundImage: `url(${data.cover_photo})` }}
          >
            <div className="el-countdown-overlay" />
            <div className="el-countdown-inner reveal">
              <p className="el-sub light">Menuju Hari Bahagia</p>
              <h2 className="el-title light">{formatFullDate(data.main_date)}</h2>
              <Countdown target={data.main_date} />
            </div>
          </section>
          )}

          {/* LOVE STORY */}
          {show("show_love_story") && data.love_story && data.love_story.length > 0 && (
            <section className="el-section el-story">
              <SectionTitle sub="Perjalanan Cinta" title="Our Love Story" />
              <div className="el-timeline">
                {data.love_story.map((s) => (
                  <div className="el-timeline-item reveal" key={s.id}>
                    <div className="el-timeline-dot" />
                    <div className="el-timeline-card">
                      <span className="el-timeline-date">{s.date_label}</span>
                      <h4>{s.title}</h4>
                      <p>{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EVENTS */}
          {show("show_events") && (
          <section className="el-section el-events">
            <SectionTitle sub="Save The Date" title="Waktu & Tempat" />
            <div className="el-events-grid">
              {data.events.map((ev) => (
                <div className="el-event-card reveal" key={ev.id}>
                  <h3>{ev.name}</h3>
                  <div className="el-event-line el-event-date">
                    {formatFullDate(ev.date)}
                  </div>
                  <div className="el-event-line">{timeRange(ev.time_start, ev.time_end)}</div>
                  <div className="el-event-venue">{ev.venue_name}</div>
                  <div className="el-event-address">{ev.venue_address}</div>
                  {mapEmbedUrl(ev) && (
                    <div className="el-map-embed">
                      <iframe
                        title={`Peta ${ev.name}`}
                        src={mapEmbedUrl(ev)}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                  {ev.maps_url && (
                    <a
                      className="el-maps-btn"
                      href={ev.maps_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📍 Lihat Lokasi
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
          )}

          {/* GALLERY */}
          {show("show_gallery") && data.gallery && data.gallery.length > 0 && (
            <section className="el-section el-gallery">
              <SectionTitle sub="Momen Bahagia" title="Galeri" />
              <div className="el-gallery-grid reveal">
                {data.gallery.map((g) => (
                  <figure className="el-gallery-item" key={g.id}>
                    <img src={g.image} alt={g.caption || "gallery"} loading="lazy" />
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* GIFT */}
          {show("show_gift") &&
            ((data.bank_accounts && data.bank_accounts.length > 0) ||
              data.gift_address) && (
            <section className="el-section el-gift">
              <SectionTitle sub="Tanda Kasih" title="Wedding Gift" />
              <p className="el-gift-text reveal">
                Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
                Bila memberi adalah ungkapan tanda kasih, Anda dapat memberikannya
                secara cashless.
              </p>
              <div className="reveal">
                <GiftSection
                  accounts={data.bank_accounts}
                  address={data.gift_address}
                />
              </div>
            </section>
          )}

          {/* EXTRA INFO */}
          {show("show_info") &&
            (data.live_stream_url || data.dresscode || data.wedding_hashtag) && (
            <section className="el-section el-info">
              <SectionTitle sub="Informasi" title="Hal Penting" />
              <div className="reveal">
                <WeddingInfo data={data} />
              </div>
            </section>
          )}

          {/* RSVP */}
          {show("show_rsvp") && (
          <section className="el-section el-rsvp">
            <SectionTitle sub="Konfirmasi Kehadiran" title="RSVP" />
            <div className="reveal">
              <RsvpForm
                slug={data.slug}
                summary={data.rsvp_summary}
                onSubmitted={onRsvpSubmitted}
              />
            </div>
          </section>
          )}

          {/* GUESTBOOK */}
          {show("show_guestbook") && (
          <section className="el-section el-guestbook">
            <SectionTitle sub="Ucapan & Doa" title="Buku Tamu" />
            <div className="reveal">
              <Guestbook slug={data.slug} wishes={wishes} onAdded={onWishAdded} />
            </div>
          </section>
          )}

          {/* CLOSING */}
          <section
            className="el-closing"
            style={{ backgroundImage: `url(${data.cover_photo})` }}
          >
            <div className="el-closing-overlay" />
            <div className="el-closing-inner reveal">
              <p>{data.closing_text}</p>
              <p className="el-closing-thanks">Atas kehadiran dan doanya, kami ucapkan terima kasih.</p>
              <h2 className="el-cover-names">
                {data.groom_name} <span>&amp;</span> {data.bride_name}
              </h2>
            </div>
          </section>

          <footer className="el-footer">
            <p>Dibuat dengan ♥ — Undangan Digital</p>
            <p>
              Create by{" "}
              <a
                href="https://wa.me/6281917190895"
                target="_blank"
                rel="noopener noreferrer"
              >
                balesourcecode
              </a>
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}
