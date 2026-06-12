import { useEffect, useState } from "react";
import Countdown from "../components/Countdown.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import GiftSection from "../components/GiftSection.jsx";
import WeddingInfo from "../components/WeddingInfo.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import Guestbook from "../components/Guestbook.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { formatDate, formatFullDate, timeRange } from "../utils/format.js";

function Leaf() {
  return <div className="fl-leaf" aria-hidden="true">❀</div>;
}

function SectionTitle({ title }) {
  return (
    <div className="fl-section-head reveal">
      <Leaf />
      <h2 className="fl-title">{title}</h2>
    </div>
  );
}

export default function FloralTemplate({
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
    <div className="tpl-floral">
      <AudioPlayer src={data.music_url} playing={music} onToggle={setMusic} />

      {/* COVER */}
      <section className={`fl-cover ${opened ? "is-open" : ""}`}>
        <div className="fl-cover-frame">
          <div className="fl-corner tl">❁</div>
          <div className="fl-corner tr">❁</div>
          <div className="fl-corner bl">❁</div>
          <div className="fl-corner br">❁</div>
          <div className="fl-cover-content">
            <p className="fl-cover-pre">You Are Invited</p>
            {data.groom_photo && (
              <div className="fl-cover-photo">
                <img src={data.cover_photo} alt="cover" />
              </div>
            )}
            <h1 className="fl-cover-names">
              {data.bride_name} &amp; {data.groom_name}
            </h1>
            <p className="fl-cover-date">{formatDate(data.main_date)}</p>
            <div className="fl-cover-guest">
              <p>Kepada Yth.</p>
              <strong>{guestName || "Bapak/Ibu/Saudara/i"}</strong>
            </div>
            <button className="fl-open-btn" onClick={open}>
              Buka Undangan
            </button>
          </div>
        </div>
      </section>

      {opened && (
        <div className="fl-body">
          {/* OPENING */}
          <section className="fl-section fl-opening">
            <div className="fl-opening-inner reveal">
              <Leaf />
              <p className="fl-opening-text">{data.opening_text}</p>
              {show("show_quote") && data.quote && (
                <blockquote className="fl-quote">
                  “{data.quote}”
                  {data.quote_source && <cite>— {data.quote_source}</cite>}
                </blockquote>
              )}
            </div>
          </section>

          {/* COUPLE */}
          {show("show_couple") && (
          <section className="fl-section fl-couple">
            <SectionTitle title="The Couple" />
            <div className="fl-person reveal">
              <div className="fl-person-photo">
                <img src={data.bride_photo} alt={data.bride_name} />
              </div>
              <h3>{data.bride_full_name || data.bride_name}</h3>
              <p className="fl-person-order">{data.bride_order}</p>
              <p className="fl-person-parents">
                Putri dari {data.bride_father}
                {data.bride_mother && <> &amp; {data.bride_mother}</>}
              </p>
              {data.bride_instagram && (
                <a
                  className="fl-ig"
                  href={`https://instagram.com/${data.bride_instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{data.bride_instagram}
                </a>
              )}
            </div>

            <div className="fl-amp reveal">&amp;</div>

            <div className="fl-person reveal">
              <div className="fl-person-photo">
                <img src={data.groom_photo} alt={data.groom_name} />
              </div>
              <h3>{data.groom_full_name || data.groom_name}</h3>
              <p className="fl-person-order">{data.groom_order}</p>
              <p className="fl-person-parents">
                Putra dari {data.groom_father}
                {data.groom_mother && <> &amp; {data.groom_mother}</>}
              </p>
              {data.groom_instagram && (
                <a
                  className="fl-ig"
                  href={`https://instagram.com/${data.groom_instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{data.groom_instagram}
                </a>
              )}
            </div>
          </section>
          )}

          {/* COUNTDOWN */}
          {show("show_countdown") && (
          <section className="fl-section fl-countdown-sec">
            <div className="fl-countdown-inner reveal">
              <p className="fl-count-date">{formatFullDate(data.main_date)}</p>
              <Countdown target={data.main_date} />
            </div>
          </section>
          )}

          {/* LOVE STORY */}
          {show("show_love_story") && data.love_story && data.love_story.length > 0 && (
            <section className="fl-section fl-story">
              <SectionTitle title="Our Story" />
              <div className="fl-story-list">
                {data.love_story.map((s) => (
                  <div className="fl-story-item reveal" key={s.id}>
                    <span className="fl-story-date">{s.date_label}</span>
                    <h4>{s.title}</h4>
                    <p>{s.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EVENTS */}
          {show("show_events") && (
          <section className="fl-section fl-events">
            <SectionTitle title="Save The Date" />
            <div className="fl-events-grid">
              {data.events.map((ev) => (
                <div className="fl-event-card reveal" key={ev.id}>
                  <h3>{ev.name}</h3>
                  <div className="fl-event-date">{formatFullDate(ev.date)}</div>
                  <div className="fl-event-time">{timeRange(ev.time_start, ev.time_end)}</div>
                  <div className="fl-event-venue">{ev.venue_name}</div>
                  <div className="fl-event-address">{ev.venue_address}</div>
                  {ev.maps_url && (
                    <a
                      className="fl-maps-btn"
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
            <section className="fl-section fl-gallery">
              <SectionTitle title="Gallery" />
              <div className="fl-gallery-grid reveal">
                {data.gallery.map((g) => (
                  <figure className="fl-gallery-item" key={g.id}>
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
            <section className="fl-section fl-gift">
              <SectionTitle title="Wedding Gift" />
              <p className="fl-gift-text reveal">
                Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda
                kasih, dapat melalui rekening berikut.
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
            <section className="fl-section fl-info">
              <SectionTitle title="Informasi" />
              <div className="reveal">
                <WeddingInfo data={data} />
              </div>
            </section>
          )}

          {/* RSVP */}
          {show("show_rsvp") && (
          <section className="fl-section fl-rsvp">
            <SectionTitle title="RSVP" />
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
          <section className="fl-section fl-guestbook">
            <SectionTitle title="Wishes" />
            <div className="reveal">
              <Guestbook slug={data.slug} wishes={wishes} onAdded={onWishAdded} />
            </div>
          </section>
          )}

          {/* CLOSING */}
          <section className="fl-closing">
            <div className="fl-closing-inner reveal">
              <Leaf />
              <p>{data.closing_text}</p>
              <h2 className="fl-cover-names">
                {data.bride_name} &amp; {data.groom_name}
              </h2>
            </div>
          </section>

          <footer className="fl-footer">
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
