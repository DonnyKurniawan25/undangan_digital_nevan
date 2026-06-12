import { useEffect, useState } from "react";
import Countdown from "../components/Countdown.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import GiftSection from "../components/GiftSection.jsx";
import WeddingInfo from "../components/WeddingInfo.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import Guestbook from "../components/Guestbook.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { formatDate, formatFullDate, timeRange } from "../utils/format.js";

function SectionTitle({ label, title }) {
  return (
    <div className="md-head reveal">
      <span className="md-label">{label}</span>
      <h2 className="md-title">{title}</h2>
    </div>
  );
}

export default function ModernTemplate({
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

  return (
    <div className="tpl-modern">
      <AudioPlayer src={data.music_url} playing={music} onToggle={setMusic} />

      {/* COVER */}
      <section className={`md-cover ${opened ? "is-open" : ""}`}>
        <div className="md-cover-left">
          <div className="md-cover-content">
            <span className="md-cover-tag">WE ARE GETTING MARRIED</span>
            <h1 className="md-cover-names">
              {data.groom_name}
              <span>&amp;</span>
              {data.bride_name}
            </h1>
            <p className="md-cover-date">{formatDate(data.main_date)}</p>
            <div className="md-cover-guest">
              <span>Kepada</span>
              <strong>{guestName || "Bapak/Ibu/Saudara/i"}</strong>
            </div>
            <button className="md-open-btn" onClick={open}>
              Buka Undangan →
            </button>
          </div>
        </div>
        <div
          className="md-cover-right"
          style={{ backgroundImage: `url(${data.cover_photo})` }}
        />
      </section>

      {opened && (
        <div className="md-body">
          {/* OPENING */}
          <section className="md-section md-opening">
            <div className="md-opening-inner reveal">
              <p className="md-opening-text">{data.opening_text}</p>
              {data.quote && (
                <blockquote className="md-quote">
                  “{data.quote}”
                  {data.quote_source && <cite>{data.quote_source}</cite>}
                </blockquote>
              )}
            </div>
          </section>

          {/* COUPLE */}
          <section className="md-section md-couple">
            <SectionTitle label="01 — Couple" title="The Happy Couple" />
            <div className="md-couple-grid">
              <div className="md-person reveal">
                <div className="md-person-photo">
                  <img src={data.groom_photo} alt={data.groom_name} />
                </div>
                <div className="md-person-info">
                  <h3>{data.groom_full_name || data.groom_name}</h3>
                  <p className="md-person-order">{data.groom_order}</p>
                  <p className="md-person-parents">
                    Putra dari {data.groom_father}
                    {data.groom_mother && <> &amp; {data.groom_mother}</>}
                  </p>
                  {data.groom_instagram && (
                    <a
                      className="md-ig"
                      href={`https://instagram.com/${data.groom_instagram}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{data.groom_instagram}
                    </a>
                  )}
                </div>
              </div>
              <div className="md-person reveal reverse">
                <div className="md-person-photo">
                  <img src={data.bride_photo} alt={data.bride_name} />
                </div>
                <div className="md-person-info">
                  <h3>{data.bride_full_name || data.bride_name}</h3>
                  <p className="md-person-order">{data.bride_order}</p>
                  <p className="md-person-parents">
                    Putri dari {data.bride_father}
                    {data.bride_mother && <> &amp; {data.bride_mother}</>}
                  </p>
                  {data.bride_instagram && (
                    <a
                      className="md-ig"
                      href={`https://instagram.com/${data.bride_instagram}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{data.bride_instagram}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* COUNTDOWN */}
          <section className="md-section md-countdown-sec">
            <SectionTitle label="02 — Save The Date" title={formatFullDate(data.main_date)} />
            <div className="reveal">
              <Countdown target={data.main_date} />
            </div>
          </section>

          {/* LOVE STORY */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="md-section md-story">
              <SectionTitle label="03 — Story" title="How We Met" />
              <div className="md-story-grid">
                {data.love_story.map((s, i) => (
                  <div className="md-story-item reveal" key={s.id}>
                    <span className="md-story-num">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <span className="md-story-date">{s.date_label}</span>
                      <h4>{s.title}</h4>
                      <p>{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EVENTS */}
          <section className="md-section md-events">
            <SectionTitle label="04 — When & Where" title="The Events" />
            <div className="md-events-grid">
              {data.events.map((ev) => (
                <div className="md-event-card reveal" key={ev.id}>
                  <h3>{ev.name}</h3>
                  <div className="md-event-row">
                    <span>Tanggal</span>
                    <strong>{formatFullDate(ev.date)}</strong>
                  </div>
                  <div className="md-event-row">
                    <span>Waktu</span>
                    <strong>{timeRange(ev.time_start, ev.time_end)}</strong>
                  </div>
                  <div className="md-event-row">
                    <span>Tempat</span>
                    <strong>{ev.venue_name}</strong>
                  </div>
                  <p className="md-event-address">{ev.venue_address}</p>
                  {ev.maps_url && (
                    <a
                      className="md-maps-btn"
                      href={ev.maps_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lihat Lokasi →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* GALLERY */}
          {data.gallery && data.gallery.length > 0 && (
            <section className="md-section md-gallery">
              <SectionTitle label="05 — Moments" title="Gallery" />
              <div className="md-gallery-grid reveal">
                {data.gallery.map((g) => (
                  <figure className="md-gallery-item" key={g.id}>
                    <img src={g.image} alt={g.caption || "gallery"} loading="lazy" />
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* GIFT */}
          {((data.bank_accounts && data.bank_accounts.length > 0) ||
            data.gift_address) && (
            <section className="md-section md-gift">
              <SectionTitle label="06 — Gift" title="Wedding Gift" />
              <p className="md-gift-text reveal">
                Kehadiran Anda sudah cukup membahagiakan kami. Bila ingin memberi
                tanda kasih, silakan melalui kanal berikut.
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
          {(data.live_stream_url || data.dresscode || data.wedding_hashtag) && (
            <section className="md-section md-info">
              <SectionTitle label="07 — Info" title="Good To Know" />
              <div className="reveal">
                <WeddingInfo data={data} />
              </div>
            </section>
          )}

          {/* RSVP */}
          <section className="md-section md-rsvp">
            <SectionTitle label="08 — RSVP" title="Konfirmasi Kehadiran" />
            <div className="reveal">
              <RsvpForm
                slug={data.slug}
                summary={data.rsvp_summary}
                onSubmitted={onRsvpSubmitted}
              />
            </div>
          </section>

          {/* GUESTBOOK */}
          <section className="md-section md-guestbook">
            <SectionTitle label="09 — Wishes" title="Ucapan & Doa" />
            <div className="reveal">
              <Guestbook slug={data.slug} wishes={wishes} onAdded={onWishAdded} />
            </div>
          </section>

          {/* CLOSING */}
          <section className="md-closing">
            <div className="md-closing-inner reveal">
              <p>{data.closing_text}</p>
              <h2 className="md-cover-names">
                {data.groom_name}
                <span>&amp;</span>
                {data.bride_name}
              </h2>
              {data.wedding_hashtag && (
                <p className="md-closing-tag">{data.wedding_hashtag}</p>
              )}
            </div>
          </section>

          <footer className="md-footer">
            <p>Dibuat dengan ♥ — Undangan Digital</p>
          </footer>
        </div>
      )}
    </div>
  );
}
