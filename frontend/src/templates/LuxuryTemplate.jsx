import { useEffect, useState } from "react";
import Countdown from "../components/Countdown.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import GiftSection from "../components/GiftSection.jsx";
import WeddingInfo from "../components/WeddingInfo.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import Guestbook from "../components/Guestbook.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { formatDate, formatFullDate, timeRange } from "../utils/format.js";

function SectionTitle({ index, title }) {
  return (
    <div className="lx-head reveal">
      {index && <span className="lx-index">{index}</span>}
      <h2 className="lx-title">{title}</h2>
      <span className="lx-line" />
    </div>
  );
}

export default function LuxuryTemplate({
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
    <div className="tpl-luxury">
      <AudioPlayer src={data.music_url} playing={music} onToggle={setMusic} />

      {/* COVER */}
      <section className={`lx-cover ${opened ? "is-open" : ""}`}>
        <div
          className="lx-cover-bg"
          style={{ backgroundImage: `url(${data.cover_photo})` }}
        />
        <div className="lx-cover-overlay" />
        <div className="lx-cover-frame">
          <div className="lx-cover-content">
            <p className="lx-cover-pre">The Wedding Celebration Of</p>
            <h1 className="lx-cover-names">
              {data.groom_name}
              <span className="lx-amp">&amp;</span>
              {data.bride_name}
            </h1>
            <div className="lx-cover-divider">
              <span />◆<span />
            </div>
            <p className="lx-cover-date">{formatDate(data.main_date)}</p>
            <div className="lx-cover-guest">
              <p>Kepada Yth.</p>
              <strong>{guestName || "Bapak/Ibu/Saudara/i"}</strong>
            </div>
            <button className="lx-open-btn" onClick={open}>
              Buka Undangan
            </button>
          </div>
        </div>
      </section>

      {opened && (
        <div className="lx-body">
          {/* OPENING */}
          <section className="lx-section lx-opening">
            <div className="lx-opening-inner reveal">
              <div className="lx-monogram">
                {data.groom_name[0]}
                {data.bride_name[0]}
              </div>
              <p className="lx-opening-text">{data.opening_text}</p>
              {show("show_quote") && data.quote && (
                <blockquote className="lx-quote">
                  “{data.quote}”
                  {data.quote_source && <cite>— {data.quote_source}</cite>}
                </blockquote>
              )}
            </div>
          </section>

          {/* COUPLE */}
          {show("show_couple") && (
          <section className="lx-section lx-couple">
            <SectionTitle index="I" title="The Couple" />
            <div className="lx-couple-grid">
              <div className="lx-person reveal">
                <div className="lx-person-photo">
                  <img src={data.groom_photo} alt={data.groom_name} />
                </div>
                <h3>{data.groom_full_name || data.groom_name}</h3>
                <p className="lx-person-order">{data.groom_order}</p>
                <p className="lx-person-parents">
                  Putra dari {data.groom_father}
                  {data.groom_mother && <> &amp; {data.groom_mother}</>}
                </p>
                {data.groom_instagram && (
                  <a
                    className="lx-ig"
                    href={`https://instagram.com/${data.groom_instagram}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{data.groom_instagram}
                  </a>
                )}
              </div>
              <div className="lx-couple-amp reveal">&amp;</div>
              <div className="lx-person reveal">
                <div className="lx-person-photo">
                  <img src={data.bride_photo} alt={data.bride_name} />
                </div>
                <h3>{data.bride_full_name || data.bride_name}</h3>
                <p className="lx-person-order">{data.bride_order}</p>
                <p className="lx-person-parents">
                  Putri dari {data.bride_father}
                  {data.bride_mother && <> &amp; {data.bride_mother}</>}
                </p>
                {data.bride_instagram && (
                  <a
                    className="lx-ig"
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
            className="lx-section lx-countdown-sec"
            style={{ backgroundImage: `url(${data.cover_photo})` }}
          >
            <div className="lx-countdown-overlay" />
            <div className="lx-countdown-inner reveal">
              <p className="lx-count-pre">Counting Down To</p>
              <h2 className="lx-count-date">{formatFullDate(data.main_date)}</h2>
              <Countdown target={data.main_date} />
            </div>
          </section>
          )}

          {/* LOVE STORY */}
          {show("show_love_story") && data.love_story && data.love_story.length > 0 && (
            <section className="lx-section lx-story">
              <SectionTitle index="II" title="Our Story" />
              <div className="lx-timeline">
                {data.love_story.map((s) => (
                  <div className="lx-timeline-item reveal" key={s.id}>
                    <span className="lx-timeline-date">{s.date_label}</span>
                    <h4>{s.title}</h4>
                    <p>{s.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EVENTS */}
          {show("show_events") && (
          <section className="lx-section lx-events">
            <SectionTitle index="III" title="The Events" />
            <div className="lx-events-grid">
              {data.events.map((ev) => (
                <div className="lx-event-card reveal" key={ev.id}>
                  <h3>{ev.name}</h3>
                  <span className="lx-event-sep">◆</span>
                  <div className="lx-event-date">{formatFullDate(ev.date)}</div>
                  <div className="lx-event-time">
                    {timeRange(ev.time_start, ev.time_end)}
                  </div>
                  <div className="lx-event-venue">{ev.venue_name}</div>
                  <div className="lx-event-address">{ev.venue_address}</div>
                  {ev.maps_url && (
                    <a
                      className="lx-maps-btn"
                      href={ev.maps_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Location
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
          )}

          {/* GALLERY */}
          {show("show_gallery") && data.gallery && data.gallery.length > 0 && (
            <section className="lx-section lx-gallery">
              <SectionTitle index="IV" title="Gallery" />
              <div className="lx-gallery-grid reveal">
                {data.gallery.map((g) => (
                  <figure className="lx-gallery-item" key={g.id}>
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
            <section className="lx-section lx-gift">
              <SectionTitle index="V" title="Wedding Gift" />
              <p className="lx-gift-text reveal">
                Doa restu Anda adalah hadiah terindah. Bila berkenan memberi tanda
                kasih, dapat melalui kanal berikut.
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
            <section className="lx-section lx-info">
              <SectionTitle index="VI" title="Information" />
              <div className="reveal">
                <WeddingInfo data={data} />
              </div>
            </section>
          )}

          {/* RSVP */}
          {show("show_rsvp") && (
          <section className="lx-section lx-rsvp">
            <SectionTitle index="VII" title="RSVP" />
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
          <section className="lx-section lx-guestbook">
            <SectionTitle index="VIII" title="Wishes" />
            <div className="reveal">
              <Guestbook slug={data.slug} wishes={wishes} onAdded={onWishAdded} />
            </div>
          </section>
          )}

          {/* CLOSING */}
          <section
            className="lx-closing"
            style={{ backgroundImage: `url(${data.cover_photo})` }}
          >
            <div className="lx-closing-overlay" />
            <div className="lx-closing-inner reveal">
              <p>{data.closing_text}</p>
              <div className="lx-cover-divider">
                <span />◆<span />
              </div>
              <h2 className="lx-cover-names">
                {data.groom_name}
                <span className="lx-amp">&amp;</span>
                {data.bride_name}
              </h2>
              {data.wedding_hashtag && (
                <p className="lx-closing-tag">{data.wedding_hashtag}</p>
              )}
            </div>
          </section>

          <footer className="lx-footer">
            <p>Dibuat dengan ♥ — Undangan Digital</p>
          </footer>
        </div>
      )}
    </div>
  );
}
