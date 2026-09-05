import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { IconWhatsApp, IconClose, IconChevronUp } from './Icons';

export const FloatingWidgets = () => {
  const { content } = useContent();
  const footerData = content?.footer || {};

  const [chatOpen, setChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = (footerData.whatsappPhone || '+15551234567').replace(/[^0-9]/g, '');
  const defaultMsg = encodeURIComponent(footerData.whatsappDefaultMsg || 'Hello IPPLAY TV Support, I would like to get started with IPTV');

  return (
    <>
      {/* 1. Bottom-Left Floating WhatsApp 24/7 Support Widget */}
      <div className="floating-support-container">
        <button 
          type="button" 
          className="whatsapp-support-pill-btn"
          onClick={() => setChatOpen(!chatOpen)}
          aria-label="Open 24/7 WhatsApp Support"
        >
          <div className="whatsapp-circle-icon">
            <IconWhatsApp size={22} />
            <span className="live-support-pulse"></span>
          </div>
          <span className="support-pill-text">{footerData.supportPillText || '24/7 SUPPORT'}</span>
        </button>

        {/* Support Chat Popover Drawer */}
        {chatOpen && (
          <div className="whatsapp-chat-popover animate-scale-up">
            <div className="chat-header">
              <div className="agent-info">
                <div className="agent-avatar">
                  <IconWhatsApp size={20} />
                  <span className="online-indicator"></span>
                </div>
                <div>
                  <h5>IPPLAY TV Support</h5>
                  <span className="online-status">Online • Typically replies instantly</span>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close-chat"
                onClick={() => setChatOpen(false)}
                aria-label="Close support chat"
              >
                <IconClose size={18} />
              </button>
            </div>

            <div className="chat-body">
              <div className="chat-bubble received">
                👋 Hello! Welcome to <strong>IPPLAY TV</strong>. How can we help you today?
              </div>
              <div className="chat-bubble received">
                ⚡ Would you like a <strong>Free Trial</strong> or help setting up on your FireStick / Smart TV?
              </div>
            </div>

            <div className="chat-footer">
              <a 
                href={`https://wa.me/${cleanPhone}?text=${defaultMsg}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-start-whatsapp"
              >
                <IconWhatsApp size={18} />
                <span>Start WhatsApp Conversation</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 2. Scroll to top button */}
      {showScrollTop && (
        <button 
          type="button" 
          className="btn-scroll-top animate-fade-in"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <IconChevronUp size={20} />
        </button>
      )}
    </>
  );
};
