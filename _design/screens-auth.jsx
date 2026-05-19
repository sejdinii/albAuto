// Authentication screens

function WelcomeScreen() {
  return (
    <Phone>
      <StatusBar/>
      {/* Hero background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 440,
        background: `linear-gradient(180deg, oklch(0.18 0.04 60) 0%, oklch(0.10 0.02 60) 100%)`,
      }}>
        {/* Car silhouette */}
        <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', bottom: -10, left: 0, right: 0, width: '100%' }}>
          <path d="M40 170 Q44 130 80 120 L150 100 Q200 86 250 92 L320 105 Q360 116 380 138 L395 150 Q400 165 392 175 L370 192 Q368 210 350 210 Q332 210 330 192 L130 192 Q128 210 110 210 Q92 210 90 192 L62 192 Q42 188 40 170 Z" fill="rgba(245,166,35,0.95)"/>
          <path d="M120 116 L170 100 Q200 92 240 96 L300 110 L322 140 L110 140 Z" fill="rgba(255,255,255,0.18)"/>
        </svg>
        <div style={{ position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center' }}>
          <Logo size={32} dark={true}/>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 380, left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '32px 32px 0 0', padding: '32px 24px 0' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -0.6, lineHeight: 1.15 }}>
          The Balkan car market,<br/>in your pocket.
        </div>
        <div style={{ fontSize: 13, color: T.body, marginTop: 10, lineHeight: 1.5 }}>
          Buy and sell across Macedonia, Albania and Kosovo, or import from anywhere in Europe.
        </div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div data-nav="signup"><Button variant="primary" size="lg">Continue with email</Button></div>
          <div data-nav="otp"><Button variant="outline" size="lg" icon="apple">Continue with Apple</Button></div>
          <div data-nav="otp"><Button variant="outline" size="lg" icon="google">Continue with Google</Button></div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: T.muted }}>
          Have an account? <span data-nav="login" style={{ color: T.ink, fontWeight: 700, textDecoration: 'underline', textDecorationThickness: 2, textDecorationColor: T.gold, textUnderlineOffset: 3, cursor: 'pointer' }}>Log in</span>
        </div>
      </div>
      <HomeIndicator dark={true}/>
    </Phone>
  );
}

function LoginScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Log in" leading="back" variant="white"/>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: T.ink, letterSpacing: -0.4, lineHeight: 1.15 }}>
          Welcome back
        </div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Sign in to continue browsing.</div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Email" value="andrej.m@example.com" icon="mail"/>
          <Field label="Password" value="••••••••••" icon="lock" rightLabel="Show"/>
          <div style={{ textAlign: 'right', marginTop: -2 }}>
            <span style={{ fontSize: 12, color: T.ink, fontWeight: 600 }}>Forgot password?</span>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div data-nav="home"><Button variant="primary" size="lg">Log in</Button></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.hairline }}/>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 1 }}>OR</div>
          <div style={{ flex: 1, height: 1, background: T.hairline }}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="outline" size="md" icon="apple">Continue with Apple</Button>
          <Button variant="outline" size="md" icon="google">Continue with Google</Button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 12, color: T.muted }}>
          New here? <span style={{ color: T.ink, fontWeight: 700 }}>Create an account</span>
        </div>
      </div>
      <HomeIndicator/>
    </Phone>
  );
}

function Field({ label, value, icon, placeholder, rightLabel, error, focused }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: T.body, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{
        height: 48, padding: '0 14px', borderRadius: 12,
        border: `1.5px solid ${focused ? T.ink : (error ? T.red : T.hairline)}`,
        background: '#fff', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {icon && <Icon name={icon} color={T.muted} size={18}/>}
        <div style={{ flex: 1, fontSize: 14, color: value ? T.ink : T.muted, fontWeight: value ? 500 : 400 }}>
          {value || placeholder}
        </div>
        {rightLabel && <div style={{ fontSize: 12, color: T.ink, fontWeight: 600 }}>{rightLabel}</div>}
      </div>
      {error && <div style={{ fontSize: 11, color: T.red, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function SignupScreen() {
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Create account" leading="back" variant="white"/>
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.4 }}>
          Let's set you up
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Step 1 of 3 — your details</div>
        <div style={{ height: 4, background: T.hairline, borderRadius: 99, marginTop: 12, overflow: 'hidden' }}>
          <div style={{ width: '33%', height: '100%', background: T.gold }}/>
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Full name" value="Andrej Mitrev" icon="menu"/>
          <Field label="Email" value="andrej.m@example.com" icon="mail"/>
          <Field label="Phone" value="+389 70 234 567" icon="phone"/>
          <Field label="Password" placeholder="Min 8 characters" icon="lock" focused/>
          <div style={{ marginTop: 4, padding: 10, background: T.goldTint, borderRadius: 10, display: 'flex', gap: 8 }}>
            <Icon name="shield" color={T.goldDark} size={16}/>
            <div style={{ fontSize: 11, color: T.body, lineHeight: 1.4 }}>
              We never share your number publicly. Buyers contact you through the in-app chat first.
            </div>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div data-nav="otp"><Button variant="primary" size="lg" iconRight="chevR">Continue</Button></div>
        </div>
      </div>
      <HomeIndicator/>
    </Phone>
  );
}

function OTPScreen() {
  const digits = ['7','3','4','2','',''];
  return (
    <Phone>
      <StatusBar/>
      <TopBar title="Verify number" leading="back" variant="white"/>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.4, lineHeight: 1.2 }}>
          Enter the 6-digit code we sent to your phone
        </div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 8 }}>
          Sent to <span style={{ color: T.ink, fontWeight: 600 }}>+389 70 234 567</span>. <span style={{ color: T.ink, fontWeight: 600 }}>Change</span>
        </div>
        <div style={{ marginTop: 28, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              width: 46, height: 56, borderRadius: 12,
              border: `2px solid ${i === 4 ? T.ink : T.hairline}`,
              background: d ? '#fff' : T.surfaceAlt,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 800, color: T.ink, fontFamily: T.mono,
              position: 'relative',
            }}>
              {d}
              {i === 4 && <div style={{ position: 'absolute', bottom: 12, width: 2, height: 26, background: T.gold, animation: 'blink 1s infinite' }}/>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: T.muted }}>
          Didn't get it? <span style={{ color: T.ink, fontWeight: 700 }}>Resend in 28s</span>
        </div>
        <div style={{ marginTop: 28 }}>
          <div data-nav="home"><Button variant="primary" size="lg">Verify</Button></div>
        </div>
        <div style={{ marginTop: 14, padding: 12, background: T.surfaceAlt, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chat" color={T.gold} size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>SMS auto-fill on</div>
            <div style={{ fontSize: 11, color: T.muted }}>We'll fill it in for you as soon as it arrives.</div>
          </div>
        </div>
      </div>
      <HomeIndicator/>
    </Phone>
  );
}

Object.assign(window, { WelcomeScreen, LoginScreen, SignupScreen, OTPScreen, Field });
