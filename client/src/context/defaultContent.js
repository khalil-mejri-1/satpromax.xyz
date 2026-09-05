export const defaultContent = {
  // 1. Navigation & General
  navbar: {
    logoIp: "IP",
    logoTv: "TV",
    logoPlay: "PLAY",
    linkPricing: "Pricing",
    linkChannels: "Channels List",
    linkInstall: "How To Install",
    linkContact: "Contact",
    btnGetStarted: "GET STARTED",
  },

  // 2. Hero Section
  hero: {
    badgeOffer: "Special Offer",
    badgeDiscount: "62% OFF",
    titlePrefix: "Best IPTV Service with",
    titleChannels: "19,000+ Channels",
    titleMiddle: "and",
    titleVod: "+56K movies and series",
    titleSuffix: "on-demand (VOD) from around the Globe",
    subtitle: "Watch your favorite channels, latest movies, and TV series in high quality without interruption",
    btnSubscribe: "Subscribe Now",
    btnPlans: "Premium Plans",
    perk1: "Instant Activation",
    perk2: "Anti-Freeze™ 9.0",
    perk3: "4K / FHD Streams",
    perk4: "24/7 VIP Support",
    liveBadge: "LIVE",
    liveViewersText: "14,890+ Active Viewers Now",
    uptimeText: "99.9% Zero Buffering Uptime",
    showcaseCards: [
      { id: 1, tag: "DOCU", quality: "FHD", title: "The Most Dangerous Animal", subtitle: "Stream Episode 1" },
      { id: 2, tag: "SERIES", quality: "4K", title: "FBI", subtitle: "Season 6 Live" },
      { id: 3, tag: "COMEDY", quality: "1080p", title: "The Good Place", subtitle: "All Episodes VOD" },
      { id: 4, tag: "sling", quality: "60FPS", title: "Live Sports PPV", subtitle: "Real-Time Broadcast" },
    ],
  },

  // 3. Supported Devices Strip
  deviceStrip: {
    title: "Supported Platforms & Devices",
    devices: [
      { id: 1, name: "Fire TV", label: "Amazon Fire TV" },
      { id: 2, name: "Android", label: "Android TV & Box" },
      { id: 3, name: "Roku", label: "Roku Streaming" },
      { id: 4, name: "Xbox", label: "Xbox Console" },
      { id: 5, name: "MAG BOX", label: "MAG 322/524" },
      { id: 6, name: "Apple", label: "Apple TV & iOS" },
      { id: 7, name: "Samsung", label: "Samsung Smart TV" },
      { id: 8, name: "Formuler", label: "Formuler Z11" },
      { id: 9, name: "Windows", label: "Windows 10/11" },
      { id: 10, name: "LG", label: "LG webOS TV" },
      { id: 11, name: "Huawei", label: "Huawei / Smart Devices" },
    ],
  },

  // 4. Pricing Section
  pricing: {
    badge: "Premium Plans",
    titlePrefix: "Choose Your",
    titleHighlight: "Perfect Plan",
    subtitle: "All plans include our premium features and 24/7 support",
    connection1: "1 Device / Connection",
    connection2: "2 Devices (Family Pack)",
    connection3: "3 Devices (Multi-Room)",
    plans: [
      {
        id: '1m',
        title: '1 Month',
        badge: 'Starter',
        price: 13.99,
        period: '/ 1 Month',
        savings: 'Standard Rate',
        popular: false,
        features: [
          '19,000+ Live Channels',
          '56,000+ VOD Movies & Series',
          '4K / Ultra HD & FHD Quality',
          'AntiFreeze™ 9.0 Technology',
          'Electronic Program Guide (EPG)',
          'Free Updates & Fast Activation',
          '24/7 Dedicated Customer Support',
          'All Devices Supported',
        ],
      },
      {
        id: '3m',
        title: '3 Months',
        badge: 'Save 30%',
        price: 26.99,
        period: '/ 3 Months',
        savings: 'Save $15.00',
        popular: false,
        features: [
          '19,000+ Live Channels',
          '56,000+ VOD Movies & Series',
          '4K / Ultra HD & FHD Quality',
          'AntiFreeze™ 9.0 Technology',
          'Electronic Program Guide (EPG)',
          'Free Updates & Fast Activation',
          '24/7 Dedicated Customer Support',
          '7-Days Catch-Up Replay',
        ],
      },
      {
        id: '6m',
        title: '6 Months',
        badge: 'Save 45%',
        price: 39.99,
        period: '/ 6 Months',
        savings: 'Save $43.95',
        popular: false,
        features: [
          '19,000+ Live Channels',
          '56,000+ VOD Movies & Series',
          '4K / Ultra HD & FHD Quality',
          'AntiFreeze™ 9.0 Technology',
          'Electronic Program Guide (EPG)',
          'Free Updates & Fast Activation',
          '24/7 VIP Dedicated Support',
          'PPV Events & Sports Passes',
        ],
      },
      {
        id: '12m',
        title: '12 Months',
        badge: '🔥 62% OFF - BEST VALUE',
        price: 59.99,
        period: '/ 12 Months',
        savings: 'Only $4.99/mo',
        popular: true,
        features: [
          '19,000+ Live Channels in 4K/FHD',
          '56,000+ VOD Movies & Series (Updated Daily)',
          '4K / UHD / FHD / 60 FPS Streams',
          'AntiFreeze™ 9.0 Zero-Buffer Server',
          'Full EPG Electronic Program Guide',
          'All International Sports & PPV Events',
          'Instant Automated Activation',
          '24/7 VIP WhatsApp & Live Chat Support',
          '7-Day Money-Back Guarantee',
        ],
      },
      {
        id: '24m',
        title: '24 Months',
        badge: '75% OFF - SUPER SAVER',
        price: 89.99,
        period: '/ 24 Months',
        savings: 'Only $3.74/mo',
        popular: false,
        features: [
          '19,000+ Live Channels',
          '56,000+ VOD Movies & Series',
          '4K / UHD / FHD / 60 FPS Streams',
          'AntiFreeze™ 9.0 Premium Server',
          'Full EPG & Catch-Up TV',
          'Free Stream Optimizer & VIP Line',
          'Instant Automated Activation',
          '24/7 Lifetime Priority Support',
          '7-Day Money-Back Guarantee',
        ],
      },
    ],
  },

  // 5. Channels Section
  channels: {
    titlePrefix: "Watch All Channels with",
    titleHighlight: "IPTV",
    titleSuffix: "No Cable TV Required",
    description: "We offer thousands of TV channels covering Canada, United States, United Kingdom, Portugal, Albania, Germany, Italy, France, Brazil, Romania, Greece, Spain, Sweden, Finland, Ireland, Norway, Denmark, Latin American countries, Arab countries, and almost all countries worldwide.",
    counterText: "19,420+ Channels Online in 4K / FHD / 60 FPS with Zero Freeze",
    btnBrowse: "Browse Full Channel Database",
  },

  // 6. Sports Section
  sports: {
    titlePrefix: "The Best IPTV 2025 To Watch All International",
    titleHighlight: "Sports Events",
    titleSuffix: ", including ppv iptv",
    description: "At our IPTV subscription service, we are proud to offer an extensive range of sports channels that cater to every sports enthusiast's needs. Our sports channels cover a vast variety of sports including football, basketball, baseball, tennis, golf, rugby, and more.",
    btnExplore: "Explore All Channels",
  },

  // 7. Features Grid
  featuresGrid: {
    card1: {
      title: "19,000+ Channels",
      desc: "Global and local channels variety",
      statValue: "19.4K+",
      statDetail: "Live Global TV Feeds",
    },
    card2: {
      title: "Huge VOD Library",
      desc: "Updated movies and series collection",
      statValue: "56,000+",
      statDetail: "Movies & 4K Series",
    },
    card3: {
      title: "Ultra-Fast Speed",
      desc: "High-speed servers without buffering",
      statValue: "10 Gbps",
      statDetail: "Anti-Freeze Servers",
    },
  },

  // 8. EPG Section
  epg: {
    title: "EPG Feature",
    description: "EPG is one of our most requested features and providing a full and updated EPG has been our priority since day one. We can proudly say that we have been able to cover the majority of our IPTV channels.",
    perk1: "Real-time Electronic Program Guide with 7-day schedule",
    perk2: "Automated EPG updates every 6 hours",
    perk3: "One-click program recording & 7-day catch-up replay",
    btnText: "JOIN US",
  },

  // 9. VOD Section
  vod: {
    titlePrefix: "Watch The Latest",
    titleHighlight: "Series & Movies",
    titleSuffix: "with VOD on IPTV",
    description: "We have a vast list of vod (series & movies) updated monthly. You can watch your favorite TV shows and documentaries at any time. All of it is from multiple platforms like Prime, HBO, Netflix, Hulu, Disney, Sling TV, Apple TV, and more.",
    ctaTitle: "Want to request a movie or series?",
    ctaDesc: "Our VOD library updates daily. Request any TV show or cinema release anytime.",
    ctaBtn: "Get Instant VOD Access",
    items: [
      {
        id: 1,
        title: "Geek Girl",
        platform: "NETFLIX",
        rating: "8.4",
        genre: "Comedy / Drama",
        year: "2024",
        quality: "4K UHD",
        description: "Awkward teenager Harriet Manners is scouted to become a top London model, turning her world upside down.",
      },
      {
        id: 2,
        title: "SUPACELL",
        platform: "NETFLIX",
        rating: "8.7",
        genre: "Sci-Fi / Action",
        year: "2024",
        quality: "4K HDR",
        description: "A group of ordinary South Londoners unexpectedly develop superpowers and must unite to survive.",
      },
      {
        id: 3,
        title: "Vikings Valhalla",
        platform: "NETFLIX",
        rating: "8.9",
        genre: "Action / History",
        year: "2024",
        quality: "4K UHD",
        description: "In this sequel to Vikings, legendary Norse heroes blaze new paths through a rapidly changing Europe.",
      },
      {
        id: 4,
        title: "Worst Roommate Ever",
        platform: "NETFLIX",
        rating: "8.2",
        genre: "Docuseries / Crime",
        year: "2024",
        quality: "1080p",
        description: "Terrifying tales of malevolent roommates who turn unsuspecting co-habitants' lives into waking nightmares.",
      },
      {
        id: 5,
        title: "Pedaço de Mim",
        platform: "NETFLIX",
        rating: "8.5",
        genre: "Drama / Romance",
        year: "2024",
        quality: "4K UHD",
        description: "Due to a rare medical phenomenon, a woman finds herself pregnant with twins by two different men.",
      },
      {
        id: 6,
        title: "House of the Dragon",
        platform: "HBO MAX",
        rating: "9.1",
        genre: "Fantasy / Drama",
        year: "2024",
        quality: "4K DOLBY",
        description: "The Targaryen civil war erupts in full fury as dragons clash across the skies of Westeros.",
      },
    ],
  },

  // 10. Devices Supported Section
  devices: {
    titlePrefix: "All Devices Are",
    titleHighlight: "Supported",
    subtitle: "Experience seamless streaming across all your favorite devices",
    categories: [
      {
        id: "smart-tv",
        title: "Smart TVs",
        brand: "Samsung, LG, Sony, Android TV",
        icon: "📺",
        apps: ["Smart IPTV", "IPTV Smarters Pro", "IBO Player", "SET IPTV", "NET IPTV", "TiviMate"],
        setupTime: "2 Minutes",
        description: "Enjoy ultra-crisp 4K UHD streaming directly on your living room Smart TV without needing extra cables or hardware.",
      },
      {
        id: "firestick",
        title: "Amazon FireStick",
        brand: "Fire TV Stick 4K, Fire TV Cube, Fire Edition TVs",
        icon: "🔥",
        apps: ["TiviMate Premium", "IPTV Smarters Pro", "XCIPTV", "Downloader App", "OTT Navigator"],
        setupTime: "1 Minute",
        description: "The most popular IPTV streaming hardware. Fast channel switching, responsive EPG guide, and smooth 60 FPS playback.",
      },
      {
        id: "android",
        title: "Android TV & Phones",
        brand: "Nvidia Shield, Xiaomi Mi Box, Google TV, Samsung Galaxy",
        icon: "🤖",
        apps: ["TiviMate", "IPTV Smarters", "Televizo", "XCIPTV Player", "VLC for Android"],
        setupTime: "1 Minute",
        description: "Full compatibility with all Android phones, tablets, TV boxes, and smart projectors with automated M3U & Xtream Codes.",
      },
      {
        id: "apple",
        title: "Apple TV & iOS",
        brand: "Apple TV 4K, iPhone 16/15, iPad Pro, MacBook, iMac",
        icon: "🍏",
        apps: ["IPTV Smarters Pro", "GSE Smart IPTV", "Snappier IPTV", "Flex IPTV", "VLC Player"],
        setupTime: "2 Minutes",
        description: "Seamless synchronization across the entire Apple ecosystem with AirPlay support and HDR10/Dolby Vision streaming.",
      },
      {
        id: "mag-box",
        title: "MAG & Formuler",
        brand: "MAG 524, MAG 322, Formuler Z11 Pro, Z10, Amiko",
        icon: "📦",
        apps: ["MYTVOnline 2 / 3", "Stalker Portal", "Ministra Portal", "MAC Portal Activation"],
        setupTime: "Instant Portal",
        description: "Dedicated portal activation for MAG & Formuler set-top boxes with custom MAC address registration.",
      },
      {
        id: "pc-mac",
        title: "PC & Windows / Mac",
        brand: "Windows 11/10, macOS Sequoia/Sonoma, Linux",
        icon: "💻",
        apps: ["VLC Media Player", "IPTV Smarters Windows/Mac", "Kodi 21", "Web Player Browser"],
        setupTime: "Instant",
        description: "Watch live channels and VOD directly on your computer or through our zero-install Web Browser Player.",
      },
    ],
  },

  // 11. How to Install Section
  install: {
    badge: "Easy 3-Step Setup",
    titlePrefix: "How To",
    titleHighlight: "Install & Activate",
    subtitle: "Get up and running in less than 2 minutes on any device of your choice",
    btnOrder: "Get Started Now",
    apps: [
      {
        id: 'smarters',
        name: 'IPTV Smarters Pro',
        devices: 'Android, FireStick, iOS, Smart TV, Windows',
        steps: [
          'Download and install IPTV Smarters Pro from your device store or Downloader (Code: 29938).',
          'Open the app and select "Login with Xtream Codes API".',
          'Enter Any Name in the first field, then enter your Username, Password, and Server URL from your activation email.',
          'Click "Add User" and enjoy 19,000+ live channels & 56K+ VOD movies instantly!',
        ],
      },
      {
        id: 'tivimate',
        name: 'TiviMate IPTV',
        devices: 'FireStick, Android TV, Nvidia Shield, Google TV',
        steps: [
          'Install TiviMate from the Google Play Store or search Downloader app.',
          'Click "Add Playlist" -> choose "Xtream Codes login" or "M3U Playlist".',
          'Input your Server URL, Username, and Password sent upon order confirmation.',
          'Enable EPG TV Guide and enjoy ultra-smooth channel zapping and 4K streaming.',
        ],
      },
      {
        id: 'smartiptv',
        name: 'Smart IPTV / IBO Player',
        devices: 'Samsung Smart TV, LG webOS TV',
        steps: [
          'Search and install "IBO Player" or "Smart IPTV" from your TV App Store.',
          'Open the app to find your TV MAC Address and Device Key.',
          'Visit the portal upload page or provide your MAC Address during checkout.',
          'Restart the TV app, and all your channels and playlist will load automatically.',
        ],
      },
      {
        id: 'mag',
        name: 'MAG / Formuler Box',
        devices: 'MAG 250/322/524, Formuler Z10/Z11',
        steps: [
          'Go to Settings -> System Settings -> Servers -> Portals.',
          'Set Portal 1 Name to "IPPLAY TV" and enter the Portal URL provided in your activation email.',
          'Send us your MAG device MAC address (starts with 00:1A:79:xx:xx:xx) to whitelist.',
          'Reboot the device portal to access all channels, EPG, and VOD on your TV.',
        ],
      },
    ],
  },

  // 12. FAQ Section
  faq: {
    badge: "Frequently Asked Questions",
    titlePrefix: "Have Questions?",
    titleHighlight: "We've Got Answers",
    subtitle: "Everything you need to know about our premium IPTV service",
    bannerTitle: "Still have questions or need a custom trial?",
    bannerDesc: "Our friendly 24/7 customer support agents are ready to assist you right now.",
    btnChat: "Chat with 24/7 Support",
    items: [
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
    ],
  },

  // 13. Footer & Floating Support
  footer: {
    brandDesc: "The world's leading premium IPTV provider delivering 19,000+ live HD/4K TV channels and 56,000+ VOD movies & series with zero freezing and 99.9% guaranteed server uptime.",
    ratingText: "4.9 / 5 Rated by 14,800+ Global Customers",
    guaranteeTitle: "7-Day Money Back Guarantee",
    guaranteeDesc: "100% risk-free trial with instant money-back protection.",
    copyrightText: "© 2026 IPPLAY TV. All rights reserved. Premium IPTV & VOD Streaming Service.",
    supportPillText: "24/7 SUPPORT",
    whatsappPhone: "+15551234567",
    whatsappDefaultMsg: "Hello IPPLAY TV Support, I would like to get started with IPTV",
  },
};
