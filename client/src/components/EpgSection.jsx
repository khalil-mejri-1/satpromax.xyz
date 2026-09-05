import React from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconArrowRight, IconSparkles, IconCheck, IconTv } from './Icons';

export const EpgSection = ({ onOpenOrderModal }) => {
  const { content } = useContent();
  const epgData = content?.epg || {};

  return (
    <AdminEditWrapper sectionKey="epg" sectionTitle="ميزة الدليل الإلكتروني (EPG)">
      <section className="epg-section">
        <div className="epg-container">
          <div className="epg-glass-banner">
            {/* Left Column: 3D Stack of Channel Cubes Visual */}
            <div className="epg-visual-col">
              <div className="cubes-pyramid-container">
                {/* Top Row */}
                <div className="cubes-layer layer-1">
                  <div className="cube-3d-box cube-skyone">
                    <span className="cube-front">sky one</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-skyliving">
                    <span className="cube-front">sky living</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-history">
                    <span className="cube-front">HISTORY</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                </div>

                {/* Middle Row */}
                <div className="cubes-layer layer-2">
                  <div className="cube-3d-box cube-dave">
                    <span className="cube-front">Dave</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-syfy">
                    <span className="cube-front">syfy</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-itv">
                    <span className="cube-front">itv</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-nick">
                    <span className="cube-front">nick jr.</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="cubes-layer layer-3">
                  <div className="cube-3d-box cube-skyarts">
                    <span className="cube-front">sky ARTS</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-gold">
                    <span className="cube-front">GOLD</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-natgeo">
                    <span className="cube-front">NAT GEO</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="cubes-layer layer-4">
                  <div className="cube-3d-box cube-skynews">
                    <span className="cube-front">sky NEWS</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-skysports">
                    <span className="cube-front">sky sports</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-fox">
                    <span className="cube-front">FOX</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-atlantic">
                    <span className="cube-front">sky atlantic</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                  <div className="cube-3d-box cube-iplayer">
                    <span className="cube-front">iPlayer</span>
                    <span className="cube-top"></span>
                    <span className="cube-side"></span>
                  </div>
                </div>

                {/* Reflection under cubes */}
                <div className="cubes-floor-reflection"></div>
              </div>
            </div>

            {/* Right Column: EPG Feature Details & Join Us CTA */}
            <div className="epg-content-col">
              <h2 className="epg-main-title">
                <span className="highlight-epg-gradient">{epgData.title || 'EPG Feature'}</span>
              </h2>

              <p className="epg-description-paragraph">
                {epgData.description || 'EPG is one of our most requested features and providing a full and updated EPG has been our priority since day one. We can proudly say that we have been able to cover the majority of our IPTV channels.'}
              </p>

              <div className="epg-perks-list">
                <div className="epg-perk-item">
                  <span className="epg-check-icon"><IconCheck size={14} /></span>
                  <span>{epgData.perk1 || 'Real-time Electronic Program Guide with 7-day schedule'}</span>
                </div>
                <div className="epg-perk-item">
                  <span className="epg-check-icon"><IconCheck size={14} /></span>
                  <span>{epgData.perk2 || 'Automated EPG updates every 6 hours'}</span>
                </div>
                <div className="epg-perk-item">
                  <span className="epg-check-icon"><IconCheck size={14} /></span>
                  <span>{epgData.perk3 || 'One-click program recording & 7-day catch-up replay'}</span>
                </div>
              </div>

              <div className="epg-cta-wrapper">
                <button 
                  type="button" 
                  className="btn-join-us"
                  onClick={() => onOpenOrderModal({ plan: '12-months', title: 'Get EPG Included with 12 Months Plan' })}
                >
                  <span>{epgData.btnText || 'JOIN US'}</span>
                  <IconArrowRight size={18} className="btn-arrow-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
