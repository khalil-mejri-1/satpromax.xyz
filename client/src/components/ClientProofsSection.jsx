import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconChevronLeft, IconChevronRight } from './Icons';

export const ClientProofsSection = () => {
  const { content } = useContent();
  const proofsData = content?.clientProofs || {};

  const items = proofsData.items && proofsData.items.length > 0
    ? proofsData.items
    : [
        {
          id: 1,
          title: "+1 (780) 456-xxxx",
          clientPhone: "+1 (780) 456-xxxx",
          image: "",
          caption: "Details sent to email & 4K streaming confirmed",
          messages: [
            { sender: 'them', text: 'details are sent to ur email', time: '3:05 AM', status: 'read' },
            { sender: 'them', text: 'there is an alternative url\nin case this one don\'t work', time: '3:06 AM', status: 'read' },
            { sender: 'me', text: 'Please ok', time: '3:10 AM', reaction: '❤️' },
            { sender: 'me', text: 'I hope you don\'t include adult content ?', time: '3:11 AM' },
            { sender: 'them', text: 'let me check again', time: '3:12 AM', status: 'read' },
            { sender: 'them', text: 'no i don\'t don\'t worry', time: '3:13 AM', status: 'read' },
            { sender: 'me', text: 'Okay thank you', time: '3:13 AM', reaction: '❤️' },
          ],
        },
        {
          id: 2,
          title: "+1 (905) 832-xxxx",
          clientPhone: "+1 (905) 832-xxxx",
          image: "",
          caption: "Account renewal & sports package setup",
          messages: [
            { sender: 'them', text: 'logout then login again', time: '5:02 AM', status: 'read' },
            { sender: 'me', text: 'okay', time: '5:03 AM' },
            { sender: 'me', text: 'It\'s all there, thank you again, sorry to bother you so late', time: '5:04 AM' },
            { sender: 'them', text: 'no no, you are welcome', time: '5:05 AM', status: 'read' },
            { sender: 'me', text: '👍', time: '5:21 AM' },
            { sender: 'me', text: 'I\'m sorry, but the adult channels are gone. When you have a chance, please add them back. Thank you', time: '5:28 AM' },
            { sender: 'them', text: 'done', time: '5:39 AM', status: 'read' },
            { sender: 'me', text: 'Works, thank you', time: '5:40 AM', reaction: '❤️' },
          ],
        },
        {
          id: 3,
          title: "+44 7911 12xxxx",
          clientPhone: "+44 7911 12xxxx",
          image: "",
          caption: "Instant activation on Smart TV",
          messages: [
            { sender: 'me', text: 'Hello, I just ordered the 12 month plan', time: '11:15 AM' },
            { sender: 'them', text: 'Welcome! Your playlist is active. Sending your Xtream codes now.', time: '11:16 AM', status: 'read' },
            { sender: 'them', text: 'Username: iptv_vip_94\nServer: http://line.satpro.me', time: '11:17 AM', status: 'read' },
            { sender: 'me', text: 'Just logged into TiviMate, all 4K channels work smoothly!', time: '11:22 AM', reaction: '🔥' },
            { sender: 'them', text: 'Enjoy your streaming! Contact us 24/7 if you need anything.', time: '11:24 AM', status: 'read' },
          ],
        },
        {
          id: 4,
          title: "+33 6 45 89 xx xx",
          clientPhone: "+33 6 45 89 xx xx",
          image: "",
          caption: "UFC PPV & Premier League in 50fps",
          messages: [
            { sender: 'me', text: 'Le match est en direct sans aucun lag merci beaucoup !', time: '8:45 PM' },
            { sender: 'them', text: 'Avec plaisir ! Nos serveurs 10 Gbps garantissent 0 buffering.', time: '8:46 PM', status: 'read' },
            { sender: 'me', text: 'Je vais renouveler pour 1 an direct 👍', time: '8:50 PM', reaction: '❤️' },
            { sender: 'them', text: 'Merci pour votre confiance !', time: '8:51 PM', status: 'read' },
          ],
        },
      ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <AdminEditWrapper sectionKey="clientProofs" sectionTitle="محادثات وتجارب العملاء (Our Valued Clients)">
      <section className="client-proofs-section" id="proofs">
        <div className="client-proofs-container">
          
          {/* Section Header matching Image 2 */}
          <div className="section-header-center">
            <h2 className="section-main-title client-proofs-main-title">
              <span className="highlight-text-pink-gradient">
                {proofsData.titlePrefix || 'Our'} {proofsData.titleHighlight || 'Valued Clients'}
              </span>{' '}
              <span className="heart-emoji">{proofsData.titleSuffix || '💙'}</span>
            </h2>
            <p className="section-sub-desc client-proofs-sub-desc">
              {proofsData.subtitle || 'Check out what our satisfied customers have to say about us!'}
            </p>
          </div>

          {/* 3D Phone Mockup Carousel */}
          <div 
            className="phone-mockup-carousel-stage"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Arrows */}
            <button 
              type="button"
              className="carousel-nav-btn btn-prev" 
              onClick={handlePrev}
              aria-label="Previous chat proof"
            >
              <IconChevronLeft size={20} />
            </button>
            <button 
              type="button"
              className="carousel-nav-btn btn-next" 
              onClick={handleNext}
              aria-label="Next chat proof"
            >
              <IconChevronRight size={20} />
            </button>

            {/* Viewport */}
            <div className="phones-track-viewport">
              {items.map((item, idx) => {
                let offset = idx - activeIndex;
                const count = items.length;
                if (offset > count / 2) offset -= count;
                if (offset < -count / 2) offset += count;

                let posClass = 'phone-hidden';
                if (offset === 0) posClass = 'phone-active';
                else if (offset === 1) posClass = 'phone-next-1';
                else if (offset === -1) posClass = 'phone-prev-1';
                else if (offset === 2) posClass = 'phone-next-2';
                else if (offset === -2) posClass = 'phone-prev-2';

                return (
                  <div
                    key={item.id || idx}
                    className={`smartphone-mockup-frame ${posClass}`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    {/* Phone Outer Chassis & Speaker Bar */}
                    <div className="smartphone-speaker-bar">
                      <span className="smartphone-camera-dot"></span>
                    </div>

                    {/* Phone Screen Container */}
                    <div className="smartphone-screen-body">
                      {item.image ? (
                        /* When user uploaded / configured an image screenshot */
                        <div className="custom-screenshot-wrapper">
                          <img 
                            src={item.image} 
                            alt={item.title || "WhatsApp Screenshot"} 
                            className="custom-whatsapp-screenshot" 
                          />
                        </div>
                      ) : (
                        /* Realistic WhatsApp Dark Theme Chat View */
                        <div className="whatsapp-app-mockup">
                          {/* WhatsApp Top Navigation Bar */}
                          <div className="wa-top-bar">
                            <div className="wa-profile-group">
                              <span className="wa-back-chevron">‹</span>
                              <div className="wa-user-avatar">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                              </div>
                              <div className="wa-contact-meta">
                                <span className="wa-contact-name">{item.title || item.clientPhone}</span>
                                <span className="wa-contact-status">online</span>
                              </div>
                            </div>
                            <div className="wa-top-icons">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                            </div>
                          </div>

                          {/* WhatsApp Chat Wallpaper & Messages List */}
                          <div className="wa-messages-scroller">
                            <div className="wa-encryption-pill">
                              🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
                            </div>

                            {(item.messages || []).map((msg, mIdx) => (
                              <div 
                                key={mIdx} 
                                className={`wa-bubble-row ${msg.sender === 'them' ? 'from-them' : 'from-me'}`}
                              >
                                <div className="wa-message-bubble">
                                  <p className="wa-msg-text">{msg.text}</p>
                                  <div className="wa-msg-footer">
                                    <span className="wa-msg-time">{msg.time}</span>
                                    {msg.sender === 'them' && (
                                      <span className="wa-double-check">✓✓</span>
                                    )}
                                  </div>
                                  {msg.reaction && (
                                    <span className="wa-reaction-badge">{msg.reaction}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* WhatsApp Bottom Input Field */}
                          <div className="wa-input-bottom-bar">
                            <div className="wa-input-pill">
                              <span className="wa-input-icon">😊</span>
                              <span className="wa-input-placeholder">Type a message</span>
                              <span className="wa-input-icon">📎</span>
                            </div>
                            <div className="wa-mic-btn">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                <line x1="12" y1="19" x2="12" y2="23"/>
                                <line x1="8" y1="23" x2="16" y2="23"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dots */}
            <div className="client-proofs-dots-indicator">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`client-proof-dot ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to proof ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>
    </AdminEditWrapper>
  );
};
