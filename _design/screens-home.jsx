// Home, Notifications, Search

function HomeScreen() {
  return (
    <Phone>
      <StatusBar/>
      {/* Header */}
      <div style={{ padding: '53px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
          <Logo size={22}/>
          <div style={{ display: 'flex', gap: 8 }}>
            <div data-nav="notifications" style={{ width: 40, height: 40, borderRadius: 99, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
              <Icon name="bell" color={T.ink} size={18}/>
              <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 99, background: T.red, border: '2px solid #fff' }}/>
            </div>
            <div data-nav="profile" style={{ width: 40, height: 40, borderRadius: 99, background: T.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>AM</div>
          </div>
        </div>
      </div>
      {/* Search */}
      <div style={{ padding: '14px 16px 0' }}>
        <div data-nav="search" style={{ height: 50, borderRadius: 14, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, boxShadow: T.shadow.card, cursor: 'pointer' }}>
          <Icon name="search" color={T.muted} size={20}/>
          <div style={{ flex: 1, fontSize: 14, color: T.muted }}>Search make, model or VIN…</div>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: T.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="filter" color={T.ink} size={15}/>
          </div>
        </div>
      </div>
      {/* Hero categories */}
      <div style={{ padding: '18px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, letterSpacing: -0.2 }}>Where to?</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div data-nav="balkan-countries" style={{ cursor: 'pointer' }}><CategoryCard title="Cars within Balkans" sub="2,872 listings" hue={30} primary={true}/></div>
          <div data-nav="continent" style={{ cursor: 'pointer' }}><CategoryCard title="Cars for Import" sub="13,610 worldwide" hue={210}/></div>
        </div>
      </div>
      {/* Featured row */}
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.ink }}>For you</div>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>See all</div>
        </div>
        <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
          {CARS.slice(3,6).map(c => (
            <div key={c.id} data-nav="detail" style={{ width: 140, flexShrink: 0, cursor: 'pointer' }}>
              <CarCardSmall car={c}/>
            </div>
          ))}
        </div>
      </div>
      {/* New listings grid */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.ink }}>New listings</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: T.muted, fontWeight: 600 }}>
            All cities <Icon name="chevD" size={12} color={T.muted}/>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {CARS.slice(0,6).map(c => <div key={c.id} data-nav="detail" style={{ cursor: 'pointer' }}><CarCardSmall car={c}/></div>)}
        </div>
      </div>
      <div style={{ height: 80 }}/>
      <TabBar active="home"/>
      <HomeIndicator/>
    </Phone>
  );
}

function CategoryCard({ title, sub, hue, primary }) {
  return (
    <div style={{
      aspectRatio: '1', borderRadius: 18, position: 'relative', overflow: 'hidden',
      background: primary ? T.ink : `linear-gradient(160deg, oklch(0.92 0.03 ${hue}), oklch(0.78 0.04 ${hue}))`,
      padding: 14, color: primary ? '#fff' : T.ink,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      border: primary ? 'none' : `1px solid ${T.hairline}`,
    }}>
      {/* Car silhouette */}
      <svg viewBox="0 0 200 100" style={{ position: 'absolute', bottom: -10, right: -20, width: 140, opacity: 0.95 }}>
        <path d="M20 70 Q22 55 38 50 L70 42 Q90 36 110 38 L140 42 Q160 46 170 56 L185 60 Q190 62 188 70 L182 78 L168 78 Q166 86 158 86 Q150 86 148 78 L60 78 Q58 86 50 86 Q42 86 40 78 L28 78 Q18 76 20 70 Z" fill={primary ? T.gold : 'rgba(15,15,16,0.85)'} />
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 9, fontFamily: T.mono, opacity: 0.6, letterSpacing: 0.5, textTransform: 'uppercase' }}>{sub}</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.1, maxWidth: '70%' }}>{title}</div>
        <div style={{ width: 32, height: 32, borderRadius: 99, background: primary ? T.gold : T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" color={primary ? T.ink : '#fff'} size={16} strokeWidth={2.4}/>
        </div>
      </div>
    </div>
  );
}

function NotificationsScreen() {
  const items = [
    { type:'price', icon:'tag', color:T.green, title:'Price dropped on BMW M3', body:'AED 489,900 → 479,900 · saved €2,600', time:'now' },
    { type:'chat',  icon:'chat', color:T.gold, title:'Andrej M. sent you an offer', body:'78,000 € for the Range Rover Sport', time:'2m' },
    { type:'match', icon:'sparkles', color:T.gold, title:'3 new matches for your saved search', body:'Audi RS6, mileage < 30 000 km', time:'1h' },
    { type:'ad',    icon:'eye', color:T.blue, title:'Your ad was viewed 248 times today', body:'2024 Porsche 911 Carrera S', time:'3h' },
    { type:'sys',   icon:'shield', color:T.body, title:'Verification complete', body:'You can now post Premium ads', time:'Yesterday' },
  ];
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Notifications" trailing={<span style={{ fontSize: 13, color: T.ink, fontWeight: 600 }}>Mark read</span>} variant="white"/>
      <div style={{ padding: '8px 0 0' }}>
        <div style={{ padding: '8px 16px', display: 'flex', gap: 8 }}>
          {['All','Listings','Chats','Price drops','System'].map((c, i) => (
            <div key={c} style={{
              padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
              background: i === 0 ? T.ink : 'transparent',
              color: i === 0 ? '#fff' : T.body,
              border: i === 0 ? 'none' : `1px solid ${T.hairline}`,
            }}>{c}</div>
          ))}
        </div>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${T.hairline}`, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: it.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={it.icon} color={it.color} size={18} strokeWidth={2}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, lineHeight: 1.3 }}>{it.title}</div>
              <div style={{ fontSize: 12, color: T.body, marginTop: 3, lineHeight: 1.4 }}>{it.body}</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{it.time}</div>
          </div>
        ))}
      </div>
      <HomeIndicator/>
    </Phone>
  );
}

function SearchOverlayScreen() {
  return (
    <Phone>
      <StatusBar/>
      <div style={{ padding: '53px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="back" color={T.ink} size={22}/>
        <div style={{ flex: 1, height: 44, borderRadius: 12, background: T.surfaceAlt, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="search" color={T.muted} size={18}/>
          <div style={{ fontSize: 14, color: T.ink, fontWeight: 600 }}>bmw m3<span style={{ background: T.gold, marginLeft: 1, width: 2, height: 16, display: 'inline-block', verticalAlign: -3 }}/></div>
        </div>
      </div>
      <div style={{ padding: '6px 16px 0' }}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '12px 0 6px' }}>Suggestions</div>
        {[
          { icon:'search', text:'BMW M3 Competition', sub:'Skopje · 14 listings' },
          { icon:'search', text:'BMW M3 G80',         sub:'All Balkans · 22 listings' },
          { icon:'sparkles', text:'BMW M3 under €80,000', sub:'Smart suggestion · 8 listings' },
          { icon:'car',    text:'BMW M4',             sub:'Similar model · 19 listings' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${T.hairline}` }}>
            <Icon name={s.icon} color={s.icon === 'sparkles' ? T.gold : T.muted} size={18}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: T.ink, fontWeight: 600 }}>{s.text}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{s.sub}</div>
            </div>
            <Icon name="chevR" color={T.muted} size={14}/>
          </div>
        ))}
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '16px 0 6px' }}>Recent</div>
        {['Range Rover SVR','Tesla Model Y < €50k','Skopje 2023+'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${T.hairline}` }}>
            <Icon name="history" color={T.muted} size={18}/>
            <div style={{ flex: 1, fontSize: 14, color: T.body }}>{s}</div>
            <Icon name="close" color={T.muted} size={14}/>
          </div>
        ))}
      </div>
      <HomeIndicator/>
    </Phone>
  );
}

Object.assign(window, { HomeScreen, NotificationsScreen, SearchOverlayScreen, CategoryCard });
