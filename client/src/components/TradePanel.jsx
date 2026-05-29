import { useState } from 'react'
import api from '../api/axios'

export default function TradePanel({ symbol, quote, onTrade }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const trade = async (type) => {
    setLoading(true)
    setMsg(null)
    try {
      const { data } = await api.post(`/trades/${type}`, { symbol, quantity: Number(quantity) })
      setMsg({ type: 'success', text: `${type === 'buy' ? 'Bought' : 'Sold'} ${quantity} share(s) of ${symbol} at $${data.price}. New balance: $${data.balance.toLocaleString()}` })
      onTrade()
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Trade failed' })
    }
    setLoading(false)
  }

  const total = quote ? (quote.price * quantity).toFixed(2) : '...'

  return (
    <div style={{ maxWidth: 420 }}>
      <h3 style={{ color: '#f1f5f9', marginBottom: 20, fontSize: 16 }}>Virtual Trade — {symbol}</h3>
      {msg && (
        <div style={{ background: msg.type === 'success' ? '#0f2d1a' : '#2d1515',
          border: `1px solid ${msg.type === 'success' ? '#166534' : '#7f1d1d'}`,
          color: msg.type === 'success' ? '#86efac' : '#fca5a5',
          padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {msg.text}
        </div>
      )}
      <div style={{ background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ color: '#64748b', fontSize: 14 }}>Current Price</span>
          <span style={{ color: '#6366f1', fontWeight: 600 }}>${quote?.price || '...'}</span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#64748b', fontSize: 13, display: 'block', marginBottom: 8 }}>Quantity</label>
          <input type="number" min="1" value={quantity}
            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: '100%', background: '#13131f', border: '1px solid #1e1e3a', borderRadius: 8,
              padding: '10px 14px', color: '#e2e8f0', fontSize: 15, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #1e1e3a' }}>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>Total Value</span>
          <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16 }}>${total}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => trade('buy')} disabled={loading}
          style={{ flex: 1, background: '#166534', border: '1px solid #15803d', color: '#86efac',
            borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? '...' : '▲ Buy'}
        </button>
        <button onClick={() => trade('sell')} disabled={loading}
          style={{ flex: 1, background: '#7f1d1d', border: '1px solid #991b1b', color: '#fca5a5',
            borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? '...' : '▼ Sell'}
        </button>
      </div>
    </div>
  )
}
