import { useCountdown } from "../hooks/useCountdown.js";

export default function Countdown({ target }) {
  const t = useCountdown(target);
  const items = [
    { label: "Hari", value: t.days },
    { label: "Jam", value: t.hours },
    { label: "Menit", value: t.minutes },
    { label: "Detik", value: t.seconds },
  ];
  return (
    <div className="countdown">
      {items.map((it) => (
        <div className="countdown-item" key={it.label}>
          <span className="countdown-value">{String(it.value).padStart(2, "0")}</span>
          <span className="countdown-label">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
