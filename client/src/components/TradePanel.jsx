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
      <h3 style={{ color: '#0C447C', marginBottom: 20, fontSize: 16 }}>Virtual Trade — {symbol}</h3>
      {msg && (
        <div style={{ background: msg.type === 'success' ? '#EAF3DE' : '#FCEBEB',
          border: `1px solid ${msg.type === 'success' ? '#97C459' : '#F09595'}`,
          color: msg.type === 'success' ? '#3B6D11' : '#A32D2D',
          padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {msg.text}
        </div>
      )}
      <div style={{ background: '#F0F7FF', border: '1px solid #D6E8FB', borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ color: '#5F5E5A', fontSize: 14 }}>Current Price</span>
          <span style={{ color: '#378ADD', fontWeight: 600 }}>${quote?.price || '...'}</span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#5F5E5A', fontSize: 13, display: 'block', marginBottom: 8 }}>Quantity</label>
          <input type="number" min="1" value={quantity}
            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: '100%', background: '#fff', border: '1px solid #D6E8FB', borderRadius: 8,
              padding: '10px 14px', color: '#2C2C2A', fontSize: 15, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #D6E8FB' }}>
          <span style={{ color: '#5F5E5A', fontSize: 14 }}>Total Value</span>
          <span style={{ color: '#0C447C', fontWeight: 700, fontSize: 16 }}>${total}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => trade('buy')} disabled={loading}
          style={{ flex: 1, background: '#EAF3DE', border: '1px solid #97C459', color: '#3B6D11',
            borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? '...' : '▲ Buy'}
        </button>
        <button onClick={() => trade('sell')} disabled={loading}
          style={{ flex: 1, background: '#FCEBEB', border: '1px solid #F09595', color: '#A32D2D',
            borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? '...' : '▼ Sell'}
        </button>
      </div>
    </div>
  )
}
