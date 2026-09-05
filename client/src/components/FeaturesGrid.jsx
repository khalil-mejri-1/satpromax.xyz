import React from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconMonitor, IconFilm, IconZap } from './Icons';

export const FeaturesGrid = () => {
  const { content } = useContent();
  const fg = content?.featuresGrid || {};

  const card1 = fg.card1 || {
    title: "19,000+ Channels",
    desc: "Global and local channels variety",
    statValue: "19.4K+",
    statDetail: "Live Global TV Feeds",
  };

  const card2 = fg.card2 || {
    title: "Huge VOD Library",
    desc: "Updated movies and series collection",
    statValue: "56,000+",
    statDetail: "Movies & 4K Series",
  };

  const card3 = fg.card3 || {
    title: "Ultra-Fast Speed",
    desc: "High-speed servers without buffering",
    statValue: "10 Gbps",
    statDetail: "Anti-Freeze Servers",
  };

  const features = [
    {
      id: 1,
      title: card1.title,
      desc: card1.desc,
      icon: <IconMonitor size={28} className="feat-icon-svg" />,
      colorClass: "feat-orange",
      statValue: card1.statValue,
      statDetail: card1.statDetail,
    },
    {
      id: 2,
      title: card2.title,
      desc: card2.desc,
      icon: <IconFilm size={28} className="feat-icon-svg" />,
      colorClass: "feat-amber",
      statValue: card2.statValue,
      statDetail: card2.statDetail,
    },
    {
      id: 3,
      title: card3.title,
      desc: card3.desc,
      icon: <IconZap size={28} className="feat-icon-svg" />,
      colorClass: "feat-gold",
      statValue: card3.statValue,
      statDetail: card3.statDetail,
    },
  ];

  return (
    <AdminEditWrapper sectionKey="featuresGrid" sectionTitle="Fonctionnalités Clés">
      <section className="features-grid-section">
        <div className="features-container">
          <div className="features-cards-row">
            {features.map((item) => (
              <div key={item.id} className="feature-highlight-card">
                <div className={`feature-icon-box ${item.colorClass}`}>
                  {item.icon}
                </div>
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="feature-card-desc">{item.desc}</p>

                <div className="feature-card-footer-glow">
                  <span className="footer-stat">{item.statValue}</span>
                  <span className="footer-label">{item.statDetail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
