// Profile/Menu, Financing calculator, Appointment booking, Recently viewed

function ProfileMenuScreen() {
  return (
    <Phone>
      <StatusBar/>
      {/* Yellow header w/ user card */}
      <div style={{ background: T.gold, paddingTop: 53, paddingBottom: 24 }}>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', minHeight: 44 }}>
          <Icon name="back" color={T.ink} size={22}/>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 800, color: T.ink }}>Account</div>
          <Icon name="cog" color={T.ink} size={20}/>
        </div>
        <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: T.ink, color: T.gold, fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            AM
            <div style={{ position: 'absolute', bottom: -4, right: -4 }}><Icon name="verified" color={T.gold} size={22}/></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.ink, letterSpacing: -0.3 }}>Andrej Mitrev</div>
            <div style={{ fontSize: 11, color: 'rgba(15,15,16,0.65)' }}>Member since Feb 2024 · Skopje</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, background: T.ink, color: T.gold, fontSize: 10, fontWeight: 800, marginTop: 6, letterSpacing: 0.4 }}>
              <Icon name="verified" color={T.gold} size={10}/>VERIFIED
            </div>
          </div>
        </div>
      </div>
      {/* Quick actions */}
      <div style={{ padding: '0 16px', marginTop: -14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div data-nav="dealer-dash" style={{ cursor: 'pointer' }}><QuickAction icon="doc"   title="My ads" sub="5 active · 2 sold" color={T.ink} dark/></div>
        <div data-nav="saved-searches" style={{ cursor: 'pointer' }}><QuickAction icon="bell"  title="My searches" sub="3 alerts · 11 new" color="#fff"/></div>
      </div>
      <div style={{ padding: '14px 16px 100px' }}>
        {/* Menu groups */}
        <Group title="Account">
          <MenuItem icon="menu" label="Profile" sub="Photo, bio, public info"/>
          <MenuItem icon="cog"  label="Settings"/>
          <MenuItem icon="bell" label="Notifications" detail="3"/>
          <MenuItem icon="shield" label="Security" sub="Password, 2-step verify"/>
        </Group>
        <Group title="Marketplace">
          <MenuItem icon="cal"   label="My appointments" nav="appointment"/>
          <MenuItem icon="scale" label="Compare cars" detail="2" nav="compare"/>
          <MenuItem icon="history" label="Recently viewed" nav="recent"/>
          <MenuItem icon="gauge"  label="Financing calculator" nav="financing"/>
        </Group>
        <Group title="Dealer tools">
          <MenuItem icon="building"  label="Switch to dealer mode" badge="NEW" nav="dealer-dash"/>
          <MenuItem icon="instagram" label="Connect Instagram" nav="social-connect"/>
          <MenuItem icon="analytics" label="Listing analytics" nav="dealer-dash"/>
        </Group>
        <Group title="Support">
          <MenuItem icon="questionmark" label="Help & FAQ"/>
          <MenuItem icon="doc"  label="Terms & privacy"/>
        </Group>
        {/* City selector */}
        <div style={{ marginTop: 14, padding: 14, background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="pin" color={T.gold} size={20}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5, textTransform: 'uppercase' }}>Browsing in</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 2 }}>All cities</div>
          </div>
          <Icon name="chevR" color={T.muted} size={16}/>
        </div>
      </div>
      <TabBar active="menu"/>
      <HomeIndicator/>
    </Phone>
  );
}

function QuickAction({ icon, title, sub, color, dark }) {
  return (
    <div style={{ padding: 14, borderRadius: 14, background: color, color: dark ? '#fff' : T.ink, border: dark ? 'none' : `1px solid ${T.hairline}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: dark ? T.gold : T.goldTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} color={dark ? T.ink : T.goldDark} size={18} strokeWidth={2}/>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, marginTop: 10, letterSpacing: -0.2 }}>{title}</div>
      <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, padding: '0 4px' }}>{title}</div>
      <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}`, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function MenuItem({ icon, label, sub, detail, badge, nav }) {
  return (
    <div data-nav={nav} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderBottom: `1px solid ${T.hairline}`, cursor: nav ? 'pointer' : 'default' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: T.goldTint, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Icon name={icon} color={T.goldDark} size={16}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{label}</div>
          {badge && <div style={{ padding: '2px 6px', borderRadius: 4, background: T.gold, color: T.ink, fontSize: 9, fontWeight: 800 }}>{badge}</div>}
        </div>
        {sub && <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      {detail && <div style={{ fontSize: 11, color: T.ink, fontWeight: 700, fontFamily: T.mono, marginRight: 8, background: T.surfaceAlt, padding: '2px 6px', borderRadius: 6 }}>{detail}</div>}
      <Icon name="chevR" color={T.muted} size={14}/>
    </div>
  );
}

function FinancingScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Financing" subtitle="Estimate your monthly payment" variant="white"/>
      <div style={{ padding: '14px 16px 100px' }}>
        {/* Car summary */}
        <div style={{ padding: 12, background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 60, height: 50, borderRadius: 10, overflow: 'hidden' }}><CarPhoto hue={30} height={50}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>BMW M3 Competition</div>
            <div style={{ fontSize: 11, color: T.muted }}>2024 · 4,200 km</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: T.mono, marginTop: 4 }}>€ 121,300</div>
          </div>
        </div>

        {/* Big number */}
        <div style={{ marginTop: 16, padding: 18, background: T.ink, color: '#fff', borderRadius: 18 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono, letterSpacing: 1, textTransform: 'uppercase' }}>Estimated monthly</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: T.gold, fontFamily: T.mono, letterSpacing: -1.5, lineHeight: 1.1, marginTop: 4 }}>€ 1,847</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>60 months · 6.4% APR · €24,260 down</div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[['Principal','€97,040'],['Interest','€13,580'],['Total','€110,620']].map(([k,v]) => (
              <div key={k}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono, letterSpacing: 0.5 }}>{k.toUpperCase()}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: T.mono, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Slider label="Down payment" value="€ 24,260" caption="20% of car price">
            <div style={{ position: 'relative', height: 8 }}>
              <div style={{ position: 'absolute', inset: 0, background: T.hairline, borderRadius: 99 }}/>
              <div style={{ position: 'absolute', left: 0, width: '20%', height: '100%', background: T.gold, borderRadius: 99 }}/>
              <div style={{ position: 'absolute', left: 'calc(20% - 10px)', top: -6, width: 20, height: 20, borderRadius: 99, background: '#fff', border: `2px solid ${T.gold}`, boxShadow: T.shadow.elev }}/>
            </div>
          </Slider>
          <Slider label="Loan term" value="60 months" caption="5 years">
            <div style={{ position: 'relative', height: 8 }}>
              <div style={{ position: 'absolute', inset: 0, background: T.hairline, borderRadius: 99 }}/>
              <div style={{ position: 'absolute', left: 0, width: '60%', height: '100%', background: T.gold, borderRadius: 99 }}/>
              <div style={{ position: 'absolute', left: 'calc(60% - 10px)', top: -6, width: 20, height: 20, borderRadius: 99, background: '#fff', border: `2px solid ${T.gold}`, boxShadow: T.shadow.elev }}/>
            </div>
          </Slider>
          <Slider label="Interest rate" value="6.4% APR" caption="Tap to apply for pre-approval">
            <div style={{ position: 'relative', height: 8 }}>
              <div style={{ position: 'absolute', inset: 0, background: T.hairline, borderRadius: 99 }}/>
              <div style={{ position: 'absolute', left: 0, width: '32%', height: '100%', background: T.gold, borderRadius: 99 }}/>
              <div style={{ position: 'absolute', left: 'calc(32% - 10px)', top: -6, width: 20, height: 20, borderRadius: 99, background: '#fff', border: `2px solid ${T.gold}`, boxShadow: T.shadow.elev }}/>
            </div>
          </Slider>
        </div>
        <div style={{ marginTop: 18 }}>
          <Button variant="primary" size="md" iconRight="chevR">Get pre-approved · 60s</Button>
        </div>
        <div style={{ fontSize: 10, color: T.muted, marginTop: 10, textAlign: 'center', lineHeight: 1.5 }}>
          Estimates only. Actual rates from partner banks: NLB, ProCredit, OTP.
        </div>
      </div>
      <HomeIndicator/>
    </Phone>
  );
}

function Slider({ label, value, caption, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.mono }}>{value}</div>
      </div>
      <div style={{ paddingTop: 8 }}>{children}</div>
      {caption && <div style={{ fontSize: 11, color: T.muted, marginTop: 8 }}>{caption}</div>}
    </div>
  );
}

function AppointmentScreen() {
  const days = [
    { d:'Mon', n:12, slots:0 },
    { d:'Tue', n:13, slots:3 },
    { d:'Wed', n:14, slots:5, sel:true },
    { d:'Thu', n:15, slots:2 },
    { d:'Fri', n:16, slots:4 },
    { d:'Sat', n:17, slots:6 },
    { d:'Sun', n:18, slots:1 },
  ];
  const times = [
    { t:'09:30', avail:true },
    { t:'10:00', avail:false },
    { t:'10:30', avail:true },
    { t:'11:00', avail:true, sel:true },
    { t:'11:30', avail:false },
    { t:'14:00', avail:true },
    { t:'14:30', avail:true },
    { t:'15:00', avail:false },
  ];
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Book a viewing" subtitle="BMW M3 Competition" variant="white"/>
      <div style={{ padding: '14px 16px 110px' }}>
        {/* Listing */}
        <div style={{ padding: 12, background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: 10, overflow: 'hidden' }}><CarPhoto hue={30} height={50}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>BMW M3 Competition</div>
            <div style={{ fontSize: 11, color: T.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="pin" size={11} color={T.muted}/> AutoBalkan Skopje
            </div>
          </div>
          <Icon name="verified" color={T.gold} size={18}/>
        </div>

        {/* Calendar */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>May 2026</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="back" color={T.ink} size={14}/></div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="chevR" color={T.ink} size={14}/></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {days.map((d, i) => (
              <div key={i} style={{
                padding: '8px 0', borderRadius: 10, textAlign: 'center',
                background: d.sel ? T.ink : '#fff',
                border: d.sel ? 'none' : `1px solid ${T.hairline}`,
                opacity: d.slots === 0 ? 0.4 : 1,
              }}>
                <div style={{ fontSize: 9, color: d.sel ? 'rgba(255,255,255,0.6)' : T.muted, fontFamily: T.mono, fontWeight: 700, letterSpacing: 0.5 }}>{d.d.toUpperCase()}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: d.sel ? T.gold : T.ink, fontFamily: T.mono, marginTop: 2 }}>{d.n}</div>
                <div style={{ fontSize: 8, color: d.sel ? 'rgba(255,255,255,0.5)' : T.muted, fontFamily: T.mono, marginTop: 1 }}>{d.slots > 0 ? `${d.slots} free` : '—'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Times */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, marginBottom: 10 }}>Wed, May 14</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
            {times.map((t, i) => (
              <div key={i} style={{
                padding: '10px 0', borderRadius: 8, textAlign: 'center',
                background: t.sel ? T.gold : '#fff',
                border: t.sel ? 'none' : `1px solid ${T.hairline}`,
                color: t.avail ? (t.sel ? T.ink : T.ink) : T.muted,
                fontSize: 12, fontWeight: t.sel ? 800 : 600,
                textDecoration: t.avail ? 'none' : 'line-through',
                fontFamily: T.mono,
                opacity: t.avail ? 1 : 0.5,
              }}>{t.t}</div>
            ))}
          </div>
        </div>

        {/* Type */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, marginBottom: 8 }}>Type of viewing</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: 12, borderRadius: 12, background: T.ink, color: '#fff' }}>
              <Icon name="car" color={T.gold} size={20}/>
              <div style={{ fontSize: 13, fontWeight: 800, marginTop: 6 }}>Test drive</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>30–45 min</div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: '#fff', border: `1px solid ${T.hairline}` }}>
              <Icon name="eye" color={T.body} size={20}/>
              <div style={{ fontSize: 13, fontWeight: 800, marginTop: 6 }}>Inspection only</div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>15–20 min</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', padding: '12px 16px 30px', background: '#fff', borderTop: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5 }}>WED · 11:00</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>Test drive · 30 min</div>
        </div>
        <div style={{ flex: 1 }}><Button variant="primary" size="md">Confirm</Button></div>
      </div>
    </Phone>
  );
}

function RecentlyViewedScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Recently viewed" trailing={<span style={{ fontSize: 12, color: T.ink, fontWeight: 700 }}>Clear</span>} variant="white"/>
      <div style={{ padding: '12px 16px 100px' }}>
        {[
          { label:'Today',     cars:[CARS[0], CARS[3]] },
          { label:'Yesterday', cars:[CARS[1], CARS[2], CARS[5]] },
          { label:'This week', cars:[CARS[4], CARS[6], CARS[7]] },
        ].map((grp, gi) => (
          <div key={grp.label} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{grp.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grp.cars.map((c, i) => (
                <div key={c.id} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden' }}><CarPhoto hue={c.hue} height={56}/></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>{c.make} {c.model}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{c.year} · {c.km}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, fontFamily: T.mono, marginTop: 3 }}>{c.priceEur}</div>
                  </div>
                  {gi === 0 && i === 0 && <div style={{ padding: '3px 6px', borderRadius: 4, background: T.green, color: '#fff', fontSize: 9, fontWeight: 800 }}>↓ €2,600</div>}
                  <Icon name="heart" color={T.muted} size={18}/>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <TabBar active="menu"/>
      <HomeIndicator/>
    </Phone>
  );
}

Object.assign(window, {
  ProfileMenuScreen, FinancingScreen, AppointmentScreen, RecentlyViewedScreen,
  QuickAction, Group, MenuItem, Slider,
});
