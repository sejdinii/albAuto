// AlbAuto design tokens + atomic UI primitives.
// Everything attaches to window at the bottom.

const T = {
  // Brand
  gold: '#F5A623',
  goldDark: '#D88B0A',
  goldSoft: '#FFE9B8',
  goldTint: '#FFF6E0',

  // Neutral
  ink: '#0F0F10',
  ink2: '#2A2A2C',
  body: '#4A4A4D',
  muted: '#8A8780',
  hairline: '#ECE9E0',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F5EF',
  bg: '#FAFAF7',

  // Status
  green: '#1FAE6B',
  greenSoft: '#E1F5EB',
  red: '#E14B4B',
  redSoft: '#FCE6E6',
  blue: '#2E7DEB',
  blueSoft: '#E2EDFE',

  // Brand palette (social)
  instagram: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
  facebook: '#1877F2',

  // Type
  font: '"Manrope", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  // Sizes
  fs: {
    xs: 11, sm: 12, base: 13, md: 14, lg: 16,
    xl: 18, h3: 22, h2: 28, h1: 34, hero: 44,
  },
  // Radii
  r: { sm: 8, md: 12, lg: 16, xl: 22, pill: 9999 },
  // Shadows
  shadow: {
    card: '0 1px 2px rgba(15,15,16,0.04), 0 4px 14px rgba(15,15,16,0.06)',
    elev: '0 6px 24px rgba(15,15,16,0.10)',
    sticky: '0 -4px 24px rgba(15,15,16,0.06)',
  },
};

// =====================================================
// Icon (inline SVGs, stroke-based)
// =====================================================
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.8, fill = false }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'search':
      return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case 'bell':
      return <svg {...props}><path d="M6 8a6 6 0 1112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 004 0"/></svg>;
    case 'heart':
      return fill
        ? <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 5a5.5 5.5 0 019.5 7C19 16.5 12 21 12 21z"/></svg>
        : <svg {...props}><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 5a5.5 5.5 0 019.5 7C19 16.5 12 21 12 21z"/></svg>;
    case 'home':
      return <svg {...props}><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9.5z"/></svg>;
    case 'plus':
      return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'chat':
      return <svg {...props}><path d="M21 12a8 8 0 11-3-6.2L21 5l-1 3.7A8 8 0 0121 12z"/></svg>;
    case 'menu':
      return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7"/></svg>;
    case 'back':
      return <svg {...props}><path d="M15 5l-7 7 7 7"/></svg>;
    case 'chevR':
      return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chevD':
      return <svg {...props}><path d="M6 9l6 6 6-6"/></svg>;
    case 'close':
      return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'check':
      return <svg {...props}><path d="M4 12l5 5 11-12"/></svg>;
    case 'share':
      return <svg {...props}><path d="M12 3v13M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/></svg>;
    case 'pin':
      return <svg {...props}><path d="M12 22s-7-7.5-7-13a7 7 0 1114 0c0 5.5-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'phone':
      return <svg {...props}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>;
    case 'whatsapp':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M20.5 3.5A11 11 0 003.2 17l-1.2 4.5 4.6-1.2A11 11 0 1020.5 3.5zM12 20a8 8 0 01-4.1-1.1l-.3-.2-2.7.7.7-2.6-.2-.3A8 8 0 1112 20zm4.5-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.9-.1.1-.3.2-.5 0-.7-.3-1.4-.7-2-1.3-.6-.6-1-1.3-1.3-2-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2.7 2.7 0 00-.8 2c0 1.2.9 2.3 1 2.5.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.4 0 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3z"/></svg>;
    case 'camera':
      return <svg {...props}><path d="M4 7h3l2-2h6l2 2h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'filter':
      return <svg {...props}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case 'sort':
      return <svg {...props}><path d="M7 4v16M3 8l4-4 4 4M17 20V4M21 16l-4 4-4-4"/></svg>;
    case 'eye':
      return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'star':
      return fill
        ? <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l3.1 6.5 7 1-5 5 1.2 7-6.3-3.4-6.3 3.4 1.2-7-5-5 7-1z"/></svg>
        : <svg {...props}><path d="M12 2l3.1 6.5 7 1-5 5 1.2 7-6.3-3.4-6.3 3.4 1.2-7-5-5 7-1z"/></svg>;
    case 'verified':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 1.5l2.4 1.8 3-.3 1.2 2.7 2.7 1.4-.4 3 1.6 2.5-1.9 2.3.3 3-2.8 1.1-1.5 2.6-2.9-.7-2.7 1.4-2.3-2-3 .1-1.3-2.7-2.7-1.5.6-3-1.4-2.5L2.3 8l-.1-3L5 4l1.6-2.6 2.8.8L12 1.5z" stroke="none"/><path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>;
    case 'sparkles':
      return <svg {...props}><path d="M12 3l1.5 4 4 1.5-4 1.5L12 14l-1.5-4-4-1.5 4-1.5L12 3z"/><path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/></svg>;
    case 'bolt':
      return <svg {...props}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
    case 'badge':
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'globe':
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>;
    case 'car':
      return <svg {...props}><path d="M3 14l1.5-5a2 2 0 012-1.5h11a2 2 0 012 1.5L21 14M5 14h14v5H5z"/><circle cx="8" cy="17" r="1.5"/><circle cx="16" cy="17" r="1.5"/></svg>;
    case 'gauge':
      return <svg {...props}><path d="M4 16a8 8 0 1116 0"/><path d="M12 16l4-4"/></svg>;
    case 'cal':
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'shield':
      return <svg {...props}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'doc':
      return <svg {...props}><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/></svg>;
    case 'edit':
      return <svg {...props}><path d="M4 20l4-1 11-11-3-3-11 11-1 4z"/></svg>;
    case 'trash':
      return <svg {...props}><path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"/></svg>;
    case 'upload':
      return <svg {...props}><path d="M12 16V3M7 8l5-5 5 5"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>;
    case 'play':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M7 4l13 8-13 8z"/></svg>;
    case 'instagram':
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill={color}/></svg>;
    case 'facebook':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M22 12a10 10 0 10-11.6 9.9v-7H8v-3h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v7A10 10 0 0022 12z"/></svg>;
    case 'sync':
      return <svg {...props}><path d="M21 12a9 9 0 01-15 6.7L3 16M3 12a9 9 0 0115-6.7L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/></svg>;
    case 'lock':
      return <svg {...props}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>;
    case 'mail':
      return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case 'apple':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M16.4 12.7c0-2.4 2-3.6 2.1-3.6-1.1-1.6-2.9-1.8-3.5-1.8-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.3 9.8.8 1.2 1.8 2.5 3.1 2.5 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.9-3.2zM14 5.3c.7-.8 1.1-2 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.8-1.5z"/></svg>;
    case 'google':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M22 12.3c0-.8-.1-1.4-.2-2.1H12v4h5.7c-.2 1.3-1 2.4-2.2 3.1v2.6h3.5c2.1-1.9 3-4.7 3-7.6z" fill="#4285F4"/><path d="M12 22c2.9 0 5.4-1 7.2-2.6l-3.5-2.6c-1 .6-2.2 1-3.7 1-2.8 0-5.2-1.9-6.1-4.5H2.3v2.7A10 10 0 0012 22z" fill="#34A853"/><path d="M5.9 13.3c-.2-.6-.4-1.3-.4-2s.2-1.4.4-2V6.6H2.3a10 10 0 000 8.8l3.6-2.1z" fill="#FBBC05"/><path d="M12 5.4c1.6 0 3 .6 4.1 1.6l3-3A10 10 0 002.3 6.6L5.9 9.3C6.8 6.7 9.2 5.4 12 5.4z" fill="#EA4335"/></svg>;
    case 'dots':
      return <svg {...props}><circle cx="5" cy="12" r="1.4" fill={color} stroke="none"/><circle cx="12" cy="12" r="1.4" fill={color} stroke="none"/><circle cx="19" cy="12" r="1.4" fill={color} stroke="none"/></svg>;
    case 'send':
      return <svg {...props}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case 'attach':
      return <svg {...props}><path d="M21 11l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8"/></svg>;
    case 'analytics':
      return <svg {...props}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>;
    case 'building':
      return <svg {...props}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2"/></svg>;
    case 'fuel':
      return <svg {...props}><path d="M5 21V5a2 2 0 012-2h7a2 2 0 012 2v16"/><path d="M3 21h15M16 11h2a2 2 0 012 2v3a2 2 0 002 2"/></svg>;
    case 'cog':
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.4l2-1.5-2-3.4-2.4.8a7 7 0 00-2.4-1.4L13.7 3h-3.4l-.4 2.1A7 7 0 007.5 6.5L5 5.7l-2 3.4 2 1.5A7 7 0 005 12c0 .5 0 1 .1 1.4L3 14.9l2 3.4 2.4-.8a7 7 0 002.4 1.4l.4 2.1h3.4l.4-2.1a7 7 0 002.4-1.4l2.4.8 2-3.4-2-1.5c.1-.4.1-.9.1-1.4z"/></svg>;
    case 'questionmark':
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 0c0 2-2.5 2-2.5 4M12 17h.01"/></svg>;
    case 'flame':
      return <svg {...props}><path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1-2-1-4-1-6-2 1-5 4-6 8-2-1-3-3-3-3-1 2-1 4-1 7s3 8 7 8z"/></svg>;
    case 'tag':
      return <svg {...props}><path d="M3 12V5a2 2 0 012-2h7l9 9-9 9-9-9z"/><circle cx="8" cy="8" r="1.5"/></svg>;
    case 'scale':
      return <svg {...props}><path d="M12 3v18M5 8h14M5 8l-3 8h6L5 8zM19 8l-3 8h6l-3-8z"/></svg>;
    case 'history':
      return <svg {...props}><path d="M3 12a9 9 0 109-9c-2.5 0-5 1-7 3M3 3v4h4"/><path d="M12 7v5l3 2"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

// =====================================================
// CarPhoto — gradient + silhouette placeholder
// =====================================================
function CarPhoto({ hue = 30, label, width = '100%', height = 160, radius = 0, dark = false, badge, count }) {
  const bg = dark
    ? `linear-gradient(160deg, oklch(0.22 0.04 ${hue}) 0%, oklch(0.12 0.02 ${hue}) 100%)`
    : `linear-gradient(160deg, oklch(0.85 0.04 ${hue}) 0%, oklch(0.62 0.05 ${hue}) 100%)`;
  return (
    <div style={{
      width, height, borderRadius: radius, background: bg,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* horizon line */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '62%', height: 1, background: 'rgba(0,0,0,0.08)' }} />
      {/* car silhouette */}
      <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', left: 0, right: 0, bottom: '8%', width: '85%', margin: '0 auto', display: 'block' }}>
        <path d="M20 70 Q22 55 38 50 L70 42 Q90 36 110 38 L140 42 Q160 46 170 56 L185 60 Q190 62 188 70 L182 78 L168 78 Q166 86 158 86 Q150 86 148 78 L60 78 Q58 86 50 86 Q42 86 40 78 L28 78 Q18 76 20 70 Z" fill="rgba(15,15,16,0.85)" />
        <path d="M55 50 L82 44 Q98 42 118 44 L142 50 L150 60 L48 60 Z" fill="rgba(255,255,255,0.15)" />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', top: 10, left: 10,
          fontFamily: T.mono, fontSize: 10, color: 'rgba(255,255,255,0.85)',
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>{label}</div>
      )}
      {badge}
      {count && (
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          background: 'rgba(0,0,0,0.55)', color: '#fff',
          fontFamily: T.mono, fontSize: 10, padding: '3px 7px', borderRadius: 6,
        }}>{count}</div>
      )}
    </div>
  );
}

// =====================================================
// Status bar (custom-tinted, replaces iOS one)
// =====================================================
function StatusBar({ dark = false, tint }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40,
      height: 47, padding: '0 28px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      background: tint || 'transparent', color: c,
    }}>
      <div style={{ fontFamily: '-apple-system, system-ui', fontWeight: 600, fontSize: 16, marginTop: 6 }}>9:41</div>
      <div style={{ width: 126, height: 37, position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 11, borderRadius: 24, background: '#000', zIndex: 5 }} />
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
        <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0" y="6" width="3" height="4" rx="0.7" fill={c}/><rect x="4" y="4" width="3" height="6" rx="0.7" fill={c}/><rect x="8" y="2" width="3" height="8" rx="0.7" fill={c}/><rect x="12" y="0" width="3" height="10" rx="0.7" fill={c}/></svg>
        <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0.5" y="0.5" width="19" height="10" rx="3" stroke={c} strokeOpacity="0.35" fill="none"/><rect x="2" y="2" width="16" height="7" rx="1.5" fill={c}/></svg>
      </div>
    </div>
  );
}

// =====================================================
// Home indicator bar
// =====================================================
function HomeIndicator({ dark = false }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
      height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      paddingBottom: 8, pointerEvents: 'none',
    }}>
      <div style={{ width: 139, height: 5, borderRadius: 100, background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.85)' }} />
    </div>
  );
}

// =====================================================
// Bottom tab bar
// =====================================================
function TabBar({ active = 'home', chatBadge = 2 }) {
  const tabs = [
    { id: 'home',      icon: 'home',  label: 'Home',  nav: 'home' },
    { id: 'favorites', icon: 'heart', label: 'Saved', nav: 'favorites' },
    { id: 'sell',      icon: 'plus',  label: 'Sell',  nav: 'sell-type' },
    { id: 'chats',     icon: 'chat',  label: 'Chats', nav: 'chat-list', badge: chatBadge },
    { id: 'menu',      icon: 'menu',  label: 'Menu',  nav: 'profile' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
      paddingTop: 8, paddingBottom: 34, background: '#fff',
      borderTop: `1px solid ${T.hairline}`,
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map(t => {
        const isCenter = t.id === 'sell';
        const isActive = t.id === active;
        if (isCenter) {
          return (
            <div key={t.id} data-nav={t.nav} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 56, cursor: 'pointer' }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,166,35,0.4)', marginTop: -14 }}>
                <Icon name="plus" color="#0F0F10" size={24} strokeWidth={2.4}/>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: T.ink, marginTop: -2 }}>{t.label}</div>
            </div>
          );
        }
        return (
          <div key={t.id} data-nav={t.nav} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 56, position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'relative' }}>
              <Icon name={t.icon} color={isActive ? T.ink : T.muted} fill={isActive && t.id === 'favorites'} strokeWidth={isActive ? 2.2 : 1.8} size={22}/>
              {t.badge ? (
                <div style={{ position: 'absolute', top: -6, right: -10, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 99, background: T.red, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.badge}</div>
              ) : null}
            </div>
            <div style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? T.ink : T.muted }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// =====================================================
// Top app bar (gold or white)
// =====================================================
function TopBar({ title, variant = 'plain', leading = 'back', trailing, subtitle, onPress }) {
  const isGold = variant === 'gold';
  const isWhite = variant === 'white';
  const bg = isGold ? T.gold : '#fff';
  const fg = isGold ? T.ink : T.ink;
  return (
    <div style={{
      paddingTop: 53, paddingBottom: 12, paddingLeft: 8, paddingRight: 8,
      background: bg, position: 'relative',
      borderBottom: isWhite ? `1px solid ${T.hairline}` : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', minHeight: 44 }}>
        {leading === 'back' && (
          <div data-nav="__back" style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="back" color={fg} size={22} strokeWidth={2}/>
          </div>
        )}
        {leading === 'close' && (
          <div data-nav="__back" style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="close" color={fg} size={22} strokeWidth={2}/>
          </div>
        )}
        {leading === 'none' && <div style={{ width: 16 }}/>}
        <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: fg, letterSpacing: -0.2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: isGold ? 'rgba(15,15,16,0.65)' : T.muted, marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{ minWidth: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
          {trailing}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Button
// =====================================================
function Button({ children, variant = 'primary', size = 'md', icon, iconRight, full = true, color }) {
  const styles = {
    primary: { bg: T.gold, fg: T.ink },
    dark: { bg: T.ink, fg: '#fff' },
    outline: { bg: 'transparent', fg: T.ink, border: `1.5px solid ${T.ink}` },
    soft: { bg: T.goldTint, fg: T.ink },
    ghost: { bg: 'transparent', fg: T.ink },
    green: { bg: T.green, fg: '#fff' },
    danger: { bg: T.red, fg: '#fff' },
  }[variant];
  const h = { sm: 36, md: 48, lg: 54 }[size];
  return (
    <button style={{
      height: h, padding: '0 18px', borderRadius: 12,
      background: color || styles.bg, color: styles.fg,
      border: styles.border || 'none',
      fontFamily: T.font, fontSize: 15, fontWeight: 700,
      width: full ? '100%' : 'auto', display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer', letterSpacing: -0.1,
    }}>
      {icon && <Icon name={icon} size={18} color={styles.fg} strokeWidth={2.2}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={18} color={styles.fg} strokeWidth={2.2}/>}
    </button>
  );
}

// =====================================================
// Badge
// =====================================================
function Badge({ children, color = T.gold, fg = T.ink, icon, size = 'md' }) {
  const fontSize = size === 'sm' ? 10 : 11;
  const py = size === 'sm' ? 3 : 4;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: `${py}px 8px`, borderRadius: 6,
      background: color, color: fg,
      fontSize, fontWeight: 700, letterSpacing: 0.4,
      textTransform: 'uppercase', fontFamily: T.font,
    }}>
      {icon && <Icon name={icon} size={11} color={fg} strokeWidth={2.4}/>}
      {children}
    </span>
  );
}

// =====================================================
// Phone screen shell
// =====================================================
function Phone({ children, width = 360, height = 740, bg = T.bg, dark = false }) {
  // Separate fixed chrome (StatusBar / TabBar / HomeIndicator) from scrollable content
  // so chrome anchors to the phone viewport, not to the scroll content.
  const fixed = [];
  const flow = [];
  React.Children.forEach(children, (ch) => {
    if (!ch) return;
    const t = ch.type;
    if (t === StatusBar || t === TabBar || t === HomeIndicator) fixed.push(ch);
    else flow.push(ch);
  });
  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      borderRadius: 40, background: bg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.06) inset, 0 24px 60px rgba(15,15,16,0.18)',
      border: `1px solid ${T.hairline}`,
      fontFamily: T.font,
      color: T.ink,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}>
        {flow}
      </div>
      {fixed}
    </div>
  );
}

// =====================================================
// CarCard (3-col grid)
// =====================================================
function CarCardSmall({ car }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <CarPhoto hue={car.hue} label={car.label} height={84} radius={10}/>
      <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{car.year}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, lineHeight: 1.2 }}>{car.make}</div>
      <div style={{ fontSize: 11, color: T.body, lineHeight: 1.2, marginTop: -2 }}>{car.model}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: T.goldDark, fontFamily: T.mono, marginTop: 2 }}>{car.price}</div>
    </div>
  );
}

// =====================================================
// CarCardMedium (2-col grid for favorites)
// =====================================================
function CarCardMedium({ car, favorited = true }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: T.shadow.card, border: `1px solid ${T.hairline}` }}>
      <div style={{ position: 'relative' }}>
        <CarPhoto hue={car.hue} label={car.label} height={120}
          count={car.photos ? `${car.photos.cur}/${car.photos.total}` : null}
          badge={
            <div style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 99, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" color={favorited ? T.red : T.muted} fill={favorited} size={16}/>
            </div>
          }
        />
      </div>
      <div style={{ padding: 10 }}>
        <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{car.year} · {car.km}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 2, lineHeight: 1.2 }}>{car.make} {car.model}</div>
        <div style={{ fontSize: 11, color: T.body, marginTop: 1 }}>{car.trim}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, fontFamily: T.mono, marginTop: 6, letterSpacing: -0.3 }}>{car.price}</div>
      </div>
    </div>
  );
}

// =====================================================
// CarCardListing (large list rows)
// =====================================================
function CarCardListing({ car, premium = false }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.hairline}`, boxShadow: T.shadow.card, marginBottom: 14 }}>
      <div style={{ position: 'relative' }}>
        <CarPhoto hue={car.hue} label={car.label} height={195}
          count={car.photos ? `${car.photos.cur}/${car.photos.total}` : null}
          badge={
            <React.Fragment>
              {premium && (
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <Badge color="#0F0F10" fg={T.gold} icon="bolt">Premium</Badge>
                </div>
              )}
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 99, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="share" color={T.ink} size={15}/>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 99, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="heart" color={T.muted} size={15}/>
                </div>
              </div>
              {car.photos && (
                <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4 }}>
                  {Array.from({ length: car.photos.total }).map((_, i) => (
                    <div key={i} style={{ width: 5, height: 5, borderRadius: 99, background: i === car.photos.cur - 1 ? '#fff' : 'rgba(255,255,255,0.4)' }} />
                  ))}
                </div>
              )}
            </React.Fragment>
          }
        />
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, letterSpacing: -0.2 }}>{car.make} {car.model}</div>
            <div style={{ fontSize: 12, color: T.body, marginTop: 2 }}>{car.trim} · {car.subtitle}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.ink, fontFamily: T.mono, letterSpacing: -0.4 }}>{car.price}</div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{car.priceEur}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <Badge color={T.greenSoft} fg={T.green} icon="check">Warranty</Badge>
          <Badge color={T.greenSoft} fg={T.green} icon="check">Service</Badge>
          <Badge color={T.surfaceAlt} fg={T.body}>{car.year}</Badge>
          <Badge color={T.surfaceAlt} fg={T.body}>{car.km}</Badge>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.hairline}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="pin" color={T.muted} size={13}/>
            <span style={{ fontSize: 12, color: T.body }}>{car.location}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ height: 36, padding: '0 14px', borderRadius: 99, background: T.gold, border: 'none', fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <Icon name="chat" size={14} color={T.ink} strokeWidth={2.2}/> Chat
            </button>
            <button style={{ height: 36, width: 36, borderRadius: 99, background: T.green, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="whatsapp" size={16} color="#fff"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Logo wordmark
// =====================================================
function Logo({ size = 22, dark = false }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.3, background: T.gold, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.15)' }}>
        <div style={{ width: size * 0.55, height: size * 0.22, borderRadius: size * 0.06, background: T.ink }} />
      </div>
      <span style={{ fontSize: size * 0.85, fontWeight: 800, letterSpacing: -0.5, color: dark ? '#fff' : T.ink, fontFamily: T.font }}>
        AlbAuto
      </span>
    </div>
  );
}

Object.assign(window, {
  T, Icon, CarPhoto, StatusBar, HomeIndicator, TabBar, TopBar,
  Button, Badge, Phone, CarCardSmall, CarCardMedium, CarCardListing, Logo,
});
