// Browse flow: country → city → make → model → listings → detail
// Also: continent (import flow)

function SelectListScreen({ title, subtitle, allLabel, items, selectedIdx = 0, showSearch = true, hideCheck = false, nextRoute, allRoute }) {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title={title} subtitle={subtitle} variant="white" trailing={showSearch ? <Icon name="search" color={T.ink} size={20}/> : null}/>
      <div style={{ padding: '8px 0 100px' }}>
        {allLabel && (
          <div data-nav={allRoute || nextRoute} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${T.hairline}`, background: selectedIdx === -1 ? T.goldTint : 'transparent', cursor: 'pointer' }}>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: T.ink }}>{allLabel}</div>
            {selectedIdx === -1 && !hideCheck && <div style={{ width: 26, height: 26, borderRadius: 99, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" color={T.ink} size={16} strokeWidth={2.6}/></div>}
          </div>
        )}
        {items.map((it, i) => {
          const isObj = typeof it === 'object';
          const name = isObj ? it.name : it;
          const count = isObj ? it.count : null;
          const flag = isObj ? it.flag : null;
          const isSel = i === selectedIdx;
          return (
            <div key={i} data-nav={nextRoute} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${T.hairline}`, background: isSel ? T.goldTint : 'transparent', cursor: 'pointer' }}>
              {flag && <div style={{ fontSize: 22, marginRight: 12 }}>{flag}</div>}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, color: T.ink, fontWeight: isSel ? 700 : 500 }}>{name}</div>
                {count != null && <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, marginTop: 1 }}>{count.toLocaleString()} listings</div>}
              </div>
              {isSel && !hideCheck && <div style={{ width: 26, height: 26, borderRadius: 99, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" color={T.ink} size={16} strokeWidth={2.6}/></div>}
            </div>
          );
        })}
      </div>
      <TabBar active="home"/>
      <HomeIndicator/>
    </Phone>
  );
}

function BalkanCountriesScreen() {
  return <SelectListScreen
    title="Cars within Balkans"
    subtitle="Step 1 of 5 · Pick a country"
    allLabel="All in Balkan Countries"
    items={BALKAN_COUNTRIES}
    selectedIdx={-1}
    nextRoute="balkan-cities"
  />;
}

function BalkanCitiesScreen() {
  return <SelectListScreen
    title="Cities in North Macedonia"
    subtitle="Step 2 of 5 · Pick a city"
    allLabel="All cities"
    items={MK_CITIES.map(c => ({ name:c, count: Math.floor(Math.random()*400 + 30) }))}
    selectedIdx={0}
    nextRoute="makes"
  />;
}

function MakesScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Select make" subtitle="Step 3 of 5" variant="white" trailing={<Icon name="search" color={T.ink} size={20}/>}/>
      {/* Popular brands */}
      <div style={{ padding: '12px 16px 8px' }}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Popular</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {['BMW','Audi','MB','VW','Toyota','Porsche','Tesla','Ford'].map((b, i) => (
            <div key={b} data-nav="models" style={{ aspectRatio:'1', borderRadius: 12, background: i === 0 ? T.ink : '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: i === 0 ? T.gold : T.ink, letterSpacing: -0.2, cursor: 'pointer' }}>{b}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: '8px 0' }}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '12px 20px 4px' }}>A–Z · All makes</div>
        {[
          ['A','Abarth','Acura','AITO','Al Damani','Alfa Romeo','Aston Martin','Audi','Aurus'],
        ].map((grp) => (
          <div key={grp[0]}>
            <div style={{ padding: '6px 20px', fontSize: 11, fontWeight: 800, color: T.muted, fontFamily: T.mono, background: T.surfaceAlt }}>{grp[0]}</div>
            {grp.slice(1).map((n) => (
              <div key={n} data-nav="models" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${T.hairline}`, cursor: 'pointer' }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: T.surfaceAlt, marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{n.charAt(0)}</div>
                <div style={{ flex: 1, fontSize: 14, color: T.ink, fontWeight: 500 }}>{n}</div>
                <Icon name="chevR" color={T.muted} size={14}/>
              </div>
            ))}
          </div>
        ))}
      </div>
      <TabBar active="home"/>
      <HomeIndicator/>
    </Phone>
  );
}

function ModelsScreen() {
  return <SelectListScreen
    title="Select model"
    subtitle="BMW · Step 4 of 5"
    allLabel="All BMW models"
    items={BMW_MODELS.slice(0, 13).map(m => ({ name:m, count: Math.floor(Math.random()*40 + 2) }))}
    selectedIdx={16-9}
    nextRoute="listings"
  />;
}

function ListingsScreen() {
  return (
    <Phone>
      <StatusBar/>
      {/* Header w/ search chip */}
      <div style={{ padding: '53px 16px 0', background: '#fff', borderBottom: `1px solid ${T.hairline}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12 }}>
          <Icon name="back" color={T.ink} size={22}/>
          <div style={{ flex: 1, height: 40, borderRadius: 12, background: T.surfaceAlt, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="search" color={T.muted} size={16}/>
            <div style={{ fontSize: 13, color: T.ink, fontWeight: 600 }}>BMW M3</div>
            <div style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: T.muted }}>Skopje, MK</div>
          </div>
        </div>
        {/* filter bar */}
        <div style={{ display: 'flex', gap: 6, overflow: 'hidden', paddingBottom: 12 }}>
          <div data-nav="filters" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 10px', borderRadius: 99, background: T.ink, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <Icon name="filter" color="#fff" size={13}/>Filters
            <div style={{ width: 16, height: 16, borderRadius: 99, background: T.gold, color: T.ink, fontSize: 9, fontWeight: 800, display:'flex', alignItems:'center', justifyContent:'center', marginLeft: 2 }}>3</div>
          </div>
          {['Trim','Price','Year','Specs'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 12px', borderRadius: 99, background: '#fff', border: `1px solid ${T.hairline}`, fontSize: 12, fontWeight: 600, color: T.body }}>
              {f} <Icon name="chevD" color={T.muted} size={11}/>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: T.muted, fontFamily: T.mono }}>14 RESULTS · BMW M3</div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: T.ink }}><Icon name="sort" size={13}/>Sort</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: T.ink }}><Icon name="star" size={13}/>Save</div>
        </div>
      </div>
      <div style={{ padding: '12px 16px 90px' }}>
        <div data-nav="detail" style={{ cursor: 'pointer' }}><CarCardListing car={CARS[0]} premium={true}/></div>
        <div data-nav="detail" style={{ cursor: 'pointer' }}><CarCardListing car={CARS[3]}/></div>
      </div>
      <TabBar active="home"/>
      <HomeIndicator/>
    </Phone>
  );
}

function FiltersSheet() {
  return (
    <Phone>
      <StatusBar/>
      {/* Dimmed underlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,16,0.3)' }}/>
      {/* Sheet */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '24px 24px 0 0', padding: 20, maxHeight: '85%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 99, margin: '0 auto 14px' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.ink }}>Filters</div>
          <div style={{ fontSize: 13, color: T.body, fontWeight: 600 }}>Reset</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FilterRow label="Price range" value="€20k – €130k">
            <div style={{ height: 60, position: 'relative' }}>
              <svg viewBox="0 0 280 40" style={{ width: '100%', height: 50 }}>
                {Array.from({ length: 28 }).map((_, i) => {
                  const h = [4,8,10,18,22,28,34,30,28,22,18,12,10,8,7,8,10,12,14,10,8,6,5,4,3,3,2,2][i];
                  const sel = i > 4 && i < 22;
                  return <rect key={i} x={i*10+2} y={40-h} width={6} height={h} rx={1} fill={sel ? T.gold : T.hairline}/>;
                })}
              </svg>
              <div style={{ height: 4, background: T.gold, position: 'absolute', left: '20%', right: '22%', top: 50, borderRadius: 99 }}/>
              <div style={{ position: 'absolute', left: 'calc(20% - 10px)', top: 44, width: 18, height: 18, borderRadius: 99, background: '#fff', border: `2px solid ${T.gold}`, boxShadow: T.shadow.elev }}/>
              <div style={{ position: 'absolute', right: 'calc(22% - 10px)', top: 44, width: 18, height: 18, borderRadius: 99, background: '#fff', border: `2px solid ${T.gold}`, boxShadow: T.shadow.elev }}/>
            </div>
          </FilterRow>
          <FilterRow label="Year" value="2018 – 2026">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[2018,2019,2020,2021,2022,2023,2024,2025,2026].map((y, i) => (
                <div key={y} style={{ padding: '7px 12px', borderRadius: 99, background: i>=3 ? T.gold : T.surfaceAlt, color: T.ink, fontSize: 12, fontWeight: i>=3 ? 700 : 600 }}>{y}</div>
              ))}
            </div>
          </FilterRow>
          <FilterRow label="Body type" value="3 selected">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[['Sedan',true],['SUV',true],['Wagon',true],['Coupé',false],['Pickup',false],['Hatch',false]].map(([n,sel]) => (
                <div key={n} style={{ padding: '12px 8px', borderRadius: 10, background: sel ? T.ink : '#fff', border: sel ? 'none' : `1px solid ${T.hairline}`, color: sel ? '#fff' : T.body, fontSize: 12, fontWeight: 700, textAlign:'center' }}>{n}</div>
              ))}
            </div>
          </FilterRow>
          <FilterRow label="Fuel" value="Petrol, Hybrid">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[['Petrol',true],['Diesel',false],['Hybrid',true],['Electric',false],['LPG',false]].map(([n,sel]) => (
                <div key={n} style={{ padding: '7px 12px', borderRadius: 99, background: sel ? T.gold : T.surfaceAlt, color: T.ink, fontSize: 12, fontWeight: sel ? 700 : 600 }}>{n}</div>
              ))}
            </div>
          </FilterRow>
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><Button variant="outline" size="md">Save search</Button></div>
          <div style={{ flex: 1.4 }}><Button variant="primary" size="md">Show 142 cars</Button></div>
        </div>
      </div>
      <HomeIndicator/>
    </Phone>
  );
}

function FilterRow({ label, value, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>{label}</div>
        <div style={{ fontSize: 12, color: T.body, fontFamily: T.mono }}>{value}</div>
      </div>
      {children}
    </div>
  );
}

function CarDetailScreen() {
  const car = CARS[0];
  return (
    <Phone>
      <StatusBar dark={true}/>
      {/* Gallery */}
      <div style={{ position: 'relative', height: 340 }}>
        <CarPhoto hue={car.hue} height={340} dark={true} count="2 / 11"/>
        {/* overlay icons */}
        <div style={{ position: 'absolute', top: 53, left: 16, width: 38, height: 38, borderRadius: 99, background: 'rgba(15,15,16,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="back" color="#fff" size={20} strokeWidth={2.2}/>
        </div>
        <div style={{ position: 'absolute', top: 53, right: 16, display: 'flex', gap: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: 'rgba(15,15,16,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="share" color="#fff" size={18}/></div>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: 'rgba(15,15,16,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="heart" color="#fff" size={18} fill={false}/></div>
        </div>
        <div style={{ position: 'absolute', top: 110, left: 16 }}>
          <Badge color="#0F0F10" fg={T.gold} icon="bolt">Premium</Badge>
        </div>
      </div>
      {/* Sheet content */}
      <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', marginTop: -22, position: 'relative', padding: 20, paddingBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, letterSpacing: 1, textTransform: 'uppercase' }}>BMW · M3 · COMPETITION</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, marginTop: 4, letterSpacing: -0.4 }}>2024 · 4,200 km</div>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 14, background: T.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: T.mono, letterSpacing: 1 }}>PRICE</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.gold, fontFamily: T.mono, letterSpacing: -0.4 }}>AED 479,900</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: T.mono }}>≈ € 121,300 EUR</div>
          </div>
          <div style={{ padding: '4px 10px', borderRadius: 99, background: T.greenSoft, color: T.green, fontSize: 10, fontWeight: 800, letterSpacing: 0.4 }}>↓ 10K SINCE MON</div>
        </div>
        {/* trust row */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          <Badge color={T.greenSoft} fg={T.green} icon="check">Warranty</Badge>
          <Badge color={T.greenSoft} fg={T.green} icon="check">Service contract</Badge>
          <Badge color={T.blueSoft} fg={T.blue} icon="badge">Inspected</Badge>
          <Badge color={T.surfaceAlt} fg={T.body}>GCC Specs</Badge>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="pin" color={T.muted} size={14}/>
          <div style={{ fontSize: 12, color: T.body }}>Skopje · North Macedonia</div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: T.muted }}>Posted 3 days ago</div>
        </div>

        {/* Overview */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, marginBottom: 10 }}>Overview</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: T.hairline, borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.hairline}` }}>
            {[
              ['Trim','Competition'],
              ['Horsepower','510 HP'],
              ['Interior','Black Merino'],
              ['Exterior','Brooklyn Grey'],
              ['Body','Sedan'],
              ['Transmission','8-spd Auto'],
              ['Fuel','Petrol'],
              ['Drive','M xDrive'],
            ].map(([k,v]) => (
              <div key={k} style={{ background: '#fff', padding: 10 }}>
                <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5, textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Seller card */}
        <div style={{ marginTop: 16, padding: 12, background: T.surfaceAlt, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: T.ink, color: T.gold, fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            AM
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16 }}><Icon name="verified" color={T.gold} size={16}/></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>AutoBalkan Skopje</div>
            <div style={{ fontSize: 11, color: T.muted }}>Verified dealer · 4.9 ★ (218)</div>
          </div>
          <div style={{ fontSize: 12, color: T.ink, fontWeight: 700 }}>View →</div>
        </div>
      </div>
      {/* Sticky CTA */}
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', background: '#fff', borderTop: `1px solid ${T.hairline}`, padding: '12px 16px 34px', display: 'flex', gap: 10, boxShadow: T.shadow.sticky }}>
        <button style={{ flex: 1, height: 50, borderRadius: 14, background: T.gold, border: 'none', fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name="phone" color={T.ink} size={16} strokeWidth={2.2}/> Call
        </button>
        <button style={{ flex: 1, height: 50, borderRadius: 14, background: T.green, border: 'none', fontFamily: T.font, fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name="whatsapp" color="#fff" size={16}/> WhatsApp
        </button>
        <button data-nav="chat-detail" style={{ width: 50, height: 50, borderRadius: 14, background: T.ink, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="chat" color={T.gold} size={20} strokeWidth={2.2}/>
        </button>
      </div>
    </Phone>
  );
}

function ContinentScreen() {
  return <SelectListScreen
    title="Cars for Import"
    subtitle="Step 1 of 6 · Pick a continent"
    allLabel="All continents"
    items={CONTINENTS}
    selectedIdx={-1}
    showSearch={false}
    nextRoute="eu-countries"
  />;
}

function EUCountriesScreen() {
  return <SelectListScreen
    title="Cars within Europe"
    subtitle="Step 2 of 6 · Pick a country"
    allLabel="All in Europe"
    items={EU_COUNTRIES.slice(0,9).map(n => ({ name:n, count: Math.floor(Math.random()*900 + 100) }))}
    selectedIdx={5}
    nextRoute="makes"
  />;
}

Object.assign(window, {
  SelectListScreen, BalkanCountriesScreen, BalkanCitiesScreen,
  MakesScreen, ModelsScreen, ListingsScreen, FiltersSheet,
  CarDetailScreen, ContinentScreen, EUCountriesScreen,
});
