import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Portfolio() {
  const [data, setData] = useState(null)
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const [port, hist] = await Promise.all([api.get('/portfolio'), api.get('/trades/history')])
        setData(port.data)
        setTrades(hist.data)
      } catch {}
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <div style={{ color: '#888780', textAlign: 'center', padding: 60 }}>Loading portfolio...</div>
  if (!data) return null

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#F0F7FF', border: '1px solid #D6E8FB', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 6 }}>Virtual Balance</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#378ADD' }}>
            ${data.virtualBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ background: '#F0F7FF', border: '1px solid #D6E8FB', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 6 }}>Holdings</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#0C447C' }}>{data.holdings.length} stocks</p>
        </div>
        <div style={{ background: '#F0F7FF', border: '1px solid #D6E8FB', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 6 }}>Total Trades</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#0C447C' }}>{trades.length}</p>
        </div>
      </div>

      {data.holdings.length > 0 && (
        <>
          <h3 style={{ color: '#5F5E5A', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Holdings</h3>
          <div style={{ background: '#FFFFFF', border: '1px solid #D6E8FB', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #D6E8FB', background: '#F0F7FF' }}>
                  {['Symbol','Quantity','Avg Price','Total Value'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: '#5F5E5A', fontSize: 12, fontWeight: 600, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.holdings.map(h => (
                  <tr key={h.symbol} style={{ borderBottom: '1px solid #E8F1FC' }}>
                    <td style={{ padding: '12px 16px', color: '#378ADD', fontWeight: 600 }}>{h.symbol}</td>
                    <td style={{ padding: '12px 16px', color: '#2C2C2A' }}>{h.quantity}</td>
                    <td style={{ padding: '12px 16px', color: '#2C2C2A' }}>${h.avgPrice.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', color: '#2C2C2A' }}>${(h.avgPrice * h.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {trades.length > 0 && (
        <>
          <h3 style={{ color: '#5F5E5A', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Trades</h3>
          <div style={{ background: '#FFFFFF', border: '1px solid #D6E8FB', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #D6E8FB', background: '#F0F7FF' }}>
                  {['Symbol','Type','Qty','Price','Total','Date'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: '#5F5E5A', fontSize: 12, fontWeight: 600, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trades.map(t => (
                  <tr key={t._id} style={{ borderBottom: '1px solid #E8F1FC' }}>
                    <td style={{ padding: '12px 16px', color: '#378ADD', fontWeight: 600 }}>{t.symbol}</td>
                    <td style={{ padding: '12px 16px', color: t.type === 'buy' ? '#3B6D11' : '#A32D2D', fontWeight: 600, textTransform: 'uppercase' }}>{t.type}</td>
                    <td style={{ padding: '12px 16px', color: '#2C2C2A' }}>{t.quantity}</td>
                    <td style={{ padding: '12px 16px', color: '#2C2C2A' }}>${t.price.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', color: '#2C2C2A' }}>${t.total.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', color: '#888780', fontSize: 12 }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
