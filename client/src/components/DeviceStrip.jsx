import React from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';

export const DeviceStrip = () => {
  const { content } = useContent();
  const stripData = content?.deviceStrip || {};

  const devices = [
    {
      name: "Fire TV",
      icon: (
        <div className="device-brand-icon firetv-icon">
          <span className="brand-text">fire</span>
          <span className="brand-tv">tv</span>
          <span className="firetv-smile">⌢</span>
        </div>
      ),
    },
    {
      name: "Android",
      icon: (
        <div className="device-brand-icon android-icon">
          <span className="brand-text">android</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#3ddc84">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.081 12 8.081c-1.8533 0-3.5902.3306-5.1368.8687L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
          </svg>
        </div>
      ),
    },
    {
      name: "Roku",
      icon: (
        <div className="device-brand-icon roku-icon">
          <span className="roku-text">Roku</span>
        </div>
      ),
    },
    {
      name: "Xbox",
      icon: (
        <div className="device-brand-icon xbox-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#107c10">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c2.046 0 3.948.604 5.545 1.636-1.57.818-3.491 1.773-5.545 1.773s-3.975-.955-5.545-1.773C8.052 2.786 9.954 2.182 12 2.182zM4.69 5.564c1.773 1.09 3.975 1.882 7.31 1.882 3.334 0 5.536-.791 7.31-1.882 1.636 1.745 2.69 4.091 2.863 6.682-1.99-.409-5.181-.79-7.527 2.155-.79 1.009-1.636 2.455-2.645 4.309-1.01-1.854-1.855-3.3-2.646-4.309-2.345-2.945-5.536-2.564-7.527-2.155.173-2.59 1.227-4.936 2.863-6.682z"/>
          </svg>
          <span className="brand-text">XBOX</span>
        </div>
      ),
    },
    {
      name: "MAG BOX",
      icon: (
        <div className="device-brand-icon mag-icon">
          <span className="mag-title">MAG</span>
          <span className="mag-sub">BOX</span>
        </div>
      ),
    },
    {
      name: "Apple",
      icon: (
        <div className="device-brand-icon apple-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.09.64-2.73 1.39-.56.64-.99 1.68-.94 2.74 1.07.08 2.11-.56 2.66-1.26z"/>
          </svg>
        </div>
      ),
    },
    {
      name: "Samsung",
      icon: (
        <div className="device-brand-icon samsung-icon">
          <span className="samsung-pill">SAMSUNG</span>
        </div>
      ),
    },
    {
      name: "Formuler",
      icon: (
        <div className="device-brand-icon formuler-icon">
          <span className="formuler-badge">FORMULER</span>
        </div>
      ),
    },
    {
      name: "Windows",
      icon: (
        <div className="device-brand-icon windows-icon">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#f25022" d="M1 1h10v10H1z"/>
            <path fill="#00a4ef" d="M1 13h10v10H1z"/>
            <path fill="#7fba00" d="M13 1h10v10H13z"/>
            <path fill="#ffb900" d="M13 13h10v10H13z"/>
          </svg>
        </div>
      ),
    },
    {
      name: "LG",
      icon: (
        <div className="device-brand-icon lg-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#a50034">
            <circle cx="12" cy="12" r="11" fill="none" stroke="#a50034" strokeWidth="2"/>
            <path d="M8 8v8h7" stroke="#a50034" strokeWidth="2" fill="none"/>
            <circle cx="9.5" cy="10" r="1.2" fill="#a50034"/>
          </svg>
        </div>
      ),
    },
    {
      name: "Huawei",
      icon: (
        <div className="device-brand-icon huawei-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff0000">
            <path d="M12 2c-.5 2-1 5-1 7s.5 5 1 7c.5-2 1-5 1-7s-.5-5-1-7zm-4.5 2.5c.5 1.5 2 4.5 3 6.5-1.5 1.5-4 3.5-6 4 1-2 2.5-5 3-7.5v-3zm9 0c-.5 2.5 1 5.5 2 7.5-2-.5-4.5-2.5-6-4 1-2 2.5-5 3-7.5v4z"/>
          </svg>
        </div>
      ),
    },
  ];

  return (
    <AdminEditWrapper sectionKey="deviceStrip" sectionTitle="Bandeau Appareils">
      <div className="device-strip-section">
        <div className="device-strip-container">
          <div className="device-strip-bar">
            {devices.map((device, index) => {
              const label = stripData.devices?.[index]?.label || device.name;
              return (
                <div key={index} className="device-brand-item" title={label}>
                  {device.icon}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminEditWrapper>
  );
};
