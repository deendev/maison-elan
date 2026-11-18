// Editable catalogue layer for the demo admin.
// The built-in products live in data.js. Admin changes are stored in this browser
// (localStorage) and applied in place to the shared PRODUCTS array, so every page
// that imports PRODUCTS sees them.
import { PRODUCTS } from './data.js';

const KEY = 'elan:catalog';
const ORIGINAL = PRODUCTS.map((p) => JSON.parse(JSON.stringify(p)));

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') || { edits: {}, added: [], removed: [] }; }
  catch { return { edits: {}, added: [], removed: [] }; }
};
const write = (c) => {
  try { localStorage.setItem(KEY, JSON.stringify(c)); return true; }
  catch { return false; } // storage full (large images) or unavailable
};

function apply() {
  const c = read();
  const base = ORIGINAL.filter((p) => !c.removed.includes(p.id)).map((p) => ({ ...p, ...(c.edits[p.id] || {}) }));
  const next = [...base, ...c.added.filter((p) => !c.removed.includes(p.id))];
  PRODUCTS.splice(0, PRODUCTS.length, ...next);
}
apply();

export const isBuiltIn = (id) => ORIGINAL.some((p) => p.id === id);

export function saveProduct(product) {
  const c = read();
  if (isBuiltIn(product.id)) c.edits[product.id] = product;
  else {
    const i = c.added.findIndex((p) => p.id === product.id);
    if (i >= 0) c.added[i] = product; else c.added.push(product);
  }
  c.removed = c.removed.filter((x) => x !== product.id);
  const ok = write(c);
  apply();
  return ok;
}

export function deleteProduct(id) {
  const c = read();
  if (isBuiltIn(id)) { if (!c.removed.includes(id)) c.removed.push(id); }
  else c.added = c.added.filter((p) => p.id !== id);
  delete c.edits[id];
  write(c);
  apply();
}

export function resetCatalog() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  apply();
}

export const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'product';

export function uniqueId(name) {
  const base = slugify(name);
  let id = base, n = 2;
  while (PRODUCTS.some((p) => p.id === id) || ORIGINAL.some((p) => p.id === id)) id = `${base}-${n++}`;
  return id;
}

/* Resize an uploaded image to a compact data URL so it fits in browser storage. */
export function fileToImage(file, max = 900) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * s);
      c.height = Math.round(img.naturalHeight * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/webp', 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that image.')); };
    img.src = url;
  });
}

/* ------------------------------------------------------------------ */
/* Orders                                                               */
/* ------------------------------------------------------------------ */
export const STATUSES = [
  { id: 'confirmed', label: 'Order confirmed', short: 'Confirmed' },
  { id: 'preparing', label: 'Preparing in the atelier', short: 'Preparing' },
  { id: 'shipped', label: 'Shipped', short: 'Shipped' },
  { id: 'out-for-delivery', label: 'Out for delivery', short: 'Out for delivery' },
  { id: 'delivered', label: 'Delivered', short: 'Delivered' },
];
export const statusIndex = (s) => Math.max(0, STATUSES.findIndex((x) => x.id === s));

export const CARRIERS = [
  { id: 'dhl', name: 'DHL Express', url: (c) => `https://www.dhl.com/it-en/home/tracking.html?tracking-id=${encodeURIComponent(c)}` },
  { id: 'ups', name: 'UPS', url: (c) => `https://www.ups.com/track?tracknum=${encodeURIComponent(c)}` },
  { id: 'brt', name: 'BRT', url: (c) => `https://vas.brt.it/vas/sped_det_show.hsm?referer=sped_numspe_par.htm&Nspediz=${encodeURIComponent(c)}` },
  { id: 'gls', name: 'GLS', url: (c) => `https://gls-group.com/IT/it/servizi-online/ricerca-spedizioni?match=${encodeURIComponent(c)}` },
  { id: 'poste', name: 'Poste Italiane', url: (c) => `https://www.poste.it/cerca/index.html#/risultati-spedizioni/${encodeURIComponent(c)}` },
];
export const carrierById = (id) => CARRIERS.find((c) => c.id === id);

export function addBusinessDays(date, n) {
  const d = new Date(date);
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}
export const isoDay = (d) => new Date(d).toISOString().slice(0, 10);
export const niceDate = (d, opts = { weekday: 'long', day: 'numeric', month: 'long' }) =>
  new Date(d).toLocaleDateString('en-GB', opts);

export function newOrder({ id, items, customer = {}, method = 'standard', stripeSession = null, sample = false, date = new Date() }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const d = new Date(date);
  return {
    id: id || 'ME-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    date: d.toISOString(),
    items,
    subtotal, discount: 0, ship: 0, total: subtotal,
    method,
    name: customer.name || '',
    email: customer.email || '',
    address: customer.address || 'Collected on the secure payment page',
    stripeSession,
    sample,
    status: 'confirmed',
    history: [{ status: 'confirmed', at: d.toISOString() }],
    tracking: null,
    eta: isoDay(addBusinessDays(d, method === 'express' ? 1 : 4)),
    note: '',
  };
}

/* A few sample orders so the dashboard isn't empty on first visit. */
export function sampleOrders() {
  const now = Date.now();
  const day = 864e5;
  const mk = (id, daysAgo, name, email, city, items, status, tracking) => {
    const o = newOrder({ id, items, customer: { name, email, address: city }, sample: true, date: new Date(now - daysAgo * day) });
    const idx = statusIndex(status);
    o.history = STATUSES.slice(0, idx + 1).map((s, k) => ({ status: s.id, at: new Date(now - (daysAgo - k * 0.8) * day).toISOString() }));
    o.status = status;
    o.tracking = tracking || null;
    return o;
  };
  return [
    mk('ME-4F82KQ', 0.3, 'Giulia Bianchi', 'giulia.b@example.com', 'Via Farini 14, 43121 Parma, Italy',
      [{ id: 'tailored-wool-blazer', colorIndex: 0, size: 'S', qty: 1, price: 295 }, { id: 'relaxed-tailored-trousers', colorIndex: 0, size: 'S', qty: 1, price: 165 }], 'confirmed'),
    mk('ME-9TZ1WD', 2, 'Lukas Meyer', 'lukas.meyer@example.com', 'Bergmannstraße 22, 10961 Berlin, Germany',
      [{ id: 'cashmere-crewneck', colorIndex: 0, size: 'M', qty: 1, price: 210 }], 'shipped', { carrier: 'dhl', code: '1Z84630193' }),
    mk('ME-2HB7XN', 3, 'Amara Okafor', 'amara.o@example.com', '12 Rue Oberkampf, 75011 Paris, France',
      [{ id: 'structured-leather-handbag', colorIndex: 0, size: 'One Size', qty: 1, price: 340 }, { id: 'cashmere-scarf', colorIndex: 0, size: 'One Size', qty: 1, price: 135 }], 'out-for-delivery', { carrier: 'ups', code: '1Z999AA10123456784' }),
    mk('ME-7QC3RM', 8, 'Marco Ferri', 'marco.ferri@example.com', 'Corso Canalgrande 40, 41121 Modena, Italy',
      [{ id: 'leather-minimal-sneakers', colorIndex: 0, size: '42', qty: 1, price: 175 }], 'delivered', { carrier: 'brt', code: '058123400912' }),
  ];
}
