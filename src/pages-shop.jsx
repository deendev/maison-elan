import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, Heart, Truck, RotateCcw, Ruler, ArrowLeft, ArrowRight, Plus, Minus, ShieldCheck, Lock } from 'lucide-react';
import { STRIPE_LINKS, stripeUrl } from './stripe.js';
import { useStore, Reveal, useLockScroll, useEsc } from './store.jsx';
import { PRODUCTS, COLLECTIONS, CATEGORIES, FREE_SHIPPING, euro, getProduct } from './data.js';
import { Scene, ProductImage } from './art.jsx';
import { ProductCard, Breadcrumbs, Swatches, SizePicker, QtyStepper } from './components.jsx';

/* ------------------------------------------------------------------ */
/* Route → listing config                                               */
/* ------------------------------------------------------------------ */
export function listingFor(route) {
  const cats = CATEGORIES.map((c) => c.id);
  let base = 'shop', cat = null;
  const m = route.match(/^(shop|women|men)-(.+)$/);
  if (m && cats.includes(m[2])) { base = m[1]; cat = m[2]; }
  else if (['shop', 'women', 'men', 'new-arrivals', 'essentials', 'accessories'].includes(route)) base = route;
  else return null;
  const col = COLLECTIONS.find((c) => c.id === base);
  let cfg;
  if (col) cfg = { title: col.title, eyebrow: col.eyebrow, text: col.banner, scene: col.scene, filter: col.filter };
  else if (base === 'new-arrivals') cfg = { title: 'New Arrivals', eyebrow: 'Autumn–Winter 2026', text: 'The newest pieces from the atelier, arriving weekly through the season.', scene: 'hero', filter: (p) => p.isNew };
  else cfg = { title: 'The Collection', eyebrow: 'All Ready-to-Wear & Accessories', text: 'Every piece in the current collection, for women and men.', scene: 'atelier', filter: () => true };
  return { ...cfg, base, cat };
}

const PRICE_RANGES = [
  ['u150', 'Under €150', (p) => p.price < 150],
  ['150-250', '€150 – €250', (p) => p.price >= 150 && p.price <= 250],
  ['250-350', '€250 – €350', (p) => p.price > 250 && p.price <= 350],
  ['o350', 'Over €350', (p) => p.price > 350],
];
const FAMILIES = [
  ['Neutral', '#E4D9C3'], ['Black', '#1B1A19'], ['Grey', '#8E8C89'], ['Brown', '#8A5532'], ['Blue', '#283040'], ['Green', '#99A08B'],
];
const SIZE_OPTS = ['XS', 'S', 'M', 'L', 'XL', 'One Size', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const SORTS = [['featured', 'Most popular'], ['newest', 'Newest'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low']];

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-charcoal/10 py-5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between eyebrow" aria-expanded={open}>
        {title}<ChevronDown size={15} strokeWidth={1.2} className={'transition-transform duration-500 ' + (open ? 'rotate-180' : '')} />
      </button>
      <div className={'grid transition-all duration-500 ease-lux ' + (open ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function Check({ checked, onChange, label, count }) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer text-[13.5px] group">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <span className={'h-4 w-4 border grid place-items-center transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 ' + (checked ? 'bg-ink border-ink' : 'border-charcoal/30 group-hover:border-ink')}>
        {checked && <svg viewBox="0 0 12 12" className="h-2.5 w-2.5"><path d="M2 6.5 L5 9 L10 3" stroke="#F5F1EA" strokeWidth="1.6" fill="none" /></svg>}
      </span>
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-[12px] text-charcoal/40">{count}</span>}
    </label>
  );
}

function Filters({ f, setF, scoped }) {
  const tog = (k, v) => setF((o) => ({ ...o, [k]: o[k].includes(v) ? o[k].filter((x) => x !== v) : [...o[k], v] }));
  const pool = f.cat.length ? scoped.filter((p) => f.cat.includes(p.category)) : scoped;
  const availSizes = SIZE_OPTS.filter((s) => pool.some((p) => p.sizes.includes(s)));
  return (
    <div>
      <FilterGroup title="Category">
        {CATEGORIES.map((c) => {
          const n = scoped.filter((p) => p.category === c.id).length;
          if (!n) return null;
          return <Check key={c.id} label={c.name} count={n} checked={f.cat.includes(c.id)} onChange={() => tog('cat', c.id)} />;
        })}
      </FilterGroup>
      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {availSizes.map((s) => (
            <button key={s} onClick={() => tog('size', s)} aria-pressed={f.size.includes(s)} className={'chip ' + (f.size.includes(s) ? 'bg-ink text-ivory border-ink' : 'border-charcoal/20 hover:border-ink')}>{s}</button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Colour">
        <div className="grid grid-cols-2 gap-x-3">
          {FAMILIES.map(([fam, hex]) => {
            const n = scoped.filter((p) => p.colors.some((c) => c.family === fam)).length;
            if (!n) return null;
            const on = f.color.includes(fam);
            return (
              <button key={fam} onClick={() => tog('color', fam)} aria-pressed={on} className="flex items-center gap-3 py-2 text-[13.5px] text-left">
                <span className={'rounded-full p-[3px] border ' + (on ? 'border-ink' : 'border-transparent')}><span className="block h-5 w-5 rounded-full border border-black/10" style={{ background: hex }} /></span>
                <span className={on ? 'underline underline-offset-4' : ''}>{fam}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        {PRICE_RANGES.map(([k, l, fn]) => <Check key={k} label={l} count={scoped.filter(fn).length} checked={f.price.includes(k)} onChange={() => tog('price', k)} />)}
      </FilterGroup>
    </div>
  );
}

const EMPTY = { cat: [], size: [], color: [], price: [] };

export function ShopPage({ route }) {
  const cfg = listingFor(route);
  const [f, setF] = useState({ ...EMPTY, cat: cfg.cat ? [cfg.cat] : [] });
  const [sort, setSort] = useState('featured');
  const [sheet, setSheet] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  useLockScroll(sheet);
  useEsc(() => setSheet(false), sheet);
  useEffect(() => { setF({ ...EMPTY, cat: cfg.cat ? [cfg.cat] : [] }); }, [route]);

  const scoped = useMemo(() => PRODUCTS.filter(cfg.filter), [route]);
  const results = useMemo(() => {
    let r = scoped.filter((p) =>
      (!f.cat.length || f.cat.includes(p.category)) &&
      (!f.size.length || p.sizes.some((s) => f.size.includes(s))) &&
      (!f.color.length || p.colors.some((c) => f.color.includes(c.family))) &&
      (!f.price.length || PRICE_RANGES.some(([k, , fn]) => f.price.includes(k) && fn(p)))
    );
    const by = { featured: (a, b) => b.popularity - a.popularity, newest: (a, b) => b.added - a.added, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price }[sort];
    return [...r].sort(by);
  }, [scoped, f, sort]);

  const chips = [
    ...f.cat.map((v) => ['cat', v, CATEGORIES.find((c) => c.id === v)?.name]),
    ...f.size.map((v) => ['size', v, 'Size ' + v]),
    ...f.color.map((v) => ['color', v, v]),
    ...f.price.map((v) => ['price', v, PRICE_RANGES.find((p) => p[0] === v)[1]]),
  ];
  const nActive = chips.length;
  const catTitle = cfg.cat ? CATEGORIES.find((c) => c.id === cfg.cat)?.name : null;
  const tabsBase = cfg.base === 'shop' ? 'shop' : ['women', 'men'].includes(cfg.base) ? cfg.base : null;

  return (
    <div className="page-in">
      {/* Banner */}
      <section className="relative h-[46svh] min-h-[340px] md:h-[56vh] md:min-h-[460px] overflow-hidden bg-ink text-ivory">
        <div className="absolute inset-0 slow-zoom"><Scene name={cfg.scene} className="h-full w-full" alt={cfg.title} priority /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/10" />
        <div className="relative h-full mx-auto max-w-[1600px] px-5 md:px-10 flex flex-col justify-end pb-10 md:pb-14">
          <p className="eyebrow text-ivory/75">{cfg.eyebrow}</p>
          <h1 className="display text-[48px] sm:text-[72px] lg:text-[104px] mt-4">{catTitle && cfg.base !== 'shop' ? <>{cfg.title.replace(/^The /, '')} <em>· {catTitle}</em></> : catTitle || cfg.title}</h1>
          <p className="mt-4 max-w-[520px] text-[14.5px] md:text-[16px] text-ivory/85">{cfg.text}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="pt-6"><Breadcrumbs items={[['Home', 'home'], ...(cfg.cat && cfg.base !== 'shop' ? [[cfg.title, cfg.base]] : []), [catTitle || cfg.title]]} /></div>

        {tabsBase && (
          <div className="mt-6 -mx-5 px-5 md:mx-0 md:px-0 flex gap-2 overflow-x-auto no-scrollbar">
            {[['All', tabsBase], ...CATEGORIES.map((c) => [c.name, tabsBase + '-' + c.id])].map(([l, h]) => {
              const on = route === h;
              return <a key={h} href={'#' + h} className={'shrink-0 h-10 px-5 inline-flex items-center border text-[12.5px] transition-colors ' + (on ? 'bg-ink text-ivory border-ink' : 'border-charcoal/20 hover:border-ink')}>{l}</a>;
            })}
          </div>
        )}

        {/* Toolbar */}
        <div className="sticky top-[72px] z-20 -mx-5 px-5 md:mx-0 md:px-0 mt-6 bg-ivory/95 backdrop-blur-md border-y border-charcoal/10 h-14 flex items-center justify-between gap-4">
          <button onClick={() => setSheet(true)} className="lg:hidden navlabel inline-flex items-center gap-2">
            <SlidersHorizontal size={15} strokeWidth={1.3} /> Filter {nActive > 0 && <span className="h-5 min-w-5 px-1.5 rounded-full bg-ink text-ivory text-[10px] grid place-items-center">{nActive}</span>}
          </button>
          <p className="hidden lg:block text-[13px] text-charcoal/60" aria-live="polite">{results.length} {results.length === 1 ? 'piece' : 'pieces'}</p>
          <div className="relative">
            <button onClick={() => setSortOpen(!sortOpen)} className="navlabel inline-flex items-center gap-2" aria-haspopup="listbox" aria-expanded={sortOpen}>
              <span className="hidden sm:inline text-charcoal/50">Sort by:</span> {SORTS.find((s) => s[0] === sort)[1]}
              <ChevronDown size={14} strokeWidth={1.3} className={'transition-transform ' + (sortOpen ? 'rotate-180' : '')} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <ul role="listbox" className="absolute right-0 top-[calc(100%+14px)] z-20 w-[230px] bg-ivory border border-charcoal/10 shadow-xl py-2 fade-in">
                  {SORTS.map(([k, l]) => (
                    <li key={k}>
                      <button role="option" aria-selected={sort === k} onClick={() => { setSort(k); setSortOpen(false); }} className={'w-full text-left px-5 py-3 text-[13.5px] hover:bg-cream ' + (sort === k ? 'font-semibold' : '')}>{l}</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-14 pt-6 lg:pt-8 min-h-[70vh] lg:min-h-[calc(100vh-150px)]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-[150px] max-h-[calc(100vh-170px)] overflow-y-auto no-scrollbar pb-8">
              <div className="flex items-center justify-between pb-2">
                <p className="font-serif text-[22px]">Refine</p>
                {nActive > 0 && <button onClick={() => setF(EMPTY)} className="text-[12px] underline underline-offset-4 text-charcoal/60 hover:text-ink">Clear all</button>}
              </div>
              <Filters f={f} setF={setF} scoped={scoped} />
            </div>
          </aside>

          <div>
            <p className="lg:hidden text-[12.5px] text-charcoal/60 mb-4">{results.length} {results.length === 1 ? 'piece' : 'pieces'}</p>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {chips.map(([k, v, l]) => (
                  <button key={k + v} onClick={() => setF((o) => ({ ...o, [k]: o[k].filter((x) => x !== v) }))} className="h-9 pl-4 pr-3 inline-flex items-center gap-2 bg-cream text-[12.5px] hover:bg-sand transition-colors">
                    {l} <X size={13} strokeWidth={1.4} />
                  </button>
                ))}
                <button onClick={() => setF(EMPTY)} className="h-9 px-3 text-[12.5px] underline underline-offset-4">Clear all</button>
              </div>
            )}
            {results.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-serif text-[30px]">No pieces match these filters.</p>
                <p className="mt-3 text-[14px] text-charcoal/60">Try removing a filter or two.</p>
                <button onClick={() => setF(EMPTY)} className="btn-outline mt-8">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-3 sm:gap-x-5 gap-y-10 md:gap-y-14">
                {results.map((p, i) => <div key={p.id} className="fade-in" style={{ animationDelay: Math.min(i, 8) * 40 + 'ms' }}><ProductCard product={p} index={i} /></div>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <div className={'fixed inset-0 z-50 lg:hidden ' + (sheet ? 'ovl open' : 'ovl pointer-events-none')} aria-hidden={!sheet}>
        <div className={'absolute inset-0 bg-ink/40 transition-opacity duration-500 ' + (sheet ? 'opacity-100' : 'opacity-0')} onClick={() => setSheet(false)} />
        <div role="dialog" aria-label="Filters" className={'absolute inset-x-0 bottom-0 top-[8dvh] bg-ivory rounded-t-[18px] flex flex-col transition-transform duration-500 ease-lux ' + (sheet ? 'translate-y-0' : 'translate-y-full')}>
          <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-charcoal/20" />
          <div className="h-14 px-5 flex items-center justify-between border-b border-charcoal/10">
            <p className="font-serif text-[22px]">Filter</p>
            <button onClick={() => setSheet(false)} aria-label="Close filters" className="p-2 -mr-2"><X size={20} strokeWidth={1.4} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5"><Filters f={f} setF={setF} scoped={scoped} /></div>
          <div className="px-5 py-4 pb-safe border-t border-charcoal/10 grid grid-cols-[auto_1fr] gap-3">
            <button onClick={() => setF(EMPTY)} className="btn-outline px-6">Clear</button>
            <button onClick={() => setSheet(false)} className="btn-dark">Show {results.length} {results.length === 1 ? 'piece' : 'pieces'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product detail                                                       */
/* ------------------------------------------------------------------ */
function Accordion({ title, children, open: initial = false }) {
  const [open, setOpen] = useState(initial);
  return (
    <div className="border-b border-charcoal/10">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left" aria-expanded={open}>
        <span className="eyebrow">{title}</span>
        {open ? <Minus size={15} strokeWidth={1.3} /> : <Plus size={15} strokeWidth={1.3} />}
      </button>
      <div className={'grid transition-all duration-500 ease-lux ' + (open ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden text-[14px] leading-[1.75] text-charcoal/80">{children}</div>
      </div>
    </div>
  );
}

export function ProductPage({ id }) {
  const p = getProduct(id);
  const { addToBag, toggleWish, isWished, setSizeGuide } = useStore();
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(p && p.sizes.length === 1 ? p.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState(false);
  const [slide, setSlide] = useState(0);
  const [zoom, setZoom] = useState(null);
  useEffect(() => { setColor(0); setSize(p && p.sizes.length === 1 ? p.sizes[0] : null); setQty(1); setErr(false); setSlide(0); }, [id]);
  useLockScroll(zoom != null);
  useEsc(() => setZoom(null), zoom != null);

  if (!p) return <NotFound />;
  const wished = isWished(p.id);
  const views = ['front', 'detail', 'studio', 'stone'];
  const scene = p.gender === 'men' ? 'men' : p.category === 'accessories' ? 'accessories' : 'women';
  const related = PRODUCTS.filter((x) => x.id !== p.id && (x.category === p.category || x.gender === p.gender)).sort((a, b) => (b.category === p.category) - (a.category === p.category) || b.popularity - a.popularity).slice(0, 4);
  const add = () => {
    if (!size) { setErr(true); document.getElementById('size-label')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    addToBag(p.id, color, size, qty);
  };
  const buyNow = () => {
    const url = stripeUrl(p.id, { size, color: p.colors[color].name });
    try { localStorage.setItem('elan:pending', JSON.stringify({ key: `${p.id}|${color}|${size}`, id: p.id, colorIndex: color, size, qty, price: p.price, at: Date.now() })); } catch { /* ignore */ }
    window.location.assign(url);
  };
  const crumbsCol = p.gender === 'men' ? ['Men', 'men'] : p.gender === 'women' ? ['Women', 'women'] : ['Accessories', 'accessories'];
  const catName = CATEGORIES.find((c) => c.id === p.category).name;

  const gallery = (
    <>
      {/* Mobile: swipe gallery */}
      <div className="md:hidden relative -mx-5">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
          onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        >
          {views.map((v, i) => (
            <button key={v} onClick={() => setZoom(i)} className="snap-center shrink-0 w-full" aria-label={`Enlarge image ${i + 1}`}>
              <ProductImage product={p} colorIndex={color} variant={v} className="aspect-[4/5]" />
            </button>
          ))}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {views.map((v, i) => <span key={v} className={'h-[3px] transition-all duration-500 ' + (slide === i ? 'w-6 bg-ink' : 'w-3 bg-ink/25')} />)}
        </div>
        <button onClick={() => toggleWish(p.id)} aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={wished} className="absolute top-4 right-4 h-11 w-11 rounded-full bg-ivory/80 grid place-items-center">
          <Heart size={18} strokeWidth={1.3} className={wished ? 'fill-ink' : ''} />
        </button>
      </div>
      {/* Desktop: editorial grid */}
      <div className="hidden md:grid grid-cols-2 gap-2">
        {views.map((v, i) => (
          <button key={v} onClick={() => setZoom(i)} className={'cursor-zoom-in overflow-hidden ' + (i === 0 ? 'col-span-2' : '')} aria-label={`Enlarge image ${i + 1}`}>
            <ProductImage product={p} colorIndex={color} variant={v} className={(i === 0 ? 'aspect-[5/6]' : 'aspect-[4/5]') + ' transition-transform duration-[1200ms] ease-lux hover:scale-[1.03]'} />
          </button>
        ))}
        <div className="col-span-2"><Scene name={scene} className="aspect-[16/10]" alt={`${p.name} styled in the Autumn–Winter 2026 campaign`} /></div>
      </div>
    </>
  );

  return (
    <div className="page-in">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 pt-4 md:pt-8 pb-28 md:pb-0">
        <div className="hidden md:block mb-6"><Breadcrumbs items={[['Home', 'home'], crumbsCol, [catName, (p.gender === 'unisex' ? 'shop' : crumbsCol[1]) + '-' + p.category], [p.name]]} /></div>
        <div className="md:grid md:grid-cols-[1.25fr_1fr] lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-20">
          {gallery}
          <div className="pt-7 md:pt-0">
            <div className="md:sticky md:top-[100px]">
              <div className="flex items-start justify-between gap-6">
                <div>
                  {p.isNew && <p className="eyebrow text-taupe mb-3">New Season</p>}
                  <h1 className="font-serif text-[34px] md:text-[44px] leading-[1.02]">{p.name}</h1>
                </div>
                <button onClick={() => toggleWish(p.id)} aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={wished} className="hidden md:grid h-11 w-11 shrink-0 place-items-center border border-charcoal/20 hover:border-ink transition-colors">
                  <Heart size={18} strokeWidth={1.3} className={wished ? 'fill-ink' : ''} />
                </button>
              </div>
              <p className="mt-4 text-[18px] tabular-nums">{euro(p.price)}</p>
              <p className="mt-1 text-[12px] text-charcoal/55">Taxes included. {p.price >= FREE_SHIPPING ? 'Ships complimentary.' : `Free shipping on orders over ${euro(FREE_SHIPPING)}.`}</p>
              <p className="mt-6 text-[14.5px] leading-[1.75] text-charcoal/80">{p.description}</p>

              <div className="mt-8">
                <p className="eyebrow">Colour <span className="normal-case tracking-normal text-[13px] text-charcoal/60 ml-2">{p.colors[color].name}</span></p>
                <div className="mt-3 -ml-[3px]"><Swatches product={p} value={color} onChange={setColor} size="lg" /></div>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <p id="size-label" className={'eyebrow ' + (err ? 'text-[#9b3b2b]' : '')}>{err ? 'Please select a size' : 'Size'}{size && p.sizes.length > 1 && <span className="normal-case tracking-normal text-[13px] text-charcoal/60 ml-2">{size}</span>}</p>
                  {p.sizes.length > 1 && <button onClick={() => setSizeGuide(true)} className="inline-flex items-center gap-2 text-[12px] underline underline-offset-4"><Ruler size={14} strokeWidth={1.3} />Size guide</button>}
                </div>
                <div className="mt-3"><SizePicker product={p} value={size} onChange={(s) => { setSize(s); setErr(false); }} /></div>
              </div>

              <div className="mt-8 flex gap-3">
                <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, Math.min(10, v)))} />
                <button onClick={add} className="btn-dark flex-1">Add to Bag</button>
              </div>
              {STRIPE_LINKS[p.id] && (
                <button onClick={() => { if (!size) { setErr(true); document.getElementById('size-label')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; } buyNow(); }} className="mt-3 btn w-full bg-[#635BFF] text-white hover:bg-[#5248e6]">
                  <Lock size={14} strokeWidth={1.5} /> Buy now with Stripe <span className="opacity-70 normal-case tracking-normal">(test)</span>
                </button>
              )}
              <button onClick={() => toggleWish(p.id)} className="mt-3 btn-outline w-full" aria-pressed={wished}>
                <Heart size={15} strokeWidth={1.3} className={wished ? 'fill-current' : ''} /> {wished ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>

              <ul className="mt-8 space-y-3 text-[13px] text-charcoal/75">
                <li className="flex items-center gap-3"><Truck size={16} strokeWidth={1.2} />Standard delivery in 2–4 working days. Express next day.</li>
                <li className="flex items-center gap-3"><RotateCcw size={16} strokeWidth={1.2} />Free returns and exchanges within 30 days.</li>
                <li className="flex items-center gap-3"><ShieldCheck size={16} strokeWidth={1.2} />{p.origin}. Traceable materials.</li>
              </ul>

              <div className="mt-8 border-t border-charcoal/10">
                <Accordion title="Product Details" open>
                  <ul className="list-disc pl-5 space-y-1">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>
                </Accordion>
                <Accordion title="Materials & Care">
                  <p><strong className="font-medium text-ink">Composition:</strong> {p.material}</p>
                  <p className="mt-2"><strong className="font-medium text-ink">Care:</strong> {p.care}</p>
                  <p className="mt-2"><strong className="font-medium text-ink">Origin:</strong> {p.origin}</p>
                </Accordion>
                <Accordion title="Delivery & Returns">
                  <p>Complimentary standard delivery on orders over {euro(FREE_SHIPPING)}; otherwise €9. Express next-day delivery is €18 when ordered before 14:00 CET.</p>
                  <p className="mt-2">Return unworn items within 30 days for a full refund. <a href="#help-returns" className="underline underline-offset-4">Read the full policy</a>.</p>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You may also like */}
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pt-20 md:pt-32" aria-labelledby="ymal">
        <div className="flex items-end justify-between">
          <h2 id="ymal" className="display text-[36px] md:text-[56px]">You May <em>Also Like</em></h2>
          <a href={'#shop-' + p.category} className="hidden sm:inline-flex navlabel items-center gap-2 hover:gap-3 transition-all pb-2">Shop {catName} <ArrowRight size={14} strokeWidth={1.3} /></a>
        </div>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-10">
          {related.map((r) => <ProductCard key={r.id} product={r} />)}
        </div>
      </section>

      {/* Mobile sticky add bar */}
      <div className="md:hidden fixed inset-x-0 bottom-[60px] z-20 bg-ivory/95 backdrop-blur-md border-t border-charcoal/10 px-4 py-3 flex items-center gap-3 pb-safe" style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] truncate">{p.name}</p>
          <p className="text-[12px] text-charcoal/60">{euro(p.price)} · {p.colors[color].name}{size ? ' · ' + size : ''}</p>
        </div>
        <button onClick={add} className="btn-dark px-6 h-11">{size ? 'Add to Bag' : 'Select Size'}</button>
      </div>

      {/* Zoom viewer */}
      {zoom != null && (
        <div className="fixed inset-0 z-[60] bg-ivory fade-in" role="dialog" aria-label="Image viewer">
          <ProductImage product={p} colorIndex={color} variant={views[zoom]} className="absolute inset-0" />
          <button onClick={() => setZoom(null)} aria-label="Close viewer" className="absolute top-4 right-4 h-12 w-12 rounded-full bg-ivory/90 grid place-items-center"><X size={20} strokeWidth={1.3} /></button>
          <button onClick={() => setZoom((zoom + views.length - 1) % views.length)} aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-ivory/90 grid place-items-center"><ArrowLeft size={18} strokeWidth={1.3} /></button>
          <button onClick={() => setZoom((zoom + 1) % views.length)} aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-ivory/90 grid place-items-center"><ArrowRight size={18} strokeWidth={1.3} /></button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 eyebrow bg-ivory/90 px-4 py-2">{zoom + 1} / {views.length}</p>
        </div>
      )}
    </div>
  );
}

export function NotFound() {
  return (
    <div className="page-in mx-auto max-w-[900px] px-5 py-32 md:py-48 text-center">
      <p className="eyebrow text-taupe">Page not found</p>
      <h1 className="display text-[56px] md:text-[96px] mt-5">Lost, <em>elegantly.</em></h1>
      <p className="mt-6 text-[15px] text-charcoal/70">The page you were looking for has moved or no longer exists.</p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3"><a href="#home" className="btn-dark">Return Home</a><a href="#new-arrivals" className="btn-outline">Shop New Arrivals</a></div>
    </div>
  );
}
