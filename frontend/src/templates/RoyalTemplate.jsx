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
    <div className="rv-section-head reveal">
      {sub && <span className="rv-sub">{sub}</span>}
      <h2 className="rv-title">{title}</h2>
      <div className="rv-divider">
        <span>❦</span>
      </div>
    </div>
  );
}

export default function RoyalTemplate({
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

  // The couple photo on the cover: prefer cover_photo, fall back to groom/bride.
  const coverPhoto = data.cover_photo || data.groom_photo || data.bride_photo;

  return (
    <div className="tpl-royal">
      <AudioPlayer src={data.music_url} playing={music} onToggle={setMusic} />

      {/* COVER — couple photo framed in an oval, vintage maroon style */}
      <section className={`rv-cover ${opened ? "is-open" : ""}`}>
        <div className="rv-cover-frame">
          <div className="rv-cover-inner">
            <p className="rv-cover-pre">The Wedding Of</p>
            <p className="rv-cover-bismillah">Sakinah, Mawaddah, Warahmah</p>

            <div className="rv-cover-photo">
              <div className="rv-oval">
                {coverPhoto ? (
                  <img src={coverPhoto} alt={`${data.groom_name} & ${data.bride_name}`} />
                ) : (
                  <div className="rv-oval-placeholder">♥</div>
                )}
              </div>
            </div>

            <h1 className="rv-cover-names">
              {data.groom_name} <span>&amp;</span> {data.bride_name}
            </h1>
            <p className="rv-cover-date">{formatDate(data.main_date)}</p>

            <div className="rv-cover-guest">
              <p>Kepada Yth.</p>
              <strong>{guestName || "Bapak/Ibu/Saudara/i"}</strong>
              <small>Mohon maaf jika ada kesalahan dalam penulisan nama / gelar.</small>
            </div>

            <button className="rv-open-btn" onClick={open}>
              <span>✉</span> Buka Undangan
            </button>
          </div>
        </div>
      </section>

      {opened && (
        <div className="rv-body">
          {/* OPENING */}
          <section className="rv-section rv-opening">
            <div className="rv-opening-inner reveal">
              <p className="rv-bismillah">بِسْمِ اللهِ الرَّحْمنِ الرَّحِيْمِ</p>
              <p className="rv-opening-text">{data.opening_text}</p>
              {show("show_quote") && data.quote && (
                <blockquote className="rv-quote">
                  “{data.quote}”
                  {data.quote_source && <cite>— {data.quote_source}</cite>}
                </blockquote>
              )}
            </div>
          </section>

          {/* COUPLE */}
          {show("show_couple") && (
            <section className="rv-section rv-couple">
              <SectionTitle sub="Kami Yang Berbahagia" title="Mempelai" />
              <div className="rv-couple-grid">
                <div className="rv-person reveal">
                  <div className="rv-person-photo">
                    <img src={data.groom_photo} alt={data.groom_name} />
                  </div>
                  <h3>{data.groom_full_name || data.groom_name}</h3>
                  <p className="rv-person-order">{data.groom_order}</p>
                  <p className="rv-person-parents">
                    Putra dari {data.groom_father}
                    {data.groom_mother && <> &amp; {data.groom_mother}</>}
                  </p>
                  {data.groom_instagram && (
                    <a
                      className="rv-ig"
                      href={`https://instagram.com/${data.groom_instagram}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{data.groom_instagram}
                    </a>
                  )}
                </div>

                <div className="rv-amp reveal">&amp;</div>

                <div className="rv-person reveal">
                  <div className="rv-person-photo">
                    <img src={data.bride_photo} alt={data.bride_name} />
                  </div>
                  <h3>{data.bride_full_name || data.bride_name}</h3>
                  <p className="rv-person-order">{data.bride_order}</p>
                  <p className="rv-person-parents">
                    Putri dari {data.bride_father}
                    {data.bride_mother && <> &amp; {data.bride_mother}</>}
                  </p>
                  {data.bride_instagram && (
                    <a
                      className="rv-ig"
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
              className="rv-section rv-countdown-sec"
              style={{ backgroundImage: `url(${coverPhoto})` }}
            >
              <div className="rv-countdown-overlay" />
              <div className="rv-countdown-inner reveal">
                <p className="rv-sub light">Menuju Hari Bahagia</p>
                <h2 className="rv-title light">{formatFullDate(data.main_date)}</h2>
                <Countdown target={data.main_date} />
              </div>
            </section>
          )}

          {/* LOVE STORY */}
          {show("show_love_story") && data.love_story && data.love_story.length > 0 && (
            <section className="rv-section rv-story">
              <SectionTitle sub="Perjalanan Cinta" title="Our Love Story" />
              <div className="rv-timeline">
                {data.love_story.map((s) => (
                  <div className="rv-timeline-item reveal" key={s.id}>
                    <div className="rv-timeline-dot" />
                    <div className="rv-timeline-card">
                      <span className="rv-timeline-date">{s.date_label}</span>
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
            <section className="rv-section rv-events">
              <SectionTitle sub="Save The Date" title="Waktu & Tempat" />
              <div className="rv-events-grid">
                {data.events.map((ev) => (
                  <div className="rv-event-card reveal" key={ev.id}>
                    <h3>{ev.name}</h3>
                    <div className="rv-event-line rv-event-date">
                      {formatFullDate(ev.date)}
                    </div>
                    <div className="rv-event-line">{timeRange(ev.time_start, ev.time_end)}</div>
                    <div className="rv-event-venue">{ev.venue_name}</div>
                    <div className="rv-event-address">{ev.venue_address}</div>
                    {mapEmbedUrl(ev) && (
                      <div className="rv-map-embed">
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
                        className="rv-maps-btn"
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
            <section className="rv-section rv-gallery">
              <SectionTitle sub="Momen Bahagia" title="Galeri" />
              <div className="rv-gallery-grid reveal">
                {data.gallery.map((g) => (
                  <figure className="rv-gallery-item" key={g.id}>
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
              <section className="rv-section rv-gift">
                <SectionTitle sub="Tanda Kasih" title="Wedding Gift" />
                <p className="rv-gift-text reveal">
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
              <section className="rv-section rv-info">
                <SectionTitle sub="Informasi" title="Hal Penting" />
                <div className="reveal">
                  <WeddingInfo data={data} />
                </div>
              </section>
            )}

          {/* RSVP */}
          {show("show_rsvp") && (
            <section className="rv-section rv-rsvp">
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
            <section className="rv-section rv-guestbook">
              <SectionTitle sub="Ucapan & Doa" title="Buku Tamu" />
              <div className="reveal">
                <Guestbook slug={data.slug} wishes={wishes} onAdded={onWishAdded} />
              </div>
            </section>
          )}

          {/* CLOSING */}
          <section
            className="rv-closing"
            style={{ backgroundImage: `url(${coverPhoto})` }}
          >
            <div className="rv-closing-overlay" />
            <div className="rv-closing-inner reveal">
              <p>{data.closing_text}</p>
              <p className="rv-closing-thanks">
                Atas kehadiran dan doanya, kami ucapkan terima kasih.
              </p>
              <h2 className="rv-cover-names">
                {data.groom_name} <span>&amp;</span> {data.bride_name}
              </h2>
            </div>
          </section>

          <footer className="rv-footer">
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
