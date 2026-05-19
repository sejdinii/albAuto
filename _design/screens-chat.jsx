// Chat list + Chat conversation with offers

function ChatListScreen() {
  return (
    <Phone>
      <StatusBar/>
      {/* Yellow header */}
      <div style={{ background: T.gold, paddingTop: 53, paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', minHeight: 44 }}>
          <div style={{ flex: 1, fontSize: 20, fontWeight: 800, color: T.ink, letterSpacing: -0.3 }}>Chats</div>
          <Icon name="search" color={T.ink} size={20}/>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', padding: '8px 16px 0' }}>
          {[['All',true],['Buying',false],['Selling',false],['Unread',false,2]].map(([n,a,b], i) => (
            <div key={n} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 4, borderBottom: a ? `3px solid ${T.ink}` : '3px solid transparent', fontSize: 13, fontWeight: a ? 800 : 600, color: T.ink, opacity: a ? 1 : 0.6 }}>
              {n}
              {b && <div style={{ width: 16, height: 16, borderRadius: 99, background: T.ink, color: T.gold, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{b}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Safety reminder */}
      <div style={{ margin: 16, padding: 10, borderRadius: 10, background: T.surfaceAlt, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Icon name="shield" color={T.goldDark} size={16}/>
        <div style={{ fontSize: 11, color: T.body, flex: 1, lineHeight: 1.4 }}>Always chat through AlbAuto — never share bank details or move payments off-platform.</div>
      </div>
      {/* Unread group */}
      <div style={{ padding: '0 16px 6px' }}>
        <div style={{ background: T.gold, color: T.ink, fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: '4px 10px', borderRadius: 6, display: 'inline-block' }}>2 NEW MESSAGES</div>
      </div>
      <div>
        {CHATS.map((c, i) => <div key={i} data-nav="chat-detail" style={{ cursor: 'pointer' }}><ChatRow chat={c}/></div>)}
      </div>
      <div style={{ height: 100 }}/>
      <TabBar active="chats"/>
      <HomeIndicator/>
    </Phone>
  );
}

function ChatRow({ chat }) {
  const vColor = chat.verified === 'gold' ? T.gold : chat.verified === 'blue' ? T.blue : chat.verified === 'green' ? T.green : null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${T.hairline}`, gap: 12 }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ width: 48, height: 48, borderRadius: 99, background: `oklch(0.6 0.08 ${chat.hue})`, color: '#fff', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{chat.init}</div>
        {vColor && <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18 }}><Icon name="verified" color={vColor} size={18}/></div>}
        {chat.unread && <div style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 99, background: T.green, border: '2px solid #fff' }}/>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 14, fontWeight: chat.unread ? 800 : 600, color: chat.unread ? T.goldDark : T.ink }}>{chat.name}</div>
          <div style={{ fontSize: 11, color: chat.unread ? T.ink : T.muted, fontFamily: T.mono, fontWeight: chat.unread ? 700 : 500 }}>{chat.date}</div>
        </div>
        <div style={{ fontSize: 12, color: chat.unread ? T.ink : T.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: chat.unread ? 500 : 400 }}>{chat.preview}</div>
      </div>
    </div>
  );
}

function ChatDetailScreen() {
  return (
    <Phone>
      <StatusBar/>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${T.hairline}`, paddingTop: 53 }}>
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="back" color={T.ink} size={22}/>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: `oklch(0.6 0.08 30)`, color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            AM
            <div style={{ position: 'absolute', bottom: -1, right: -1, width: 14, height: 14 }}><Icon name="verified" color={T.gold} size={14}/></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>Andrej M.</div>
              <Icon name="verified" color={T.gold} size={13}/>
            </div>
            <div style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>● Online · usually replies in 10m</div>
          </div>
          <Icon name="phone" color={T.ink} size={20}/>
          <div style={{ width: 8 }}/>
          <Icon name="dots" color={T.ink} size={20}/>
        </div>
        {/* Pinned listing */}
        <div style={{ padding: 8, margin: '4px 12px 10px', background: T.surfaceAlt, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden' }}><CarPhoto hue={30} height={44}/></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>2024 BMW M3 Competition</div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>€ 121,300 · Skopje</div>
          </div>
          <Icon name="chevR" color={T.muted} size={14}/>
        </div>
      </div>
      {/* Messages */}
      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <DateChip text="Today"/>
        <Bubble side="them">Hey, is the M3 still available?</Bubble>
        <Bubble side="them">Saw it on your Instagram too.</Bubble>
        <Bubble side="me">Yes! Still here. When would you like to see it?</Bubble>
        <Bubble side="me" type="image" hue={30}/>
        <Bubble side="them">Looks great. Would you take 115k?</Bubble>
        {/* Offer card */}
        <div style={{ alignSelf: 'flex-start', maxWidth: '88%', padding: 12, background: '#fff', border: `1px solid ${T.hairline}`, borderRadius: '4px 18px 18px 18px' }}>
          <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>● Offer · valid 24h</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.mono, marginTop: 4 }}>€ 115,000</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>5% below your asking price</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button style={{ flex: 1, padding: '7px 0', background: T.gold, border: 'none', borderRadius: 8, fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.ink }}>Accept</button>
            <button style={{ flex: 1, padding: '7px 0', background: '#fff', border: `1.5px solid ${T.ink}`, borderRadius: 8, fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.ink }}>Counter</button>
            <button style={{ flex: 0.5, padding: '7px 0', background: 'transparent', border: 'none', fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.body }}>Pass</button>
          </div>
        </div>
        <Bubble side="me">I can do 118k. Test drive tomorrow at 11?</Bubble>
        <Bubble side="them" typing/>
      </div>
      {/* Composer */}
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, marginTop: 'auto', padding: '8px 8px 30px', background: '#fff', borderTop: `1px solid ${T.hairline}` }}>
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="plus" color={T.ink} size={20} strokeWidth={2.2}/>
          <div style={{ flex: 1, height: 38, borderRadius: 99, background: T.surfaceAlt, padding: '0 12px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, fontSize: 13, color: T.muted }}>Message…</div>
            <Icon name="attach" color={T.muted} size={16}/>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" color={T.ink} size={16} strokeWidth={2.4}/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '0 12px' }}>
          {['Make an offer','Schedule visit','Send VIN','Verified','Location'].map(q => (
            <div key={q} style={{ padding: '4px 10px', borderRadius: 99, background: T.surfaceAlt, fontSize: 11, color: T.body, fontWeight: 600, flexShrink: 0 }}>{q}</div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function DateChip({ text }) {
  return (
    <div style={{ alignSelf: 'center', padding: '3px 10px', borderRadius: 99, background: T.surfaceAlt, fontSize: 10, color: T.muted, fontFamily: T.mono, fontWeight: 700, letterSpacing: 0.5 }}>{text}</div>
  );
}

function Bubble({ side, children, type, hue, typing }) {
  const me = side === 'me';
  const base = {
    maxWidth: '78%', padding: '8px 12px',
    fontSize: 13, lineHeight: 1.4,
    alignSelf: me ? 'flex-end' : 'flex-start',
    background: me ? T.ink : '#fff',
    color: me ? '#fff' : T.ink,
    border: me ? 'none' : `1px solid ${T.hairline}`,
    borderRadius: me ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
  };
  if (type === 'image') {
    return (
      <div style={{ ...base, padding: 4, borderRadius: 14, overflow: 'hidden', width: 200 }}>
        <CarPhoto hue={hue} height={130} radius={10}/>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: T.mono, padding: '4px 4px 0' }}>14:28 · ✓✓ read</div>
      </div>
    );
  }
  if (typing) {
    return (
      <div style={{ ...base, padding: '12px 14px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 99, background: T.muted, opacity: 0.6 }}/>)}
        </div>
      </div>
    );
  }
  return (
    <div style={base}>
      {children}
      <div style={{ fontSize: 10, color: me ? 'rgba(255,255,255,0.4)' : T.muted, fontFamily: T.mono, marginTop: 4, textAlign: me ? 'right' : 'left' }}>{me ? '14:28 · ✓✓' : '14:26'}</div>
    </div>
  );
}

Object.assign(window, { ChatListScreen, ChatDetailScreen, ChatRow, DateChip, Bubble });
