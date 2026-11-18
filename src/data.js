// Fictional catalogue for MAISON ÉLAN. All products, prices and copy are invented.

const C = {
  ivory: { name: 'Ivory', hex: '#EFE9DE', family: 'Neutral' },
  oat: { name: 'Oat', hex: '#D6C7AF', family: 'Neutral' },
  cream: { name: 'Cream', hex: '#E7DCC8', family: 'Neutral' },
  bone: { name: 'Bone', hex: '#DED6C7', family: 'Neutral' },
  white: { name: 'Optic White', hex: '#F4F2EE', family: 'Neutral' },
  ecru: { name: 'Ecru', hex: '#E4D9C3', family: 'Neutral' },
  champagne: { name: 'Champagne', hex: '#D4BE9C', family: 'Neutral' },
  black: { name: 'Black', hex: '#1B1A19', family: 'Black' },
  charcoal: { name: 'Charcoal', hex: '#3A3836', family: 'Grey' },
  stone: { name: 'Stone', hex: '#9C958B', family: 'Grey' },
  grey: { name: 'Grey Melange', hex: '#8E8C89', family: 'Grey' },
  taupe: { name: 'Taupe', hex: '#A99B8A', family: 'Brown' },
  camel: { name: 'Camel', hex: '#B08D66', family: 'Brown' },
  cognac: { name: 'Cognac', hex: '#8A5532', family: 'Brown' },
  chocolate: { name: 'Chocolate', hex: '#4E3A2E', family: 'Brown' },
  mocha: { name: 'Mocha', hex: '#7A6252', family: 'Brown' },
  navy: { name: 'Midnight', hex: '#283040', family: 'Blue' },
  sky: { name: 'Pale Sky', hex: '#C6D0D8', family: 'Blue' },
  sage: { name: 'Sage', hex: '#99A08B', family: 'Green' },
  olive: { name: 'Olive', hex: '#5F604A', family: 'Green' },
};

const APPAREL = ['XS', 'S', 'M', 'L', 'XL'];
const SHOES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const ONE = ['One Size'];

export const CATEGORIES = [
  { id: 'knitwear', name: 'Knitwear', shape: 'sweater', tone: '#E4DBCD', color: C.oat.hex },
  { id: 'outerwear', name: 'Outerwear', shape: 'coat', tone: '#DCD3C5', color: C.camel.hex },
  { id: 'dresses', name: 'Dresses', shape: 'dress', tone: '#E8E1D6', color: C.black.hex },
  { id: 'shirts', name: 'Shirts', shape: 'shirt', tone: '#E2DCD2', color: C.white.hex },
  { id: 'trousers', name: 'Trousers', shape: 'trousers', tone: '#E6DED1', color: C.taupe.hex },
  { id: 'accessories', name: 'Bags & Accessories', shape: 'bag', tone: '#DDD4C6', color: C.cognac.hex },
];

const P = (o) => ({
  rating: 4.8,
  care: 'Dry clean or hand wash cold. Dry flat, away from direct heat.',
  origin: 'Made in Italy',
  ...o,
});

export const PRODUCTS = [
  P({
    id: 'oversized-cashmere-sweater', name: 'Oversized Cashmere Sweater', price: 189, category: 'knitwear', gender: 'women', shape: 'sweater',
    colors: [C.oat, C.charcoal, C.ivory], sizes: APPAREL, isNew: true, essential: true, popularity: 98, added: 20261110,
    material: '100% Grade-A Mongolian cashmere, 12-gauge knit',
    description: 'A generous, dropped-shoulder sweater knitted from long-fibre cashmere. The volume sits easily over tailoring or alone with a slim trouser, and the fibre softens further with every wear.',
    details: ['Relaxed, oversized fit', 'Dropped shoulders and ribbed crew neck', 'Ribbed cuffs and hem', 'Model is 177 cm and wears size S'],
  }),
  P({
    id: 'tailored-wool-blazer', name: 'Tailored Wool Blazer', price: 295, category: 'outerwear', gender: 'women', shape: 'blazer',
    colors: [C.camel, C.black, C.stone], sizes: APPAREL, isNew: true, essential: true, popularity: 95, added: 20261108,
    material: '98% virgin wool, 2% elastane. Lining: 100% cupro',
    description: 'Cut from Italian wool with a touch of stretch, this single-breasted blazer has a softly padded shoulder and a waist that follows the body without pinching. Built to be worn as often as a cardigan.',
    details: ['Single-breasted, two-button closure', 'Notch lapels and flap pockets', 'Half-canvas construction', 'Fully lined in breathable cupro'],
  }),
  P({
    id: 'minimalist-silk-dress', name: 'Minimalist Silk Dress', price: 225, category: 'dresses', gender: 'women', shape: 'dress',
    colors: [C.champagne, C.black, C.sage], sizes: APPAREL, isNew: true, popularity: 92, added: 20261105,
    material: '100% mulberry silk charmeuse, 22 momme',
    description: 'A bias-cut slip dress in heavy silk charmeuse that falls to mid-calf. Fine adjustable straps and a cowl-free neckline keep the line clean, day or evening.',
    details: ['Bias cut for natural drape', 'Adjustable spaghetti straps', 'Mid-calf length', 'French seams throughout'],
  }),
  P({
    id: 'premium-cotton-shirt', name: 'Premium Cotton Shirt', price: 115, category: 'shirts', gender: 'men', shape: 'shirt',
    colors: [C.white, C.sky, C.ecru], sizes: APPAREL, isNew: true, essential: true, popularity: 90, added: 20261103,
    material: '100% long-staple Egyptian cotton poplin, 120s two-fold',
    description: 'A crisp, slightly relaxed shirt in two-fold poplin with a soft semi-spread collar. Mother-of-pearl buttons and a curved hem that works tucked or loose.',
    details: ['Semi-spread collar', 'Mother-of-pearl buttons', 'Single-needle stitching', 'Curved hem'],
    care: 'Machine wash at 30°C. Iron while slightly damp.', origin: 'Made in Portugal',
  }),
  P({
    id: 'relaxed-tailored-trousers', name: 'Relaxed Tailored Trousers', price: 165, category: 'trousers', gender: 'women', shape: 'trousers',
    colors: [C.taupe, C.black, C.cream], sizes: APPAREL, isNew: true, essential: true, popularity: 89, added: 20261101,
    material: '64% wool, 34% viscose, 2% elastane',
    description: 'High-rise trousers with a single front pleat and a straight, easy leg that breaks just above the shoe. The fabric has enough weight to hang well and enough give to sit in all day.',
    details: ['High rise with single pleat', 'Concealed hook-and-bar closure', 'Side slip pockets', 'Pressed crease'],
  }),
  P({
    id: 'structured-leather-handbag', name: 'Structured Leather Handbag', price: 340, category: 'accessories', gender: 'women', shape: 'bag',
    colors: [C.cognac, C.black, C.bone], sizes: ONE, isNew: true, popularity: 97, added: 20261109,
    material: 'Full-grain calf leather, suede-lined interior',
    description: 'A compact top-handle bag with a rigid base and a magnetic flap. Holds a phone, cardholder and keys, with a detachable strap for wearing across the body.',
    details: ['W 26 × H 19 × D 10 cm', 'Detachable adjustable strap', 'Interior slip pocket', 'Brushed gold-tone hardware'],
    care: 'Wipe with a soft dry cloth. Store in the dust bag provided.',
  }),
  P({
    id: 'merino-knit-polo', name: 'Merino Knit Polo', price: 145, category: 'knitwear', gender: 'men', shape: 'polo',
    colors: [C.navy, C.oat, C.chocolate], sizes: APPAREL, isNew: true, popularity: 86, added: 20261028,
    material: '100% extra-fine merino wool, 14-gauge',
    description: 'A long-sleeve polo in fine merino with an open, buttonless collar. Light enough to layer under a blazer, smart enough to wear on its own.',
    details: ['Open collar, no buttons', 'Fully fashioned shoulders', 'Ribbed cuffs and hem', 'Regular fit'],
  }),
  P({
    id: 'leather-minimal-sneakers', name: 'Leather Minimal Sneakers', price: 175, category: 'accessories', gender: 'unisex', shape: 'sneaker',
    colors: [C.white, C.black, C.taupe], sizes: SHOES, isNew: true, essential: true, popularity: 94, added: 20261026,
    material: 'Nappa leather upper, leather lining, natural rubber sole',
    description: 'A clean low-top built on a stitched cup sole. No logos, tonal laces, and a padded collar that needs almost no breaking in.',
    details: ['Margom rubber cup sole', 'Removable leather insole', 'Tonal waxed laces', 'True to EU size'],
    care: 'Wipe clean with a damp cloth. Use a leather conditioner monthly.', origin: 'Made in Portugal',
  }),
  P({
    id: 'double-faced-wool-coat', name: 'Double-Faced Wool Coat', price: 420, category: 'outerwear', gender: 'women', shape: 'coat',
    colors: [C.camel, C.charcoal], sizes: APPAREL, essential: true, popularity: 88, added: 20260920,
    material: '90% wool, 10% cashmere, double-faced',
    description: 'An unlined wrap coat made by hand-finishing two layers of wool and cashmere into one. Light on the shoulders and warm well into winter.',
    details: ['Wrap front with self-tie belt', 'Hand-finished edges', 'Patch pockets', 'Falls below the knee'],
  }),
  P({
    id: 'ribbed-knit-midi-dress', name: 'Ribbed Knit Midi Dress', price: 195, category: 'dresses', gender: 'women', shape: 'dress',
    colors: [C.mocha, C.cream], sizes: APPAREL, popularity: 80, added: 20260915,
    material: '70% wool, 30% cashmere rib knit',
    description: 'A close-fitting rib dress with a high neck and long sleeves. The knit holds its shape and moves with you, so it works with boots in winter and sandals in spring.',
    details: ['Fitted silhouette', 'High crew neck', 'Midi length with side vent', 'Fully fashioned'],
  }),
  P({
    id: 'silk-satin-blouse', name: 'Silk Satin Blouse', price: 160, category: 'shirts', gender: 'women', shape: 'shirt',
    colors: [C.ivory, C.black, C.champagne], sizes: APPAREL, popularity: 84, added: 20261002,
    material: '100% silk satin',
    description: 'A fluid blouse with a narrow collar and covered placket. Tuck it into tailoring or wear it open over a slip for evening.',
    details: ['Concealed button placket', 'Narrow point collar', 'Single-button cuffs', 'Relaxed fit'],
  }),
  P({
    id: 'pleated-wide-leg-trousers', name: 'Pleated Wide-Leg Trousers', price: 175, category: 'trousers', gender: 'women', shape: 'trousers',
    colors: [C.black, C.stone], sizes: APPAREL, popularity: 78, added: 20260901,
    material: '100% wool gabardine',
    description: 'Wide, full-length trousers with double front pleats and a deep turn-up. Gabardine gives them a clean, dry hand and a lot of movement.',
    details: ['Double front pleats', 'Wide leg with 4 cm turn-up', 'Belt loops', 'Full length'],
  }),
  P({
    id: 'fine-knit-cardigan', name: 'Fine Knit Cardigan', price: 175, category: 'knitwear', gender: 'women', shape: 'cardigan',
    colors: [C.ivory, C.navy, C.taupe], sizes: APPAREL, popularity: 82, added: 20261012,
    material: '70% silk, 30% cashmere, 16-gauge',
    description: 'A slim V-neck cardigan in silk and cashmere, finished with horn buttons. Thin enough to sit under a coat without bulk.',
    details: ['V-neck', 'Genuine horn buttons', 'Slim fit', 'Fully fashioned'],
  }),
  P({
    id: 'cashmere-crewneck', name: 'Cashmere Crewneck', price: 210, category: 'knitwear', gender: 'men', shape: 'sweater',
    colors: [C.grey, C.navy, C.camel], sizes: APPAREL, essential: true, popularity: 91, added: 20260925,
    material: '100% cashmere, 12-gauge',
    description: 'The crewneck we would keep if we could keep only one. Regular fit, saddle shoulders and enough weight to wear on its own through autumn.',
    details: ['Regular fit', 'Saddle shoulders', 'Ribbed trims', 'Model is 186 cm and wears size M'],
  }),
  P({
    id: 'unstructured-linen-blazer', name: 'Unstructured Linen Blazer', price: 265, category: 'outerwear', gender: 'men', shape: 'blazer',
    colors: [C.olive, C.ecru, C.navy], sizes: APPAREL, popularity: 76, added: 20260810,
    material: '55% linen, 45% wool',
    description: 'A soft-shouldered jacket without padding or canvas, made in a linen and wool blend that creases well and breathes on warm days.',
    details: ['Unlined, unpadded', 'Patch pockets', 'Two-button front', 'Single back vent'],
  }),
  P({
    id: 'wool-overcoat', name: 'Wool Overcoat', price: 460, category: 'outerwear', gender: 'men', shape: 'coat',
    colors: [C.charcoal, C.camel, C.black], sizes: APPAREL, essential: true, popularity: 87, added: 20261015,
    material: '80% wool, 20% cashmere',
    description: 'A single-breasted overcoat with a concealed placket and a length that covers a blazer. Cut with room through the chest for knitwear underneath.',
    details: ['Concealed button placket', 'Notch lapels', 'Below-knee length', 'Inside welt pocket'],
  }),
  P({
    id: 'oxford-button-down', name: 'Oxford Button-Down', price: 120, category: 'shirts', gender: 'men', shape: 'shirt',
    colors: [C.sky, C.white], sizes: APPAREL, popularity: 79, added: 20260830,
    material: '100% cotton oxford, garment washed',
    description: 'A garment-washed oxford with a soft roll to the collar. It looks lived-in from the first wear and only improves.',
    details: ['Button-down collar', 'Box pleat at back', 'Chest pocket', 'Relaxed fit'],
    care: 'Machine wash at 30°C.', origin: 'Made in Portugal',
  }),
  P({
    id: 'pleated-wool-trousers', name: 'Pleated Wool Trousers', price: 180, category: 'trousers', gender: 'men', shape: 'trousers',
    colors: [C.charcoal, C.taupe, C.navy], sizes: APPAREL, popularity: 81, added: 20261020,
    material: '100% tropical wool',
    description: 'Single-pleat trousers in lightweight tropical wool with side adjusters in place of belt loops. A tapered leg finishes neatly over a sneaker or loafer.',
    details: ['Single forward pleat', 'Side adjusters', 'Tapered leg', 'Unfinished hem for tailoring'],
  }),
  P({
    id: 'leather-tote', name: 'Soft Leather Tote', price: 290, category: 'accessories', gender: 'women', shape: 'tote',
    colors: [C.black, C.camel], sizes: ONE, popularity: 85, added: 20260905,
    material: 'Vegetable-tanned grained leather',
    description: 'An unlined tote large enough for a 14-inch laptop, with a removable zip pouch inside. The leather darkens and softens over time.',
    details: ['W 40 × H 32 × D 14 cm', 'Removable zip pouch', 'Shoulder-length handles', 'Raw edges, hand-painted'],
    care: 'Wipe with a soft dry cloth. Store stuffed, in the dust bag provided.',
  }),
  P({
    id: 'cashmere-scarf', name: 'Cashmere Scarf', price: 135, category: 'accessories', gender: 'unisex', shape: 'scarf',
    colors: [C.oat, C.charcoal, C.camel], sizes: ONE, essential: true, popularity: 83, added: 20261018,
    material: '100% cashmere, woven',
    description: 'A woven cashmere scarf, long enough to wrap twice, finished with a short hand-twisted fringe.',
    details: ['200 × 35 cm', 'Hand-twisted fringe', 'Woven in Scotland', 'Gift-boxed'],
    origin: 'Made in Scotland',
  }),
  P({
    id: 'leather-belt', name: 'Leather Belt', price: 95, category: 'accessories', gender: 'unisex', shape: 'belt',
    colors: [C.black, C.cognac], sizes: ['80', '90', '100'], popularity: 70, added: 20260801,
    material: 'Full-grain leather, solid brass buckle',
    description: 'A 3 cm belt in full-grain leather with a plain brass buckle. Sized in centimetres from the buckle to the middle hole.',
    details: ['Width 3 cm', 'Solid brass buckle', 'Five holes', 'Edge-painted by hand'],
    care: 'Condition occasionally with leather balm.',
  }),
  P({
    id: 'leather-card-holder', name: 'Leather Card Holder', price: 75, category: 'accessories', gender: 'unisex', shape: 'card',
    colors: [C.black, C.cognac, C.sage], sizes: ONE, popularity: 77, added: 20261006,
    material: 'Grained calf leather',
    description: 'Four card slots and a central pocket for folded notes, in a slim grained leather that keeps its shape.',
    details: ['10.5 × 7.5 cm', 'Four card slots', 'Central pocket', 'Blind-embossed logo'],
    care: 'Wipe with a soft dry cloth.',
  }),
  P({
    id: 'suede-loafers', name: 'Suede Penny Loafers', price: 230, category: 'accessories', gender: 'men', shape: 'loafer',
    colors: [C.chocolate, C.taupe], sizes: SHOES, popularity: 74, added: 20260920,
    material: 'Calf suede upper, Blake-stitched leather sole',
    description: 'Unlined suede loafers on a flexible Blake-stitched sole. Soft from the first day and easy to wear without socks.',
    details: ['Unlined suede', 'Blake-stitched leather sole', 'Rubber heel tip', 'Fits true to size'],
    care: 'Brush with a suede brush. Treat with protector spray.',
  }),
  P({
    id: 'wrap-midi-skirt', name: 'Wool Wrap Midi Skirt', price: 170, category: 'dresses', gender: 'women', shape: 'skirt',
    colors: [C.charcoal, C.camel], sizes: APPAREL, popularity: 72, added: 20260912,
    material: '100% wool flannel',
    description: 'A wrap skirt in soft wool flannel that ties at the side. Falls to the mid-calf and moves well when you walk.',
    details: ['Side tie wrap', 'Mid-calf length', 'Partially lined', 'High waist'],
  }),
];

// Keep only colourways that have photography (falls back to all colours if none do)
import { PHOTOS } from './photos.js';
for (const p of PRODUCTS) {
  const shot = p.colors.filter((_, i) => PHOTOS[`p-${p.id}-${i}`]);
  if (shot.length && shot.length < p.colors.length) p.colors = shot;
}

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const NEW_ARRIVAL_IDS = [
  'oversized-cashmere-sweater', 'tailored-wool-blazer', 'minimalist-silk-dress', 'premium-cotton-shirt',
  'relaxed-tailored-trousers', 'structured-leather-handbag', 'merino-knit-polo', 'leather-minimal-sneakers',
];

export const COLLECTIONS = [
  {
    id: 'women', title: "The Women's Edit", eyebrow: 'Collection 01', scene: 'women',
    blurb: 'Soft tailoring, fluid silk and cashmere cut with room to move.',
    banner: 'Tailoring with ease, silk with weight, knitwear made to be lived in.',
    filter: (p) => p.gender === 'women' || p.gender === 'unisex',
  },
  {
    id: 'men', title: "The Men's Edit", eyebrow: 'Collection 02', scene: 'men',
    blurb: 'Unstructured jackets, fine knits and shirts in honest cloth.',
    banner: 'Relaxed tailoring, fine-gauge knits and shirting for every day of the week.',
    filter: (p) => p.gender === 'men' || p.gender === 'unisex',
  },
  {
    id: 'essentials', title: 'Contemporary Essentials', eyebrow: 'Collection 03', scene: 'essentials',
    blurb: 'The ten pieces we reach for first, in colours that work together.',
    banner: 'Pieces that answer most mornings. Neutral, durable, endlessly re-combined.',
    filter: (p) => p.essential,
  },
  {
    id: 'accessories', title: 'Accessories', eyebrow: 'Collection 04', scene: 'accessories',
    blurb: 'Leather goods, scarves and shoes made in small Italian workshops.',
    banner: 'Leather goods and shoes from family workshops in Tuscany and Porto.',
    filter: (p) => p.category === 'accessories',
  },
];

export const JOURNAL = [
  {
    id: 'new-language-of-minimalism', title: 'The New Language of Minimalism', scene: 'journal1', tag: 'Perspective', date: '12 November 2026', read: '5 min read',
    dek: 'Minimalism used to mean less colour and fewer things. Now it means fewer, better decisions.',
    body: [
      'For a long time minimalism was a look: white walls, black clothes, nothing on the table. It photographed well and it was easy to copy, which is part of why it wore thin.',
      'The version we care about is quieter and more practical. It is about the number of decisions a garment asks of you. A coat that goes with every trouser you own asks for none. A jacket that only works with one shirt asks for several, every morning.',
      'When we design a season we start with that question. How many things in the wardrobe does this piece agree with? The Tailored Wool Blazer was cut to sit over a silk slip, a cashmere crewneck and a cotton shirt with equal ease. The colour range is narrow on purpose: camel, black and stone sit beside each other without effort.',
      'Minimalism in this sense is not an absence. It is a set of good agreements, made once, so you can stop negotiating with your closet and get dressed.',
    ],
  },
  {
    id: 'building-a-timeless-wardrobe', title: 'Building a Timeless Wardrobe', scene: 'journal2', tag: 'Guide', date: '4 November 2026', read: '7 min read',
    dek: 'Twelve pieces, three colours and a rule about trousers. A practical guide from our design studio.',
    body: [
      'Start with trousers. Most people buy tops first because they are more fun, then find nothing to wear them with. Two pairs of well-cut trousers, one dark and one light, will carry more outfits than any single sweater.',
      'Pick three colours and commit for a year. Ours would be charcoal, oat and camel. Every knit, shirt and coat you add should sit comfortably next to at least two of them.',
      'Buy outerwear last and buy it well. A coat is the garment most people see you in for five months of the year, so it is worth the larger share of the budget. Look at the seams on the inside, the weight of the cloth and how the shoulder sits when you raise your arms.',
      'Then stop for a season. Wear what you have, notice the gaps and fill only those. A wardrobe built this way grows slowly, but almost nothing in it goes unworn.',
    ],
  },
  {
    id: 'the-details-that-define-luxury', title: 'The Details That Define Luxury', scene: 'journal3', tag: 'Craft', date: '27 October 2026', read: '4 min read',
    dek: 'Mother-of-pearl, French seams and hand-painted edges. What you notice after the hundredth wear.',
    body: [
      'Luxury is easy to claim and hard to fake up close. Turn a shirt inside out and look at the seams. Single-needle stitching runs in one tidy line; a cheaper shirt shows two rows and puckers after a few washes.',
      'Buttons tell you a lot. Real mother-of-pearl is cool to the touch and has a faint rainbow in the light. Plastic copies are warm and uniform.',
      'On leather goods, check the edges. Hand-painted edges are smooth and slightly rounded, with layers of paint sanded between coats. Folded or raw-cut edges are fine too, but they should be clean, never fraying.',
      'None of these details show in a photograph. They show on the hundredth wear, when the garment still looks the way it did on the first.',
    ],
  },
];

export const INFO = {
  shipping: {
    title: 'Shipping', body: [
      ['Complimentary standard shipping', 'Orders over €150 ship free within the EU, the UK and Switzerland. Standard delivery takes 2 to 4 working days.'],
      ['Standard shipping under €150', 'A flat rate of €9 applies to orders under €150.'],
      ['Express delivery', 'Next working day delivery for €18 when ordered before 14:00 CET, Monday to Friday.'],
      ['International orders', 'We ship to 42 countries. Duties and taxes are calculated at checkout so there is nothing to pay on arrival.'],
    ],
  },
  returns: {
    title: 'Returns & Exchanges', body: [
      ['30-day returns', 'Return unworn items with tags attached within 30 days of delivery for a full refund.'],
      ['Free collection', 'Book a courier collection from your account. Returns from the EU are free.'],
      ['Exchanges', 'Exchange for a different size or colour at no cost. We dispatch the replacement as soon as the return is scanned.'],
      ['Refunds', 'Refunds are issued to the original payment method within 5 working days of the return reaching our atelier.'],
    ],
  },
  'size-guide': { title: 'Size Guide', sizeTable: true, body: [] },
  contact: {
    title: 'Contact Us', body: [
      ['Client services', 'Monday to Saturday, 09:00 to 19:00 CET. Email client@maison-elan.example or call +33 1 84 00 00 00.'],
      ['Atelier & showroom', '18 Rue du Temple Imaginaire, 75003 Paris, France. Visits by appointment.'],
      ['Press', 'press@maison-elan.example'],
    ],
  },
  care: {
    title: 'Garment Care', body: [
      ['Cashmere and merino', 'Hand wash cold with wool detergent, press out water in a towel and dry flat. Rest knitwear for a day between wears.'],
      ['Silk', 'Dry clean, or hand wash cold with a silk detergent. Never wring. Iron on the reverse at low heat.'],
      ['Leather', 'Keep away from direct heat and store in the dust bag. Condition every few months.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy', body: [
      ['Portfolio demonstration', 'This website is a fictional brand created as a design and development portfolio piece. The site itself stores nothing on a server. Payment details and delivery addresses entered at checkout are handled by Stripe in test mode.'],
      ['Local storage', 'Your bag, wishlist and demo account are saved only in this browser using local storage so they persist between visits. Clear your browser data to remove them.'],
    ],
  },
  terms: {
    title: 'Terms & Conditions', body: [
      ['Demonstration only', 'MAISON ÉLAN is fictional. Checkout uses Stripe in test mode: only Stripe test cards are accepted, no money is taken and no orders are fulfilled.'],
      ['Imagery', 'Imagery on this site is art-directed for demonstration purposes.'],
    ],
  },
  accessibility: {
    title: 'Accessibility', body: [
      ['Our commitment', 'The site is built with semantic HTML, keyboard-accessible controls, visible focus states and text alternatives for images.'],
      ['Reduced motion', 'If your system asks for reduced motion, animations on this site are minimised.'],
    ],
  },
};

export const SIZE_TABLE = {
  head: ['Size', 'EU', 'UK', 'US', 'Bust / Chest (cm)', 'Waist (cm)', 'Hip (cm)'],
  rows: [
    ['XS', '34', '6', '2', '80–84', '62–66', '88–92'],
    ['S', '36', '8', '4', '84–88', '66–70', '92–96'],
    ['M', '38', '10', '6', '88–94', '70–76', '96–102'],
    ['L', '40', '12', '8', '94–100', '76–82', '102–108'],
    ['XL', '42', '14', '10', '100–106', '82–88', '108–114'],
  ],
};

export const FREE_SHIPPING = 150;
export const SHIP_STANDARD = 9;
export const SHIP_EXPRESS = 18;

export const euro = (n) =>
  '€' + (Number.isInteger(n) ? n.toLocaleString('en-IE') : n.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
