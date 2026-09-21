import React from 'react';

export const DEFAULT_PAYMENT_METHODS = [
  { id: 'flouci', name: 'Flouci', enabled: true },
  { id: 'd17', name: 'D 17', enabled: true },
  { id: 'paypal', name: 'Paypal', enabled: true },
  { id: 'binance', name: 'Binance', enabled: true },
  { id: 'redotpay', name: 'Redotpay', enabled: true },
  { id: 'virement', name: 'Virement bancaire', enabled: true },
  { id: 'moneco', name: 'Moneco', enabled: true },
  { id: 'western_union', name: 'Western union', enabled: true },
  { id: 'ria', name: 'Ria Money Transfer', enabled: true },
  { id: 'la_poste', name: 'La Poste tunisienne', enabled: true },
  { id: 'zitouna', name: 'IZI - Zitouna Payment', enabled: true },
  { id: 'moneygram', name: 'MoneyGram', enabled: true },
  { id: 'kashy', name: 'kashy', enabled: true },
];

export const PaymentLogo = ({ method, style = {} }) => {
  if (!method) return null;

  const customImg = method.image || method.logo;
  if (customImg) {
    return (
      <img 
        src={customImg} 
        alt={method.name || 'Payment'} 
        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', ...style }} 
      />
    );
  }

  const normalized = (method.name || method.id || '').toLowerCase().trim();

  // 1. Flouci
  if (normalized.includes('flouci')) {
    return (
      <svg viewBox="0 0 160 48" height="34" style={{ maxWidth: '100%', height: '34px', ...style }}>
        <rect width="44" height="44" x="2" y="2" rx="10" fill="#f97316" />
        <path d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 16c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" fill="#ffffff" />
        <text x="56" y="32" fontFamily="system-ui, -apple-system, sans-serif" fontSize="26" fontWeight="800" fill="#1e293b" letterSpacing="-0.5">flouci</text>
      </svg>
    );
  }

  // 2. D 17
  if (normalized.includes('d17') || normalized.includes('d 17')) {
    return (
      <svg viewBox="0 0 110 50" height="34" style={{ maxWidth: '100%', height: '34px', ...style }}>
        <rect x="5" y="4" width="100" height="42" rx="6" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
        <text x="55" y="27" fontFamily="system-ui, sans-serif" fontSize="21" fontWeight="900" fill="#0284c7" textAnchor="middle">D17</text>
        <rect x="18" y="32" width="74" height="9" fill="#0284c7" rx="2" />
        <text x="55" y="39" fontFamily="system-ui, sans-serif" fontSize="6.5" fontWeight="800" fill="#ffffff" textAnchor="middle" letterSpacing="0.8">DIGIPOST BANK</text>
      </svg>
    );
  }

  // 3. Paypal
  if (normalized.includes('paypal') || normalized.includes('pay-pal')) {
    return (
      <svg viewBox="0 0 130 40" height="32" style={{ maxWidth: '100%', height: '32px', ...style }}>
        <path d="M14 6h11c5 0 9 3 8 8-1 6-5 9-10 9h-4l-3 13h-6l6-30z" fill="#003087" />
        <path d="M22 13h10c5 0 8 3 7 8-1 5-5 8-10 8h-4l-2 9h-5l4-25z" fill="#0079C1" opacity="0.9" />
        <text x="46" y="27" fontFamily="system-ui, sans-serif" fontSize="21" fontWeight="800" fontStyle="italic">
          <tspan fill="#003087">Pay</tspan><tspan fill="#0079C1">Pal</tspan>
        </text>
      </svg>
    );
  }

  // 4. Binance
  if (normalized.includes('binance')) {
    return (
      <svg viewBox="0 0 150 42" height="32" style={{ maxWidth: '100%', height: '32px', ...style }}>
        <g fill="#F3BA2F">
          <polygon points="17,5 23,11 17,17 11,11" />
          <polygon points="26,14 32,20 26,26 20,20" />
          <polygon points="8,14 14,20 8,26 2,20" />
          <polygon points="17,23 23,29 17,35 11,29" />
          <polygon points="17,14 20,17 17,20 14,17" />
        </g>
        <text x="42" y="27" fontFamily="system-ui, sans-serif" fontSize="19" fontWeight="900" fill="#EAA516" letterSpacing="1.2">BINANCE</text>
      </svg>
    );
  }

  // 5. Redotpay
  if (normalized.includes('redotpay') || normalized.includes('redot')) {
    return (
      <svg viewBox="0 0 140 40" height="30" style={{ maxWidth: '100%', height: '30px', ...style }}>
        <g transform="translate(4, 5)">
          <circle cx="15" cy="15" r="14" fill="#ef4444" />
          <path d="M12 9h6a5 5 0 0 1 0 10h-3v4h-3V9zm3 3v4h3a2 2 0 0 0 0-4h-3z" fill="#ffffff" />
        </g>
        <text x="42" y="27" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="800" fill="#0f172a">RedotPay</text>
      </svg>
    );
  }

  // 6. Virement bancaire / Bank
  if (normalized.includes('virement') || normalized.includes('bank') || normalized.includes('bancaire')) {
    return (
      <svg viewBox="0 0 60 50" height="36" style={{ maxWidth: '100%', height: '36px', ...style }}>
        <g stroke="#334155" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18L30 6l24 12" />
          <line x1="12" y1="20" x2="12" y2="38" />
          <line x1="24" y1="20" x2="24" y2="38" />
          <line x1="36" y1="20" x2="36" y2="38" />
          <line x1="48" y1="20" x2="48" y2="38" />
          <line x1="4" y1="40" x2="56" y2="40" />
          <line x1="2" y1="44" x2="58" y2="44" />
          <circle cx="30" cy="14" r="2.5" fill="#334155" />
        </g>
      </svg>
    );
  }

  // 7. Moneco
  if (normalized.includes('moneco')) {
    return (
      <svg viewBox="0 0 130 40" height="32" style={{ maxWidth: '100%', height: '32px', ...style }}>
        <rect x="4" y="5" width="30" height="30" rx="8" fill="#10b981" />
        <path d="M12 28V12l14 16V12" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="44" y="27" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="800" fill="#065f46" letterSpacing="-0.3">Moneco</text>
      </svg>
    );
  }

  // 8. Western union
  if (normalized.includes('western') || normalized.includes('union')) {
    return (
      <svg viewBox="0 0 70 50" height="36" style={{ maxWidth: '100%', height: '36px', ...style }}>
        <circle cx="35" cy="25" r="23" fill="#fbbf24" />
        <text x="35" y="23" fontFamily="system-ui, sans-serif" fontSize="7" fontWeight="900" fill="#000000" textAnchor="middle">WESTERN</text>
        <text x="35" y="32" fontFamily="system-ui, sans-serif" fontSize="7" fontWeight="900" fill="#000000" textAnchor="middle">UNION</text>
      </svg>
    );
  }

  // 9. Ria Money Transfer
  if (normalized.includes('ria')) {
    return (
      <svg viewBox="0 0 140 40" height="32" style={{ maxWidth: '100%', height: '32px', ...style }}>
        <rect x="2" y="5" width="46" height="30" rx="7" fill="#f97316" />
        <text x="25" y="26" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="900" fontStyle="italic" fill="#ffffff" textAnchor="middle">Ria</text>
        <text x="56" y="21" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="800" fill="#ea580c">Money</text>
        <text x="56" y="32" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="800" fill="#ea580c">Transfer</text>
      </svg>
    );
  }

  // 10. La Poste tunisienne
  if (normalized.includes('poste') || normalized.includes('tunisie')) {
    return (
      <svg viewBox="0 0 120 48" height="36" style={{ maxWidth: '100%', height: '36px', ...style }}>
        <path d="M60 4c-14 3-26 12-32 20 8-3 18-5 28-5 12 0 22 4 28 8-4-12-12-20-24-23z" fill="#0284c7" />
        <path d="M42 22c-8 3-14 8-18 14 10-4 22-6 36-6s24 3 32 7c-4-7-10-12-18-14-10-2-22-2-32-1z" fill="#f59e0b" />
        <text x="60" y="38" fontFamily="system-ui, sans-serif" fontSize="7.5" fontWeight="800" fill="#0284c7" textAnchor="middle">البريد التونسي</text>
        <text x="60" y="45" fontFamily="system-ui, sans-serif" fontSize="6" fontWeight="700" fill="#475569" textAnchor="middle">LA POSTE TUNISIENNE</text>
      </svg>
    );
  }

  // 11. IZI - Zitouna Payment
  if (normalized.includes('zitouna') || normalized.includes('izi')) {
    return (
      <svg viewBox="0 0 130 46" height="34" style={{ maxWidth: '100%', height: '34px', ...style }}>
        <g fill="#0284c7">
          <circle cx="28" cy="12" r="4" fill="#06b6d4" />
          <circle cx="38" cy="12" r="4" fill="#10b981" />
          <circle cx="48" cy="12" r="4" fill="#0284c7" />
        </g>
        <text x="38" y="27" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="900" fill="#0284c7" textAnchor="middle" letterSpacing="1">IZI</text>
        <text x="38" y="38" fontFamily="system-ui, sans-serif" fontSize="7.5" fontWeight="700" fill="#10b981" textAnchor="middle">Zitouna Payment</text>
      </svg>
    );
  }

  // 12. MoneyGram
  if (normalized.includes('moneygram') || normalized.includes('money gram')) {
    return (
      <svg viewBox="0 0 130 40" height="32" style={{ maxWidth: '100%', height: '32px', ...style }}>
        <circle cx="18" cy="20" r="14" fill="#dc2626" />
        <path d="M12 20c0-3.3 2.7-6 6-6 2.5 0 4.6 1.5 5.5 3.7l-2.4 1c-.6-1.5-2-2.5-3.6-2.5-2.2 0-4 1.8-4 4s1.8 4 4 4c1.7 0 3.1-1.1 3.7-2.6l2.4.9c-.9 2.4-3.2 4.1-5.9 4.1-3.5 0-6.2-2.7-6.2-6.2z" fill="#ffffff" />
        <polygon points="21,18 27,20 21,22" fill="#ffffff" />
        <text x="38" y="26" fontFamily="system-ui, sans-serif" fontSize="15" fontWeight="800" fill="#1e293b">MoneyGram</text>
      </svg>
    );
  }

  // 13. kashy
  if (normalized.includes('kashy')) {
    return (
      <svg viewBox="0 0 110 38" height="30" style={{ maxWidth: '100%', height: '30px', ...style }}>
        <circle cx="14" cy="19" r="11" fill="#6366f1" opacity="0.15" />
        <text x="14" y="23" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="900" fill="#6366f1" textAnchor="middle">K</text>
        <text x="30" y="25" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="900" fill="#0f172a" letterSpacing="-0.5">kashy</text>
      </svg>
    );
  }

  // Default Generic Payment Card
  return (
    <svg viewBox="0 0 48 36" height="30" style={{ maxWidth: '100%', height: '30px', ...style }}>
      <rect width="44" height="32" x="2" y="2" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <rect width="44" height="7" x="2" y="8" fill="#334155" />
      <rect width="10" height="7" x="7" y="19" rx="1.5" fill="#f59e0b" />
      <circle cx="34" cy="22" r="3" fill="#ef4444" />
      <circle cx="38" cy="22" r="3" fill="#f59e0b" opacity="0.8" />
    </svg>
  );
};
