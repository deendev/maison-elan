import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './catalog.js';
import { StoreProvider, useStore } from './store.jsx';
import { AnnouncementBar, Header, MobileMenu, MobileTabBar, SearchOverlay, BagDrawer, QuickAddSheet, SizeGuideModal, Toast, Footer } from './components.jsx';
import HomePage from './pages-home.jsx';
import { ShopPage, ProductPage, NotFound, listingFor } from './pages-shop.jsx';
import AdminApp from './admin.jsx';
import { OrderTrackingPage, CheckoutPage, ConfirmationPage, WishlistPage, AccountPage, CollectionsPage, JournalPage, ArticlePage, StoryPage, CampaignPage, InfoPage } from './pages-more.jsx';
import { JOURNAL, INFO, getProduct } from './data.js';

const TITLES = { home: 'MAISON ÉLAN | Contemporary Luxury Fashion' };

function Router() {
  const { route } = useStore();
  let page, title;
  if (route === 'home') { page = <HomePage />; title = TITLES.home; }
  else if (route.startsWith('product-') && getProduct(route.slice(8))) { const p = getProduct(route.slice(8)); page = <ProductPage id={p.id} />; title = p.name; }
  else if (listingFor(route)) { const c = listingFor(route); page = <ShopPage route={route} />; title = c.title; }
  else if (route === 'checkout') { page = <CheckoutPage />; title = 'Checkout'; }
  else if (route === 'order-confirmed') { page = <ConfirmationPage />; title = 'Order Confirmed'; }
  else if (route.startsWith('order-')) { page = <OrderTrackingPage id={route.slice(6)} />; title = 'Order ' + route.slice(6); }
  else if (route === 'wishlist') { page = <WishlistPage />; title = 'Wishlist'; }
  else if (route === 'account') { page = <AccountPage />; title = 'My Account'; }
  else if (route === 'collections') { page = <CollectionsPage />; title = 'Collections'; }
  else if (route === 'journal') { page = <JournalPage />; title = 'Journal'; }
  else if (route.startsWith('journal-') && JOURNAL.find((a) => a.id === route.slice(8))) { page = <ArticlePage id={route.slice(8)} />; title = JOURNAL.find((a) => a.id === route.slice(8)).title; }
  else if (route === 'story') { page = <StoryPage />; title = 'Our Story'; }
  else if (route === 'campaign') { page = <CampaignPage />; title = 'The Campaign'; }
  else if (route.startsWith('help-') && INFO[route.slice(5)]) { page = <InfoPage topic={route.slice(5)} />; title = INFO[route.slice(5)].title; }
  else { page = <NotFound />; title = 'Page Not Found'; }
  React.useEffect(() => { document.title = title === TITLES.home ? title : `${title} | MAISON ÉLAN`; }, [title]);
  return <main id="main" key={route} className="flex-1">{page}</main>;
}

function Shell() {
  const { route } = useStore();
  React.useEffect(() => { if (route.startsWith('admin')) document.title = 'Admin | MAISON ÉLAN'; }, [route]);
  if (route === 'admin' || route.startsWith('admin-')) return <><AdminApp route={route} /><Toast /></>;
  return (
      <div className="min-h-screen flex flex-col">
        <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }} className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-ink text-ivory px-4 py-2">Skip to content</a>
        <AnnouncementBar />
        <Header />
        <Router />
        <Footer />
        <MobileTabBar />
        <MobileMenu />
        <SearchOverlay />
        <BagDrawer />
        <QuickAddSheet />
        <SizeGuideModal />
        <Toast />
      </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
