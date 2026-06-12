const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${DAYS_ID[d.getDay()]}, ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTime(timeStr) {
  if (!timeStr) return "";
  // timeStr like "08:00:00"
  const [h, m] = timeStr.split(":");
  return `${h}.${m}`;
}

export function timeRange(start, end) {
  const s = formatTime(start);
  const e = formatTime(end);
  if (s && e) return `${s} - ${e} WIB`;
  if (s) return `${s} WIB - selesai`;
  return "";
}

export function relativeTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

// Build a keyless Google Maps embed URL for a small inline preview map.
// Prefers the venue address/name as the query (most reliable); otherwise
// tries to extract a "q=" or "@lat,lng" location from the saved maps_url.
export function mapEmbedUrl(ev) {
  if (!ev) return "";
  const query = [ev.venue_name, ev.venue_address]
    .filter(Boolean)
    .join(", ")
    .trim();
  if (query) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  }
  const url = ev.maps_url || "";
  if (!url) return "";
  // Try ?q=... then @lat,lng
  const qMatch = url.match(/[?&]q=([^&]+)/);
  if (qMatch) {
    return `https://maps.google.com/maps?q=${qMatch[1]}&z=15&output=embed`;
  }
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}&z=15&output=embed`;
  }
  return "";
}
