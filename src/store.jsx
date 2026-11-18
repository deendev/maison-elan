import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getProduct, FREE_SHIPPING, SHIP_STANDARD } from './data.js';
import { sampleOrders } from './catalog.js';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

const load = (k, d) => {
  try {
    const v = localStorage.getItem('elan:' + k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
};
const save = (k, v) => {
  try {
    localStorage.setItem('elan:' + k, JSON.stringify(v));
  } catch {
    /* storage unavailable: state stays in memory */
  }
};

/* Hash router: only plain #name values, e.g. #shop, #product-tailored-wool-blazer */
function readHash() {
  const h = (typeof location !== 'undefined' && location.hash.replace(/^#/, '')) || 'home';
  return h || 'home';
}

export function StoreProvider({ children }) {
  const [route, setRoute] = useState(readHash);
  const [bag, setBag] = useState(() => load('bag', []));
  const [wish, setWish] = useState(() => load('wish', []));
  const [account, setAccount] = useState(() => load('account', null));
  const [orders, setOrders] = useState(() => {
    const o = load('orders', []);
    if (!load('seeded', false)) { save('seeded', true); return [...o, ...sampleOrders()]; }
    return o;
  });
  const [catalogVersion, setCatalogVersion] = useState(0);
  const bumpCatalog = useCallback(() => setCatalogVersion((v) => v + 1), []);
  const updateOrder = useCallback((id, patch) => setOrders((list) => list.map((o) => (o.id === id ? { ...o, ...(typeof patch === 'function' ? patch(o) : patch) } : o))), []);
  const addOrder = useCallback((o) => setOrders((list) => (list.some((x) => x.id === o.id || (o.stripeSession && x.stripeSession === o.stripeSession)) ? list : [o, ...list].slice(0, 60))), []);
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quick, setQuick] = useState(null); // product id for quick-add sheet
  const [sizeGuide, setSizeGuide] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  useEffect(() => save('bag', bag), [bag]);
  useEffect(() => save('wish', wish), [wish]);
  useEffect(() => save('account', account), [account]);
  useEffect(() => save('orders', orders), [orders]);

  useEffect(() => {
    const on = () => {
      setRoute(readHash());
      setMenuOpen(false);
      setSearchOpen(false);
      setBagOpen(false);
      setQuick(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const go = useCallback((name) => {
    if (('#' + name) === location.hash || (name === 'home' && !location.hash)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMenuOpen(false); setSearchOpen(false); setBagOpen(false);
    } else {
      location.hash = name;
    }
  }, []);

  const notify = useCallback((msg, action) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, action, k: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const addToBag = useCallback((id, colorIndex, size, qty = 1, { open = true } = {}) => {
    const key = `${id}|${colorIndex}|${size}`;
    setBag((b) => {
      const ex = b.find((i) => i.key === key);
      if (ex) return b.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i));
      return [...b, { key, id, colorIndex, size, qty }];
    });
    if (open) setBagOpen(true);
    else notify(`${getProduct(id)?.name} added to your bag`, { label: 'View bag', fn: () => setBagOpen(true) });
  }, [notify]);

  const setQty = useCallback((key, qty) => {
    setBag((b) => (qty <= 0 ? b.filter((i) => i.key !== key) : b.map((i) => (i.key === key ? { ...i, qty: Math.min(10, qty) } : i))));
  }, []);
  const removeItem = useCallback((key) => setBag((b) => b.filter((i) => i.key !== key)), []);
  const clearBag = useCallback(() => setBag([]), []);

  const toggleWish = useCallback((id) => {
    setWish((w) => {
      const has = w.includes(id);
      notify(has ? 'Removed from your wishlist' : 'Saved to your wishlist', has ? null : { label: 'View', fn: () => go('wishlist') });
      return has ? w.filter((x) => x !== id) : [...w, id];
    });
  }, [notify, go]);

  const lines = useMemo(() => bag.map((i) => ({ ...i, product: getProduct(i.id) })).filter((i) => i.product), [bag, catalogVersion]);
  const count = lines.reduce((s, i) => s + i.qty, 0);
  const subtotal = lines.reduce((s, i) => s + i.qty * i.product.price, 0);
  const shipping = 0; // Delivery is complimentary in the Stripe test-mode demo

  const value = {
    route, go, bag: lines, count, subtotal, shipping,
    addToBag, setQty, removeItem, clearBag,
    wish, toggleWish, isWished: (id) => wish.includes(id),
    account, setAccount, orders, setOrders, updateOrder, addOrder, catalogVersion, bumpCatalog,
    bagOpen, setBagOpen, searchOpen, setSearchOpen, menuOpen, setMenuOpen,
    quick, setQuick, sizeGuide, setSizeGuide, toast, setToast, notify,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* Reveal-on-scroll hook */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={'reveal ' + className} style={{ transitionDelay: delay + 'ms' }} {...rest}>
      {children}
    </Tag>
  );
}

export function useLockScroll(on) {
  useEffect(() => {
    if (!on) return;
    const o = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = o; };
  }, [on]);
}

export function useEsc(fn, on = true) {
  useEffect(() => {
    if (!on) return;
    const h = (e) => e.key === 'Escape' && fn();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [fn, on]);
}
