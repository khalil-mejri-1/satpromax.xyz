import React, { useState } from 'react';
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
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import { Modals } from './components/Modals';
import { AdminBar } from './components/AdminBar';
import { AdminLogin } from './components/AdminLogin';
import { SectionEditModal } from './components/SectionEditModal';
import './App.css';

function App() {
  const { isAdmin, showAdminLogin, closeAdminLogin } = useContent();

  const [currentLang, setLang] = useState('en');
  const [currentCurrency, setCurrency] = useState('USD');
  const [orderModalData, setOrderModalData] = useState(null);
  const [channelExplorerOpen, setChannelExplorerOpen] = useState(false);
  const [vodPlayerData, setVodPlayerData] = useState(null);

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

  const handleOpenVodPlayer = (movieData) => {
    setVodPlayerData(movieData);
  };

  const handleCloseVodPlayer = () => {
    setVodPlayerData(null);
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

      {/* Main Sections Ordered EXACTLY as shown in user screenshots */}
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
          onOpenVodPlayer={handleOpenVodPlayer}
          onOpenOrderModal={handleOpenOrderModal}
        />

        {/* Section 9: All Devices Are Supported */}
        <DevicesSupported />

        {/* Section 10: Step-by-Step Installation Guides */}
        <HowToInstall 
          onOpenOrderModal={handleOpenOrderModal}
        />

        {/* Section 11: Frequently Asked Questions & 24/7 Support Banner */}
        <FaqSection 
          onOpenOrderModal={handleOpenOrderModal}
        />
      </main>

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

      {/* Interactive Customer Modals (Order/Checkout, Channel Browser, VOD Player) */}
      <Modals 
        orderModalData={orderModalData}
        onCloseOrderModal={handleCloseOrderModal}
        channelExplorerOpen={channelExplorerOpen}
        onCloseChannelExplorer={handleCloseChannelExplorer}
        vodPlayerData={vodPlayerData}
        onCloseVodPlayer={handleCloseVodPlayer}
        currentCurrency={currentCurrency}
      />

      {/* Admin Section Edit Modal (Opens whenever an edit button is clicked on any section) */}
      <SectionEditModal />

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
