import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Adoption from './pages/Adoption';
import PetDetails from './pages/PetDetails';
import Store from './pages/Store';
import ProductDetails from './pages/ProductDetails';
import Diseases from './pages/Diseases';
import DiseaseDetails from './pages/DiseaseDetails';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import RefundPolicy from './pages/RefundPolicy';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { analyticsAPI } from './services/api';

const PAGE_META: Record<string, { title: string; desc: string }> = {
  '/': { title: 'PetPal — Pet Adoption, Store & Care in India', desc: 'Adopt pets, shop quality pet supplies, and get AI-powered pet health guidance. PetPal is India\'s complete pet care platform.' },
  '/adoption': { title: 'Adopt a Pet — PetPal', desc: 'Browse dogs, cats and more looking for loving homes. Apply to adopt in minutes.' },
  '/store': { title: 'Pet Store — Food, Toys & Beds | PetPal', desc: 'Shop pet food, toys, beds and accessories at honest prices in ₹. Free shipping over ₹2,999.' },
  '/diseases': { title: 'Pet Health & Disease Guide | PetPal', desc: 'Check pet symptoms and learn about common diseases with our AI-assisted health guide.' },
  '/chat': { title: 'AI Pet Care Assistant | PetPal', desc: 'Chat with our AI assistant for instant answers about pet care, nutrition and health.' },
  '/about': { title: 'About PetPal', desc: 'Learn about PetPal — India\'s complete platform for pet adoption, supplies and care.' },
  '/contact': { title: 'Contact PetPal', desc: 'Get in touch with the PetPal team. We respond within 1 business day.' },
  '/404': { title: 'Page Not Found | PetPal', desc: 'The page you are looking for does not exist.' },
  '/terms': { title: 'Terms of Service | PetPal', desc: 'PetPal terms of service.' },
  '/privacy': { title: 'Privacy Policy | PetPal', desc: 'How PetPal collects, uses and protects your data.' },
  '/refund': { title: 'Refund & Return Policy | PetPal', desc: 'Return and refund rules for PetPal orders and adoption fees.' },
  '/cart': { title: 'Shopping Cart | PetPal', desc: 'Review your cart and checkout securely.' },
  '/login': { title: 'Sign In | PetPal', desc: 'Sign in to your PetPal account.' },
  '/register': { title: 'Create Account | PetPal', desc: 'Create a free PetPal account.' },
};

const setMeta = (path: string) => {
  const known = PAGE_META[path];
  const title = known?.title || (path.startsWith('/adoption/') ? 'Pet Details | PetPal'
    : path.startsWith('/store/') ? 'Product Details | PetPal'
    : path.startsWith('/diseases/') ? 'Pet Disease Info | PetPal'
    : path === '/profile' ? 'My Profile | PetPal'
    : path === '/admin' ? 'Admin Dashboard | PetPal'
    : path === '/checkout' ? 'Checkout | PetPal'
    : 'PetPal');
  const desc = known?.desc || 'PetPal — pet adoption, store and care platform for India.';

  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', desc);

  let og = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
  if (!og) {
    og = document.createElement('meta');
    og.setAttribute('property', 'og:title');
    document.head.appendChild(og);
  }
  og.setAttribute('content', title);
};

function RouteEffects() {
  const location = useLocation();
  useEffect(() => {
    setMeta(location.pathname);
    window.scrollTo(0, 0);
    analyticsAPI.track(location.pathname).catch(() => {});
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <RouteEffects />
          <Header />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/adoption" element={<Adoption />} />
              <Route path="/adoption/:id" element={<PetDetails />} />
              <Route path="/store" element={<Store />} />
              <Route path="/store/:id" element={<ProductDetails />} />
              <Route path="/diseases" element={<Diseases />} />
              <Route path="/diseases/:id" element={<DiseaseDetails />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
