import { ArrowRight, ArrowDown, Truck, RotateCcw, Scissors, Leaf } from 'lucide-react';
import { Reveal } from './store.jsx';
import { PRODUCTS, COLLECTIONS, CATEGORIES, JOURNAL, NEW_ARRIVAL_IDS, getProduct } from './data.js';
import { Scene, GarmentArt, Picture } from './art.jsx';
import { ProductCard, NewsletterForm } from './components.jsx';

export function SectionHead({ eyebrow, title, link, linkLabel = 'View all', className = '' }) {
  return (
    <div className={'flex items-end justify-between gap-6 ' + className}>
      <div>
        {eyebrow && <p className="eyebrow text-taupe mb-4">{eyebrow}</p>}
        <h2 className="display text-[38px] sm:text-[52px] lg:text-[68px]">{title}</h2>
      </div>
      {link && (
        <a href={'#' + link} className="hidden sm:inline-flex navlabel items-center gap-2 hover:gap-3 transition-all shrink-0 pb-2">
          {linkLabel} <ArrowRight size={14} strokeWidth={1.3} />
        </a>
      )}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[620px] max-h-[1100px] overflow-hidden bg-ink" aria-labelledby="hero-title">
      <div className="absolute inset-0 slow-zoom">
        <Scene name="hero" priority className="h-full w-full" alt="Autumn–Winter 2026 campaign: two models in tailored camel and charcoal coats beneath stone arches" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-ink/30" />
      <div className="relative h-full mx-auto max-w-[1600px] px-5 md:px-10 flex flex-col justify-end pb-16 md:pb-20 text-ivory">
        <p className="eyebrow text-ivory/80 rise" style={{ animationDelay: '.2s' }}>Autumn–Winter 2026 · The Campaign</p>
        <h1 id="hero-title" className="display mt-5 text-[54px] leading-[0.92] sm:text-[84px] lg:text-[128px] xl:text-[150px] rise" style={{ animationDelay: '.35s' }}>
          THE ART OF<br />
          <span className="italic font-normal">EFFORTLESS</span> STYLE.
        </h1>
        <div className="mt-8 md:mt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 rise" style={{ animationDelay: '.55s' }}>
          <p className="font-serif text-[19px] md:text-[24px] text-ivory/90 max-w-[440px]">Designed with intention. Made to be remembered.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#collections" className="btn-light">Discover the Collection</a>
            <a href="#campaign" className="btn-ghost-light">Explore the Campaign</a>
          </div>
        </div>
      </div>
      <a href="#featured" onClick={(e) => { e.preventDefault(); document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }); }} aria-label="Scroll to collections" className="hidden md:grid absolute bottom-8 left-1/2 -translate-x-1/2 h-11 w-11 place-items-center text-ivory/80 hover:text-ivory">
        <ArrowDown size={18} strokeWidth={1.2} className="animate-bounce" />
      </a>
    </section>
  );
}

function Promises() {
  const items = [
    [Truck, 'Complimentary shipping', 'On orders over €150', 'help-shipping'],
    [RotateCcw, '30-day returns', 'Free collection in the EU', 'help-returns'],
    [Scissors, 'Made in Europe', 'Family workshops in Italy & Portugal', 'story'],
    [Leaf, 'Considered materials', 'Traceable wool, cashmere & leather', 'journal-the-details-that-define-luxury'],
  ];
  return (
    <section className="border-b border-charcoal/10" aria-label="Our promises">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 flex md:grid md:grid-cols-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {items.map(([I, t, s, h]) => (
          <a key={t} href={'#' + h} className="snap-start shrink-0 w-[72%] sm:w-[44%] md:w-auto py-6 md:py-7 pr-6 flex items-center gap-4 group">
            <I size={20} strokeWidth={1.1} className="text-taupe shrink-0" />
            <span>
              <span className="block text-[13px] font-medium group-hover:underline underline-offset-4">{t}</span>
              <span className="block text-[12px] text-charcoal/60">{s}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function FeaturedCollections() {
  const wrap = ['md:col-span-7', 'md:col-span-5 md:mt-40', 'md:col-span-5', 'md:col-span-7 md:mt-24'];
  const aspect = ['aspect-[4/5] md:aspect-[7/8]', 'aspect-[4/5]', 'aspect-[4/5]', 'aspect-[4/5] md:aspect-[7/6]'];
  return (
    <section id="featured" className="mx-auto max-w-[1600px] px-5 md:px-10 pt-20 md:pt-32" aria-labelledby="featured-title">
      <Reveal>
        <SectionHead eyebrow="The Collections" title={<span id="featured-title">Four ways to wear<br className="hidden sm:block" /> <em>the season.</em></span>} link="collections" linkLabel="All collections" />
      </Reveal>
      <div className="mt-12 md:mt-16 -mx-5 px-5 md:mx-0 md:px-0 flex md:grid md:grid-cols-12 gap-4 md:gap-x-8 md:gap-y-20 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.id} delay={(i % 2) * 120} className={'snap-start shrink-0 w-[82%] sm:w-[60%] md:w-auto ' + wrap[i]}>
            <a href={'#' + c.id} className="group block">
              <div className={'relative overflow-hidden ' + aspect[i]}>
                <div className="absolute inset-0 transition-transform duration-[1600ms] ease-lux group-hover:scale-[1.04]">
                  <Scene name={c.scene} className="h-full w-full" alt={c.title} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <div className="absolute left-5 right-5 bottom-5 md:left-8 md:bottom-8 md:right-8 text-ivory">
                  <p className="eyebrow text-ivory/75">{c.eyebrow}</p>
                  <h3 className="display text-[34px] md:text-[48px] mt-3">{c.title}</h3>
                </div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <p className="text-[14px] text-charcoal/70 max-w-[360px]">{c.blurb}</p>
                <span className="navlabel inline-flex items-center gap-2 shrink-0 link-u">Explore Collection</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function NewArrivals() {
  const items = NEW_ARRIVAL_IDS.map(getProduct);
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-10 pt-24 md:pt-40" aria-labelledby="new-title">
      <Reveal>
        <SectionHead eyebrow="New Arrivals" title={<span id="new-title">NEW SEASON.<br /><em>NEW PERSPECTIVE.</em></span>} link="new-arrivals" linkLabel="Shop new arrivals" />
      </Reveal>
      <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-5 lg:gap-x-6 gap-y-10 md:gap-y-16">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 90}><ProductCard product={p} index={i} /></Reveal>
        ))}
      </div>
      <div className="mt-12 text-center sm:hidden"><a href="#new-arrivals" className="btn-outline w-full">Shop New Arrivals</a></div>
    </section>
  );
}

function Campaign() {
  return (
    <section className="relative mt-24 md:mt-40 min-h-[86svh] md:min-h-[92vh] overflow-hidden bg-ink text-ivory flex" aria-labelledby="campaign-title">
      <div className="absolute inset-0">
        <Scene name="campaign" className="h-full w-full" alt="A model in an ivory wool coat walks through a colonnade in low evening light" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
      <div className="relative mx-auto max-w-[1600px] w-full px-5 md:px-10 flex items-end md:items-center py-16">
        <Reveal className="max-w-[640px]">
          <p className="eyebrow text-ivory/70">The Campaign · Chapter II</p>
          <h2 id="campaign-title" className="display text-[56px] sm:text-[88px] lg:text-[120px] mt-5">LESS,<br /><em>BUT BETTER.</em></h2>
          <p className="mt-7 font-serif text-[19px] md:text-[23px] leading-snug text-ivory/85 max-w-[480px]">
            An appreciation of thoughtful design, beautiful materials, and pieces that transcend seasons.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a href="#story" className="btn-light">Discover the Story</a>
            <a href="#campaign" className="btn-ghost-light">View the Lookbook</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CategoryGrid({ title = true }) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-10 pt-24 md:pt-40" aria-labelledby="cat-title">
      {title && (
        <Reveal>
          <SectionHead eyebrow="Shop by Category" title={<span id="cat-title">Find your <em>foundation.</em></span>} link="shop" linkLabel="Shop all" />
        </Reveal>
      )}
      <div className="mt-12 md:mt-16 -mx-5 px-5 md:mx-0 md:px-0 flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.id} delay={i * 70} className="snap-start shrink-0 w-[44%] sm:w-[30%] md:w-auto">
            <a href={'#shop-' + c.id} className="group block">
              <Picture photo={'cat-' + c.id} alt={c.name} className="aspect-[3/4]">
                <div className="h-full w-full transition-transform duration-[1400ms] ease-lux group-hover:scale-[1.06]">
                  <GarmentArt shape={c.shape} color={c.color} tone={c.tone} />
                </div>
              </Picture>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-serif text-[19px] md:text-[21px] group-hover:italic">{c.name}</span>
                <ArrowRight size={15} strokeWidth={1.2} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
              </div>
              <p className="text-[12px] text-charcoal/55 mt-1">{PRODUCTS.filter((p) => p.category === c.id).length} pieces</p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="mt-24 md:mt-40 bg-cream" aria-labelledby="story-title">
      <div className="mx-auto max-w-[1600px] grid lg:grid-cols-2">
        <Scene name="story" className="aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[820px]" alt="The Maison Élan atelier, a sunlit stone hall with three arched windows" />
        <Reveal className="px-5 md:px-10 lg:px-20 xl:px-28 py-16 md:py-24 flex flex-col justify-center">
          <p className="eyebrow text-taupe">The House</p>
          <h2 id="story-title" className="display text-[44px] sm:text-[60px] xl:text-[76px] mt-5">BEYOND TRENDS.<br /><em>BEYOND SEASONS.</em></h2>
          <div className="mt-8 space-y-5 text-[15px] leading-[1.8] text-charcoal/80 max-w-[520px]">
            <p>MAISON ÉLAN is a contemporary fashion label founded in Paris on a simple idea: make fewer things, and make them properly. Each collection starts with cloth, sourced from mills in Biella, Prato and the Scottish Borders, and ends in small family workshops that have sewn for us since our first season.</p>
            <p>We design for the way people actually dress. A blazer that softens with wear. A sweater you reach for in October and still wear in March. Silhouettes that ignore the calendar, in colours chosen to work with everything else you own.</p>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-charcoal/15 pt-8 max-w-[520px]">
            {[['2016', 'Founded in Paris'], ['11', 'Partner workshops'], ['94%', 'Natural fibres']].map(([n, l]) => (
              <div key={l}><dt className="font-serif text-[34px] md:text-[42px] leading-none">{n}</dt><dd className="mt-2 text-[12px] text-charcoal/60">{l}</dd></div>
            ))}
          </dl>
          <div className="mt-12"><a href="#story" className="btn-outline">Read Our Story</a></div>
        </Reveal>
      </div>
    </section>
  );
}

export function JournalGrid({ items = JOURNAL, heading = true }) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-10 pt-24 md:pt-40" aria-labelledby="journal-title">
      {heading && (
        <Reveal>
          <SectionHead eyebrow="The Journal" title={<span id="journal-title">Notes from <em>the atelier.</em></span>} link="journal" linkLabel="All stories" />
        </Reveal>
      )}
      <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-12 md:gap-8">
        {items.map((a, i) => (
          <Reveal key={a.id} delay={i * 110}>
            <a href={'#journal-' + a.id} className="group block">
              <div className="overflow-hidden">
                <div className="transition-transform duration-[1600ms] ease-lux group-hover:scale-[1.04]">
                  <Scene name={a.scene} className="aspect-[4/5]" alt={a.title} />
                </div>
              </div>
              <p className="mt-6 eyebrow text-taupe">{a.tag} · {a.read}</p>
              <h3 className="mt-3 font-serif text-[27px] md:text-[30px] leading-[1.1] group-hover:italic">{a.title}</h3>
              <p className="mt-3 text-[14px] text-charcoal/70 leading-relaxed">{a.dek}</p>
              <span className="mt-5 inline-flex navlabel items-center gap-2 group-hover:gap-3 transition-all">Read Story <ArrowRight size={14} strokeWidth={1.3} /></span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="mt-24 md:mt-40 border-t border-charcoal/10" aria-labelledby="nl-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-20 md:py-32 grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
        <Reveal>
          <p className="eyebrow text-taupe">Newsletter</p>
          <h2 id="nl-title" className="display text-[44px] sm:text-[64px] lg:text-[80px] mt-5">BE PART OF<br />THE <em>ÉLAN</em> WORLD.</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="font-serif text-[20px] md:text-[24px] leading-snug text-charcoal/80 mb-8 max-w-[520px]">Discover new collections, exclusive releases, and stories from our world.</p>
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Promises />
      <FeaturedCollections />
      <NewArrivals />
      <Campaign />
      <CategoryGrid />
      <BrandStory />
      <JournalGrid />
      <NewsletterSection />
    </>
  );
}
