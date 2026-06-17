import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import StockChart from '../components/StockChart'
import TradePanel from '../components/TradePanel'
import Portfolio from '../components/Portfolio'
import Prediction from '../components/Prediction'
import Sentiment from '../components/Sentiment'

const STOCKS = ['AAPL','GOOGL','MSFT','TSLA','AMZN','NVDA','META']

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
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

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={styles.app}>
      <div style={styles.nav}>
        <span style={styles.logo} onClick={() => navigate('/')}>📈 StockSense</span>
        <div style={styles.navRight}>
          <span style={styles.balance}>💰 ${balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
          <span style={styles.navUser}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.sidebar}>
          <p style={styles.sideLabel}>Markets</p>
          {STOCKS.map(s => (
            <div key={s} style={{...styles.stockItem, ...(selected === s ? styles.stockActive : {})}}
              onClick={() => setSelected(s)}>
              <span style={styles.stockSymbol}>{s}</span>
              {selected === s && quote && (
                <span style={{color: quote.change >= 0 ? '#3B6D11' : '#A32D2D', fontSize: 12}}>
                  {quote.change >= 0 ? '▲' : '▼'} {Math.abs(quote.change_pct)}%
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={styles.main}>
          {quote && (
            <div style={styles.quoteBar}>
              <div>
                <span style={styles.quoteSymbol}>{quote.symbol}</span>
                <span style={styles.quotePrice}>${quote.price}</span>
                <span style={{color: quote.change >= 0 ? '#3B6D11' : '#A32D2D', fontSize: 14, marginLeft: 8, fontWeight: 600}}>
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

          <div style={styles.tabs}>
            {['chart','predict','sentiment','trade','portfolio'].map(t => (
              <button key={t} style={{...styles.tab, ...(tab===t ? styles.tabActive : {})}}
                onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div style={styles.content}>
            {tab === 'chart' && <StockChart symbol={selected} />}
            {tab === 'predict' && <Prediction symbol={selected} />}
            {tab === 'sentiment' && <Sentiment symbol={selected} />}
            {tab === 'trade' && <TradePanel symbol={selected} quote={quote} onTrade={refreshBalance} />}
            {tab === 'portfolio' && <Portfolio onRefresh={refreshBalance} />}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  app: { minHeight: '100vh', background: '#F0F7FF', display: 'flex', flexDirection: 'column' },
  nav: { background: '#FFFFFF', borderBottom: '1px solid #D6E8FB', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 20, fontWeight: 700, color: '#185FA5', cursor: 'pointer' },
  navRight: { display: 'flex', alignItems: 'center', gap: 20 },
  balance: { background: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 8, padding: '6px 14px', fontSize: 14, color: '#185FA5', fontWeight: 600 },
  navUser: { color: '#5F5E5A', fontSize: 14 },
  logoutBtn: { background: 'transparent', border: '1px solid #D6E8FB', color: '#5F5E5A', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 },
  body: { display: 'flex', flex: 1 },
  sidebar: { width: 180, background: '#FFFFFF', borderRight: '1px solid #D6E8FB', padding: 16, flexShrink: 0 },
  sideLabel: { color: '#888780', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 },
  stockItem: { padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stockActive: { background: '#E6F1FB', border: '1px solid #85B7EB' },
  stockSymbol: { color: '#2C2C2A', fontSize: 14, fontWeight: 500 },
  main: { flex: 1, padding: 24, overflow: 'auto' },
  quoteBar: { background: '#FFFFFF', border: '1px solid #D6E8FB', borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  quoteSymbol: { fontSize: 18, fontWeight: 700, color: '#0C447C', marginRight: 12 },
  quotePrice: { fontSize: 22, fontWeight: 700, color: '#378ADD' },
  quoteMeta: { display: 'flex', gap: 20, color: '#5F5E5A', fontSize: 13 },
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: { padding: '8px 20px', borderRadius: 8, border: '1px solid #D6E8FB', background: '#fff', color: '#5F5E5A', cursor: 'pointer', fontSize: 14 },
  tabActive: { background: '#378ADD', border: '1px solid #378ADD', color: '#fff', fontWeight: 600 },
  content: { background: '#FFFFFF', border: '1px solid #D6E8FB', borderRadius: 12, padding: 24, minHeight: 400 }
}
