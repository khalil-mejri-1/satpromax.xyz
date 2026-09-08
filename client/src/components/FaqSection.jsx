import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconChevronDown, IconHeadphones, IconShieldCheck, IconSparkles } from './Icons';

export const FaqSection = ({ onOpenOrderModal }) => {
  const { content } = useContent();
  const faqData = content?.faq || {};

  const [openIdx, setOpenIdx] = useState(0);

  const defaultFaqs = [
    {
      q: "How fast do I receive my subscription details after payment?",
      a: "Activation is fully automated. You will receive your M3U link, Xtream Codes credentials (Username, Password, Server URL), and full setup guides in your email and WhatsApp within 1 to 5 minutes after payment confirmation."
    },
    {
      q: "Does your service freeze or buffer during big live football and sports matches?",
      a: "No. We utilize advanced Anti-Freeze™ 9.0 technology and load-balanced 10 Gbps European and North American CDN servers with 99.9% uptime. This prevents server overloading and eliminates buffering even during World Cups, El Clásico, and Super Bowl events."
    },
    {
      q: "Can I use one subscription on multiple devices?",
      a: "You can install your subscription on as many devices as you like. However, simultaneous connections depend on the plan you select (1, 2, or 3 simultaneous streams). If you need to watch on multiple TVs at the same time, choose our Family or Multi-Room package."
    },
    {
      q: "What devices and applications are supported?",
      a: "Our IPTV service is compatible with ALL devices: Amazon FireStick, Smart TVs (Samsung, LG, Sony), Android TV & Boxes, Apple TV, iPhone, iPad, Windows PC, Mac, MAG 250/322/524, Formuler, Nvidia Shield, and apps like IPTV Smarters Pro, TiviMate, IBO Player, and VLC."
    },
    {
      q: "Do you offer a money-back guarantee?",
      a: "Yes, we provide a 7-day 100% money-back guarantee. If you encounter any technical issues that our 24/7 support team cannot resolve, we will issue a full refund with no questions asked."
    },
    {
      q: "Is an internet speed of 10-20 Mbps enough for 4K streaming?",
      a: "Yes! For standard HD channels, 8 Mbps is sufficient. For 4K Ultra HD and 60 FPS sports streams, we recommend a stable internet connection of 20 Mbps or higher."
    },
  ];

  const faqs = (faqData.defaultItems && faqData.defaultItems.length > 0) 
    ? faqData.defaultItems 
    : (faqData.items && faqData.items.length > 0 ? faqData.items : defaultFaqs);

  return (
    <AdminEditWrapper sectionKey="faq" sectionTitle="الأسئلة الشائعة والدعم (FAQ)">
      <section id="contact" className="faq-section">
        <div className="faq-container">
          <div className="section-header-center">
            <div className="pill-badge-container">
              <span className="pill-badge-gradient">{faqData.badge || 'Frequently Asked Questions'}</span>
            </div>
            <h2 className="section-main-title">
              {faqData.titlePrefix || 'Have Questions?'} <span className="highlight-perfect-plan">{faqData.titleHighlight || "We've Got Answers"}</span>
            </h2>
            <p className="section-sub-desc">
              {faqData.subtitle || 'Everything you need to know about our premium IPTV service'}
            </p>
          </div>

          <div className="faq-accordion-box">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${openIdx === idx ? 'open' : ''}`}
              >
                <button 
                  type="button" 
                  className="faq-question-btn"
                  onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                  aria-expanded={openIdx === idx}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  <span className="faq-chevron-circle">
                    <IconChevronDown size={16} className={`chevron-icon ${openIdx === idx ? 'rotated' : ''}`} />
                  </span>
                </button>

                {openIdx === idx && (
                  <div className="faq-answer-pane animate-fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Live Support Banner */}
          <div className="faq-support-banner">
            <div className="support-banner-content">
              <div className="support-icon-circle">
                <IconHeadphones size={24} />
              </div>
              <div>
                <h4>{faqData.bannerTitle || 'Still have questions or need a custom trial?'}</h4>
                <p>{faqData.bannerDesc || 'Our friendly 24/7 customer support agents are ready to assist you right now.'}</p>
              </div>
            </div>
            <a 
              href={`https://wa.me/${(content?.footer?.whatsappPhone || '+15551234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content?.footer?.whatsappDefaultMsg || 'Hello IPPLAY TV Support, I have a question about IPTV')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-contact-support"
            >
              {faqData.btnChat || 'Chat with 24/7 Support'}
            </a>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
