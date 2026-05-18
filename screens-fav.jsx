// Favorites, Compare, Recently Viewed, Saved Searches

function FavoritesScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Saved" leading="none" trailing={<Icon name="filter" color={T.ink} size={20}/>} variant="white"/>
      <div style={{ padding: '8px 16px 0', display: 'flex', gap: 8 }}>
        {[['Cars',9,true],['Searches',3,false],['Compare',2,false]].map(([t,n,a]) => (
          <div key={t} style={{ padding: '8px 14px', borderRadius: 99, background: a ? T.ink : '#fff', border: a ? 'none' : `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: a ? '#fff' : T.body }}>{t}</div>
            <div style={{ fontSize: 11, fontFamily: T.mono, color: a ? T.gold : T.muted }}>{n}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform:'uppercase' }}>9 saved cars</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: T.ink, fontWeight: 600 }}>Sort: Recent <Icon name="chevD" size={11} color={T.ink}/></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CARS.slice(0,6).map(c => <div key={c.id} data-nav="detail" style={{ cursor: 'pointer' }}><CarCardMedium car={c}/></div>)}
        </div>
      </div>
      <div style={{ height: 100 }}/>
      <TabBar active="favorites"/>
      <HomeIndicator/>
    </Phone>
  );
}

function CompareScreen() {
  const cars = [CARS[0], CARS[1]];
  const specs = [
    ['Price',     ['AED 479,900', 'AED 489,000'], 0],
    ['Year',      ['2024',        '2023'        ], 0],
    ['Mileage',   ['4,200 km',    '18,800 km'   ], 0],
    ['HP',        ['510 HP',      '630 HP'      ], 1],
    ['0–100 km/h',['3.5 s',       '3.4 s'       ], 1],
    ['Body',      ['Sedan',       'Wagon'       ], null],
    ['Drive',     ['M xDrive',    'Quattro'     ], null],
    ['Warranty',  ['Yes',         'No'          ], 0],
  ];
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Compare" subtitle="2 of 4 selected" variant="white" trailing={<Icon name="plus" color={T.ink} size={20}/>}/>
      <div style={{ padding: '8px 16px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {cars.map(c => (
            <div key={c.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.hairline}` }}>
              <CarPhoto hue={c.hue} height={90}/>
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{c.year}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.ink, lineHeight: 1.2, marginTop: 2 }}>{c.make} {c.model}</div>
                <div style={{ fontSize: 10, color: T.body }}>{c.trim}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}`, overflow: 'hidden' }}>
          {specs.map(([label, vals, winner], i) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr', borderTop: i > 0 ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ padding: 10, fontSize: 11, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5, textTransform: 'uppercase', borderRight: `1px solid ${T.hairline}` }}>{label}</div>
              {vals.map((v, j) => (
                <div key={j} style={{ padding: 10, fontSize: 13, fontWeight: winner === j ? 800 : 600, color: T.ink, borderRight: j === 0 ? `1px solid ${T.hairline}` : 'none', background: winner === j ? T.goldTint : 'transparent', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {v}{winner === j && <Icon name="check" color={T.goldDark} size={12} strokeWidth={3}/>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: 14, background: T.goldTint, borderRadius: 14, display: 'flex', gap: 10 }}>
          <Icon name="sparkles" color={T.goldDark} size={18}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.ink }}>AI summary</div>
            <div style={{ fontSize: 11, color: T.body, marginTop: 4, lineHeight: 1.45 }}>The M3 is newer with lower mileage and includes warranty. The RS6 has 120 more HP and wagon practicality, but is 8 months older with 4× the mileage.</div>
          </div>
        </div>
      </div>
      <TabBar active="favorites"/>
      <HomeIndicator/>
    </Phone>
  );
}

function SavedSearchesScreen() {
  const items = [
    { title:'BMW M3', sub:'Skopje · €20k–130k · 2018+', count:14, freq:'Daily', new:3, hue:30 },
    { title:'Range Rover Sport', sub:'All Balkans · Petrol/Hybrid', count:7, freq:'Weekly', new:0, hue:150 },
    { title:'EV under €40,000', sub:'Europe import · 2022+', count:42, freq:'Daily', new:8, hue:200 },
  ];
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Saved searches" variant="white" trailing={<Icon name="plus" color={T.ink} size={20}/>}/>
      <div style={{ padding: '12px 16px 100px' }}>
        {items.map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${T.hairline}`, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden' }}>
              <CarPhoto hue={s.hue} height={56}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, letterSpacing: -0.2 }}>{s.title}</div>
                {s.new > 0 && <div style={{ padding: '2px 6px', borderRadius: 6, background: T.gold, color: T.ink, fontSize: 9, fontWeight: 800 }}>+{s.new} NEW</div>}
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.sub}</div>
              <div style={{ fontSize: 11, color: T.body, marginTop: 6, fontFamily: T.mono }}>{s.count} matches · alerts {s.freq}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: T.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bell" color={T.ink} size={14}/></div>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: T.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="trash" color={T.body} size={14}/></div>
            </div>
          </div>
        ))}
        <div style={{ padding: 16, borderRadius: 14, border: `1.5px dashed ${T.hairline}`, textAlign: 'center', marginTop: 4 }}>
          <Icon name="plus" color={T.muted} size={20}/>
          <div style={{ fontSize: 12, color: T.body, fontWeight: 600, marginTop: 4 }}>Create a new alert</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Get notified when matching cars are posted</div>
        </div>
      </div>
      <TabBar active="favorites"/>
      <HomeIndicator/>
    </Phone>
  );
}

Object.assign(window, { FavoritesScreen, CompareScreen, SavedSearchesScreen });
