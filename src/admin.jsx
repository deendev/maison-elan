import { useMemo, useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, ExternalLink, LogOut, Plus, Search, Pencil, Trash2, ArrowLeft, Upload, X, RotateCcw, Truck, AlertCircle, Menu, Eye,
} from 'lucide-react';
import { useStore } from './store.jsx';
import { PRODUCTS, CATEGORIES, euro, getProduct } from './data.js';
import { ProductImage } from './art.jsx';
import { Logo } from './components.jsx';
import { STRIPE_LINKS } from './stripe.js';
import {
  saveProduct, deleteProduct, resetCatalog, uniqueId, fileToImage, isBuiltIn,
  STATUSES, statusIndex, CARRIERS, carrierById, niceDate, sampleOrders,
} from './catalog.js';
import { OrderTimeline } from './pages-more.jsx';

const SESSION = 'elan:admin';
const isAuthed = () => { try { return sessionStorage.getItem(SESSION) === '1'; } catch { return false; } };

const SIZE_PRESETS = {
  apparel: ['XS', 'S', 'M', 'L', 'XL'],
  shoes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  one: ['One Size'],
};
const SHAPES = { knitwear: 'sweater', outerwear: 'blazer', dresses: 'dress', shirts: 'shirt', trousers: 'trousers', accessories: 'bag' };

const label = 'block text-[11px] uppercase tracking-[.14em] text-charcoal/60 mb-2';
const input = 'w-full h-11 px-3 bg-white border border-charcoal/15 text-[14px] focus:border-ink focus:outline-none transition-colors';

function StatusBadge({ status }) {
  const i = statusIndex(status);
  const tone = ['bg-[#EDE3CF] text-[#6B5426]', 'bg-[#E5E1EC] text-[#4A3F66]', 'bg-[#DCE6EE] text-[#2C4A63]', 'bg-[#DCE6EE] text-[#2C4A63]', 'bg-[#DDE8DA] text-[#2F5229]'][i];
  return <span className={'inline-flex items-center h-6 px-2.5 text-[11px] font-medium rounded-full whitespace-nowrap ' + tone}>{STATUSES[i].short}</span>;
}

function Confirm({ open, title, body, action = 'Delete', onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-5" role="dialog" aria-label={title}>
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[420px] p-7 fade-in">
        <p className="font-serif text-[24px]">{title}</p>
        <p className="mt-2 text-[14px] text-charcoal/70">{body}</p>
        <div className="mt-7 flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline h-11 px-5">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn h-11 px-5 bg-[#8E2F23] text-white hover:bg-[#7a271d]">{action}</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Login({ onIn }) {
  const [email, setEmail] = useState('admin@maison-elan.example');
  const [pw, setPw] = useState('demo');
  return (
    <div className="min-h-screen grid place-items-center bg-cream px-5">
      <form
        onSubmit={(e) => { e.preventDefault(); try { sessionStorage.setItem(SESSION, '1'); } catch { /* ignore */ } onIn(); }}
        className="w-full max-w-[420px] bg-white p-8 md:p-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,.35)]"
      >
        <Logo className="!text-[19px]" />
        <p className="eyebrow text-taupe mt-8">Admin</p>
        <h1 className="font-serif text-[34px] mt-2 leading-tight">Sign in to the dashboard</h1>
        <p className="mt-3 text-[13px] text-charcoal/60">Demo access: the details below are filled in for you. Changes are saved only in this browser.</p>
        <div className="mt-8 space-y-5">
          <label className="block"><span className={label}>Email</span><input className={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
          <label className="block"><span className={label}>Password</span><input type="password" className={input} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></label>
        </div>
        <button className="btn-dark w-full mt-8">Sign In</button>
        <a href="#home" className="block text-center mt-5 text-[12.5px] underline underline-offset-4 text-charcoal/60">Back to the store</a>
      </form>
    </div>
  );
}

function Shell({ route, children, onOut }) {
  const { orders } = useStore();
  const [nav, setNav] = useState(false);
  const open = orders.filter((o) => statusIndex(o.status) < 2).length;
  const items = [
    ['Dashboard', 'admin', LayoutDashboard],
    ['Products', 'admin-products', Package, PRODUCTS.length],
    ['Orders', 'admin-orders', ShoppingBag, open || null],
  ];
  const active = (h) => (h === 'admin' ? route === 'admin' : route.startsWith(h.replace(/s$/, '')));
  const side = (
    <nav className="flex flex-col h-full">
      <div className="h-16 px-6 flex items-center border-b border-white/10"><Logo className="!text-[15px] text-ivory" /></div>
      <p className="px-6 pt-6 pb-2 text-[10px] uppercase tracking-[.2em] text-ivory/40">Admin</p>
      <ul className="px-3 space-y-1">
        {items.map(([l, h, I, n]) => (
          <li key={h}>
            <a href={'#' + h} onClick={() => setNav(false)} className={'flex items-center gap-3 h-11 px-3 text-[13.5px] transition-colors ' + (active(h) ? 'bg-white/10 text-ivory' : 'text-ivory/65 hover:text-ivory hover:bg-white/5')}>
              <I size={17} strokeWidth={1.4} />{l}
              {n ? <span className="ml-auto text-[11px] px-2 rounded-full bg-white/10">{n}</span> : null}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto px-3 pb-5 space-y-1">
        <a href="#home" className="flex items-center gap-3 h-11 px-3 text-[13.5px] text-ivory/65 hover:text-ivory"><ExternalLink size={16} strokeWidth={1.4} />View store</a>
        <button onClick={onOut} className="w-full flex items-center gap-3 h-11 px-3 text-[13.5px] text-ivory/65 hover:text-ivory"><LogOut size={16} strokeWidth={1.4} />Sign out</button>
      </div>
    </nav>
  );
  return (
    <div className="min-h-screen bg-[#F3F1ED] text-charcoal lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block bg-ink sticky top-0 h-screen">{side}</aside>
      <div className={'lg:hidden fixed inset-0 z-50 ' + (nav ? '' : 'pointer-events-none')}>
        <div className={'absolute inset-0 bg-ink/40 transition-opacity ' + (nav ? 'opacity-100' : 'opacity-0')} onClick={() => setNav(false)} />
        <aside className={'absolute inset-y-0 left-0 w-[260px] bg-ink transition-transform duration-300 ' + (nav ? 'translate-x-0' : '-translate-x-full')}>{side}</aside>
      </div>
      <div className="min-w-0">
        <header className="lg:hidden sticky top-0 z-30 h-14 px-4 bg-ink text-ivory flex items-center justify-between">
          <button onClick={() => setNav(true)} aria-label="Open admin menu" className="p-2 -ml-2"><Menu size={20} strokeWidth={1.4} /></button>
          <span className="text-[12px] uppercase tracking-[.2em]">Admin</span>
          <a href="#home" aria-label="View store" className="p-2 -mr-2"><Eye size={18} strokeWidth={1.4} /></a>
        </header>
        <div className="bg-[#EDE6DA] text-[12.5px] px-5 md:px-8 py-2.5 flex items-center gap-2">
          <AlertCircle size={14} strokeWidth={1.5} className="shrink-0" />
          Demo dashboard. Changes are saved in this browser and show on the store straight away.
        </div>
        <main className="px-5 md:px-8 py-7 md:py-10 max-w-[1280px]">{children}</main>
      </div>
    </div>
  );
}

const Card = ({ className = '', children }) => <div className={'bg-white border border-black/[.06] ' + className}>{children}</div>;
const H1 = ({ children, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
    <h1 className="font-serif text-[34px] md:text-[42px] leading-none">{children}</h1>
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>
);

/* ------------------------------------------------------------------ */
function Dashboard() {
  const { orders, setOrders, notify, bumpCatalog } = useStore();
  const [reset, setReset] = useState(false);
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const soldOut = PRODUCTS.filter((p) => p.soldOut);
  const attention = orders.filter((o) => statusIndex(o.status) < 2 || (o.status === 'shipped' && !o.tracking));
  const kpis = [
    ['Revenue', euro(revenue), `${orders.length} orders`],
    ['Average order', euro(orders.length ? Math.round(revenue / orders.length) : 0), 'Per order'],
    ['To fulfil', attention.length, 'Awaiting shipment'],
    ['Products', PRODUCTS.length, soldOut.length ? `${soldOut.length} sold out` : 'All in stock'],
  ];
  return (
    <>
      <H1 actions={<button onClick={() => setReset(true)} className="btn-outline h-10 px-4 text-[10px]"><RotateCcw size={13} strokeWidth={1.4} />Reset demo data</button>}>Good day.</H1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map(([k, v, s]) => (
          <Card key={k} className="p-5 md:p-6">
            <p className="text-[11px] uppercase tracking-[.16em] text-charcoal/55">{k}</p>
            <p className="font-serif text-[30px] md:text-[36px] mt-3 leading-none tabular-nums">{v}</p>
            <p className="mt-2 text-[12px] text-charcoal/55">{s}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <Card>
          <div className="px-6 h-14 flex items-center justify-between border-b border-black/[.06]">
            <p className="font-medium text-[14px]">Recent orders</p>
            <a href="#admin-orders" className="text-[12.5px] underline underline-offset-4">All orders</a>
          </div>
          <ul className="divide-y divide-black/[.06]">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id}>
                <a href={'#admin-order-' + o.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#FAF8F5]">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium">{o.id} <span className="font-normal text-charcoal/55">· {o.name || 'Guest'}</span></p>
                    <p className="text-[12px] text-charcoal/55">{niceDate(o.date, { day: 'numeric', month: 'short' })} · {o.items.reduce((s, i) => s + i.qty, 0)} items</p>
                  </div>
                  <StatusBadge status={o.status} />
                  <p className="w-20 text-right text-[13.5px] tabular-nums">{euro(o.total)}</p>
                </a>
              </li>
            ))}
            {orders.length === 0 && <li className="px-6 py-10 text-center text-[13.5px] text-charcoal/55">No orders yet.</li>}
          </ul>
        </Card>
        <div className="space-y-4">
          <Card className="p-6">
            <p className="font-medium text-[14px] flex items-center gap-2"><Truck size={16} strokeWidth={1.4} />Needs attention</p>
            {attention.length === 0 ? <p className="mt-3 text-[13px] text-charcoal/55">Everything has shipped.</p> : (
              <ul className="mt-3 space-y-2">
                {attention.slice(0, 5).map((o) => (
                  <li key={o.id}><a href={'#admin-order-' + o.id} className="flex justify-between text-[13px] hover:underline underline-offset-4"><span>{o.id} · {o.name || 'Guest'}</span><span className="text-charcoal/55">{STATUSES[statusIndex(o.status)].short}</span></a></li>
                ))}
              </ul>
            )}
          </Card>
          <Card className="p-6">
            <p className="font-medium text-[14px]">Orders by status</p>
            <ul className="mt-4 space-y-3">
              {STATUSES.map((s) => {
                const n = orders.filter((o) => o.status === s.id).length;
                return (
                  <li key={s.id}>
                    <div className="flex justify-between text-[12.5px]"><span>{s.short}</span><span className="tabular-nums">{n}</span></div>
                    <div className="mt-1.5 h-[3px] bg-black/[.06]"><div className="h-full bg-ink" style={{ width: (orders.length ? (n / orders.length) * 100 : 0) + '%' }} /></div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
      <Confirm
        open={reset}
        title="Reset demo data?"
        body="This restores the original 24 products and the sample orders. Products and orders you created in this browser will be removed."
        action="Reset"
        onClose={() => setReset(false)}
        onConfirm={() => { resetCatalog(); bumpCatalog(); setOrders(sampleOrders()); notify('Demo data restored'); }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
function Products() {
  const { bumpCatalog, notify, catalogVersion } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [del, setDel] = useState(null);
  const list = useMemo(() => PRODUCTS.filter((p) => (cat === 'all' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())), [q, cat, catalogVersion]);
  const toggleSold = (p) => { saveProduct({ ...p, soldOut: !p.soldOut }); bumpCatalog(); notify(p.soldOut ? `${p.name} is back in stock` : `${p.name} marked sold out`); };
  return (
    <>
      <H1 actions={<a href="#admin-new" className="btn-dark h-10 px-5 text-[10px]"><Plus size={14} strokeWidth={1.6} />Add product</a>}>Products</H1>
      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-black/[.06]">
          <label className="relative flex-1">
            <Search size={15} strokeWidth={1.4} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className={input + ' pl-9'} aria-label="Search products" />
          </label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={input + ' sm:w-56'} aria-label="Filter by category">
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] min-w-[720px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[.14em] text-charcoal/50 border-b border-black/[.06]">
                <th className="py-3 pl-5 pr-3 font-medium">Product</th><th className="py-3 px-3 font-medium">Category</th><th className="py-3 px-3 font-medium">Price</th><th className="py-3 px-3 font-medium">Colours</th><th className="py-3 px-3 font-medium">Stock</th><th className="py-3 pr-5 pl-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[.06]">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 pl-5 pr-3">
                    <a href={'#admin-product-' + p.id} className="flex items-center gap-3">
                      <ProductImage product={p} className="w-11 aspect-[4/5] shrink-0" />
                      <span><span className="block font-medium">{p.name}</span>{p.isNew && <span className="text-[11px] text-taupe">New season</span>}</span>
                    </a>
                  </td>
                  <td className="py-3 px-3 text-charcoal/70">{CATEGORIES.find((c) => c.id === p.category)?.name}</td>
                  <td className="py-3 px-3 tabular-nums">{euro(p.price)}</td>
                  <td className="py-3 px-3"><span className="flex gap-1">{p.colors.map((c) => <span key={c.name} title={c.name} className="h-4 w-4 rounded-full border border-black/10" style={{ background: c.hex }} />)}</span></td>
                  <td className="py-3 px-3">
                    <button onClick={() => toggleSold(p)} className={'h-7 px-3 rounded-full text-[11.5px] ' + (p.soldOut ? 'bg-[#F2DEDA] text-[#8E2F23]' : 'bg-[#DDE8DA] text-[#2F5229]')} title="Click to toggle">{p.soldOut ? 'Sold out' : 'In stock'}</button>
                  </td>
                  <td className="py-3 pr-5 pl-3">
                    <div className="flex justify-end gap-1">
                      <a href={'#admin-product-' + p.id} aria-label={`Edit ${p.name}`} className="h-9 w-9 grid place-items-center hover:bg-black/5"><Pencil size={15} strokeWidth={1.4} /></a>
                      <button onClick={() => setDel(p)} aria-label={`Delete ${p.name}`} className="h-9 w-9 grid place-items-center hover:bg-black/5 text-[#8E2F23]"><Trash2 size={15} strokeWidth={1.4} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-charcoal/55">No products match.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <Confirm
        open={!!del}
        title={`Delete ${del?.name}?`}
        body="It will be removed from the store, the search and every collection. You can bring built-in products back with Reset demo data."
        onClose={() => setDel(null)}
        onConfirm={() => { deleteProduct(del.id); bumpCatalog(); notify(`${del.name} deleted`); }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
function ProductForm({ id }) {
  const { bumpCatalog, notify, go } = useStore();
  const existing = id ? getProduct(id) : null;
  const [f, setF] = useState(() => existing ? {
    ...existing,
    detailsText: (existing.details || []).join('\n'),
    sizesPreset: Object.entries(SIZE_PRESETS).find(([, v]) => v.join() === existing.sizes.join())?.[0] || 'custom',
    sizesText: existing.sizes.join(', '),
  } : {
    name: '', price: '', category: 'knitwear', gender: 'women', description: '', material: '', care: 'Dry clean or hand wash cold.', origin: 'Made in Italy',
    colors: [{ name: 'Ivory', hex: '#EFE9DE', family: 'Neutral' }], detailsText: '', sizesPreset: 'apparel', sizesText: 'XS, S, M, L, XL',
    isNew: true, essential: false, soldOut: false, image: null,
  });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, v) => { setF((o) => ({ ...o, [k]: v })); setErrs((e) => ({ ...e, [k]: null })); };
  const setColor = (i, k, v) => set('colors', f.colors.map((c, j) => (j === i ? { ...c, [k]: v } : c)));

  if (id && !existing) return <p>Product not found. <a href="#admin-products" className="underline">Back to products</a></p>;

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try { set('image', await fileToImage(file)); } catch (err) { setErrs((x) => ({ ...x, image: err.message })); }
    setBusy(false);
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = 'Give the product a name.';
    const price = Number(f.price);
    if (!(price > 0)) er.price = 'Enter a price above 0.';
    const sizes = f.sizesPreset === 'custom' ? f.sizesText.split(',').map((x) => x.trim()).filter(Boolean) : SIZE_PRESETS[f.sizesPreset];
    if (!sizes.length) er.sizes = 'Add at least one size.';
    if (!f.colors.length || f.colors.some((c) => !c.name.trim())) er.colors = 'Every colour needs a name.';
    if (!f.description.trim()) er.description = 'Add a short description.';
    setErrs(er);
    if (Object.keys(er).length) return;
    const product = {
      ...(existing || {}),
      id: existing ? existing.id : uniqueId(f.name),
      name: f.name.trim(), price, category: f.category, gender: f.gender,
      shape: existing?.shape || SHAPES[f.category] || 'sweater',
      colors: f.colors.map((c) => ({ ...c, name: c.name.trim(), family: c.family || 'Neutral' })),
      sizes, description: f.description.trim(), material: f.material.trim(), care: f.care.trim(), origin: f.origin.trim(),
      details: f.detailsText.split('\n').map((x) => x.trim()).filter(Boolean),
      isNew: !!f.isNew, essential: !!f.essential, soldOut: !!f.soldOut,
      image: f.image || null,
      popularity: existing?.popularity ?? 50, added: existing?.added ?? Number(new Date().toISOString().slice(0, 10).replace(/-/g, '')),
      rating: existing?.rating ?? 4.8,
    };
    const ok = saveProduct(product);
    bumpCatalog();
    if (!ok) { notify('Saved, but the browser storage is full. Try a smaller image.'); return; }
    notify(existing ? 'Product updated' : 'Product added to the store', { label: 'View', fn: () => go('product-' + product.id) });
    go('admin-products');
  };

  const preview = existing ? { ...existing, image: f.image ?? existing.image, colors: f.colors.length ? f.colors : existing.colors } : null;
  return (
    <form onSubmit={submit} noValidate>
      <a href="#admin-products" className="inline-flex items-center gap-2 text-[12.5px] text-charcoal/60 hover:text-ink mb-4"><ArrowLeft size={14} strokeWidth={1.4} />Products</a>
      <H1 actions={<>{existing && <a href={'#product-' + existing.id} className="btn-outline h-10 px-4 text-[10px]"><Eye size={13} strokeWidth={1.4} />View in store</a>}<button className="btn-dark h-10 px-5 text-[10px]">{existing ? 'Save changes' : 'Add product'}</button></>}>
        {existing ? existing.name : 'New product'}
      </H1>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
        <div className="space-y-4">
          <Card className="p-6 space-y-5">
            <label className="block"><span className={label}>Name</span><input className={input} value={f.name} onChange={(e) => set('name', e.target.value)} />{errs.name && <span className="text-[12px] text-[#8E2F23]">{errs.name}</span>}</label>
            <label className="block"><span className={label}>Description</span><textarea rows={4} className={input + ' h-auto py-2.5'} value={f.description} onChange={(e) => set('description', e.target.value)} />{errs.description && <span className="text-[12px] text-[#8E2F23]">{errs.description}</span>}</label>
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block"><span className={label}>Price (€)</span><input type="number" min="1" step="1" className={input} value={f.price} onChange={(e) => set('price', e.target.value)} />{errs.price && <span className="text-[12px] text-[#8E2F23]">{errs.price}</span>}</label>
              <label className="block"><span className={label}>Category</span>
                <select className={input} value={f.category} onChange={(e) => set('category', e.target.value)}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              </label>
              <label className="block"><span className={label}>Department</span>
                <select className={input} value={f.gender} onChange={(e) => set('gender', e.target.value)}><option value="women">Women</option><option value="men">Men</option><option value="unisex">Unisex</option></select>
              </label>
              <label className="block"><span className={label}>Origin</span><input className={input} value={f.origin} onChange={(e) => set('origin', e.target.value)} /></label>
            </div>
          </Card>
          <Card className="p-6 space-y-5">
            <p className="font-medium text-[14px]">Colours and sizes</p>
            <div>
              <span className={label}>Colours</span>
              <div className="space-y-2">
                {f.colors.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="color" value={c.hex} onChange={(e) => setColor(i, 'hex', e.target.value)} className="h-11 w-14 border border-charcoal/15 bg-white p-1" aria-label={`Colour ${i + 1} swatch`} />
                    <input className={input} value={c.name} onChange={(e) => setColor(i, 'name', e.target.value)} placeholder="Colour name" aria-label={`Colour ${i + 1} name`} />
                    <button type="button" onClick={() => set('colors', f.colors.filter((_, j) => j !== i))} disabled={f.colors.length === 1} className="h-11 w-11 shrink-0 grid place-items-center border border-charcoal/15 disabled:opacity-30" aria-label="Remove colour"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => set('colors', [...f.colors, { name: '', hex: '#A99B8A', family: 'Neutral' }])} className="mt-3 text-[12.5px] underline underline-offset-4">+ Add colour</button>
              {errs.colors && <p className="text-[12px] text-[#8E2F23] mt-1">{errs.colors}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block"><span className={label}>Size range</span>
                <select className={input} value={f.sizesPreset} onChange={(e) => set('sizesPreset', e.target.value)}>
                  <option value="apparel">Clothing (XS–XL)</option><option value="shoes">Shoes (EU 36–45)</option><option value="one">One size</option><option value="custom">Custom</option>
                </select>
              </label>
              {f.sizesPreset === 'custom' && <label className="block"><span className={label}>Sizes, comma separated</span><input className={input} value={f.sizesText} onChange={(e) => set('sizesText', e.target.value)} /></label>}
            </div>
            {errs.sizes && <p className="text-[12px] text-[#8E2F23]">{errs.sizes}</p>}
          </Card>
          <Card className="p-6 space-y-5">
            <p className="font-medium text-[14px]">Details</p>
            <label className="block"><span className={label}>Composition</span><input className={input} value={f.material} onChange={(e) => set('material', e.target.value)} /></label>
            <label className="block"><span className={label}>Product details, one per line</span><textarea rows={4} className={input + ' h-auto py-2.5'} value={f.detailsText} onChange={(e) => set('detailsText', e.target.value)} /></label>
            <label className="block"><span className={label}>Care</span><input className={input} value={f.care} onChange={(e) => set('care', e.target.value)} /></label>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-6">
            <p className="font-medium text-[14px]">Image</p>
            <div className="mt-4 aspect-[4/5] bg-[#F3F1ED] relative overflow-hidden">
              {f.image ? <img src={f.image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : preview ? <ProductImage product={preview} className="absolute inset-0" /> : <div className="absolute inset-0 grid place-items-center text-[13px] text-charcoal/45">No image yet</div>}
            </div>
            <label className="mt-4 btn-outline w-full h-11 cursor-pointer">
              <Upload size={14} strokeWidth={1.4} />{busy ? 'Processing…' : f.image || existing ? 'Replace image' : 'Upload image'}
              <input type="file" accept="image/*" onChange={onImage} className="sr-only" />
            </label>
            {f.image && <button type="button" onClick={() => set('image', null)} className="mt-2 w-full text-[12px] underline underline-offset-4 text-charcoal/60">Remove uploaded image</button>}
            {errs.image && <p className="text-[12px] text-[#8E2F23] mt-2">{errs.image}</p>}
            <p className="mt-3 text-[11.5px] text-charcoal/50">JPG, PNG or WebP. Resized to 900 px wide.</p>
          </Card>
          <Card className="p-6 space-y-4">
            <p className="font-medium text-[14px]">Visibility</p>
            {[['isNew', 'Show in New Arrivals'], ['essential', 'Include in Contemporary Essentials'], ['soldOut', 'Sold out']].map(([k, l]) => (
              <label key={k} className="flex items-center justify-between gap-4 text-[13.5px] cursor-pointer">
                {l}
                <input type="checkbox" checked={!!f[k]} onChange={(e) => set(k, e.target.checked)} className="h-5 w-5 accent-[#111]" />
              </label>
            ))}
          </Card>
          <Card className="p-6 text-[12.5px] text-charcoal/65">
            {existing && STRIPE_LINKS[existing.id]
              ? 'This product has a test payment link, so "Buy now" and card checkout work.'
              : 'New products use the demo checkout (order saved without card payment) until a payment link is added.'}
            {existing && !isBuiltIn(existing.id) && <p className="mt-2">Added from this dashboard.</p>}
          </Card>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
function Orders() {
  const { orders } = useStore();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const list = orders.filter((o) => (tab === 'all' || (tab === 'open' ? statusIndex(o.status) < 2 : o.status === tab)) && (o.id + ' ' + o.name + ' ' + o.email).toLowerCase().includes(q.toLowerCase()));
  const tabs = [['all', 'All'], ['open', 'To fulfil'], ['shipped', 'Shipped'], ['delivered', 'Delivered']];
  return (
    <>
      <H1>Orders</H1>
      <Card>
        <div className="p-4 flex flex-col md:flex-row gap-3 md:items-center border-b border-black/[.06]">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={'h-9 px-4 text-[12.5px] shrink-0 ' + (tab === k ? 'bg-ink text-ivory' : 'hover:bg-black/5')}>{l}</button>)}
          </div>
          <label className="relative md:ml-auto md:w-72">
            <Search size={15} strokeWidth={1.4} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order, name or email" className={input + ' pl-9'} aria-label="Search orders" />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] min-w-[760px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[.14em] text-charcoal/50 border-b border-black/[.06]">
                <th className="py-3 pl-5 pr-3 font-medium">Order</th><th className="py-3 px-3 font-medium">Date</th><th className="py-3 px-3 font-medium">Customer</th><th className="py-3 px-3 font-medium">Items</th><th className="py-3 px-3 font-medium">Status</th><th className="py-3 px-3 font-medium">Tracking</th><th className="py-3 pr-5 pl-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[.06]">
              {list.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAF8F5] cursor-pointer" onClick={() => { location.hash = 'admin-order-' + o.id; }}>
                  <td className="py-3.5 pl-5 pr-3 font-medium"><a href={'#admin-order-' + o.id}>{o.id}</a>{o.stripeSession && <span className="ml-2 text-[10.5px] text-charcoal/45">card</span>}</td>
                  <td className="py-3.5 px-3 text-charcoal/70">{niceDate(o.date, { day: 'numeric', month: 'short' })}</td>
                  <td className="py-3.5 px-3">{o.name || <span className="text-charcoal/50">Guest</span>}</td>
                  <td className="py-3.5 px-3 text-charcoal/70">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="py-3.5 px-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3.5 px-3 text-charcoal/70">{o.tracking ? `${carrierById(o.tracking.carrier)?.name}` : '—'}</td>
                  <td className="py-3.5 pr-5 pl-3 text-right tabular-nums">{euro(o.total)}</td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-charcoal/55">No orders here.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function OrderDetail({ id }) {
  const { orders, updateOrder, notify } = useStore();
  const o = orders.find((x) => x.id === id);
  const [f, setF] = useState(() => ({
    status: o?.status || 'confirmed', carrier: o?.tracking?.carrier || 'dhl', code: o?.tracking?.code || '', eta: o?.eta || '', note: o?.note || '',
  }));
  if (!o) return <p>Order not found. <a href="#admin-orders" className="underline">Back to orders</a></p>;
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const needsTracking = statusIndex(f.status) >= 2 && !f.code.trim();
  const save = (e) => {
    e?.preventDefault();
    updateOrder(o.id, (cur) => {
      const history = [...(cur.history || [])];
      const target = statusIndex(f.status);
      // record every step up to the new status that hasn't happened yet
      STATUSES.slice(0, target + 1).forEach((s) => { if (!history.some((h) => h.status === s.id)) history.push({ status: s.id, at: new Date().toISOString() }); });
      return {
        status: f.status,
        history: history.filter((h) => statusIndex(h.status) <= target),
        tracking: f.code.trim() ? { carrier: f.carrier, code: f.code.trim() } : null,
        eta: f.eta || cur.eta,
        note: f.note.trim(),
      };
    });
    notify(`Order ${o.id} updated`);
  };
  const next = STATUSES[statusIndex(o.status) + 1];
  return (
    <form onSubmit={save}>
      <a href="#admin-orders" className="inline-flex items-center gap-2 text-[12.5px] text-charcoal/60 hover:text-ink mb-4"><ArrowLeft size={14} strokeWidth={1.4} />Orders</a>
      <H1 actions={<><a href={'#order-' + o.id} className="btn-outline h-10 px-4 text-[10px]"><Eye size={13} strokeWidth={1.4} />Customer view</a><button className="btn-dark h-10 px-5 text-[10px]">Save changes</button></>}>
        Order {o.id}
      </H1>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium text-[14px]">Fulfilment</p>
              <StatusBadge status={o.status} />
            </div>
            {next && (
              <button type="button" onClick={() => set('status', next.id)} className={'mt-4 w-full h-11 border text-[13px] transition-colors ' + (f.status === next.id ? 'border-ink bg-[#FAF8F5]' : 'border-dashed border-charcoal/30 hover:border-ink')}>
                {f.status === next.id ? `Will be marked "${next.short}" when you save` : `Mark as ${next.short.toLowerCase()}`}
              </button>
            )}
            <div className="mt-5 grid sm:grid-cols-2 gap-5">
              <label className="block"><span className={label}>Status</span>
                <select className={input} value={f.status} onChange={(e) => set('status', e.target.value)}>{STATUSES.map((s) => <option key={s.id} value={s.id}>{s.short}</option>)}</select>
              </label>
              <label className="block"><span className={label}>Estimated delivery</span><input type="date" className={input} value={f.eta} onChange={(e) => set('eta', e.target.value)} /></label>
              <label className="block"><span className={label}>Carrier</span>
                <select className={input} value={f.carrier} onChange={(e) => set('carrier', e.target.value)}>{CARRIERS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              </label>
              <label className="block"><span className={label}>Tracking number</span><input className={input + ' font-mono'} value={f.code} onChange={(e) => set('code', e.target.value)} placeholder="e.g. 1Z999AA10123456784" /></label>
            </div>
            {needsTracking && <p className="mt-3 text-[12.5px] text-[#8E5B12] flex gap-2"><AlertCircle size={14} className="mt-0.5 shrink-0" />Shipped orders usually have a tracking number, so the customer can follow the parcel.</p>}
            <label className="block mt-5"><span className={label}>Note to customer (shown on their order page)</span><textarea rows={2} className={input + ' h-auto py-2.5'} value={f.note} onChange={(e) => set('note', e.target.value)} placeholder="Optional" /></label>
          </Card>
          <Card>
            <p className="px-6 h-14 flex items-center font-medium text-[14px] border-b border-black/[.06]">Items</p>
            <ul className="divide-y divide-black/[.06]">
              {o.items.map((it, k) => {
                const p = getProduct(it.id);
                return (
                  <li key={k} className="px-6 py-4 flex items-center gap-4">
                    {p ? <ProductImage product={p} colorIndex={Math.min(it.colorIndex, p.colors.length - 1)} className="w-12 aspect-[4/5] shrink-0" /> : <div className="w-12 aspect-[4/5] bg-black/5" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px]">{p?.name || it.id}</p>
                      <p className="text-[12px] text-charcoal/55">{p?.colors[Math.min(it.colorIndex, p.colors.length - 1)]?.name} · {it.size} · Qty {it.qty}</p>
                    </div>
                    <p className="text-[13.5px] tabular-nums">{euro(it.price * it.qty)}</p>
                  </li>
                );
              })}
            </ul>
            <div className="px-6 py-4 border-t border-black/[.06] flex justify-between font-medium"><span>Total</span><span className="tabular-nums">{euro(o.total)}</span></div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-6 text-[13.5px] space-y-1">
            <p className="font-medium text-[14px] mb-3">Customer</p>
            <p>{o.name || 'Guest'}</p>
            {o.email && <p className="text-charcoal/65">{o.email}</p>}
            <p className="text-charcoal/65 pt-2">{o.address}</p>
            <p className="text-charcoal/50 pt-3 text-[12px]">Placed {new Date(o.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}{o.stripeSession ? ' · paid by card (test)' : ''}</p>
          </Card>
          <Card className="p-6">
            <p className="font-medium text-[14px] mb-5">Timeline</p>
            <OrderTimeline order={o} compact />
          </Card>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
export default function AdminApp({ route }) {
  const [authed, setAuthed] = useState(isAuthed);
  if (!authed) return <Login onIn={() => setAuthed(true)} />;
  const out = () => { try { sessionStorage.removeItem(SESSION); } catch { /* ignore */ } setAuthed(false); location.hash = 'home'; };
  let page;
  if (route === 'admin') page = <Dashboard />;
  else if (route === 'admin-products') page = <Products />;
  else if (route === 'admin-new') page = <ProductForm key="new" />;
  else if (route.startsWith('admin-product-')) page = <ProductForm key={route} id={route.slice(14)} />;
  else if (route === 'admin-orders') page = <Orders />;
  else if (route.startsWith('admin-order-')) page = <OrderDetail key={route} id={route.slice(12)} />;
  else page = <Dashboard />;
  return <Shell route={route} onOut={out}><div key={route} className="page-in">{page}</div></Shell>;
}
