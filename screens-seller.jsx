// Seller flow: type → location → form → photos → summary → ad options → published

function SellTypeScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Place an ad" subtitle="Step 1 of 5 · Where" leading="close" variant="white"/>
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, letterSpacing: -0.3, lineHeight: 1.2 }}>
          Where should we<br/>place your ad?
        </div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Pick the marketplace your car belongs to. You can edit later.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 22 }}>
          <div data-nav="sell-form" style={{ cursor: 'pointer' }}><BigTypeCard title="Cars within Balkans" sub="For buyers in Macedonia, Albania, Kosovo" hue={30} primary={true} stat="2,872 active sellers" badge="MOST COMMON"/></div>
          <div data-nav="sell-form" style={{ cursor: 'pointer' }}><BigTypeCard title="Cars for Import" sub="Selling from abroad to Balkan buyers" hue={210} stat="610 active sellers" badge={null}/></div>
        </div>
        <div data-nav="social-connect" style={{ marginTop: 18, padding: 14, background: T.surfaceAlt, borderRadius: 14, display: 'flex', gap: 10, cursor: 'pointer' }}>
          <Icon name="sparkles" color={T.gold} size={18}/>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>Dealership?</div>
            <div style={{ fontSize: 11, color: T.body, marginTop: 2, lineHeight: 1.4 }}>Connect Instagram or Facebook and we'll auto-create listings from your posts.</div>
            <div style={{ fontSize: 12, color: T.ink, fontWeight: 700, marginTop: 6 }}>Set up dealer mode →</div>
          </div>
        </div>
      </div>
      <HomeIndicator/>
    </Phone>
  );
}

function BigTypeCard({ title, sub, hue, primary, stat, badge }) {
  return (
    <div style={{
      borderRadius: 18, padding: 16, position: 'relative', overflow: 'hidden',
      background: primary ? T.ink : '#fff',
      border: primary ? 'none' : `1px solid ${T.hairline}`,
      color: primary ? '#fff' : T.ink,
      minHeight: 120,
    }}>
      <svg viewBox="0 0 200 100" style={{ position: 'absolute', bottom: -8, right: -18, width: 160, opacity: primary ? 0.5 : 0.55 }}>
        <path d="M20 70 Q22 55 38 50 L70 42 Q90 36 110 38 L140 42 Q160 46 170 56 L185 60 Q190 62 188 70 L182 78 L168 78 Q166 86 158 86 Q150 86 148 78 L60 78 Q58 86 50 86 Q42 86 40 78 L28 78 Q18 76 20 70 Z" fill={primary ? T.gold : `oklch(0.62 0.05 ${hue})`} />
      </svg>
      <div style={{ position: 'relative' }}>
        {badge && <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 6, background: T.gold, color: T.ink, fontSize: 9, fontWeight: 800, letterSpacing: 0.5, marginBottom: 8 }}>{badge}</div>}
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>{title}</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4, maxWidth: '80%', lineHeight: 1.4 }}>{sub}</div>
        <div style={{ fontSize: 10, fontFamily: T.mono, opacity: 0.5, letterSpacing: 1, marginTop: 12, textTransform: 'uppercase' }}>{stat}</div>
      </div>
    </div>
  );
}

function CarDetailsFormScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Place an ad" subtitle="Step 3 of 5 · Details" leading="close" variant="white"/>
      <div style={{ padding: '6px 16px 0' }}>
        <div style={{ height: 4, background: T.hairline, borderRadius: 99, overflow: 'hidden' }}><div style={{ width: '60%', height: '100%', background: T.gold }}/></div>
        <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, marginTop: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Motors  ›  Cars  ›  Tirana, AL</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, marginTop: 8, letterSpacing: -0.4 }}>Tell us about your car</div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="City *" value="Tirana" icon="pin" rightLabel="Edit"/>
          <SelectField label="Make & Model *" value="BMW · M3"/>
          <SelectField label="Trim *" value="Competition"/>
          <SelectField label="Regional specs *" value="EU Specs"/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <SelectField label="Year *" value="2024"/>
            <Field label="Mileage (km) *" value="4,200"/>
          </div>
          <SelectField label="Body type" value="Sedan"/>
          <div style={{ marginTop: 4, padding: 12, background: T.goldTint, borderRadius: 12, display: 'flex', gap: 10 }}>
            <Icon name="sparkles" color={T.goldDark} size={18}/>
            <div style={{ flex: 1, fontSize: 12, color: T.body, lineHeight: 1.4 }}>
              <span style={{ fontWeight: 700, color: T.ink }}>Got an Instagram post?</span> Paste a link and we'll fill the form for you.
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 90 }}/>
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', padding: '12px 16px 30px', background: '#fff', borderTop: `1px solid ${T.hairline}` }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><Button variant="outline" size="md">Save draft</Button></div>
          <div data-nav="sell-photos" style={{ flex: 1.6 }}><Button variant="primary" size="md" iconRight="chevR">Next: photos</Button></div>
        </div>
      </div>
    </Phone>
  );
}

function SelectField({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: T.body, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ height: 48, padding: '0 14px', borderRadius: 12, border: `1.5px solid ${T.hairline}`, background: '#fff', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, fontSize: 14, color: T.ink, fontWeight: 500 }}>{value}</div>
        <Icon name="chevD" color={T.muted} size={16}/>
      </div>
    </div>
  );
}

function PhotosUploadScreen() {
  const slots = [
    { filled:true, hue:30, primary:true },
    { filled:true, hue:30 },
    { filled:true, hue:30 },
    { filled:true, hue:30 },
    { filled:false }, { filled:false }, { filled:false }, { filled:false },
  ];
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Photos & video" subtitle="Step 4 of 5" leading="close" variant="white"/>
      <div style={{ padding: '6px 16px 0' }}>
        <div style={{ height: 4, background: T.hairline, borderRadius: 99, overflow: 'hidden' }}><div style={{ width: '80%', height: '100%', background: T.gold }}/></div>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, marginTop: 14, letterSpacing: -0.3 }}>Add at least 4 photos</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Listings with 8+ photos get 3× more views.</div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {slots.map((s, i) => (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: 10,
              border: s.filled ? 'none' : `1.5px dashed ${T.hairline}`,
              background: s.filled ? '#000' : '#fff',
              overflow: 'hidden', position: 'relative',
            }}>
              {s.filled ? (
                <React.Fragment>
                  <CarPhoto hue={s.hue} height="100%" dark={true}/>
                  {s.primary && (
                    <div style={{ position: 'absolute', top: 4, left: 4, padding: '2px 6px', borderRadius: 4, background: T.gold, color: T.ink, fontSize: 9, fontWeight: 800 }}>COVER</div>
                  )}
                  <div style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 99, background: 'rgba(15,15,16,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="close" color="#fff" size={11} strokeWidth={2.4}/>
                  </div>
                </React.Fragment>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 4 }}>
                  <Icon name="plus" color={T.muted} size={18}/>
                  <div style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{i + 1}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, padding: 12, background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="play" color={T.gold} size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Add a 30s walkaround video</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Optional · 2× more chat responses</div>
          </div>
          <Icon name="chevR" color={T.muted} size={16}/>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, padding: 12, background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:8 }}>
            <Icon name="camera" color={T.ink} size={18}/>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Camera</div>
          </div>
          <div style={{ flex: 1, padding: 12, background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:8 }}>
            <Icon name="upload" color={T.ink} size={18}/>
            <div style={{ fontSize: 12, fontWeight: 700 }}>From library</div>
          </div>
          <div style={{ flex: 1, padding: 12, background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:8 }}>
            <Icon name="instagram" color={T.ink} size={18}/>
            <div style={{ fontSize: 12, fontWeight: 700 }}>IG</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', padding: '12px 16px 30px', background: '#fff', borderTop: `1px solid ${T.hairline}` }}>
        <div data-nav="sell-summary"><Button variant="primary" size="md" iconRight="chevR">Continue · 4 of 8</Button></div>
      </div>
    </Phone>
  );
}

function SummaryScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Summary" subtitle="Step 5 of 5 · Review" leading="close" variant="white"/>
      <div style={{ padding: '14px 16px 100px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.4 }}>You're almost there!</div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Check everything looks right before publishing.</div>
        {/* Preview card */}
        <div style={{ marginTop: 16, background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}`, overflow: 'hidden' }}>
          <CarPhoto hue={30} height={140}/>
          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>PREVIEW</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, marginTop: 4 }}>2024 BMW M3 Competition</div>
            <div style={{ fontSize: 12, color: T.body, marginTop: 2 }}>4,200 km · EU Specs · Tirana</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.ink, fontFamily: T.mono, marginTop: 8 }}>€ 121,300</div>
          </div>
        </div>
        {/* Summary list */}
        <div style={{ marginTop: 16, background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}`, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', background: T.surfaceAlt, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${T.hairline}` }}>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5, textTransform: 'uppercase' }}>Listing summary</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>Edit ›</div>
          </div>
          {[
            ['Make & Model','BMW · M3'],
            ['Trim','Competition'],
            ['Year','2024'],
            ['Kilometers','4,200 km'],
            ['Body type','Sedan'],
            ['Regional specs','EU Specs'],
            ['Price','€ 121,300'],
            ['Contact phone','+355 69 555 0123'],
            ['Photos','8 photos · 1 video'],
          ].map(([k,v], i, arr) => (
            <div key={k} style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ fontSize: 12, color: T.muted }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{v}</div>
            </div>
          ))}
        </div>
        {/* Description (added UX) */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, marginBottom: 8 }}>Description</div>
          <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${T.hairline}`, background: '#fff', fontSize: 12, color: T.body, lineHeight: 1.5 }}>
            Single owner, fully optioned. Carbon ceramic brakes, M Drive Pro, M carbon bucket seats. Service history available...
          </div>
          <div style={{ marginTop: 6, padding: 10, borderRadius: 10, background: T.goldTint, display:'flex', alignItems:'center', gap: 8 }}>
            <Icon name="sparkles" color={T.goldDark} size={14}/>
            <div style={{ fontSize: 11, color: T.body, flex: 1 }}>AI-suggested. Tap to edit.</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', padding: '12px 16px 30px', background: '#fff', borderTop: `1px solid ${T.hairline}` }}>
        <div data-nav="sell-options"><Button variant="primary" size="md" iconRight="chevR">Choose ad type</Button></div>
      </div>
    </Phone>
  );
}

function AdOptionsScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Choose an ad type" leading="close" variant="white"/>
      <div style={{ padding: '12px 16px 110px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, letterSpacing: -0.3 }}>How visible<br/>should it be?</div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>You can upgrade anytime from your seller dashboard.</div>
        {/* Standard */}
        <div style={{ marginTop: 18, padding: 16, borderRadius: 14, background: '#fff', border: `2px solid ${T.gold}`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, right: 14, width: 24, height: 24, borderRadius: 99, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" color={T.ink} size={14} strokeWidth={3}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>Standard</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.green }}>Free</div>
          </div>
          <div style={{ fontSize: 12, color: T.body, marginTop: 4 }}>Active for 60 days, included in search results.</div>
        </div>
        {/* Top */}
        <div style={{ marginTop: 12, padding: 16, borderRadius: 14, background: T.ink, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 10px', background: T.gold, color: T.ink, fontSize: 9, fontWeight: 800, letterSpacing: 0.5, borderRadius: '0 0 0 8px' }}>BEST CHOICE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Top Ad</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.gold, fontFamily: T.mono }}>€ 49 / 7 days</div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Maximum visibility, higher search rank, highlight badge.</div>
          {/* Mini preview */}
          <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.08)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 56, height: 42, borderRadius: 8, overflow: 'hidden' }}>
              <CarPhoto hue={30} height={42}/>
            </div>
            <div style={{ flex: 1 }}>
              <Badge color={T.gold} fg={T.ink} icon="bolt">Premium</Badge>
              <div style={{ fontSize: 11, color: '#fff', fontWeight: 700, marginTop: 4 }}>2024 BMW M3 Competition</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono }}>€ 121,300</div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Top of homescreen for 7 days','Highlighted in all search results','Up to 5× more views and chats','Detailed analytics for the campaign'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="check" color={T.gold} size={14} strokeWidth={2.6}/>
                <div style={{ fontSize: 12, color: '#fff' }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', padding: '12px 16px 30px', background: '#fff', borderTop: `1px solid ${T.hairline}` }}>
        <div data-nav="sell-pub"><Button variant="primary" size="md" iconRight="chevR">Publish ad</Button></div>
      </div>
    </Phone>
  );
}

function PublishedAdScreen() {
  return (
    <Phone>
      <StatusBar/>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 80, paddingBottom: 100, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Confetti-ish badge */}
          <div style={{ width: 88, height: 88, borderRadius: 99, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 10px 30px rgba(245,166,35,0.4)' }}>
            <Icon name="check" color={T.ink} size={42} strokeWidth={3}/>
            {[0,60,120,180,240,300].map((deg,i) => (
              <div key={i} style={{ position: 'absolute', width: 6, height: 6, borderRadius: 99, background: [T.gold, T.ink, T.green][i%3], top: '50%', left: '50%', transform: `rotate(${deg}deg) translateY(-70px)` }}/>
            ))}
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, marginTop: 22, letterSpacing: -0.5, textAlign: 'center', lineHeight: 1.15 }}>
            Your ad is live!
          </div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
            We've published it to the Albania marketplace. You'll get a notification when buyers reach out.
          </div>
          {/* Mini ad preview */}
          <div style={{ marginTop: 24, width: '100%', padding: 12, background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}`, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 10, overflow: 'hidden' }}><CarPhoto hue={30} height={60}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>BMW M3 Competition</div>
              <div style={{ fontSize: 11, color: T.muted }}>Live · ID #ALB-228714</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: T.mono, marginTop: 2 }}>€ 121,300</div>
            </div>
            <div style={{ padding: '4px 8px', borderRadius: 6, background: T.greenSoft, color: T.green, fontSize: 10, fontWeight: 800 }}>ACTIVE</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div data-nav="detail"><Button variant="primary" size="lg" icon="eye">View my listing</Button></div>
          <div data-nav="sell-options"><Button variant="outline" size="lg" icon="bolt">Boost for more views</Button></div>
        </div>
      </div>
      <HomeIndicator/>
    </Phone>
  );
}

Object.assign(window, {
  SellTypeScreen, CarDetailsFormScreen, PhotosUploadScreen, SummaryScreen,
  AdOptionsScreen, PublishedAdScreen, SelectField,
});
