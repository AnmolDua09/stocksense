import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'
import api from '../api/axios'

export default function Prediction({ symbol }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data: res } = await api.get(`/stocks/predict/${symbol}`)
        setData(res)
      } catch {}
      setLoading(false)
    }
    fetch()
  }, [symbol])

  if (loading) return <div style={{ color: '#64748b', textAlign: 'center', padding: 60 }}>Running ML prediction... (~10s)</div>
  if (!data) return null

  const chartData = data.forecast.map(d => ({
    date: d.ds.slice(0,10),
    predicted: d.yhat.toFixed(2),
    low: d.yhat_lower.toFixed(2),
    high: d.yhat_upper.toFixed(2)
  }))

  const isBullish = data.signal === 'bullish'

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>Signal</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: isBullish ? '#22c55e' : '#ef4444' }}>
            {isBullish ? '▲ Bullish' : '▼ Bearish'}
          </p>
        </div>
        <div style={{ background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>Current Price</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>${data.current_price}</p>
        </div>
        <div style={{ background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>7-Day Prediction</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>${data.predicted_price}</p>
        </div>
        <div style={{ background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>Expected Change</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: isBullish ? '#22c55e' : '#ef4444' }}>
            {data.change_pct > 0 ? '+' : ''}{data.change_pct}%
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
          <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickLine={false}
            domain={['auto', 'auto']} tickFormatter={v => `$${v}`} width={65} />
          <Tooltip contentStyle={{ background: '#13131f', border: '1px solid #1e1e3a', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8' }} />
          <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} name="Predicted" />
          <Line type="monotone" dataKey="high" stroke="#22c55e" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Upper" />
          <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Lower" />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ color: '#475569', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        Powered by Facebook Prophet · Trained on 6 months of historical data · Not financial advice
      </p>
    </div>
  )
}
