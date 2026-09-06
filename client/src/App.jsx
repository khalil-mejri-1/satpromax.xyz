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
import { SectionEditModal } from './components/SectionEditModal';
import { ConfirmModal } from './components/ConfirmModal';
import './App.css';

function App() {
  const { isAdmin, showAdminLogin, closeAdminLogin } = useContent();

  const [currentLang, setLang] = useState('en');
  const [currentCurrency, setCurrency] = useState('USD');
  const [orderModalData, setOrderModalData] = useState(null);
  const [channelExplorerOpen, setChannelExplorerOpen] = useState(false);

  // Route state: checks URL path (e.g. /download-apps or /apps)
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('download-apps') || p.includes('download') || p.includes('apps')) {
        return 'download-apps';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('download-apps') || p.includes('download') || p.includes('apps')) {
        setCurrentRoute('download-apps');
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route) => {
    if (route === 'download-apps') {
      window.history.pushState({}, '', '/download-apps');
      setCurrentRoute('download-apps');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/');
      setCurrentRoute('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenOrderModal = (planInfo) => {
    setOrderModalData(planInfo || { plan: '12-months', title: '12 Months IPTV Subscription' });
  };

  const handleCloseOrderModal = () => {
    setOrderModalData(null);
  };

  const handleOpenChannelExplorer = () => {
    setChannelExplorerOpen(true);
  };

  const handleCloseChannelExplorer = () => {
    setChannelExplorerOpen(false);
  };

  return (
    <div className={`ipplay-app-root ${isAdmin ? 'admin-mode-active' : ''}`}>
      {/* 0. Top Sticky Admin Toolbar (Visible only when Admin is logged in) */}
      <AdminBar />

      {/* 1. Header & Navigation */}
      <Navbar 
        onOpenOrderModal={handleOpenOrderModal}
        currentLang={currentLang}
        setLang={setLang}
        currentCurrency={currentCurrency}
        setCurrency={setCurrency}
      />

      {/* Main Sections flow: Download Apps Page OR Home Landing Flow */}
      {currentRoute === 'download-apps' ? (
        <main className="main-content-flow download-apps-page-mode">
          <DownloadAppsPage 
            onOpenOrderModal={handleOpenOrderModal}
            onNavigateHome={() => navigateTo('home')}
          />
        </main>
      ) : (
        <main className="main-content-flow">
          {/* Section 1: Hero Section with Badges, Dual-Gradients & 3D Curved Showcase Screen */}
          <Hero 
            onOpenOrderModal={handleOpenOrderModal}
            onExploreChannels={handleOpenChannelExplorer}
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
        onOpenOrderModal={handleOpenOrderModal}
        onOpenChannelExplorer={handleOpenChannelExplorer}
      />

      {/* Floating Elements: Bottom-Left WhatsApp 24/7 Support & Floating Currency Selector */}
      <FloatingWidgets 
        currentCurrency={currentCurrency}
        setCurrency={setCurrency}
      />

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
