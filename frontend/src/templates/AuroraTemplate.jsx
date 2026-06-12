import { useEffect, useState } from "react";
import Countdown from "../components/Countdown.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import GiftSection from "../components/GiftSection.jsx";
import WeddingInfo from "../components/WeddingInfo.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import Guestbook from "../components/Guestbook.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { formatDate, formatFullDate, timeRange, mapEmbedUrl } from "../utils/format.js";

function SectionTitle({ kicker, title }) {
  return (
    <div className="au-head reveal">
      {kicker && <span className="au-kicker">{kicker}</span>}
      <h2 className="au-title">{title}</h2>
    </div>
  );
}

export default function AuroraTemplate({
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
    <div className="tpl-aurora">
      <AudioPlayer src={data.music_url} playing={music} onToggle={setMusic} />

      {/* animated aurora background shared across the whole invitation */}
      <div className="au-aurora-bg" aria-hidden="true">
        <span className="au-blob au-blob-1" />
        <span className="au-blob au-blob-2" />
        <span className="au-blob au-blob-3" />
        <div className="au-grain" />
      </div>

      {/* COVER */}
      <section className={`au-cover ${opened ? "is-open" : ""}`}>
        {data.cover_photo && (
          <div
            className="au-cover-photo"
            style={{ backgroundImage: `url(${data.cover_photo})` }}
          />
        )}
        <div className="au-cover-veil" />
        <div className="au-cover-content">
          <span className="au-cover-pre">You're Invited — The Wedding Of</span>
          <h1 className="au-cover-names">
            <span>{data.groom_name}</span>
            <span className="au-amp">&</span>
            <span>{data.bride_name}</span>
          </h1>
          <div className="au-cover-pill">{formatFullDate(data.main_date)}</div>
          <div className="au-cover-guest">
            <span>Kepada Yth.</span>
            <strong>{guestName || "Bapak/Ibu/Saudara/i"}</strong>
          </div>
          <button className="au-open-btn" onClick={open}>
            <span>Buka Undangan</span>
          </button>
        </div>
        <div className="au-scroll-hint">scroll</div>
      </section>

      {opened && (
        <div className="au-body">
          {/* OPENING */}
          <section className="au-section au-opening">
            <div className="au-glass au-opening-card reveal">
              <div className="au-monogram">
                {data.groom_name[0]}
                {data.bride_name[0]}
              </div>
              <p className="au-opening-text">{data.opening_text}</p>
              {show("show_quote") && data.quote && (
                <blockquote className="au-quote">
                  &ldquo;{data.quote}&rdquo;
                  {data.quote_source && <cite>— {data.quote_source}</cite>}
                </blockquote>
              )}
            </div>
          </section>

          {/* COUPLE */}
          {show("show_couple") && (
            <section className="au-section au-couple">
              <SectionTitle kicker="The Couple" title="Mempelai" />
              <div className="au-couple-grid">
                <div className="au-glass au-person reveal">
                  <div className="au-person-photo">
                    <img src={data.groom_photo} alt={data.groom_name} />
                  </div>
                  <h3>{data.groom_full_name || data.groom_name}</h3>
                  <p className="au-person-order">{data.groom_order}</p>
                  <p className="au-person-parents">
                    Putra dari {data.groom_father}
                    {data.groom_mother && <> &amp; {data.groom_mother}</>}
                  </p>
                  {data.groom_instagram && (
                    <a
                      className="au-ig"
                      href={`https://instagram.com/${data.groom_instagram}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{data.groom_instagram}
                    </a>
                  )}
                </div>
                <div className="au-couple-amp reveal">&amp;</div>
                <div className="au-glass au-person reveal">
                  <div className="au-person-photo">
                    <img src={data.bride_photo} alt={data.bride_name} />
                  </div>
                  <h3>{data.bride_full_name || data.bride_name}</h3>
                  <p className="au-person-order">{data.bride_order}</p>
                  <p className="au-person-parents">
                    Putri dari {data.bride_father}
                    {data.bride_mother && <> &amp; {data.bride_mother}</>}
                  </p>
                  {data.bride_instagram && (
                    <a
                      className="au-ig"
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
            <section className="au-section au-countdown-sec">
              <div className="au-glass au-countdown-inner reveal">
                <p className="au-count-pre">Menuju Hari Bahagia</p>
                <h2 className="au-count-date">{formatFullDate(data.main_date)}</h2>
                <Countdown target={data.main_date} />
              </div>
            </section>
          )}

          {/* LOVE STORY */}
          {show("show_love_story") && data.love_story && data.love_story.length > 0 && (
            <section className="au-section au-story">
              <SectionTitle kicker="Our Story" title="Perjalanan Kami" />
              <div className="au-timeline">
                {data.love_story.map((s) => (
                  <div className="au-timeline-item reveal" key={s.id}>
                    <div className="au-glass au-timeline-card">
                      <span className="au-timeline-date">{s.date_label}</span>
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
            <section className="au-section au-events">
              <SectionTitle kicker="The Events" title="Acara" />
              <div className="au-events-grid">
                {data.events.map((ev) => (
                  <div className="au-glass au-event-card reveal" key={ev.id}>
                    <h3>{ev.name}</h3>
                    <div className="au-event-date">{formatFullDate(ev.date)}</div>
                    <div className="au-event-time">
                      {timeRange(ev.time_start, ev.time_end)}
                    </div>
                    <div className="au-event-venue">{ev.venue_name}</div>
                    <div className="au-event-address">{ev.venue_address}</div>
                    {mapEmbedUrl(ev) && (
                      <div className="au-map-embed">
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
                        className="au-maps-btn"
                        href={ev.maps_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Lihat Lokasi
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* GALLERY */}
          {show("show_gallery") && data.gallery && data.gallery.length > 0 && (
            <section className="au-section au-gallery">
              <SectionTitle kicker="Gallery" title="Galeri" />
              <div className="au-gallery-grid reveal">
                {data.gallery.map((g, i) => (
                  <figure
                    className={`au-gallery-item ${i % 5 === 0 ? "au-span-2" : ""}`}
                    key={g.id}
                  >
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
              <section className="au-section au-gift">
                <SectionTitle kicker="Wedding Gift" title="Tanda Kasih" />
                <p className="au-gift-text reveal">
                  Doa restu Anda adalah hadiah terindah. Bila berkenan memberi tanda
                  kasih, dapat melalui kanal berikut.
                </p>
                <div className="au-glass au-gift-card reveal">
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
              <section className="au-section au-info">
                <SectionTitle kicker="Information" title="Informasi" />
                <div className="au-glass au-info-card reveal">
                  <WeddingInfo data={data} />
                </div>
              </section>
            )}

          {/* RSVP */}
          {show("show_rsvp") && (
            <section className="au-section au-rsvp">
              <SectionTitle kicker="RSVP" title="Konfirmasi Kehadiran" />
              <div className="au-glass au-form-card reveal">
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
            <section className="au-section au-guestbook">
              <SectionTitle kicker="Wishes" title="Ucapan & Doa" />
              <div className="au-glass au-form-card reveal">
                <Guestbook slug={data.slug} wishes={wishes} onAdded={onWishAdded} />
              </div>
            </section>
          )}

          {/* CLOSING */}
          <section className="au-closing">
            <div className="au-closing-inner reveal">
              <p>{data.closing_text}</p>
              <h2 className="au-cover-names">
                <span>{data.groom_name}</span>
                <span className="au-amp">&</span>
                <span>{data.bride_name}</span>
              </h2>
              {data.wedding_hashtag && (
                <p className="au-closing-tag">{data.wedding_hashtag}</p>
              )}
            </div>
          </section>

          <footer className="au-footer">
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
