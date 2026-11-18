// Stripe Payment Links (TEST MODE). Created in the Stripe sandbox; no real payments.
// Each link redirects back to /?paid={CHECKOUT_SESSION_ID}#order-confirmed after payment.
export const STRIPE_TEST_MODE = true;

export const STRIPE_LINKS = {
  'oversized-cashmere-sweater': 'https://buy.stripe.com/test_28E4gzf6p7K09f0fQd0Ba00',
  'tailored-wool-blazer': 'https://buy.stripe.com/test_00w3cv5vP1lC8aW33r0Ba01',
  'minimalist-silk-dress': 'https://buy.stripe.com/test_bJe3cvaQ9e8o0Iu7jH0Ba02',
  'premium-cotton-shirt': 'https://buy.stripe.com/test_8x200j4rL5BS2QC7jH0Ba03',
  'relaxed-tailored-trousers': 'https://buy.stripe.com/test_7sY8wPcYhaWc62O7jH0Ba04',
  'structured-leather-handbag': 'https://buy.stripe.com/test_cNi00jgat5BSezkfQd0Ba05',
  'merino-knit-polo': 'https://buy.stripe.com/test_eVq3cv2jDaWc62O1Zn0Ba06',
  'leather-minimal-sneakers': 'https://buy.stripe.com/test_9B614nbUdaWccrc8nL0Ba07',
  'double-faced-wool-coat': 'https://buy.stripe.com/test_fZudR9cYh7K0aj4gUh0Ba08',
  'ribbed-knit-midi-dress': 'https://buy.stripe.com/test_cNi6oHbUdfcs2QCcE10Ba09',
  'silk-satin-blouse': 'https://buy.stripe.com/test_3cIaEXe2l0hygHsavT0Ba0a',
  'pleated-wide-leg-trousers': 'https://buy.stripe.com/test_5kQ14n5vP7K03UGavT0Ba0b',
  'fine-knit-cardigan': 'https://buy.stripe.com/test_7sY9AT1fz3tK9f0bzX0Ba0c',
  'cashmere-crewneck': 'https://buy.stripe.com/test_bJe00j5vP3tK9f033r0Ba0d',
  'unstructured-linen-blazer': 'https://buy.stripe.com/test_8x24gz9M57K0dvg1Zn0Ba0e',
  'wool-overcoat': 'https://buy.stripe.com/test_bJebJ10bv6FW0Iu7jH0Ba0f',
  'oxford-button-down': 'https://buy.stripe.com/test_eVq00jcYh3tKfDo0Vj0Ba0g',
  'pleated-wool-trousers': 'https://buy.stripe.com/test_9B64gz9M58O4bn85bz0Ba0h',
  'leather-tote': 'https://buy.stripe.com/test_28E8wPaQ97K00Iu9rP0Ba0i',
  'cashmere-scarf': 'https://buy.stripe.com/test_6oU5kD4rLe8ocrc7jH0Ba0j',
  'leather-belt': 'https://buy.stripe.com/test_aFa4gz8I14xOdvg6fD0Ba0k',
  'leather-card-holder': 'https://buy.stripe.com/test_28E6oHf6pfcs2QCdI50Ba0l',
  'suede-loafers': 'https://buy.stripe.com/test_4gM5kD5vPggwezk6fD0Ba0m',
  'wrap-midi-skirt': 'https://buy.stripe.com/test_4gMbJ10bv9S80IuavT0Ba0n',
};

const clean = (s) => String(s).replace(/[^A-Za-z0-9_-]+/g, '-').slice(0, 60);

// Builds the Payment Link URL. The chosen size/colour travel as client_reference_id,
// which shows on the payment in the Stripe dashboard.
export function stripeUrl(productId, { size, color, email } = {}) {
  const base = STRIPE_LINKS[productId];
  if (!base) return null;
  const q = new URLSearchParams();
  q.set('client_reference_id', clean(`${productId}__${size || 'na'}__${color || 'na'}`));
  if (email) q.set('prefilled_email', email);
  q.set('locale', 'en');
  return `${base}?${q.toString()}`;
}
