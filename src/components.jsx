import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, User, Heart, ShoppingBag, Menu, X, Plus, Minus, ArrowRight, ChevronDown, Home, LayoutGrid, Truck, Check,
} from 'lucide-react';
import { useStore, useLockScroll, useEsc } from './store.jsx';
import { PRODUCTS, CATEGORIES, COLLECTIONS, SIZE_TABLE, FREE_SHIPPING, euro, getProduct } from './data.js';
import { ProductImage, Scene } from './art.jsx';

/* ------------------------------------------------------------------ */
export function Logo({ className = '' }) {
  return (
    <span className={'font-serif text-[21px] md:text-[23px] tracking-[0.22em] leading-none whitespace-nowrap ' + className}>
      MAISON ÉLAN
    </span>
  );
}

/* ------------------------------------------------------------------ */
export function AnnouncementBar() {
  const msgs = [
    'Complimentary Shipping on Orders Over €150',
    'Now Live: The Autumn–Winter 2026 Collection',
    'Free 30-Day Returns & Exchanges',
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % msgs.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-ink text-ivory h-9 flex items-center justify-center relative overflow-hidden">
      {msgs.map((m, k) => (
        <a
          key={m}
          href={k === 1 ? '#new-arrivals' : k === 2 ? '#help-returns' : '#help-shipping'}
          className={'absolute eyebrow text-[10px] md:text-[10.5px] transition-all duration-700 ease-lux hover:text-taupe ' + (k === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none')}
          tabIndex={k === i ? 0 : -1}
        >
          {m}
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
const MEGA = {
  women: {
    cols: [
      ['Clothing', [['All Women', 'women'], ['New Arrivals', 'new-arrivals'], ['Knitwear', 'women-knitwear'], ['Outerwear', 'women-outerwear'], ['Dresses & Skirts', 'women-dresses'], ['Shirts & Blouses', 'women-shirts'], ['Trousers', 'women-trousers']]],
      ['Accessories', [['Handbags', 'women-accessories'], ['Shoes', 'accessories'], ['Scarves & Small Leather', 'accessories']]],
      ['Edits', [["The Women's Edit", 'women'], ['Contemporary Essentials', 'essentials'], ['Building a Timeless Wardrobe', 'journal-building-a-timeless-wardrobe']]],
    ],
    feature: { scene: 'women', title: "The Women's Edit", href: 'women' },
  },
  men: {
    cols: [
      ['Clothing', [['All Men', 'men'], ['New Arrivals', 'new-arrivals'], ['Knitwear', 'men-knitwear'], ['Outerwear & Blazers', 'men-outerwear'], ['Shirts', 'men-shirts'], ['Trousers', 'men-trousers']]],
      ['Accessories', [['Shoes', 'men-accessories'], ['Belts & Card Holders', 'accessories'], ['Scarves', 'accessories']]],
      ['Edits', [["The Men's Edit", 'men'], ['Contemporary Essentials', 'essentials'], ['The Details That Define Luxury', 'journal-the-details-that-define-luxury']]],
    ],
    feature: { scene: 'men', title: "The Men's Edit", href: 'men' },
  },
  collections: {
    cols: [
      ['Collections', COLLECTIONS.map((c) => [c.title, c.id])],
      ['Shop by Category', CATEGORIES.map((c) => [c.name, 'shop-' + c.id])],
      ['The House', [['Our Story', 'story'], ['The Campaign', 'campaign'], ['Journal', 'journal']]],
    ],
    feature: { scene: 'essentials', title: 'Contemporary Essentials', href: 'essentials' },
  },
  accessories: {
    cols: [
      ['Leather Goods', [['All Accessories', 'accessories'], ['Handbags & Totes', 'accessories'], ['Card Holders', 'product-leather-card-holder'], ['Belts', 'product-leather-belt']]],
      ['Shoes', [['Leather Minimal Sneakers', 'product-leather-minimal-sneakers'], ['Suede Penny Loafers', 'product-suede-loafers']]],
      ['Gifting', [['Cashmere Scarf', 'product-cashmere-scarf'], ['Structured Leather Handbag', 'product-structured-leather-handbag']]],
    ],
    feature: { scene: 'accessories', title: 'The Leather Atelier', href: 'accessories' },
  },
};
const NAV = [
  ['Women', 'women', 'women'],
  ['Men', 'men', 'men'],
  ['New Arrivals', 'new-arrivals'],
  ['Collections', 'collections', 'collections'],
  ['Accessories', 'accessories', 'accessories'],
  ['Journal', 'journal'],
];

export function Header() {
  const { route, count, wish, setBagOpen, setSearchOpen, setMenuOpen, account } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(null);
  const closeT = useRef();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setMega(null), [route]);
  const overHero = route === 'home' && !scrolled && !mega;
  const open = (k) => { clearTimeout(closeT.current); setMega(k); };
  const close = () => { closeT.current = setTimeout(() => setMega(null), 120); };
  const active = (href) => route === href || route.startsWith(href + '-');

  return (
    <header
      className={'sticky top-0 z-40 transition-colors duration-500 ease-lux ' + (overHero ? 'bg-transparent text-ivory' : 'bg-ivory/95 backdrop-blur-md text-ink border-b border-charcoal/10')}
      style={route === 'home' ? { marginBottom: '-72px' } : undefined}
      onMouseLeave={close}
    >
      <div className="mx-auto max-w-[1600px] h-[72px] px-5 md:px-10 grid grid-cols-[1fr_auto_1fr] lg:grid-cols-[auto_1fr_auto] items-center gap-6">
        <div className="flex items-center gap-4 lg:hidden">
          <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="-ml-2 p-2"><Menu size={20} strokeWidth={1.4} /></button>
          <button aria-label="Search" onClick={() => setSearchOpen(true)} className="p-2 md:hidden"><Search size={19} strokeWidth={1.4} /></button>
        </div>
        <a href="#home" aria-label="MAISON ÉLAN home" className="justify-self-center lg:justify-self-start"><Logo /></a>
        <nav aria-label="Main" className="hidden lg:flex justify-center gap-9 xl:gap-11">
          {NAV.map(([label, href, m]) => (
            <div key={label} onMouseEnter={() => (m ? open(m) : setMega(null))} onFocus={() => m && open(m)}>
              <a href={'#' + href} className="navlabel link-u py-6 inline-flex items-center gap-1" aria-current={active(href) ? 'page' : undefined} aria-haspopup={m ? 'true' : undefined} aria-expanded={m ? mega === m : undefined}>
                {label}
              </a>
            </div>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-1 md:gap-2">
          <button aria-label="Search" onClick={() => setSearchOpen(true)} className="hidden md:inline-flex p-2 hover:opacity-60 transition-opacity"><Search size={19} strokeWidth={1.4} /></button>
          <a href="#account" aria-label={account ? 'Your account' : 'Sign in'} className="hidden md:inline-flex p-2 hover:opacity-60 transition-opacity"><User size={19} strokeWidth={1.4} /></a>
          <a href="#wishlist" aria-label={`Wishlist, ${wish.length} items`} className="relative hidden md:inline-flex p-2 hover:opacity-60 transition-opacity">
            <Heart size={19} strokeWidth={1.4} />
            {wish.length > 0 && <span className="absolute top-1 right-0.5 h-1.5 w-1.5 rounded-full bg-current" />}
          </a>
          <button aria-label={`Shopping bag, ${count} items`} onClick={() => setBagOpen(true)} className="relative p-2 -mr-2 hover:opacity-60 transition-opacity">
            <ShoppingBag size={19} strokeWidth={1.4} />
            <span key={count} className={'absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full text-[9.5px] font-semibold grid place-items-center fade-in ' + (overHero ? 'bg-ivory text-ink' : 'bg-ink text-ivory')}>
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* Mega menu */}
      <div
        className={'absolute inset-x-0 top-full hidden lg:block bg-ivory text-ink border-b border-charcoal/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,.18)] transition-all duration-500 ease-lux origin-top ' + (mega ? 'opacity-100 visible' : 'opacity-0 invisible -translate-y-2')}
        onMouseEnter={() => clearTimeout(closeT.current)}
        onMouseLeave={close}
      >
        {mega && (
          <div key={mega} className="mx-auto max-w-[1600px] px-10 py-12 grid grid-cols-[1fr_1fr_1fr_1.25fr] gap-12 fade-in">
            {MEGA[mega].cols.map(([h, links]) => (
              <div key={h}>
                <p className="eyebrow text-taupe mb-6">{h}</p>
                <ul className="space-y-3.5">
                  {links.map(([l, href]) => (
                    <li key={l}><a href={'#' + href} className="font-serif text-[19px] hover:italic transition-all">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
            <a href={'#' + MEGA[mega].feature.href} className="group block">
              <Scene name={MEGA[mega].feature.scene} className="aspect-[16/10]" alt={MEGA[mega].feature.title} />
              <div className="mt-4 flex items-center justify-between">
                <span className="font-serif text-xl">{MEGA[mega].feature.title}</span>
                <span className="navlabel inline-flex items-center gap-2 group-hover:gap-3 transition-all">Shop <ArrowRight size={14} strokeWidth={1.3} /></span>
              </div>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
export function MobileMenu() {
  const { menuOpen, setMenuOpen, setSearchOpen, account, wish } = useStore();
  const [openSec, setOpenSec] = useState('women');
  useLockScroll(menuOpen);
  useEsc(() => setMenuOpen(false), menuOpen);
  return (
    <div className={'fixed inset-0 z-50 lg:hidden ' + (menuOpen ? 'ovl open' : 'ovl pointer-events-none')} aria-hidden={!menuOpen}>
      <div className={'absolute inset-0 bg-ink/40 transition-opacity duration-500 ' + (menuOpen ? 'opacity-100' : 'opacity-0')} onClick={() => setMenuOpen(false)} />
      <aside
        className={'absolute inset-y-0 left-0 w-[88%] max-w-[420px] bg-ivory flex flex-col transition-transform duration-500 ease-lux ' + (menuOpen ? 'translate-x-0' : '-translate-x-full')}
        aria-label="Menu"
      >
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-charcoal/10">
          <Logo className="text-[18px]" />
          <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="p-2 -mr-2"><X size={20} strokeWidth={1.4} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <button onClick={() => { setMenuOpen(false); setSearchOpen(true); }} className="mx-5 mt-5 w-[calc(100%-2.5rem)] h-12 px-4 flex items-center gap-3 bg-cream/70 text-charcoal/60 text-sm">
            <Search size={16} strokeWidth={1.4} /> Search the collection
          </button>
          <nav className="px-5 py-4" aria-label="Mobile">
            {['women', 'men'].map((k) => (
              <div key={k} className="border-b border-charcoal/10">
                <button onClick={() => setOpenSec(openSec === k ? null : k)} className="w-full flex items-center justify-between py-5 font-serif text-[28px] capitalize" aria-expanded={openSec === k}>
                  {k}
                  <ChevronDown size={18} strokeWidth={1.2} className={'transition-transform duration-500 ' + (openSec === k ? 'rotate-180' : '')} />
                </button>
                <div className={'grid transition-all duration-500 ease-lux ' + (openSec === k ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]')}>
                  <ul className="overflow-hidden grid grid-cols-2 gap-x-4 gap-y-3">
                    {MEGA[k].cols[0][1].map(([l, h]) => (
                      <li key={l}><a href={'#' + h} className="text-[14px] text-charcoal/80">{l}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            {[['New Arrivals', 'new-arrivals'], ['Collections', 'collections'], ['Accessories', 'accessories'], ['Journal', 'journal'], ['Our Story', 'story']].map(([l, h]) => (
              <a key={l} href={'#' + h} className="flex items-center justify-between py-5 border-b border-charcoal/10 font-serif text-[28px]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#collections" className="block mx-5 my-4">
            <Scene name="essentials" className="aspect-[16/9]" alt="Contemporary Essentials" />
            <p className="mt-3 eyebrow">Contemporary Essentials · Shop now</p>
          </a>
        </div>
        <div className="border-t border-charcoal/10 px-5 py-4 grid grid-cols-2 gap-3 pb-safe">
          <a href="#account" className="h-12 flex items-center justify-center gap-2 border border-charcoal/20 navlabel"><User size={15} strokeWidth={1.4} />{account ? 'Account' : 'Sign In'}</a>
          <a href="#wishlist" className="h-12 flex items-center justify-center gap-2 border border-charcoal/20 navlabel"><Heart size={15} strokeWidth={1.4} />Wishlist ({wish.length})</a>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function MobileTabBar() {
  const { route, count, wish, setBagOpen, setSearchOpen } = useStore();
  const shopActive = ['shop', 'women', 'men', 'new-arrivals', 'essentials', 'accessories'].some((r) => route === r || route.startsWith(r + '-'));
  const item = 'flex flex-col items-center justify-center gap-1 text-[9.5px] uppercase tracking-[.14em] h-full';
  return (
    <nav aria-label="App" className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-ivory/95 backdrop-blur-md border-t border-charcoal/10 pb-safe">
      <div className="grid grid-cols-5 h-[60px]">
        <a href="#home" className={item + (route === 'home' ? ' text-ink' : ' text-charcoal/50')}><Home size={19} strokeWidth={1.4} />Home</a>
        <a href="#shop" className={item + (shopActive ? ' text-ink' : ' text-charcoal/50')}><LayoutGrid size={19} strokeWidth={1.4} />Shop</a>
        <button onClick={() => setSearchOpen(true)} className={item + ' text-charcoal/50'}><Search size={19} strokeWidth={1.4} />Search</button>
        <a href="#wishlist" className={item + ' relative ' + (route === 'wishlist' ? 'text-ink' : 'text-charcoal/50')}>
          <Heart size={19} strokeWidth={1.4} />Saved
          {wish.length > 0 && <span className="absolute top-2 left-1/2 ml-2 h-4 min-w-4 px-1 rounded-full bg-ink text-ivory text-[9px] grid place-items-center">{wish.length}</span>}
        </a>
        <button onClick={() => setBagOpen(true)} className={item + ' relative text-charcoal/50'}>
          <ShoppingBag size={19} strokeWidth={1.4} />Bag
          {count > 0 && <span className="absolute top-2 left-1/2 ml-2 h-4 min-w-4 px-1 rounded-full bg-ink text-ivory text-[9px] grid place-items-center">{count}</span>}
        </button>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState('');
  const input = useRef();
  useLockScroll(searchOpen);
  useEsc(() => setSearchOpen(false), searchOpen);
  useEffect(() => {
    if (searchOpen) setTimeout(() => input.current?.focus(), 250);
    else setQ('');
  }, [searchOpen]);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return PRODUCTS.filter((p) =>
      [p.name, p.category, p.gender, p.material, ...p.colors.map((c) => c.name)].join(' ').toLowerCase().includes(t)
    ).slice(0, 8);
  }, [q]);
  const popular = ['Cashmere', 'Blazer', 'Silk', 'Leather', 'Trousers', 'Sneakers'];
  return (
    <div className={'fixed inset-0 z-50 ' + (searchOpen ? 'ovl open' : 'ovl pointer-events-none')} aria-hidden={!searchOpen} role="dialog" aria-label="Search">
      <div className={'absolute inset-0 bg-ink/40 transition-opacity duration-500 ' + (searchOpen ? 'opacity-100' : 'opacity-0')} onClick={() => setSearchOpen(false)} />
      <div className={'absolute inset-x-0 top-0 bg-ivory max-h-[100dvh] overflow-y-auto transition-transform duration-500 ease-lux ' + (searchOpen ? 'translate-y-0' : '-translate-y-full')}>
        <div className="mx-auto max-w-[1200px] px-5 md:px-10 pt-6 md:pt-10 pb-10">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-taupe">Search</p>
            <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="p-2 -mr-2"><X size={20} strokeWidth={1.4} /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (results[0]) location.hash = 'product-' + results[0].id; }} className="mt-4 flex items-center gap-4 border-b border-ink pb-3">
            <Search size={22} strokeWidth={1.2} />
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="What are you looking for?" className="flex-1 bg-transparent font-serif text-[26px] md:text-[40px] placeholder:text-charcoal/30 focus:outline-none" aria-label="Search products" />
            {q && <button type="button" onClick={() => setQ('')} className="navlabel text-charcoal/60">Clear</button>}
          </form>
          {!q && (
            <div className="mt-8 grid md:grid-cols-[1fr_2fr] gap-10">
              <div>
                <p className="eyebrow text-taupe mb-4">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {popular.map((p) => <button key={p} onClick={() => setQ(p)} className="px-4 h-10 border border-charcoal/20 text-[13px] hover:border-ink transition-colors">{p}</button>)}
                </div>
              </div>
              <div>
                <p className="eyebrow text-taupe mb-4">Trending now</p>
                <div className="grid grid-cols-4 gap-3">
                  {['tailored-wool-blazer', 'oversized-cashmere-sweater', 'structured-leather-handbag', 'minimalist-silk-dress'].map((id) => {
                    const p = getProduct(id);
                    return (
                      <a key={id} href={'#product-' + id} className="group">
                        <ProductImage product={p} className="aspect-[4/5]" />
                        <p className="mt-2 text-[12px] leading-snug group-hover:underline">{p.name}</p>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {q && (
            <div className="mt-8">
              <p className="eyebrow text-taupe mb-5">{results.length} {results.length === 1 ? 'result' : 'results'} for “{q}”</p>
              {results.length === 0 ? (
                <p className="font-serif text-xl text-charcoal/70">Nothing matched. Try “cashmere”, “black” or “coat”.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-7">
                  {results.map((p) => (
                    <a key={p.id} href={'#product-' + p.id} className="group">
                      <ProductImage product={p} className="aspect-[4/5]" />
                      <p className="mt-3 text-[13px] group-hover:underline">{p.name}</p>
                      <p className="text-[13px] text-charcoal/60">{euro(p.price)}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function QtyStepper({ value, onChange, small, label = 'Quantity' }) {
  const h = small ? 'h-9' : 'h-12';
  return (
    <div className={'inline-flex items-center border border-charcoal/20 ' + h} role="group" aria-label={label}>
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(value - 1)} className={'w-9 h-full grid place-items-center hover:bg-cream transition-colors'}><Minus size={13} strokeWidth={1.4} /></button>
      <span className="w-8 text-center text-[13px] tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)} className={'w-9 h-full grid place-items-center hover:bg-cream transition-colors'}><Plus size={13} strokeWidth={1.4} /></button>
    </div>
  );
}

export function ShippingMeter({ subtotal }) {
  const left = Math.max(0, FREE_SHIPPING - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
  return (
    <div>
      <p className="text-[12.5px] flex items-center gap-2">
        <Truck size={15} strokeWidth={1.3} />
        {left > 0 ? <>You are <strong className="font-semibold">{euro(left)}</strong> away from complimentary shipping.</> : <>Your order ships complimentary.</>}
      </p>
      <div className="mt-3 h-[2px] bg-charcoal/10"><div className="h-full bg-ink transition-all duration-700 ease-lux" style={{ width: pct + '%' }} /></div>
    </div>
  );
}

export function BagDrawer() {
  const { bagOpen, setBagOpen, bag, count, subtotal, shipping, setQty, removeItem, go } = useStore();
  useLockScroll(bagOpen);
  useEsc(() => setBagOpen(false), bagOpen);
  return (
    <div className={'fixed inset-0 z-50 ' + (bagOpen ? 'ovl open' : 'ovl pointer-events-none')} aria-hidden={!bagOpen}>
      <div className={'absolute inset-0 bg-ink/40 transition-opacity duration-500 ' + (bagOpen ? 'opacity-100' : 'opacity-0')} onClick={() => setBagOpen(false)} />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={'absolute bg-ivory flex flex-col transition-transform duration-500 ease-lux inset-x-0 bottom-0 top-[6dvh] rounded-t-[18px] md:rounded-none md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[460px] ' + (bagOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full')}
      >
        <div className="md:hidden mx-auto mt-2.5 h-1 w-10 rounded-full bg-charcoal/20" />
        <div className="h-[64px] md:h-[72px] px-6 flex items-center justify-between border-b border-charcoal/10">
          <p className="font-serif text-[22px]">Your Bag <span className="text-charcoal/50 text-base">({count})</span></p>
          <button aria-label="Close bag" onClick={() => setBagOpen(false)} className="p-2 -mr-2"><X size={20} strokeWidth={1.4} /></button>
        </div>
        {bag.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
            <ShoppingBag size={34} strokeWidth={1} className="text-taupe" />
            <p className="mt-6 font-serif text-[26px]">Your bag is empty</p>
            <p className="mt-2 text-[14px] text-charcoal/60">Pieces you add will appear here.</p>
            <div className="mt-8 flex flex-col gap-3 w-full max-w-[260px]">
              <a href="#new-arrivals" className="btn-dark">Shop New Arrivals</a>
              <a href="#wishlist" className="btn-outline">View Wishlist</a>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 divide-y divide-charcoal/10">
              {bag.map((i) => {
                const c = i.product.colors[i.colorIndex];
                return (
                  <li key={i.key} className="py-5 flex gap-4 fade-in">
                    <a href={'#product-' + i.product.id} className="w-[92px] shrink-0"><ProductImage product={i.product} colorIndex={i.colorIndex} className="aspect-[4/5]" /></a>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between gap-3">
                        <a href={'#product-' + i.product.id} className="text-[14px] leading-snug hover:underline">{i.product.name}</a>
                        <p className="text-[14px] tabular-nums">{euro(i.product.price * i.qty)}</p>
                      </div>
                      <p className="mt-1 text-[12.5px] text-charcoal/60">{c.name} · {i.size}</p>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <QtyStepper small value={i.qty} onChange={(v) => setQty(i.key, v)} />
                        <button onClick={() => removeItem(i.key)} className="text-[12px] underline underline-offset-4 text-charcoal/60 hover:text-ink">Remove</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-charcoal/10 px-6 pt-5 pb-6 pb-safe space-y-2.5 bg-ivory">
              <div className="flex justify-between text-[14px]"><span>Subtotal</span><span className="tabular-nums">{euro(subtotal)}</span></div>
              <div className="flex justify-between text-[14px] text-charcoal/70"><span>Standard delivery</span><span>{shipping === 0 ? 'Complimentary' : euro(shipping)}</span></div>
              <div className="flex justify-between font-serif text-[22px] pt-2"><span>Total</span><span className="tabular-nums">{euro(subtotal + shipping)}</span></div>
              <p className="text-[11.5px] text-charcoal/50">Taxes included. Secure checkout by Stripe (test mode).</p>
              <div className="grid gap-2.5 pt-3">
                <button onClick={() => go('checkout')} className="btn-dark w-full">Proceed to Checkout</button>
                <button onClick={() => setBagOpen(false)} className="btn-outline w-full">Continue Shopping</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function SizePicker({ product, value, onChange, error }) {
  return (
    <div className={'flex flex-wrap gap-2 ' + (error ? 'animate-[pulse_.6s_ease_1]' : '')} role="radiogroup" aria-label="Size">
      {product.sizes.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          onClick={() => onChange(s)}
          className={'chip ' + (value === s ? 'bg-ink text-ivory border-ink' : 'border-charcoal/20 hover:border-ink')}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export function Swatches({ product, value, onChange, size = 'sm' }) {
  const d = size === 'lg' ? 'h-8 w-8' : 'h-[14px] w-[14px]';
  return (
    <div className={'flex items-center ' + (size === 'lg' ? 'gap-3' : 'gap-2')} role="radiogroup" aria-label="Colour">
      {product.colors.map((c, i) => (
        <button
          key={c.name}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={c.name}
          title={c.name}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(i); }}
          className={'rounded-full p-[3px] border transition-colors ' + (value === i ? 'border-ink' : 'border-transparent hover:border-charcoal/30')}
        >
          <span className={'block rounded-full border border-black/10 ' + d} style={{ background: c.hex }} />
        </button>
      ))}
    </div>
  );
}

export function QuickAddSheet() {
  const { quick, setQuick, addToBag } = useStore();
  const p = quick && getProduct(quick.id);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(null);
  const [err, setErr] = useState(false);
  useLockScroll(!!p);
  useEsc(() => setQuick(null), !!p);
  useEffect(() => { setColor(quick?.color || 0); setSize(null); setErr(false); }, [quick]);
  return (
    <div className={'fixed inset-0 z-50 ' + (p ? 'ovl open' : 'ovl pointer-events-none')} aria-hidden={!p}>
      <div className={'absolute inset-0 bg-ink/40 transition-opacity duration-500 ' + (p ? 'opacity-100' : 'opacity-0')} onClick={() => setQuick(null)} />
      <div role="dialog" aria-label="Quick add" className={'absolute inset-x-0 bottom-0 bg-ivory rounded-t-[18px] md:rounded-none md:left-1/2 md:bottom-auto md:top-1/2 md:w-[720px] md:-translate-x-1/2 transition-all duration-500 ease-lux ' + (p ? 'translate-y-0 md:-translate-y-1/2 opacity-100' : 'translate-y-full md:-translate-y-[45%] md:opacity-0')}>
        {p && (
          <div className="p-6 pb-8 pb-safe md:p-8 md:grid md:grid-cols-[260px_1fr] md:gap-8">
            <div className="md:hidden mx-auto -mt-2 mb-4 h-1 w-10 rounded-full bg-charcoal/20" />
            <ProductImage product={p} colorIndex={color} className="hidden md:block aspect-[4/5]" />
            <div>
              <div className="flex gap-4">
                <ProductImage product={p} colorIndex={color} className="md:hidden w-[84px] shrink-0 aspect-[4/5]" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-serif text-[24px] leading-tight">{p.name}</p>
                    <button aria-label="Close" onClick={() => setQuick(null)} className="p-1 -mr-1"><X size={18} strokeWidth={1.4} /></button>
                  </div>
                  <p className="mt-1 text-[15px]">{euro(p.price)}</p>
                </div>
              </div>
              <p className="mt-6 eyebrow">Colour · <span className="text-charcoal/60 normal-case tracking-normal text-[13px]">{p.colors[color].name}</span></p>
              <div className="mt-3"><Swatches product={p} value={color} onChange={setColor} size="lg" /></div>
              <p className={'mt-6 eyebrow ' + (err ? 'text-[#9b3b2b]' : '')}>{err ? 'Please select a size' : 'Size'}</p>
              <div className="mt-3"><SizePicker product={p} value={size} onChange={(s) => { setSize(s); setErr(false); }} error={err} /></div>
              <button
                className="btn-dark w-full mt-7"
                onClick={() => {
                  const s = p.sizes.length === 1 ? p.sizes[0] : size;
                  if (!s) return setErr(true);
                  addToBag(p.id, color, s, 1, { open: false });
                  setQuick(null);
                }}
              >
                Add to Bag · {euro(p.price)}
              </button>
              <a href={'#product-' + p.id} className="mt-4 block text-center text-[12px] underline underline-offset-4 text-charcoal/70">View full details</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (min-width: 768px)').matches;

export function ProductCard({ product, index = 0, compact = false }) {
  const { toggleWish, isWished, addToBag, setQuick } = useStore();
  const [color, setColor] = useState(0);
  const [picking, setPicking] = useState(false);
  const wished = isWished(product.id);
  const one = product.sizes.length === 1;
  const quickAdd = (e) => {
    e.preventDefault();
    if (one) return addToBag(product.id, color, product.sizes[0], 1, { open: false });
    if (canHover() && product.sizes.length <= 5) setPicking(true);
    else setQuick({ id: product.id, color });
  };
  return (
    <article className="group relative" onMouseLeave={() => setPicking(false)}>
      <a href={'#product-' + product.id} className="block relative" aria-label={product.name}>
        <ProductImage product={product} colorIndex={color} className="aspect-[3/4]" alt={`${product.name} in ${product.colors[color].name}`} />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-lux hidden md:block">
          <ProductImage product={product} colorIndex={color} variant="detail" className="h-full w-full" alt="" />
        </div>
        {product.isNew && <span className="absolute top-3 left-3 eyebrow text-[9.5px] bg-ivory/90 px-2 py-1">New</span>}
      </a>
      <button
        onClick={() => toggleWish(product.id)}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        aria-pressed={wished}
        className="absolute top-2 right-2 h-10 w-10 grid place-items-center rounded-full hover:bg-ivory/70 transition-colors"
      >
        <Heart size={17} strokeWidth={1.3} className={'transition-all duration-300 ' + (wished ? 'fill-ink scale-110' : '')} />
      </button>
      {/* Quick add, anchored to the bottom edge of the image */}
      <div className="relative">
        <div className="absolute -top-[52px] md:-top-14 left-2 right-2 md:left-3 md:right-3 flex justify-end md:justify-stretch">
          {picking ? (
            <div className="w-full bg-ivory/95 backdrop-blur px-3 py-2.5 fade-in">
              <p className="eyebrow text-[9.5px] text-charcoal/60 mb-2">Select size</p>
              <div className="flex gap-1.5">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => { addToBag(product.id, color, s, 1, { open: false }); setPicking(false); }} className="flex-1 h-8 text-[11.5px] border border-charcoal/20 hover:bg-ink hover:text-ivory hover:border-ink transition-colors">{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={quickAdd}
              className="h-10 md:h-11 w-10 md:w-full grid md:flex place-items-center md:items-center md:justify-center gap-2 rounded-full md:rounded-none bg-ivory/90 md:bg-ivory/95 backdrop-blur text-ink md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 focus:opacity-100 focus:translate-y-0 transition-all duration-500 ease-lux md:hover:bg-ink md:hover:text-ivory"
              aria-label={`Quick add ${product.name}`}
            >
              <Plus size={16} strokeWidth={1.4} />
              <span className="hidden md:inline navlabel text-[10.5px]">Quick Add</span>
            </button>
          )}
        </div>
      </div>
      <div className={'pt-4 ' + (compact ? 'pt-3' : '')}>
        <div className="flex items-start justify-between gap-3">
          <a href={'#product-' + product.id} className="text-[13.5px] md:text-[14px] leading-snug hover:underline underline-offset-4">{product.name}</a>
          <p className="text-[13.5px] md:text-[14px] tabular-nums shrink-0">{euro(product.price)}</p>
        </div>
        {!compact && <div className="mt-2.5 -ml-[3px]"><Swatches product={product} value={color} onChange={setColor} /></div>}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
export function SizeGuideModal() {
  const { sizeGuide, setSizeGuide } = useStore();
  useLockScroll(sizeGuide);
  useEsc(() => setSizeGuide(false), sizeGuide);
  return (
    <div className={'fixed inset-0 z-[60] ' + (sizeGuide ? 'ovl open' : 'ovl pointer-events-none')} aria-hidden={!sizeGuide}>
      <div className={'absolute inset-0 bg-ink/40 transition-opacity duration-500 ' + (sizeGuide ? 'opacity-100' : 'opacity-0')} onClick={() => setSizeGuide(false)} />
      <div role="dialog" aria-label="Size guide" className={'absolute inset-y-0 right-0 w-full md:w-[620px] bg-ivory overflow-y-auto transition-transform duration-500 ease-lux ' + (sizeGuide ? 'translate-x-0' : 'translate-x-full')}>
        <div className="p-6 md:p-10">
          <div className="flex items-center justify-between">
            <p className="font-serif text-[30px]">Size Guide</p>
            <button aria-label="Close size guide" onClick={() => setSizeGuide(false)} className="p-2 -mr-2"><X size={20} strokeWidth={1.4} /></button>
          </div>
          <SizeTable />
        </div>
      </div>
    </div>
  );
}

export function SizeTable() {
  return (
    <div>
      <p className="mt-3 text-[14px] text-charcoal/70">Body measurements in centimetres. If you are between sizes, take the smaller for tailoring and the larger for knitwear.</p>
      <div className="mt-8 overflow-x-auto no-scrollbar">
        <table className="w-full text-[13px] min-w-[520px]">
          <thead>
            <tr className="border-b border-ink">
              {SIZE_TABLE.head.map((h) => <th key={h} className="text-left py-3 pr-3 font-medium eyebrow text-[9.5px]">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {SIZE_TABLE.rows.map((r) => (
              <tr key={r[0]} className="border-b border-charcoal/10">
                {r.map((c, i) => <td key={i} className={'py-3.5 pr-3 tabular-nums ' + (i === 0 ? 'font-medium' : 'text-charcoal/80')}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 grid sm:grid-cols-3 gap-6 text-[13px] text-charcoal/80">
        <div><p className="eyebrow text-ink mb-2">Bust / Chest</p>Measure around the fullest part, keeping the tape level.</div>
        <div><p className="eyebrow text-ink mb-2">Waist</p>Measure around the narrowest part of your natural waist.</div>
        <div><p className="eyebrow text-ink mb-2">Shoes</p>EU sizing. If you are a half size, size up for sneakers and down for loafers.</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function Toast() {
  const { toast, setToast } = useStore();
  return (
    <div className="fixed z-[70] left-1/2 -translate-x-1/2 bottom-[80px] md:bottom-8 w-[calc(100%-2rem)] max-w-[420px] pointer-events-none" aria-live="polite">
      {toast && (
        <div key={toast.k} className="pointer-events-auto bg-ink text-ivory px-5 py-4 flex items-center gap-4 rise shadow-xl" style={{ animationDuration: '.6s' }}>
          <Check size={16} strokeWidth={1.6} className="shrink-0" />
          <p className="flex-1 text-[13px]">{toast.msg}</p>
          {toast.action && (
            <button onClick={() => { toast.action.fn(); setToast(null); }} className="navlabel text-[10px] underline underline-offset-4">{toast.action.label}</button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function NewsletterForm({ dark = false, compact = false }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ t: 'idle', msg: '' });
  const [consent, setConsent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!v) return setState({ t: 'err', msg: 'Please enter your email address.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setState({ t: 'err', msg: 'That email address doesn’t look right. Please check it.' });
    if (!compact && !consent) return setState({ t: 'err', msg: 'Please confirm you would like to receive our emails.' });
    try {
      const list = JSON.parse(localStorage.getItem('elan:newsletter') || '[]');
      if (list.includes(v.toLowerCase())) return setState({ t: 'ok', msg: 'You are already on the list. Thank you.' });
      localStorage.setItem('elan:newsletter', JSON.stringify([...list, v.toLowerCase()]));
    } catch { /* ignore */ }
    setState({ t: 'ok', msg: 'Welcome to the ÉLAN world. Look out for our next letter.' });
    setEmail('');
  };
  const tone = dark ? 'text-ivory border-ivory/40 focus:border-ivory placeholder:text-ivory/40' : '';
  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className={'flex items-end gap-4 border-b ' + (dark ? 'border-ivory/40' : 'border-charcoal/30')}>
        <label className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (state.t === 'err') setState({ t: 'idle' }); }}
            placeholder="Your email address"
            className={'w-full h-12 bg-transparent focus:outline-none text-[15px] ' + (dark ? 'text-ivory placeholder:text-ivory/50' : 'placeholder:text-charcoal/40') + ' ' + tone}
            aria-invalid={state.t === 'err'}
            autoComplete="email"
          />
        </label>
        <button type="submit" className={'h-12 navlabel inline-flex items-center gap-2 hover:gap-3 transition-all ' + (dark ? 'text-ivory' : '')}>
          Subscribe <ArrowRight size={14} strokeWidth={1.3} />
        </button>
      </div>
      {!compact && (
        <label className={'mt-4 flex items-start gap-3 text-[12px] cursor-pointer ' + (dark ? 'text-ivory/70' : 'text-charcoal/60')}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-current" />
          I would like to receive emails about new collections and stories. I can unsubscribe at any time.
        </label>
      )}
      <p role="status" className={'mt-3 text-[12.5px] min-h-[18px] ' + (state.t === 'err' ? (dark ? 'text-[#e5b3a3]' : 'text-[#9b3b2b]') : dark ? 'text-ivory' : 'text-ink')}>
        {state.msg}
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
export function Footer() {
  const cols = [
    ['Client Services', [['Contact Us', 'help-contact'], ['Shipping', 'help-shipping'], ['Returns & Exchanges', 'help-returns'], ['Size Guide', 'help-size-guide'], ['Garment Care', 'help-care']]],
    ['Shop', [['Women', 'women'], ['Men', 'men'], ['New Arrivals', 'new-arrivals'], ['Accessories', 'accessories'], ['Wishlist', 'wishlist']]],
    ['The House', [['About Maison Élan', 'story'], ['The Campaign', 'campaign'], ['Journal', 'journal'], ['My Account', 'account']]],
  ];
  return (
    <footer className="bg-ink text-ivory mt-auto">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 pt-16 md:pt-24 pb-28 md:pb-10">
        <div className="grid lg:grid-cols-[1.3fr_2fr] gap-14 lg:gap-24">
          <div>
            <Logo className="text-[26px]" />
            <p className="mt-6 font-serif text-[22px] md:text-[26px] leading-snug text-ivory/85 max-w-[420px]">Be the first to see new collections and private releases.</p>
            <div className="mt-6 max-w-[440px]"><NewsletterForm dark compact /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {cols.map(([h, links]) => (
              <div key={h}>
                <p className="eyebrow text-taupe mb-5">{h}</p>
                <ul className="space-y-3 text-[13.5px] text-ivory/80">
                  {links.map(([l, href]) => <li key={l}><a href={'#' + href} className="link-u hover:text-ivory">{l}</a></li>)}
                </ul>
              </div>
            ))}
            <div>
              <p className="eyebrow text-taupe mb-5">Contact</p>
              <address className="not-italic text-[13.5px] text-ivory/80 space-y-3">
                <p>18 Rue du Temple Imaginaire<br />75003 Paris, France</p>
                <p>client@maison-elan.example</p>
                <p>+33 1 84 00 00 00</p>
                <p>Mon–Sat, 09:00–19:00 CET</p>
              </address>
            </div>
          </div>
        </div>
        <div className="mt-16 md:mt-24 border-t border-ivory/15 pt-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 navlabel text-[10px] text-ivory/70">
            {[['Instagram', 'https://www.instagram.com/'], ['Pinterest', 'https://www.pinterest.com/'], ['TikTok', 'https://www.tiktok.com/'], ['YouTube', 'https://www.youtube.com/']].map(([l, h]) => (
              <li key={l}><a href={h} target="_blank" rel="noopener noreferrer" className="hover:text-ivory link-u">{l}</a></li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[11.5px] text-ivory/50">
            <li><a href="#help-privacy" className="hover:text-ivory">Privacy</a></li>
            <li><a href="#help-terms" className="hover:text-ivory">Terms</a></li>
            <li><a href="#help-accessibility" className="hover:text-ivory">Accessibility</a></li>
            <li>© 2026 Maison Élan. A fictional brand, designed as a portfolio project.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[11.5px] text-charcoal/55">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map(([l, h], i) => (
          <li key={l} className="flex items-center gap-2">
            {h ? <a href={'#' + h} className="hover:text-ink">{l}</a> : <span aria-current="page" className="text-ink">{l}</span>}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
