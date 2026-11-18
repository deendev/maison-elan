import { useEffect, useMemo, useState } from 'react';
import { Lock, ChevronDown, Check, Package, ArrowRight, LogOut, Heart, ShoppingBag, Info } from 'lucide-react';
import { useStore, Reveal } from './store.jsx';
import { PRODUCTS, COLLECTIONS, JOURNAL, INFO, FREE_SHIPPING, SHIP_STANDARD, SHIP_EXPRESS, euro, getProduct, NEW_ARRIVAL_IDS } from './data.js';
import { Scene, ProductImage } from './art.jsx';
import { ProductCard, QtyStepper, Breadcrumbs, SizeTable, ShippingMeter, Logo } from './components.jsx';
import { stripeUrl } from './stripe.js';
import { JournalGrid, NewsletterSection, CategoryGrid, SectionHead } from './pages-home.jsx';

/* ------------------------------------------------------------------ */
/* Checkout (demonstration only)                                        */
/* ------------------------------------------------------------------ */
const COUNTRIES = ['France', 'Italy', 'Germany', 'Spain', 'Netherlands', 'Belgium', 'Portugal', 'Austria', 'Ireland', 'Switzerland', 'United Kingdom', 'Denmark', 'Sweden'];

function Field({ label, name, form, set, errors, type = 'text', autoComplete, half, placeholder }) {
  const err = errors[name];
  return (
    <label className={'block ' + (half ? '' : 'sm:col-span-2')}>
      <span className="text-[11.5px] uppercase tracking-[.14em] text-charcoal/60">{label}</span>
      <input
        type={type}
        name={name}
        value={form[name] || ''}
        onChange={(e) => set(name, e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!err}
        className={'field ' + (err ? 'border-[#9b3b2b]' : '')}
      />
      {err && <span className="block mt-1.5 text-[12px] text-[#9b3b2b]">{err}</span>}
    </label>
  );
}

function OrderSummary({ bag, subtotal, ship, discount, total, promo, setPromo, applyPromo, promoMsg, editable, setQty }) {
  return (
    <div>
      <ul className="divide-y divide-charcoal/10">
        {bag.map((i) => (
          <li key={i.key} className="py-4 flex gap-4">
            <div className="relative w-[70px] shrink-0">
              <ProductImage product={i.product} colorIndex={i.colorIndex} className="aspect-[4/5]" />
              <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-ink text-ivory text-[10px] grid place-items-center">{i.qty}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] leading-snug">{i.product.name}</p>
              <p className="text-[12px] text-charcoal/60 mt-0.5">{i.product.colors[i.colorIndex].name} · {i.size}</p>
              {editable && <div className="mt-2"><QtyStepper small value={i.qty} onChange={(v) => setQty(i.key, v)} /></div>}
            </div>
            <p className="text-[13.5px] tabular-nums">{euro(i.product.price * i.qty)}</p>
          </li>
        ))}
      </ul>
      {setPromo && (
        <form onSubmit={(e) => { e.preventDefault(); applyPromo(); }} className="mt-4 flex gap-2">
          <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code (try ELAN10)" className="flex-1 h-11 px-4 bg-transparent border border-charcoal/20 text-[13px] focus:border-ink focus:outline-none" aria-label="Promo code" />
          <button className="h-11 px-5 border border-ink navlabel text-[10.5px] hover:bg-ink hover:text-ivory transition-colors">Apply</button>
        </form>
      )}
      {promoMsg && <p className={'mt-2 text-[12px] ' + (promoMsg.ok ? 'text-ink' : 'text-[#9b3b2b]')}>{promoMsg.t}</p>}
      <dl className="mt-6 space-y-2.5 text-[13.5px]">
        <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{euro(subtotal)}</dd></div>
        {discount > 0 && <div className="flex justify-between"><dt>Discount (ELAN10)</dt><dd className="tabular-nums">−{euro(discount)}</dd></div>}
        <div className="flex justify-between text-charcoal/70"><dt>Delivery</dt><dd>{ship === 0 ? 'Complimentary' : euro(ship)}</dd></div>
        <div className="flex justify-between pt-4 border-t border-charcoal/15 font-serif text-[24px]"><dt>Total</dt><dd className="tabular-nums">{euro(total)}</dd></div>
        <p className="text-[11.5px] text-charcoal/50">Including VAT</p>
      </dl>
    </div>
  );
}

function goToStripe(line, email) {
  const url = stripeUrl(line.id, { size: line.size, color: getProduct(line.id).colors[line.colorIndex]?.name, email });
  if (!url) return;
  try {
    localStorage.setItem('elan:pending', JSON.stringify({ key: line.key, id: line.id, colorIndex: line.colorIndex, size: line.size, qty: line.qty, price: getProduct(line.id).price, at: Date.now() }));
  } catch { /* ignore */ }
  window.location.assign(url);
}

export function TestCardNote({ compact }) {
  return (
    <div className={'bg-cream/60 flex gap-3 text-[13px] text-charcoal/80 ' + (compact ? 'p-4' : 'p-5')}>
      <Lock size={16} strokeWidth={1.3} className="shrink-0 mt-0.5" />
      <div>
        <p><strong className="font-semibold text-ink">Stripe test mode.</strong> You'll be taken to a secure Stripe checkout page. No real money is taken.</p>
        <p className="mt-2">Test card: <span className="font-mono tabular-nums">4242 4242 4242 4242</span>, any future expiry date, any CVC and any postcode.</p>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { bag, subtotal, setQty, account } = useStore();
  const [email, setEmail] = useState(account?.email || '');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const total = subtotal;

  if (bag.length === 0) {
    return (
      <div className="page-in mx-auto max-w-[700px] px-5 py-32 text-center">
        <p className="eyebrow text-taupe">Checkout</p>
        <h1 className="display text-[48px] md:text-[72px] mt-5">Your bag is <em>empty.</em></h1>
        <p className="mt-5 text-[15px] text-charcoal/70">Add a few pieces and come back to complete your order.</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"><a href="#new-arrivals" className="btn-dark">Shop New Arrivals</a><a href="#wishlist" className="btn-outline">View Wishlist</a></div>
      </div>
    );
  }
  const single = bag.length === 1;
  const summary = <OrderSummary {...{ bag, subtotal, ship: 0, discount: 0, total }} editable setQty={setQty} />;

  return (
    <div className="page-in">
      <div className="bg-cream/60 border-b border-charcoal/10">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10 py-3 flex items-center gap-3 text-[12.5px]">
          <Info size={15} strokeWidth={1.4} className="shrink-0" />
          <p><strong className="font-semibold">Portfolio demo in Stripe test mode.</strong> Payments go through real Stripe Checkout pages, but only test cards work and nothing is shipped.</p>
        </div>
      </div>

      <div className="lg:hidden border-b border-charcoal/10">
        <button onClick={() => setSummaryOpen(!summaryOpen)} className="w-full px-5 h-14 flex items-center justify-between" aria-expanded={summaryOpen}>
          <span className="inline-flex items-center gap-2 text-[13px]"><ShoppingBag size={16} strokeWidth={1.3} />{summaryOpen ? 'Hide' : 'Show'} order summary <ChevronDown size={14} className={'transition-transform ' + (summaryOpen ? 'rotate-180' : '')} /></span>
          <span className="font-serif text-[20px] tabular-nums">{euro(total)}</span>
        </button>
        <div className={'grid transition-all duration-500 ease-lux ' + (summaryOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
          <div className="overflow-hidden px-5"><div className="pb-6">{summary}</div></div>
        </div>
      </div>

      <div className="mx-auto max-w-[1300px] px-5 md:px-10 pt-8 md:pt-14 pb-32 md:pb-24 lg:grid lg:grid-cols-[1.35fr_1fr] lg:gap-20">
        <div>
          <Breadcrumbs items={[['Home', 'home'], ['Checkout']]} />
          <h1 className="display text-[44px] md:text-[60px] mt-4">Checkout</h1>

          <section className="mt-10" aria-labelledby="c1">
            <h2 id="c1" className="font-serif text-[24px]"><span className="text-taupe mr-3">01</span>Your email</h2>
            <p className="mt-2 text-[13px] text-charcoal/60">Optional. We pass it to Stripe so you don't have to type it twice.</p>
            <label className="block mt-4 max-w-[460px]">
              <span className="sr-only">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field" autoComplete="email" />
            </label>
          </section>

          <section className="mt-12" aria-labelledby="c2">
            <h2 id="c2" className="font-serif text-[24px]"><span className="text-taupe mr-3">02</span>Pay securely with Stripe</h2>
            <div className="mt-5"><TestCardNote /></div>

            {single ? (
              <div className="mt-6">
                <button onClick={() => goToStripe(bag[0], email)} className="btn-dark w-full h-14">
                  <Lock size={15} strokeWidth={1.4} /> Continue to Stripe · {euro(total)}
                </button>
                {bag[0].qty > 1 && <p className="mt-3 text-[12.5px] text-charcoal/60">Stripe opens with quantity 1. Set it to {bag[0].qty} on the payment page.</p>}
                <p className="mt-3 text-[12.5px] text-charcoal/60">Stripe will ask for your delivery address. Delivery is complimentary.</p>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-[13.5px] text-charcoal/75">This demo store uses one Stripe payment link per piece, so pieces are paid one at a time. After each payment you come back here to pay for the next.</p>
                <ul className="mt-5 divide-y divide-charcoal/10 border-y border-charcoal/10">
                  {bag.map((i) => (
                    <li key={i.key} className="py-4 flex items-center gap-4">
                      <ProductImage product={i.product} colorIndex={i.colorIndex} className="w-[56px] aspect-[4/5] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] truncate">{i.product.name}</p>
                        <p className="text-[12px] text-charcoal/60">{i.product.colors[i.colorIndex].name} · {i.size} · Qty {i.qty}</p>
                      </div>
                      <button onClick={() => goToStripe(i, email)} className="btn-dark h-11 px-5 text-[10px]">Pay {euro(i.product.price * i.qty)}</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-6 text-[12px] text-charcoal/55">By continuing you agree to our <a href="#help-terms" className="underline">terms</a> and <a href="#help-privacy" className="underline">privacy policy</a>.</p>
          </section>
        </div>

        <aside className="hidden lg:block" aria-label="Order summary">
          <div className="sticky top-[100px] bg-cream/50 p-8">
            <p className="font-serif text-[24px] mb-2">Order Summary</p>
            {summary}
          </div>
        </aside>
      </div>
    </div>
  );
}

export function ConfirmationPage() {
  const { orders, setOrders, removeItem, bag } = useStore();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paid = params.get('paid');
    let pending = null;
    try { pending = JSON.parse(localStorage.getItem('elan:pending') || 'null'); } catch { /* ignore */ }
    if (paid && pending) {
      const o = {
        id: 'ME-' + paid.slice(-6).toUpperCase(),
        stripeSession: paid,
        date: new Date().toISOString(),
        items: [{ id: pending.id, colorIndex: pending.colorIndex, size: pending.size, qty: pending.qty, price: pending.price }],
        subtotal: pending.price * pending.qty, discount: 0, ship: 0, total: pending.price * pending.qty,
        method: 'standard', name: '', email: '', address: 'Collected securely by Stripe',
      };
      setOrders((list) => (list.some((x) => x.stripeSession === paid) ? list : [o, ...list].slice(0, 20)));
      removeItem(pending.key);
      try { localStorage.removeItem('elan:pending'); } catch { /* ignore */ }
      setOrder(o);
    } else if (paid) {
      setOrder({ id: 'ME-' + paid.slice(-6).toUpperCase(), stripeSession: paid, items: [], total: 0 });
    } else {
      setOrder(orders[0] || null);
    }
    if (paid) {
      try { window.history.replaceState(null, '', window.location.pathname + '#order-confirmed'); } catch { /* ignore */ }
    }
  }, []);

  if (!order) {
    return (
      <div className="page-in mx-auto max-w-[700px] px-5 py-32 text-center">
        <h1 className="display text-[48px] md:text-[72px]">No order <em>yet.</em></h1>
        <a href="#new-arrivals" className="btn-dark mt-10">Shop New Arrivals</a>
      </div>
    );
  }
  return (
    <div className="page-in mx-auto max-w-[900px] px-5 md:px-10 py-20 md:py-32">
      <div className="text-center">
        <span className="mx-auto h-14 w-14 rounded-full border border-ink grid place-items-center"><Check size={22} strokeWidth={1.3} /></span>
        <p className="eyebrow text-taupe mt-8">Order {order.id}</p>
        <h1 className="display text-[48px] md:text-[80px] mt-4">Thank <em>you.</em></h1>
        <p className="mt-6 text-[15px] text-charcoal/70 max-w-[540px] mx-auto">
          {order.stripeSession ? <>Your test payment was completed on Stripe. You can see it in the Stripe dashboard under Payments (test mode). Nothing has been charged or shipped.</> : <>Your order is saved in this browser.</>}
        </p>
        {order.stripeSession && <p className="mt-3 text-[11.5px] text-charcoal/45 break-all">Stripe session {order.stripeSession}</p>}
      </div>
      {order.items.length > 0 && (
        <div className="mt-14 border-t border-charcoal/15">
          {order.items.map((it, k) => {
            const p = getProduct(it.id);
            if (!p) return null;
            return (
              <div key={k} className="py-5 flex gap-5 border-b border-charcoal/10">
                <ProductImage product={p} colorIndex={it.colorIndex} className="w-[80px] aspect-[4/5]" />
                <div className="flex-1"><p className="text-[14px]">{p.name}</p><p className="text-[12.5px] text-charcoal/60">{p.colors[it.colorIndex]?.name} · {it.size} · Qty {it.qty}</p></div>
                <p className="text-[14px] tabular-nums">{euro(it.price * it.qty)}</p>
              </div>
            );
          })}
          <div className="pt-6 flex justify-between font-serif text-[22px]"><span>Total</span><span>{euro(order.total)}</span></div>
          <p className="text-[12px] text-charcoal/55 mt-1">Delivery complimentary. Address collected by Stripe.</p>
        </div>
      )}
      <div className="mt-14 flex flex-col sm:flex-row gap-3 justify-center">
        {bag.length > 0 ? <a href="#checkout" className="btn-dark">Pay for remaining {bag.length} {bag.length === 1 ? 'piece' : 'pieces'}</a> : <a href="#new-arrivals" className="btn-dark">Continue Shopping</a>}
        <a href="#account" className="btn-outline">View Order History</a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function WishlistPage() {
  const { wish, addToBag, notify } = useStore();
  const items = wish.map(getProduct).filter(Boolean);
  return (
    <div className="page-in mx-auto max-w-[1600px] px-5 md:px-10 pt-10 md:pt-16">
      <Breadcrumbs items={[['Home', 'home'], ['Wishlist']]} />
      <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="display text-[52px] md:text-[88px]">Wishlist</h1>
          <p className="mt-3 text-[14px] text-charcoal/60">{items.length} saved {items.length === 1 ? 'piece' : 'pieces'} · Saved in this browser</p>
        </div>
        {items.length > 0 && (
          <button
            className="btn-outline"
            onClick={() => {
              items.forEach((p) => p.sizes.length === 1 && addToBag(p.id, 0, p.sizes[0], 1, { open: false }));
              const multi = items.filter((p) => p.sizes.length > 1).length;
              notify(multi ? `One-size pieces added. Choose sizes for the other ${multi} with Quick Add.` : 'All pieces added to your bag');
            }}
          >
            Add one-size pieces to bag
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <div className="py-24 md:py-32 text-center border-t border-charcoal/10 mt-10">
          <Heart size={32} strokeWidth={1} className="mx-auto text-taupe" />
          <p className="mt-6 font-serif text-[30px]">Nothing saved yet</p>
          <p className="mt-2 text-[14px] text-charcoal/60">Tap the heart on any piece to keep it here.</p>
          <a href="#new-arrivals" className="btn-dark mt-8">Discover New Arrivals</a>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-12">
          {items.map((p) => <div key={p.id} className="fade-in"><ProductCard product={p} /></div>)}
        </div>
      )}
      <div className="pb-10" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function AccountPage() {
  const { account, setAccount, orders, wish, notify } = useStore();
  const [mode, setMode] = useState('signin');
  const [f, setF] = useState({ first: '', last: '', email: '', pw: '' });
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) return setErr('Enter a valid email address.');
    if (f.pw.length < 6) return setErr('Password must be at least 6 characters.');
    if (mode === 'register' && !f.first.trim()) return setErr('Please enter your first name.');
    const first = mode === 'register' ? f.first.trim() : f.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).split(' ')[0];
    setAccount({ first, last: f.last.trim(), email: f.email.trim() });
    notify(`Welcome${mode === 'register' ? '' : ' back'}, ${first}`);
  };
  if (account) {
    return (
      <div className="page-in mx-auto max-w-[1200px] px-5 md:px-10 pt-10 md:pt-16 pb-10">
        <Breadcrumbs items={[['Home', 'home'], ['Account']]} />
        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-taupe">My Account</p>
            <h1 className="display text-[48px] md:text-[80px] mt-4">Bonjour, <em>{account.first}.</em></h1>
          </div>
          <button onClick={() => { setAccount(null); notify('You have signed out'); }} className="btn-outline"><LogOut size={14} strokeWidth={1.3} /> Sign Out</button>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          <a href="#wishlist" className="p-7 bg-cream/60 hover:bg-cream transition-colors"><Heart size={20} strokeWidth={1.2} /><p className="mt-6 font-serif text-[26px]">{wish.length} saved</p><p className="text-[13px] text-charcoal/60">View wishlist</p></a>
          <div className="p-7 bg-cream/60"><Package size={20} strokeWidth={1.2} /><p className="mt-6 font-serif text-[26px]">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p><p className="text-[13px] text-charcoal/60">Demo orders placed</p></div>
          <div className="p-7 bg-cream/60"><p className="eyebrow">Details</p><p className="mt-6 text-[14px]">{account.first} {account.last}</p><p className="text-[13px] text-charcoal/60">{account.email}</p></div>
        </div>
        <h2 className="font-serif text-[30px] mt-16">Order History</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-[14px] text-charcoal/60">No orders yet. <a href="#new-arrivals" className="underline underline-offset-4">Start shopping</a>.</p>
        ) : (
          <div className="mt-6 border-t border-charcoal/15">
            {orders.map((o) => (
              <div key={o.id} className="py-5 border-b border-charcoal/10 grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center text-[13.5px]">
                <div><p className="font-medium">{o.id}</p><p className="text-charcoal/60 text-[12.5px]">{new Date(o.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                <div className="flex -space-x-3">{o.items.slice(0, 4).map((it, k) => <ProductImage key={k} product={getProduct(it.id)} colorIndex={it.colorIndex} className="w-11 aspect-[4/5] ring-2 ring-ivory" />)}</div>
                <p className="text-charcoal/70">{o.items.reduce((s, i) => s + i.qty, 0)} items · Demo</p>
                <p className="font-serif text-[20px] tabular-nums">{euro(o.total)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="page-in md:grid md:grid-cols-2 md:min-h-[calc(100vh-108px)]">
      <Scene name="atelier" className="hidden md:block" alt="Two models in the Maison Élan atelier" />
      <div className="px-5 md:px-14 lg:px-24 py-14 md:py-20 flex flex-col justify-center max-w-[640px]">
        <p className="eyebrow text-taupe">My Account</p>
        <h1 className="display text-[48px] md:text-[68px] mt-4">{mode === 'signin' ? <>Welcome <em>back.</em></> : <>Join <em>the house.</em></>}</h1>
        <div className="mt-8 flex gap-8 border-b border-charcoal/15" role="tablist">
          {[['signin', 'Sign In'], ['register', 'Create Account']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={mode === k} onClick={() => { setMode(k); setErr(''); }} className={'pb-3 navlabel -mb-px border-b ' + (mode === k ? 'border-ink' : 'border-transparent text-charcoal/50')}>{l}</button>
          ))}
        </div>
        <form onSubmit={submit} noValidate className="mt-8 space-y-6">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-6">
              <label><span className="text-[11.5px] uppercase tracking-[.14em] text-charcoal/60">First name</span><input className="field" value={f.first} onChange={(e) => setF({ ...f, first: e.target.value })} autoComplete="given-name" /></label>
              <label><span className="text-[11.5px] uppercase tracking-[.14em] text-charcoal/60">Last name</span><input className="field" value={f.last} onChange={(e) => setF({ ...f, last: e.target.value })} autoComplete="family-name" /></label>
            </div>
          )}
          <label className="block"><span className="text-[11.5px] uppercase tracking-[.14em] text-charcoal/60">Email</span><input type="email" className="field" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></label>
          <label className="block"><span className="text-[11.5px] uppercase tracking-[.14em] text-charcoal/60">Password</span><input type="password" className="field" value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /></label>
          {err && <p className="text-[12.5px] text-[#9b3b2b]" role="alert">{err}</p>}
          <button className="btn-dark w-full">{mode === 'signin' ? 'Sign In' : 'Create Account'}</button>
          <p className="text-[12px] text-charcoal/55">Demo account: your name and email are kept only in this browser, and the password is never stored.</p>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function CollectionsPage() {
  return (
    <div className="page-in">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 pt-10 md:pt-16">
        <Breadcrumbs items={[['Home', 'home'], ['Collections']]} />
        <h1 className="display text-[56px] md:text-[120px] mt-6">Collections</h1>
        <p className="mt-4 font-serif text-[20px] md:text-[24px] text-charcoal/75 max-w-[620px]">Autumn–Winter 2026. Four edits from one wardrobe, designed to be worn together.</p>
      </div>
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 mt-12 md:mt-16 grid md:grid-cols-2 gap-x-6 gap-y-14">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.id} delay={(i % 2) * 120}>
            <a href={'#' + c.id} className="group block">
              <div className="overflow-hidden"><div className="transition-transform duration-[1600ms] ease-lux group-hover:scale-[1.04]"><Scene name={c.scene} className="aspect-[4/5] md:aspect-[5/6]" alt={c.title} /></div></div>
              <p className="mt-6 eyebrow text-taupe">{c.eyebrow} · {PRODUCTS.filter(c.filter).length} pieces</p>
              <h2 className="display text-[36px] md:text-[52px] mt-3">{c.title}</h2>
              <p className="mt-3 text-[14.5px] text-charcoal/70 max-w-[440px]">{c.blurb}</p>
              <span className="mt-5 inline-flex navlabel items-center gap-2 group-hover:gap-3 transition-all">Explore Collection <ArrowRight size={14} strokeWidth={1.3} /></span>
            </a>
          </Reveal>
        ))}
      </div>
      <CategoryGrid />
      <NewsletterSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function JournalPage() {
  return (
    <div className="page-in">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 pt-10 md:pt-16">
        <Breadcrumbs items={[['Home', 'home'], ['Journal']]} />
        <h1 className="display text-[64px] md:text-[140px] mt-6">Journal</h1>
        <p className="mt-4 font-serif text-[20px] md:text-[24px] text-charcoal/75 max-w-[620px]">Essays, guides and notes on craft from the Maison Élan studio.</p>
      </div>
      <a href={'#journal-' + JOURNAL[0].id} className="group block mx-auto max-w-[1600px] px-5 md:px-10 mt-12 md:mt-16">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16 items-end">
          <div className="overflow-hidden"><div className="transition-transform duration-[1600ms] ease-lux group-hover:scale-[1.03]"><Scene name={JOURNAL[0].scene} className="aspect-[16/10]" alt={JOURNAL[0].title} /></div></div>
          <div>
            <p className="eyebrow text-taupe">Featured · {JOURNAL[0].tag} · {JOURNAL[0].date}</p>
            <h2 className="display text-[40px] md:text-[60px] mt-4 group-hover:italic">{JOURNAL[0].title}</h2>
            <p className="mt-4 text-[15px] text-charcoal/70">{JOURNAL[0].dek}</p>
            <span className="mt-6 inline-flex navlabel items-center gap-2 group-hover:gap-3 transition-all">Read Story <ArrowRight size={14} strokeWidth={1.3} /></span>
          </div>
        </div>
      </a>
      <JournalGrid heading={false} />
      <NewsletterSection />
    </div>
  );
}

export function ArticlePage({ id }) {
  const a = JOURNAL.find((x) => x.id === id);
  if (!a) return null;
  const others = JOURNAL.filter((x) => x.id !== id);
  const shop = ['tailored-wool-blazer', 'oversized-cashmere-sweater', 'relaxed-tailored-trousers', 'premium-cotton-shirt'].map(getProduct);
  return (
    <article className="page-in">
      <header className="mx-auto max-w-[1000px] px-5 md:px-10 pt-10 md:pt-20 text-center">
        <p className="eyebrow text-taupe">{a.tag} · {a.date} · {a.read}</p>
        <h1 className="display text-[44px] md:text-[96px] mt-6">{a.title}</h1>
        <p className="mt-6 font-serif text-[20px] md:text-[26px] text-charcoal/75 max-w-[720px] mx-auto">{a.dek}</p>
      </header>
      <div className="mx-auto max-w-[1600px] md:px-10 mt-12 md:mt-16"><Scene name={a.scene} className="aspect-[4/5] sm:aspect-[16/9]" alt={a.title} priority /></div>
      <div className="mx-auto max-w-[680px] px-5 mt-14 md:mt-20 space-y-7 text-[16.5px] md:text-[18px] leading-[1.85] text-charcoal/85">
        {a.body.map((p, i) => (
          <p key={i} className={i === 0 ? 'first-letter:font-serif first-letter:text-[78px] first-letter:float-left first-letter:leading-[0.8] first-letter:mr-3 first-letter:mt-2' : ''}>{p}</p>
        ))}
        <p className="pt-6 border-t border-charcoal/15 text-[13px] text-charcoal/55">Words by the Maison Élan studio.</p>
      </div>
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pt-20 md:pt-28" aria-labelledby="shop-story">
        <h2 id="shop-story" className="display text-[36px] md:text-[52px]">Shop <em>the Story</em></h2>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-10">{shop.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>
      <JournalGrid items={others} heading={false} />
      <div className="pb-24" />
    </article>
  );
}

/* ------------------------------------------------------------------ */
export function StoryPage() {
  return (
    <div className="page-in">
      <section className="relative h-[80svh] min-h-[520px] bg-ink text-ivory overflow-hidden">
        <div className="absolute inset-0 slow-zoom"><Scene name="story" className="h-full w-full" alt="The Maison Élan atelier in Paris" priority /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="relative h-full mx-auto max-w-[1600px] px-5 md:px-10 flex flex-col justify-end pb-14">
          <p className="eyebrow text-ivory/75">Our Story</p>
          <h1 className="display text-[54px] md:text-[120px] mt-4">BEYOND TRENDS.<br /><em>BEYOND SEASONS.</em></h1>
        </div>
      </section>
      <div className="mx-auto max-w-[1100px] px-5 md:px-10 py-20 md:py-32 grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-20">
        <p className="font-serif text-[26px] md:text-[36px] leading-[1.2]">Fewer things, made properly, worn for years.</p>
        <div className="space-y-6 text-[16px] leading-[1.85] text-charcoal/80">
          <p>Maison Élan began in 2016 in a two-room studio in the Marais, with one coat, one blazer and a pair of trousers. The founders had spent a decade in large fashion houses and wanted to work at a slower pace: fewer pieces, better cloth, and the same people sewing them each season.</p>
          <p>Today we work with eleven partner workshops in Italy, Portugal and Scotland. Most are family businesses; several are run by the second or third generation. We visit each one at least twice a year, and we pay for cloth and labour before we set a retail price, never after.</p>
          <p>Our palette changes slowly on purpose. Charcoal, oat, camel and ivory return every season, so a sweater bought this year will still sit beside the trousers you bought three years ago.</p>
        </div>
      </div>
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 grid md:grid-cols-3 gap-4">
        {[['Cloth', 'Wool from Biella and Prato, cashmere spun in Scotland, silk woven in Como.', 'journal1'], ['Craft', 'Half-canvas tailoring, fully fashioned knits, hand-painted leather edges.', 'journal3'], ['Care', 'Free repairs for the first two years on every coat and blazer.', 'journal2']].map(([t, d, s]) => (
          <Reveal key={t}><Scene name={s} className="aspect-[4/5]" alt={t} /><h2 className="font-serif text-[30px] mt-6">{t}</h2><p className="mt-2 text-[14.5px] text-charcoal/70">{d}</p></Reveal>
        ))}
      </div>
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 pt-20 md:pt-28 flex flex-col sm:flex-row gap-3 justify-center"><a href="#collections" className="btn-dark">Discover the Collection</a><a href="#journal" className="btn-outline">Read the Journal</a></div>
      <NewsletterSection />
    </div>
  );
}

export function CampaignPage() {
  const looks = [
    { scene: 'campaign', title: 'Look 01 · The Colonnade', ids: ['double-faced-wool-coat', 'relaxed-tailored-trousers', 'structured-leather-handbag'] },
    { scene: 'hero', title: 'Look 02 · Two Arches', ids: ['wool-overcoat', 'tailored-wool-blazer', 'leather-minimal-sneakers'] },
    { scene: 'women', title: 'Look 03 · Camel Light', ids: ['tailored-wool-blazer', 'minimalist-silk-dress', 'cashmere-scarf'] },
    { scene: 'men', title: 'Look 04 · Columns', ids: ['cashmere-crewneck', 'pleated-wool-trousers', 'suede-loafers'] },
  ];
  return (
    <div className="page-in">
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pt-10 md:pt-16">
        <Breadcrumbs items={[['Home', 'home'], ['The Campaign']]} />
        <p className="eyebrow text-taupe mt-8">Autumn–Winter 2026</p>
        <h1 className="display text-[56px] md:text-[140px] mt-4">LESS, <em>BUT BETTER.</em></h1>
        <p className="mt-6 font-serif text-[20px] md:text-[26px] text-charcoal/75 max-w-[680px]">An appreciation of thoughtful design, beautiful materials, and pieces that transcend seasons. Photographed in the colonnades of a 1930s Paris library.</p>
      </section>
      <div className="mt-14 md:mt-20 space-y-20 md:space-y-32">
        {looks.map((l, i) => (
          <section key={l.title} className={'mx-auto max-w-[1600px] px-5 md:px-10 grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-14 items-end ' + (i % 2 ? 'lg:grid-cols-[1fr_1.6fr]' : '')}>
            <Reveal className={i % 2 ? 'lg:order-2' : ''}><Scene name={l.scene} className="aspect-[4/5] sm:aspect-[16/11]" alt={l.title} /></Reveal>
            <Reveal delay={120}>
              <p className="eyebrow text-taupe">{l.title}</p>
              <p className="font-serif text-[28px] md:text-[36px] mt-4 leading-tight">Shop the look</p>
              <ul className="mt-6 divide-y divide-charcoal/10 border-y border-charcoal/10">
                {l.ids.map((id) => {
                  const p = getProduct(id);
                  return (
                    <li key={id}>
                      <a href={'#product-' + id} className="py-4 flex items-center gap-4 group">
                        <ProductImage product={p} className="w-16 aspect-[4/5] shrink-0" />
                        <span className="flex-1 text-[14px] group-hover:underline underline-offset-4">{p.name}</span>
                        <span className="text-[14px] tabular-nums">{euro(p.price)}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </section>
        ))}
      </div>
      <div className="mt-24 text-center"><a href="#story" className="btn-dark">Discover the Story</a></div>
      <NewsletterSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function InfoPage({ topic }) {
  const t = INFO[topic];
  if (!t) return null;
  return (
    <div className="page-in mx-auto max-w-[1200px] px-5 md:px-10 pt-10 md:pt-16 pb-24">
      <Breadcrumbs items={[['Home', 'home'], ['Client Services', 'help-contact'], [t.title]]} />
      <div className="mt-8 grid md:grid-cols-[240px_1fr] gap-10 md:gap-20">
        <nav aria-label="Client services" className="order-2 md:order-1">
          <p className="eyebrow text-taupe mb-5">Client Services</p>
          <ul className="space-y-3 text-[14px]">
            {Object.entries(INFO).map(([k, v]) => (
              <li key={k}><a href={'#help-' + k} aria-current={k === topic ? 'page' : undefined} className={'link-u ' + (k === topic ? 'text-ink font-medium' : 'text-charcoal/65 hover:text-ink')}>{v.title}</a></li>
            ))}
          </ul>
        </nav>
        <div className="order-1 md:order-2">
          <h1 className="display text-[48px] md:text-[80px]">{t.title}</h1>
          {t.sizeTable && <SizeTable />}
          <div className="mt-10 divide-y divide-charcoal/10 border-t border-charcoal/10">
            {t.body.map(([h, b]) => (
              <div key={h} className="py-7 grid sm:grid-cols-[220px_1fr] gap-3 sm:gap-10">
                <h2 className="font-serif text-[22px] leading-tight">{h}</h2>
                <p className="text-[15px] leading-[1.8] text-charcoal/75">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
