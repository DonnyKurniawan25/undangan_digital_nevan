import { useEffect, useRef, useState } from "react";

// Floating music control. Attempts to autoplay once the invitation is opened.
export default function AudioPlayer({ src, playing, onToggle }) {
  const audioRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (playing) {
      audio.volume = 0.6;
      audio
        .play()
        .then(() => setActive(true))
        .catch(() => setActive(false));
    } else {
      audio.pause();
      setActive(false);
    }
  }, [playing, src]);

  if (!src) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (active) {
      audio.pause();
      setActive(false);
    } else {
      audio.play().then(() => setActive(true)).catch(() => {});
    }
    if (onToggle) onToggle(!active);
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      <button
        className={`music-toggle ${active ? "is-playing" : ""}`}
        onClick={toggle}
        aria-label="Putar musik"
        title="Musik latar"
      >
        <span className="music-icon">{active ? "♫" : "♪"}</span>
      </button>
    </>
  );
}
