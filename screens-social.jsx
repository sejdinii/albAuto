// Social auto-import (key differentiator) + Dealer dashboard

function SocialConnectScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Auto-import" leading="back" variant="white" trailing={<Icon name="questionmark" color={T.ink} size={20}/>}/>
      <div style={{ padding: '14px 20px 0' }}>
        {/* Hero */}
        <div style={{ padding: 16, borderRadius: 18, background: T.ink, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 99, background: T.instagram, opacity: 0.7, filter: 'blur(40px)' }}/>
          <div style={{ position: 'relative' }}>
            <Badge color={T.gold} fg={T.ink} icon="sparkles">DEALER</Badge>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 12, letterSpacing: -0.4, lineHeight: 1.15 }}>
              Connect once.<br/>Inventory flows in.
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8, lineHeight: 1.45 }}>
              We turn your Instagram and Facebook posts into ready-to-publish listings — photos, price, model, the works.
            </div>
          </div>
        </div>
        {/* Provider list */}
        <div style={{ marginTop: 20, fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Connect an account</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div data-nav="perms" style={{ cursor: 'pointer' }}><ProviderCard kind="instagram" handle="@autobalkan.skopje" status="connected" posts={84}/></div>
          <div data-nav="perms" style={{ cursor: 'pointer' }}><ProviderCard kind="facebook" handle="AutoBalkan Skopje" status="reconnect" posts={42}/></div>
          <div style={{ padding: 14, borderRadius: 14, border: `1.5px dashed ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="plus" color={T.muted} size={18}/>
            <div style={{ flex: 1, fontSize: 13, color: T.body, fontWeight: 600 }}>Add another business account</div>
          </div>
        </div>
        {/* How it works */}
        <div style={{ marginTop: 20, fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>How it works</div>
        {[
          { n:1, t:'You post a car on Instagram', s:'Carousel, reel, or single photo with caption.' },
          { n:2, t:'AI reads photo + caption', s:'Detects make, model, year, mileage, price.' },
          { n:3, t:'Listing appears for review', s:'You approve or edit before it goes live.' },
        ].map(s => (
          <div key={s.n} style={{ marginTop: 10, padding: 12, background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: 99, background: T.goldTint, color: T.goldDark, fontFamily: T.mono, fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{s.t}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.s}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 30 }}/>
      <HomeIndicator/>
    </Phone>
  );
}

function ProviderCard({ kind, handle, status, posts }) {
  const isIG = kind === 'instagram';
  const connected = status === 'connected';
  const reconnect = status === 'reconnect';
  return (
    <div style={{ padding: 14, borderRadius: 14, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: isIG ? T.instagram : T.facebook, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={kind} color="#fff" size={22} strokeWidth={2}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{handle}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          {connected && <React.Fragment><div style={{ width: 6, height: 6, borderRadius: 99, background: T.green }}/><div style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>Synced</div></React.Fragment>}
          {reconnect && <React.Fragment><div style={{ width: 6, height: 6, borderRadius: 99, background: T.red }}/><div style={{ fontSize: 11, color: T.red, fontWeight: 700 }}>Re-auth needed</div></React.Fragment>}
          <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>· {posts} posts</div>
        </div>
      </div>
      <div style={{ padding: '7px 12px', borderRadius: 99, background: reconnect ? T.gold : (connected ? T.surfaceAlt : T.ink), color: connected ? T.ink : (reconnect ? T.ink : '#fff'), fontSize: 12, fontWeight: 700 }}>
        {connected ? 'Manage' : reconnect ? 'Reconnect' : 'Connect'}
      </div>
    </div>
  );
}

function PermissionsScreen() {
  return (
    <Phone>
      <StatusBar/>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Top with brand-ish */}
        <div style={{ padding: '53px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Icon name="close" color={T.ink} size={22}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: T.instagram, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="instagram" color="#fff" size={18}/>
              </div>
              <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>↔</div>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="car" color={T.ink} size={18} strokeWidth={2.2}/>
              </div>
            </div>
            <div style={{ width: 22 }}/>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, marginTop: 24, letterSpacing: -0.4, lineHeight: 1.2 }}>
            AlbAuto wants to access your Instagram business account
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 8, lineHeight: 1.5 }}>
            We'll only read public car posts. You can disconnect anytime in Settings.
          </div>
        </div>
        <div style={{ padding: '20px 20px 0', flex: 1 }}>
          {[
            { i:'eye',   t:'Read your media',     s:'Photos, reels, captions — to build listings.' },
            { i:'sync',  t:'Receive sync updates', s:'Auto-mark sold when you delete the post.' },
            { i:'lock',  t:'No DMs or followers',  s:'We never read messages or your audience data.' },
          ].map((p, i, arr) => (
            <div key={p.i} style={{ padding: '14px 0', display: 'flex', alignItems: 'flex-start', gap: 14, borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={p.i} color={T.ink} size={18}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{p.t}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 3, lineHeight: 1.4 }}>{p.s}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 20px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div data-nav="importing"><Button variant="primary" size="lg">Continue as @autobalkan.skopje</Button></div>
          <Button variant="ghost" size="md">Use a different account</Button>
        </div>
      </div>
    </Phone>
  );
}

function ImportingScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Importing posts" subtitle="Hang tight, this takes a sec" leading="close" variant="white"/>
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{ padding: 16, borderRadius: 14, background: T.ink, color: '#fff', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: T.mono, letterSpacing: 0.5, textTransform: 'uppercase' }}>Progress</div>
            <div style={{ fontSize: 11, color: T.gold, fontFamily: T.mono, fontWeight: 700 }}>34 / 84</div>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', background: `linear-gradient(90deg, ${T.gold}, #FFD56A)`, borderRadius: 99 }}/>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 10, fontFamily: T.mono }}>
            <span style={{ color: T.gold }}>●</span> Analyzing photo of 2023 Audi RS6 Avant…
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Activity</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { t:'Parsed caption — found "BMW M3 Competition"', s:'2s ago', state:'ok' },
            { t:'Extracted price "120 000 €" from photo', s:'4s ago', state:'ok' },
            { t:'Detected mileage from EXIF + image OCR', s:'6s ago', state:'ok' },
            { t:'Skipped — post has no car detected', s:'12s ago', state:'skip' },
            { t:'Connected Instagram @autobalkan.skopje', s:'1m ago', state:'sync' },
          ].map((a, i) => (
            <div key={i} style={{ padding: 12, background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name={a.state==='ok'?'check':a.state==='skip'?'close':'sync'} color={a.state==='ok'?T.green:a.state==='skip'?T.muted:T.gold} size={16} strokeWidth={2.4}/>
              <div style={{ flex: 1, fontSize: 12, color: T.body }}>{a.t}</div>
              <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{a.s}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: T.goldTint, display: 'flex', gap: 10, alignItems: 'center' }}>
          <Icon name="sparkles" color={T.goldDark} size={18}/>
          <div style={{ flex: 1, fontSize: 12, color: T.body }}>
            <span style={{ fontWeight: 700, color: T.ink }}>You can leave this screen.</span> We'll keep syncing in the background.
          </div>
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', padding: '12px 16px 30px' }}>
        <div data-nav="imported"><Button variant="ghost" size="md">Run in background</Button></div>
      </div>
    </Phone>
  );
}

function ImportedInventoryScreen() {
  const items = [
    { make:'Audi RS6 Avant',  status:'ready',   sub:'Looks great · €123,600', hue:240, conf:96, src:'IG' },
    { make:'BMW M3 Comp.',    status:'ready',   sub:'Looks great · €121,300', hue:30,  conf:94, src:'IG' },
    { make:'Mercedes G 63',   status:'review',  sub:'Missing price', hue:340, conf:71, src:'FB' },
    { make:'VW Golf R',       status:'review',  sub:'Mileage uncertain', hue:280, conf:65, src:'IG' },
    { make:'Range Rover SVR', status:'duplicate',sub:'Already published as #ALB-2014', hue:150, conf:99, src:'IG' },
    { make:'Tesla Model Y',   status:'ready',   sub:'Looks great · €50,000', hue:0,   conf:92, src:'IG' },
  ];
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Imported inventory" subtitle="6 of 84 ready · 2 need review" variant="white" trailing={<Icon name="sync" color={T.ink} size={20}/>}/>
      <div style={{ padding: '8px 16px 0', display: 'flex', gap: 8, overflow: 'hidden' }}>
        {[['All',6,true],['Ready',3,false],['Needs review',2,false],['Skipped',1,false]].map(([t,n,a]) => (
          <div key={t} style={{ padding: '7px 11px', borderRadius: 99, background: a ? T.ink : '#fff', border: a ? 'none' : `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: a ? '#fff' : T.body }}>{t}</div>
            <div style={{ fontSize: 10, fontFamily: T.mono, color: a ? T.gold : T.muted }}>{n}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 16px 100px' }}>
        {items.map((it, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, padding: 10, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              <CarPhoto hue={it.hue} height={60}/>
              <div style={{ position: 'absolute', bottom: 2, left: 2, padding: '1px 4px', borderRadius: 3, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 8, fontWeight: 700, fontFamily: T.mono }}>{it.src}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, lineHeight: 1.2 }}>{it.make}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{it.sub}</div>
              <div style={{ display: 'flex', gap: 5, marginTop: 6, alignItems: 'center' }}>
                {it.status === 'ready' && <Badge color={T.greenSoft} fg={T.green} size="sm">Ready</Badge>}
                {it.status === 'review' && <Badge color={T.redSoft} fg={T.red} size="sm">Needs review</Badge>}
                {it.status === 'duplicate' && <Badge color={T.surfaceAlt} fg={T.body} size="sm">Duplicate</Badge>}
                <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>AI {it.conf}%</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {it.status === 'ready' && <button style={{ padding: '6px 10px', borderRadius: 8, background: T.gold, border: 'none', fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.ink }}>Publish</button>}
              {it.status === 'review' && <button data-nav="ai-review" style={{ padding: '6px 10px', borderRadius: 8, background: T.ink, color: '#fff', border: 'none', fontFamily: T.font, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Review</button>}
              {it.status === 'duplicate' && <button style={{ padding: '6px 10px', borderRadius: 8, background: '#fff', border: `1px solid ${T.hairline}`, fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.body }}>Merge</button>}
              <Icon name="dots" color={T.muted} size={16}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', padding: '12px 16px 30px', background: '#fff', borderTop: `1px solid ${T.hairline}` }}>
        <div data-nav="dealer-dash"><Button variant="primary" size="md" icon="bolt">Publish all ready · 3</Button></div>
      </div>
    </Phone>
  );
}

function AIReviewScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Review listing" subtitle="3 of 6 to review" variant="white" trailing={<Icon name="close" color={T.ink} size={20}/>}/>
      <div style={{ padding: '12px 16px 100px' }}>
        {/* Source post */}
        <div style={{ display: 'flex', gap: 10, padding: 10, background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, marginBottom: 14 }}>
          <div style={{ width: 70, height: 70, borderRadius: 10, overflow: 'hidden' }}>
            <CarPhoto hue={280} height={70} dark={true}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="instagram" color={T.ink} size={12}/>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.ink }}>@autobalkan.skopje</div>
              <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>· 2d ago</div>
            </div>
            <div style={{ fontSize: 12, color: T.body, marginTop: 4, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              "Golf R 2024, full pack, daddy car. Garage kept 🔥 DM for price #vw #golfr"
            </div>
          </div>
        </div>
        {/* Fields with AI annotations */}
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Auto-filled · review and edit</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AIField label="Make & Model" value="VW · Golf R" conf={98}/>
          <AIField label="Year"          value="2024" conf={91}/>
          <AIField label="Trim"          value="Performance Pack" conf={84}/>
          <AIField label="Price"         value="" error="Couldn't read price from caption" suggest="€ 38,000 — based on 12 similar listings"/>
          <AIField label="Mileage (km)"  value="8,600" conf={62} warning="Low confidence — please verify"/>
          <AIField label="City"          value="Skopje, MK" conf={99}/>
        </div>
        <div style={{ marginTop: 14, padding: 12, background: T.goldTint, borderRadius: 12, display: 'flex', gap: 10 }}>
          <Icon name="sparkles" color={T.goldDark} size={18}/>
          <div style={{ flex: 1, fontSize: 12, color: T.body, lineHeight: 1.45 }}>
            <span style={{ fontWeight: 700, color: T.ink }}>AI-suggested description.</span> Tap to use or rewrite from your caption.
          </div>
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', padding: '12px 16px 30px', background: '#fff', borderTop: `1px solid ${T.hairline}`, display: 'flex', gap: 10 }}>
        <div data-nav="imported" style={{ flex: 1 }}><Button variant="outline" size="md">Skip</Button></div>
        <div data-nav="imported" style={{ flex: 1.6 }}><Button variant="primary" size="md" iconRight="chevR">Approve & next</Button></div>
      </div>
    </Phone>
  );
}

function AIField({ label, value, conf, error, warning, suggest }) {
  const hasIssue = error || warning;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <div style={{ fontSize: 11, color: T.body, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</div>
        {conf && <div style={{ fontSize: 10, color: conf > 80 ? T.green : T.gold, fontFamily: T.mono, fontWeight: 700 }}>AI {conf}%</div>}
      </div>
      <div style={{
        height: 44, padding: '0 12px', borderRadius: 10,
        border: `1.5px solid ${error ? T.red : warning ? T.gold : T.hairline}`,
        background: '#fff', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {!value && <Icon name="sparkles" color={T.gold} size={14}/>}
        <div style={{ flex: 1, fontSize: 14, color: value ? T.ink : T.muted, fontWeight: 600 }}>{value || 'Not detected'}</div>
        {hasIssue && <Icon name="questionmark" color={error ? T.red : T.gold} size={16}/>}
      </div>
      {error && <div style={{ fontSize: 10, color: T.red, marginTop: 4, fontWeight: 600 }}>{error}</div>}
      {suggest && <div style={{ marginTop: 4, padding: '6px 10px', borderRadius: 6, background: T.surfaceAlt, fontSize: 11, color: T.body, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="sparkles" color={T.goldDark} size={11}/>{suggest} <span style={{ marginLeft: 'auto', color: T.ink, fontWeight: 700 }}>Use</span></div>}
      {warning && <div style={{ fontSize: 10, color: T.goldDark, marginTop: 4, fontWeight: 600 }}>{warning}</div>}
    </div>
  );
}

function DealerDashboardScreen() {
  return (
    <Phone>
      <StatusBar/>
      <div style={{ padding: '53px 16px 0', background: '#fff', borderBottom: `1px solid ${T.hairline}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: T.ink, color: T.gold, fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>AB</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: T.ink }}>AutoBalkan Skopje</div>
              <Icon name="verified" color={T.gold} size={14}/>
            </div>
            <div style={{ fontSize: 11, color: T.muted }}>Dealer dashboard · Pro plan</div>
          </div>
          <Icon name="cog" color={T.body} size={20}/>
        </div>
      </div>
      <div style={{ padding: '14px 16px 100px' }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <StatCard label="Active listings" value="42" delta="+4" color={T.ink}/>
          <StatCard label="Views this week" value="12,840" delta="+18%" color={T.gold}/>
          <StatCard label="New chats" value="86" delta="+22" color={T.green}/>
          <StatCard label="Avg. response" value="14m" delta="-3m" color={T.blue}/>
        </div>

        {/* Sync card */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: T.ink, color: '#fff', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="sync" color={T.gold} size={16}/>
              <div style={{ fontSize: 13, fontWeight: 800 }}>Social sync</div>
            </div>
            <div style={{ fontSize: 11, color: T.gold, fontFamily: T.mono }}>● LIVE</div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Last synced 4 minutes ago · 2 awaiting review</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono }}>INSTAGRAM</div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 2 }}>@autobalkan.skopje</div>
            </div>
            <div style={{ flex: 1, padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono }}>FACEBOOK</div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 2 }}>AutoBalkan</div>
            </div>
          </div>
        </div>

        {/* Performance chart */}
        <div style={{ marginTop: 14, padding: 14, background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>Views · last 14 days</div>
            <div style={{ fontSize: 11, color: T.muted }}>Per listing avg</div>
          </div>
          <svg viewBox="0 0 320 100" style={{ width: '100%', height: 90, marginTop: 10 }}>
            <path d="M0 80 L20 70 L40 65 L60 50 L80 60 L100 40 L120 45 L140 30 L160 35 L180 25 L200 20 L220 30 L240 15 L260 22 L280 10 L300 18 L320 12"
              fill="none" stroke={T.gold} strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M0 80 L20 70 L40 65 L60 50 L80 60 L100 40 L120 45 L140 30 L160 35 L180 25 L200 20 L220 30 L240 15 L260 22 L280 10 L300 18 L320 12 L320 100 L0 100 Z"
              fill="url(#g)" opacity="0.25"/>
            <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={T.gold}/><stop offset="1" stopColor={T.gold} stopOpacity="0"/></linearGradient></defs>
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.muted, fontFamily: T.mono, marginTop: 4 }}>
            <div>Apr 25</div><div>May 2</div><div>May 9</div>
          </div>
        </div>

        {/* Top listings */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, marginBottom: 8 }}>Top listings this week</div>
          {CARS.slice(0,3).map((c, i) => (
            <div key={c.id} style={{ padding: 10, background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.muted, fontFamily: T.mono, width: 14 }}>{i+1}</div>
              <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden' }}><CarPhoto hue={c.hue} height={48}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{c.make} {c.model}</div>
                <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, marginTop: 1 }}>{[1248,892,640][i]} views · {[18,12,9][i]} chats</div>
              </div>
              <div style={{ fontSize: 11, fontFamily: T.mono, color: T.green, fontWeight: 700 }}>+{[42,28,12][i]}%</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="menu"/>
      <HomeIndicator/>
    </Phone>
  );
}

function StatCard({ label, value, delta, color }) {
  const positive = delta && (delta.startsWith('+') || (delta.startsWith('-') && label === 'Avg. response'));
  return (
    <div style={{ padding: 12, background: '#fff', borderRadius: 12, border: `1px solid ${T.hairline}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.mono, letterSpacing: -0.5, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: positive ? T.green : T.red, fontWeight: 700, fontFamily: T.mono, marginTop: 2 }}>{delta}</div>
      <div style={{ position: 'absolute', bottom: -4, right: -4, width: 32, height: 32, borderRadius: 99, background: color, opacity: 0.06 }}/>
    </div>
  );
}

Object.assign(window, {
  SocialConnectScreen, ProviderCard, PermissionsScreen, ImportingScreen,
  ImportedInventoryScreen, AIReviewScreen, AIField,
  DealerDashboardScreen, StatCard,
});
