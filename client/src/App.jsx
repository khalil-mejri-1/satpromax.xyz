import React, { useState, useEffect } from 'react';
import { useContent } from './context/ContentContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DeviceStrip } from './components/DeviceStrip';
import { Pricing } from './components/Pricing';
import { ChannelsSection } from './components/ChannelsSection';
import { SportsSection } from './components/SportsSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { EpgSection } from './components/EpgSection';
import { VodSection } from './components/VodSection';
import { DevicesSupported } from './components/DevicesSupported';
import { HowToInstall } from './components/HowToInstall';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ClientProofsSection } from './components/ClientProofsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import { Modals } from './components/Modals';
import { AdminBar } from './components/AdminBar';
import { AdminLogin } from './components/AdminLogin';
import { DownloadAppsPage } from './components/DownloadAppsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { SectionEditModal } from './components/SectionEditModal';
import { ConfirmModal } from './components/ConfirmModal';
import { LegalPage } from './components/pages/LegalPage';
import { ChannelsListPage } from './components/ChannelsListPage';
import './App.css';

function App() {
  const { isAdmin, showAdminLogin, closeAdminLogin, content } = useContent();

  const [currentCurrency, setCurrency] = useState('USD');
  const [orderModalData, setOrderModalData] = useState(null);
  const [channelExplorerOpen, setChannelExplorerOpen] = useState(false);

  // Active route/section for navigation highlight
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
      if (p === '/pricing') return 'pricing';
      if (p === '/channels') return 'channels';
      if (p === '/install' || p === '/how-to-install') return 'install';
      if (p === '/contact' || p === '/faq') return 'contact';
      if (p === '/sports') return 'sports';
      if (p === '/vod') return 'vod';
      if (p === '/devices') return 'devices';
    }
    return 'home';
  });

  // Dedicated page view mode ('home' | 'download-apps' | 'admin-dashboard' | 'channels-list' | 'terms' | 'privacy' | 'refund')
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
      if (p.includes('admin/dashboard') || p.includes('dashboard')) return 'admin-dashboard';
      if (p.includes('download-apps') || p.includes('download') || p.includes('apps')) return 'download-apps';
      if (p === '/channels-list' || p === '/all-channels') return 'channels-list';
      if (p === '/terms' || p === '/privacy' || p === '/refund') return p.slice(1);
    }
    return 'home';
  });

  const isProgrammaticScrollRef = React.useRef(false);

  // Smooth scroll to section and update clean URL
  const scrollToSection = (sectionId, pushUrl = true) => {
    isProgrammaticScrollRef.current = true;

    if (sectionId === 'home' || sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (pushUrl && window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
      setActiveSection('home');
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 900);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const navOffset = 75;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementPosition - navOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      const path = `/${sectionId}`;
      if (pushUrl && window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      setActiveSection(sectionId);

      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 900);
    } else {
      isProgrammaticScrollRef.current = false;
    }
  };

  // Direct URL access on initial load (e.g. user opens http://localhost:5173/pricing directly)
  useEffect(() => {
    const p = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const sectionRoutes = {
      '/pricing': 'pricing',
      '/channels': 'channels',
      '/install': 'install',
      '/how-to-install': 'install',
      '/contact': 'contact',
      '/faq': 'contact',
      '/sports': 'sports',
      '/vod': 'vod',
      '/devices': 'devices',
      '/epg': 'epg',
    };

    const target = sectionRoutes[p];
    if (target) {
      const timer = setTimeout(() => {
        scrollToSection(target, false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
      if (p.includes('admin/dashboard') || p.includes('dashboard')) {
        setCurrentRoute('admin-dashboard');
      } else if (p.includes('download-apps') || p.includes('download') || p.includes('apps')) {
        setCurrentRoute('download-apps');
      } else if (p === '/channels-list' || p === '/all-channels') {
        setCurrentRoute('channels-list');
      } else if (p === '/terms' || p === '/privacy' || p === '/refund') {
        setCurrentRoute(p.slice(1));
      } else {
        setCurrentRoute('home');
        const sectionRoutes = {
          '/pricing': 'pricing',
          '/channels': 'channels',
          '/install': 'install',
          '/contact': 'contact',
          '/sports': 'sports',
          '/vod': 'vod',
          '/devices': 'devices',
        };
        const target = sectionRoutes[p];
        if (target) {
          scrollToSection(target, false);
        } else if (p === '/' || p === '') {
          scrollToSection('home', false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic ScrollSpy: updates address bar to /pricing, /channels, etc. while user naturally scrolls
  useEffect(() => {
    if (currentRoute !== 'home') return;

    let timeoutId = null;
    const handleScrollSpy = () => {
      if (isProgrammaticScrollRef.current) return;
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (isProgrammaticScrollRef.current) return;
        if (window.location.pathname.includes('admin') || window.location.pathname.includes('download')) return;

        const scrollY = window.scrollY;
        if (scrollY < 260) {
          if (window.location.pathname !== '/') {
            window.history.replaceState({}, '', '/');
            setActiveSection('home');
          }
          return;
        }

        const sectionIds = ['pricing', 'channels', 'sports', 'vod', 'devices', 'install', 'contact'];
        let matchedId = null;

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 250 && rect.bottom >= 150) {
              matchedId = id;
              break;
            }
          }
        }

        if (matchedId) {
          const targetPath = `/${matchedId}`;
          if (window.location.pathname !== targetPath) {
            window.history.replaceState({}, '', targetPath);
            setActiveSection(matchedId);
          }
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentRoute]);

  // Dynamic SEO Meta Tags Engine (Updates <title>, meta description, meta keywords in real time)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const pages = content?.sitePages;
    if (!pages || !Array.isArray(pages)) return;

    const matchedPage = pages.find((p) => {
      const s = (p.slug || '').toLowerCase().replace(/\/+$/, '') || '/';
      const perm = '/' + (p.permalink || '').toLowerCase().replace(/^\/+/, '');
      return s === currentPath || perm === currentPath;
    });

    if (matchedPage) {
      if (matchedPage.seoTitle) {
        document.title = matchedPage.seoTitle;
      }
      if (matchedPage.seoDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', matchedPage.seoDescription);
      }
      if (matchedPage.keywords) {
        let metaKeys = document.querySelector('meta[name="keywords"]');
        if (!metaKeys) {
          metaKeys = document.createElement('meta');
          metaKeys.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeys);
        }
        metaKeys.setAttribute('content', matchedPage.keywords.replace(/\n+/g, ', '));
      }
    }
  }, [currentRoute, activeSection, content?.sitePages]);

  // Navigate to route or scroll down to section
  const navigateTo = (route) => {
    if (route === 'admin-dashboard') {
      window.history.pushState({}, '', '/admin/dashboard');
      setCurrentRoute('admin-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (route === 'download-apps') {
      window.history.pushState({}, '', '/download-apps');
      setCurrentRoute('download-apps');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (route === 'channels-list' || route === 'channels-explorer') {
      window.history.pushState({}, '', '/channels-list');
      setCurrentRoute('channels-list');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (route === 'terms' || route === 'privacy' || route === 'refund') {
      window.history.pushState({}, '', `/${route}`);
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Section scroll: pricing, channels, install, contact, sports, vod, devices, home
    if (currentRoute !== 'home') {
      setCurrentRoute('home');
      setTimeout(() => {
        scrollToSection(route, true);
      }, 120);
    } else {
      scrollToSection(route, true);
    }
  };

  const handleOpenOrderModal = (planInfo) => {
    setOrderModalData(planInfo || { plan: '12-months', title: '12 Months IPTV Subscription' });
  };

  const handleCloseOrderModal = () => {
    setOrderModalData(null);
  };

  const handleOpenChannelExplorer = () => {
    try {
      const w = window.open('/channels-list', '_blank');
      if (!w || w.closed || typeof w.closed === 'undefined') {
        navigateTo('channels-list');
      }
    } catch (e) {
      navigateTo('channels-list');
    }
  };

  const handleCloseChannelExplorer = () => {
    setChannelExplorerOpen(false);
  };

  return (
    <div className={`ipplay-app-root ${isAdmin ? 'admin-mode-active' : ''}`}>
      {/* 0. Top Sticky Admin Toolbar (Visible only when Admin is logged in) */}
      <AdminBar onNavigateDashboard={() => navigateTo('admin-dashboard')} />

      {/* 1. Header & Navigation (Shown on normal pages) */}
      {currentRoute !== 'admin-dashboard' && currentRoute !== 'channels-list' && (
        <Navbar 
          currentRoute={currentRoute === 'home' ? activeSection : currentRoute}
          onNavigate={navigateTo}
          onOpenOrderModal={handleOpenOrderModal}
          onNavigateDashboard={() => navigateTo('admin-dashboard')}
        />
      )}

      {/* Main Content flow: Dashboard OR Download Apps Page OR Channels List OR Legal Pages OR Main Landing Flow */}
      {currentRoute === 'admin-dashboard' ? (
        <main className="main-content-flow admin-dashboard-page-mode">
          <AdminDashboard onNavigateHome={() => navigateTo('home')} />
        </main>
      ) : currentRoute === 'download-apps' ? (
        <main className="main-content-flow download-apps-page-mode">
          <DownloadAppsPage 
            onOpenOrderModal={handleOpenOrderModal}
            onNavigateHome={() => navigateTo('home')}
          />
        </main>
      ) : currentRoute === 'channels-list' ? (
        <main className="main-content-flow channels-page-mode">
          <ChannelsListPage 
            onNavigateHome={() => navigateTo('home')}
            onOpenOrderModal={handleOpenOrderModal}
          />
        </main>
      ) : (currentRoute === 'terms' || currentRoute === 'privacy' || currentRoute === 'refund') ? (
        <main className="main-content-flow">
          <LegalPage 
            type={currentRoute}
            onNavigate={navigateTo}
          />
        </main>
      ) : (
        /* Main Landing Flow - Smoothly scrolled to sections with clean URLs (/pricing, /channels, etc.) */
        <main className="main-content-flow">
          {/* Section 1: Hero Section with Badges, Dual-Gradients & 3D Curved Showcase Screen */}
          <Hero 
            onOpenOrderModal={handleOpenOrderModal}
            onExploreChannels={handleOpenChannelExplorer}
            onNavigate={navigateTo}
          />

          {/* Section 2: Supported Device Logos Strip */}
          <DeviceStrip />

          {/* Section 3: Pricing Plans & Duration / Multi-device Selector */}
          <Pricing 
            onOpenOrderModal={handleOpenOrderModal}
            currentCurrency={currentCurrency}
          />

          {/* Section 4: Live TV Channels Showcase */}
          <ChannelsSection 
            onOpenChannelExplorer={handleOpenChannelExplorer}
          />

          {/* Section 5: International Sports Events & PPV */}
          <SportsSection 
            onOpenChannelExplorer={handleOpenChannelExplorer}
          />

          {/* Section 6: Key Features & Statistics 3-Card Grid */}
          <FeaturesGrid />

          {/* Section 7: EPG Feature Showcase Banner with 3D TV Cubes */}
          <EpgSection 
            onOpenOrderModal={handleOpenOrderModal}
          />

          {/* Section 8: VOD Movies & TV Series Carousel Showcase */}
          <VodSection 
            onOpenOrderModal={handleOpenOrderModal}
          />

          {/* Section 9: All Devices Are Supported */}
          <DevicesSupported />

          {/* Section 10: Step-by-Step Installation Guides */}
          <HowToInstall 
            onOpenOrderModal={handleOpenOrderModal}
          />

          {/* Section 11: What Our Customers Say (Testimonials Coverflow) */}
          <TestimonialsSection />

          {/* Section 12: Our Valued Clients 💙 (WhatsApp Chat Proofs Coverflow) */}
          <ClientProofsSection />

          {/* Section 13: Frequently Asked Questions & 24/7 Support Banner */}
          <FaqSection 
            onOpenOrderModal={handleOpenOrderModal}
          />
        </main>
      )}

      {/* Section 12: Modern Footer */}
      <Footer 
        currentRoute={currentRoute === 'home' ? activeSection : currentRoute}
        onNavigate={navigateTo}
        onOpenOrderModal={handleOpenOrderModal}
        onOpenChannelExplorer={handleOpenChannelExplorer}
      />

      {/* Floating Elements: Bottom-Left WhatsApp 24/7 Support & Floating Currency Selector (Hidden in Admin Dashboard) */}
      {currentRoute !== 'admin-dashboard' && (
        <FloatingWidgets 
          currentCurrency={currentCurrency}
          setCurrency={setCurrency}
        />
      )}

      {/* Interactive Customer Modals (Order/Checkout, Channel Browser) */}
      <Modals 
        orderModalData={orderModalData}
        onCloseOrderModal={handleCloseOrderModal}
        channelExplorerOpen={channelExplorerOpen}
        onCloseChannelExplorer={handleCloseChannelExplorer}
        currentCurrency={currentCurrency}
      />

      {/* Admin Section Edit Modal (Opens whenever an edit button is clicked on any section) */}
      <SectionEditModal />

      {/* Professional Global Confirmation & Prompt Modal */}
      <ConfirmModal />

      {/* Admin Login Modal (Opens on route /admin or when Admin Portal is clicked) */}
      {showAdminLogin && !isAdmin && (
        <AdminLogin 
          onLoginSuccess={() => {}} 
          onCancel={closeAdminLogin} 
        />
      )}
    </div>
  );
}

export default App;
