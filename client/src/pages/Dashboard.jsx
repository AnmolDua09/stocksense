import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import StockChart from '../components/StockChart'
import TradePanel from '../components/TradePanel'
import Portfolio from '../components/Portfolio'
import Prediction from '../components/Prediction'

const STOCKS = ['AAPL','GOOGL','MSFT','TSLA','AMZN','NVDA','META']

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const [selected, setSelected] = useState('AAPL')
  const [quote, setQuote] = useState(null)
  const [balance, setBalance] = useState(user?.virtualBalance || 100000)
  const [tab, setTab] = useState('chart')

  useEffect(() => {
    fetchQuote(selected)
    const interval = setInterval(() => fetchQuote(selected), 10000)
    return () => clearInterval(interval)
  }, [selected])

  const fetchQuote = async (symbol) => {
    try {
      const { data } = await api.get(`/stocks/quote/${symbol}`)
      setQuote(data)
    } catch {}
  }

  const refreshBalance = async () => {
    try {
      const { data } = await api.get('/portfolio')
      setBalance(data.virtualBalance)
    } catch {}
  }

  return (
    <div style={styles.app}>
      {/* Navbar */}
      <div style={styles.nav}>
        <span style={styles.logo}>📈 StockSense</span>
        <div style={styles.navRight}>
          <span style={styles.balance}>💰 ${balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
          <span style={styles.navUser}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <p style={styles.sideLabel}>Markets</p>
          {STOCKS.map(s => (
            <div key={s} style={{...styles.stockItem, ...(selected === s ? styles.stockActive : {})}}
              onClick={() => setSelected(s)}>
              <span style={styles.stockSymbol}>{s}</span>
              {selected === s && quote && (
                <span style={{color: quote.change >= 0 ? '#22c55e' : '#ef4444', fontSize: 12}}>
                  {quote.change >= 0 ? '▲' : '▼'} {Math.abs(quote.change_pct)}%
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={styles.main}>
          {/* Quote bar */}
          {quote && (
            <div style={styles.quoteBar}>
              <div>
                <span style={styles.quoteSymbol}>{quote.symbol}</span>
                <span style={styles.quotePrice}>${quote.price}</span>
                <span style={{color: quote.change >= 0 ? '#22c55e' : '#ef4444', fontSize: 14, marginLeft: 8}}>
                  {quote.change >= 0 ? '+' : ''}{quote.change} ({quote.change_pct}%)
                </span>
              </div>
              <div style={styles.quoteMeta}>
                <span>O: ${quote.open}</span>
                <span>H: ${quote.high}</span>
                <span>L: ${quote.low}</span>
                <span>PC: ${quote.prev_close}</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={styles.tabs}>
            {['chart','predict','trade','portfolio'].map(t => (
              <button key={t} style={{...styles.tab, ...(tab===t ? styles.tabActive : {})}}
                onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={styles.content}>
            {tab === 'chart' && <StockChart symbol={selected} />}
            {tab === 'predict' && <Prediction symbol={selected} />}
            {tab === 'trade' && <TradePanel symbol={selected} quote={quote} onTrade={refreshBalance} />}
            {tab === 'portfolio' && <Portfolio onRefresh={refreshBalance} />}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  app: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' },
  nav: { background: '#13131f', borderBottom: '1px solid #1e1e3a', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 20, fontWeight: 700, color: '#6366f1' },
  navRight: { display: 'flex', alignItems: 'center', gap: 20 },
  balance: { background: '#1a1a3a', border: '1px solid #2d2d5a', borderRadius: 8, padding: '6px 14px', fontSize: 14, color: '#a5b4fc', fontWeight: 600 },
  navUser: { color: '#94a3b8', fontSize: 14 },
  logoutBtn: { background: 'transparent', border: '1px solid #1e1e3a', color: '#64748b', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 },
  body: { display: 'flex', flex: 1 },
  sidebar: { width: 180, background: '#0d0d1a', borderRight: '1px solid #1e1e3a', padding: 16, flexShrink: 0 },
  sideLabel: { color: '#475569', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 },
  stockItem: { padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stockActive: { background: '#1a1a3a', border: '1px solid #3730a3' },
  stockSymbol: { color: '#e2e8f0', fontSize: 14, fontWeight: 500 },
  main: { flex: 1, padding: 24, overflow: 'auto' },
  quoteBar: { background: '#13131f', border: '1px solid #1e1e3a', borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  quoteSymbol: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginRight: 12 },
  quotePrice: { fontSize: 22, fontWeight: 700, color: '#6366f1' },
  quoteMeta: { display: 'flex', gap: 20, color: '#64748b', fontSize: 13 },
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: { padding: '8px 20px', borderRadius: 8, border: '1px solid #1e1e3a', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: 14 },
  tabActive: { background: '#1a1a3a', border: '1px solid #3730a3', color: '#a5b4fc', fontWeight: 600 },
  content: { background: '#13131f', border: '1px solid #1e1e3a', borderRadius: 12, padding: 24, minHeight: 400 }
}
