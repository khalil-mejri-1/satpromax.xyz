import React from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconArrowRight, IconFlame } from './Icons';

export const SportsSection = ({ onOpenChannelExplorer }) => {
  const { content } = useContent();
  const sportsData = content?.sports || {};

  const sportsLeagues = [
    {
      name: "LaLiga",
      category: "Football",
      code: "LALIGA",
      icon: (
        <div className="league-icon-badge laliga">
          <span>⫽</span>
          <span>LALIGA</span>
        </div>
      ),
    },
    {
      name: "Serie A",
      category: "Football",
      code: "SERIE A",
      icon: (
        <div className="league-icon-badge seriea">
          <span className="seriea-logo">TIM</span>
          <span>Serie A</span>
        </div>
      ),
    },
    {
      name: "Premier League",
      category: "Football",
      code: "EPL",
      icon: (
        <div className="league-icon-badge premier-league">
          <span className="lion-crown">👑</span>
          <span>Premier League</span>
        </div>
      ),
    },
    {
      name: "UEFA Champions League",
      category: "Football",
      code: "UCL",
      icon: (
        <div className="league-icon-badge ucl">
          <span className="starball">⚽★</span>
          <span>CHAMPIONS LEAGUE</span>
        </div>
      ),
    },
    {
      name: "UEFA Europa League",
      category: "Football",
      code: "UEL",
      icon: (
        <div className="league-icon-badge uel">
          <span className="trophy">🏆</span>
          <span>EUROPA LEAGUE</span>
        </div>
      ),
    },
    {
      name: "beIN SPORTS",
      category: "Sports",
      code: "BEIN",
      icon: (
        <div className="league-icon-badge bein">
          <span>beIN</span>
          <span className="sport-text">SPORTS</span>
        </div>
      ),
    },
    {
      name: "Formula 1",
      category: "Racing",
      code: "F1",
      icon: (
        <div className="league-icon-badge f1">
          <span className="f1-text">F1</span>
        </div>
      ),
    },
    {
      name: "Bundesliga",
      category: "Football",
      code: "BUNDESLIGA",
      icon: (
        <div className="league-icon-badge bundesliga">
          <span className="kicker">⚽</span>
          <span>BUNDESLIGA</span>
        </div>
      ),
    },
    {
      name: "UFC PPV",
      category: "MMA",
      code: "UFC",
      icon: (
        <div className="league-icon-badge ufc">
          <span className="ufc-title">UFC</span>
          <span className="ppv-badge">PPV</span>
        </div>
      ),
    },
  ];

  return (
    <AdminEditWrapper sectionKey="sports" sectionTitle="Événements Sportifs & PPV">
      <section className="sports-section">
        <div className="sports-container">
          {/* Title */}
          <div className="section-header-center">
            <h2 className="section-main-title sports-headline">
              {sportsData.titlePrefix || 'The Best IPTV 2025 To Watch All International'}{' '}
              <span className="highlight-sports-gradient">{sportsData.titleHighlight || 'Sports Events'}</span>
              {sportsData.titleSuffix || ', including ppv iptv'}
            </h2>
            <p className="sports-description-text">
              {sportsData.description || "At our IPTV subscription service, we are proud to offer an extensive range of sports channels that cater to every sports enthusiast's needs. Our sports channels cover a vast variety of sports including football, basketball, baseball, tennis, golf, rugby, and more."}
            </p>
          </div>

          {/* Sports Leagues Badges Dark Box (Exact from Image 3 Bottom) */}
          <div className="sports-leagues-glass-box">
            <div className="sports-leagues-grid">
              {sportsLeagues.map((item, index) => (
                <div key={index} className="sports-league-item" title={`${item.name} (${item.category})`}>
                  <div className="league-badge-outer">
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Big Action CTA (Exact pill button from Image 3 Bottom) */}
          <div className="sports-cta-container">
            <button 
              type="button" 
              className="btn-explore-channels"
              onClick={onOpenChannelExplorer}
            >
              <span className="btn-menu-icon">☰</span>
              <span>{sportsData.btnExplore || 'Explore All Channels'}</span>
              <IconArrowRight size={18} className="btn-arrow-icon" />
            </button>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
