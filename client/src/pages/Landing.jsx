import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>📈 StockSense</span>
        <div style={s.navBtns}>
          <button style={s.ghostBtn} onClick={() => navigate('/login')}>Log in</button>
          <button style={s.solidBtn} onClick={() => navigate('/register')}>Sign up free</button>
        </div>
      </nav>

      <section style={s.hero}>
        <h1 style={s.heroTitle}>Real-time stock analytics,<br/>powered by AI</h1>
        <p style={s.heroSub}>
          Practice trading with a $100,000 virtual balance. Get 7-day ML price predictions
          and live news sentiment — zero risk, real market insights.
        </p>
        <div style={s.heroBtns}>
          <button style={s.solidBtnLg} onClick={() => navigate('/register')}>Get started — it's free</button>
          <button style={s.ghostBtnLg} onClick={() => navigate('/login')}>I have an account</button>
        </div>
      </section>

      <section style={s.features}>
        <div style={s.featureCard}>
          <div style={s.featureIcon}>📊</div>
          <h3 style={s.featureTitle}>Live market charts</h3>
          <p style={s.featureText}>Real-time price updates with candlestick charts across 5 time ranges.</p>
        </div>
        <div style={s.featureCard}>
          <div style={s.featureIcon}>🤖</div>
          <h3 style={s.featureTitle}>ML price predictions</h3>
          <p style={s.featureText}>7-day forecasts powered by Facebook Prophet, trained on historical data.</p>
        </div>
        <div style={s.featureCard}>
          <div style={s.featureIcon}>📰</div>
          <h3 style={s.featureTitle}>News sentiment</h3>
          <p style={s.featureText}>VADER NLP analyses live headlines to gauge market mood per stock.</p>
        </div>
        <div style={s.featureCard}>
          <div style={s.featureIcon}>💹</div>
          <h3 style={s.featureTitle}>Virtual trading</h3>
          <p style={s.featureText}>Buy and sell with $100,000 fake money. Learn without the risk.</p>
        </div>
      </section>

      <footer style={s.footer}>
        <p>Built by Anmol Dua · Not financial advice · For educational purposes</p>
      </footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#FFFFFF', fontFamily: 'Inter, sans-serif' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 32px', borderBottom: '1px solid #E8F1FC' },
  logo: { fontSize: 18, fontWeight: 700, color: '#185FA5' },
  navBtns: { display: 'flex', gap: 10 },
  ghostBtn: { fontSize: 14, padding: '9px 18px', borderRadius: 8, border: '1px solid #B5D4F4', color: '#185FA5', background: '#fff', cursor: 'pointer', fontWeight: 500 },
  solidBtn: { fontSize: 14, padding: '9px 18px', borderRadius: 8, border: 'none', color: '#fff', background: '#378ADD', cursor: 'pointer', fontWeight: 500 },
  hero: { textAlign: 'center', padding: '80px 24px 60px', maxWidth: 700, margin: '0 auto' },
  heroTitle: { fontSize: 38, fontWeight: 700, color: '#0C447C', lineHeight: 1.3, marginBottom: 16 },
  heroSub: { fontSize: 16, color: '#5F5E5A', lineHeight: 1.6, marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' },
  heroBtns: { display: 'flex', gap: 12, justifyContent: 'center' },
  solidBtnLg: { fontSize: 15, padding: '13px 26px', borderRadius: 10, border: 'none', color: '#fff', background: '#378ADD', cursor: 'pointer', fontWeight: 600 },
  ghostBtnLg: { fontSize: 15, padding: '13px 26px', borderRadius: 10, border: '1px solid #B5D4F4', color: '#185FA5', background: '#fff', cursor: 'pointer', fontWeight: 600 },
  features: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, padding: '0 32px 60px', maxWidth: 1100, margin: '0 auto' },
  featureCard: { background: '#F0F7FF', borderRadius: 14, padding: '24px 20px', textAlign: 'center' },
  featureIcon: { fontSize: 28, marginBottom: 10 },
  featureTitle: { fontSize: 15, fontWeight: 600, color: '#0C447C', marginBottom: 6 },
  featureText: { fontSize: 13, color: '#5F5E5A', lineHeight: 1.5 },
  footer: { textAlign: 'center', padding: '24px', color: '#888780', fontSize: 13, borderTop: '1px solid #E8F1FC' }
}
