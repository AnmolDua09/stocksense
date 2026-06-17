import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
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

  if (loading) return <div style={{ color: '#888780', textAlign: 'center', padding: 60 }}>Running ML prediction... (~10s)</div>
  if (!data) return null

  const chartData = data.forecast.map(d => ({
    date: d.ds.slice(0,10),
    predicted: d.yhat.toFixed(2),
    low: d.yhat_lower.toFixed(2),
    high: d.yhat_upper.toFixed(2)
  }))

  const isBullish = data.signal === 'bullish'
  const accent = isBullish ? '#3B6D11' : '#A32D2D'
  const accentBg = isBullish ? '#EAF3DE' : '#FCEBEB'

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ background: accentBg, border: `1px solid ${accent}33`, borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 6 }}>Signal</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: accent }}>
            {isBullish ? '▲ Bullish' : '▼ Bearish'}
          </p>
        </div>
        <div style={{ background: '#F0F7FF', border: '1px solid #D6E8FB', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 6 }}>Current Price</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#0C447C' }}>${data.current_price}</p>
        </div>
        <div style={{ background: '#F0F7FF', border: '1px solid #D6E8FB', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 6 }}>7-Day Prediction</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#378ADD' }}>${data.predicted_price}</p>
        </div>
        <div style={{ background: accentBg, border: `1px solid ${accent}33`, borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 6 }}>Expected Change</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: accent }}>
            {data.change_pct > 0 ? '+' : ''}{data.change_pct}%
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FC" />
          <XAxis dataKey="date" tick={{ fill: '#888780', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#D6E8FB' }} />
          <YAxis tick={{ fill: '#888780', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#D6E8FB' }}
            domain={['auto', 'auto']} tickFormatter={v => `$${v}`} width={65} />
          <Tooltip contentStyle={{ background: '#fff', border: '1px solid #D6E8FB', borderRadius: 8 }}
            labelStyle={{ color: '#5F5E5A' }} />
          <Line type="monotone" dataKey="predicted" stroke="#378ADD" strokeWidth={2.5} dot={{ fill: '#378ADD', r: 4 }} name="Predicted" />
          <Line type="monotone" dataKey="high" stroke="#639922" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Upper" />
          <Line type="monotone" dataKey="low" stroke="#E24B4A" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Lower" />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ color: '#888780', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        Powered by Facebook Prophet · Trained on 6 months of historical data · Not financial advice
      </p>
    </div>
  )
}
