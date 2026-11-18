# MAISON ÉLAN

A luxury fashion e-commerce website for a fictional designer label, built as a portfolio project.

**Live site:** https://deendev.github.io/maison-elan/

## What it does

- Editorial homepage: campaign hero, collections, new arrivals, category grid, brand story, journal and newsletter
- Collection pages with filters (category, size, colour, price) and sorting
- Product pages with gallery, colour and size selection, size guide and "You May Also Like"
- Shopping bag and wishlist saved in the browser (localStorage)
- Search, demo account with order history, journal articles, client-service pages
- Separate mobile layout with a bottom tab bar, swipe gallery and bottom sheets
- **Checkout with Stripe in test mode** (Payment Links). Use test card `4242 4242 4242 4242`, any future date, any CVC. No real money is taken.

## Stack

React 18, Vite, Tailwind CSS, Lucide icons. Fonts: Bodoni Moda and Manrope (self-hosted).
Photography generated with fal.ai (Nano Banana 2.1 and Seedream 4).

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Pushing to `main` builds the site and publishes it to GitHub Pages (Settings > Pages > Source: GitHub Actions).

## Notes

GitHub Pages hosts static files only, so checkout uses one Stripe Payment Link per product and there is no webhook. A full multi-item cart checkout with webhooks would need a small server (for example a Cloudflare Worker).
