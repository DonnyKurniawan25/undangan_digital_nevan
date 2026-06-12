// Centralised API client for the wedding invitation backend.
// During development requests to /api are proxied to the Django server.

const BASE = "/api";
const TOKEN_KEY = "wi_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { ...extra, Authorization: `Token ${token}` } : extra;
}

async function handle(res) {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    let data = null;
    try {
      data = await res.json();
      detail = data.detail || flattenErrors(data) || detail;
    } catch (_) {
      /* ignore */
    }
    const err = new Error(detail);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

function flattenErrors(data) {
  if (typeof data !== "object" || !data) return null;
  const parts = [];
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) parts.push(`${k}: ${v.join(", ")}`);
    else if (typeof v === "string") parts.push(`${k}: ${v}`);
  }
  return parts.join(" | ");
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeaders({ "Content-Type": "application/json" }),
    ...options,
  });
  return handle(res);
}

// For multipart uploads (do not set Content-Type, browser handles boundary)
async function upload(path, formData) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return handle(res);
}

export const api = {
  // public
  getTemplates: () => request("/templates/"),
  getPricing: () => request("/pricing/"),
  getPaymentInfo: () => request("/payment-info/"),
  listInvitations: () => request("/invitations/"),
  getInvitation: (slug) => request(`/invitations/${slug}/`),
  getWishes: (slug) => request(`/invitations/${slug}/wishes/`),
  createWish: (slug, payload) =>
    request(`/invitations/${slug}/wishes/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getRsvps: (slug) => request(`/invitations/${slug}/rsvps/`),
  createRsvp: (slug, payload) =>
    request(`/invitations/${slug}/rsvps/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // auth
  register: (payload) =>
    request("/auth/register/", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request("/auth/login/", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me/"),

  // my invitations
  myInvitations: () => request("/my/invitations/"),
  getMyInvitation: (id) => request(`/my/invitations/${id}/`),
  createInvitation: (payload) =>
    request("/my/invitations/", { method: "POST", body: JSON.stringify(payload) }),
  updateInvitation: (id, payload) =>
    request(`/my/invitations/${id}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteInvitation: (id) =>
    request(`/my/invitations/${id}/`, { method: "DELETE" }),

  // my photos
  myPhotos: () => request("/my/photos/"),
  uploadPhoto: (formData) => upload("/my/photos/", formData),
  deletePhoto: (id) => request(`/my/photos/${id}/`, { method: "DELETE" }),

  // my audio (music)
  myAudio: () => request("/my/audio/"),
  uploadAudio: (formData) => upload("/my/audio/", formData),
  deleteAudio: (id) => request(`/my/audio/${id}/`, { method: "DELETE" }),

  // orders
  myOrders: () => request("/my/orders/"),
  quoteOrder: (ids) =>
    request("/my/orders/quote/", {
      method: "POST",
      body: JSON.stringify({ invitation_ids: ids }),
    }),
  checkoutOrder: (ids) =>
    request("/my/orders/checkout/", {
      method: "POST",
      body: JSON.stringify({ invitation_ids: ids }),
    }),
  payOrder: (id, method = "mock") =>
    request(`/my/orders/${id}/pay/`, {
      method: "POST",
      body: JSON.stringify({ payment_method: method }),
    }),
  cancelOrder: (id) =>
    request(`/my/orders/${id}/cancel/`, { method: "POST" }),
};
