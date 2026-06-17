import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import api from '../api/axios'

const PERIODS = ['5d','1mo','3mo','6mo','1y']

export default function StockChart({ symbol }) {
  const [data, setData] = useState([])
  const [period, setPeriod] = useState('1mo')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data: res } = await api.get(`/stocks/history/${symbol}?period=${period}`)
        setData(res.data.map(d => ({ date: d.Date.slice(0,10), price: d.Close })))
      } catch {}
      setLoading(false)
    }
    fetch()
  }, [symbol, period])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {PERIODS.map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #D6E8FB',
              background: period === p ? '#378ADD' : '#fff',
              color: period === p ? '#fff' : '#5F5E5A', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            {p}
          </button>
        ))}
      </div>
      {loading ? <div style={{ color: '#888780', textAlign: 'center', padding: 60 }}>Loading chart...</div> : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#378ADD" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#378ADD" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FC" />
            <XAxis dataKey="date" tick={{ fill: '#888780', fontSize: 11 }} tickLine={false}
              interval={Math.floor(data.length / 6)} axisLine={{ stroke: '#D6E8FB' }} />
            <YAxis tick={{ fill: '#888780', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#D6E8FB' }}
              domain={['auto', 'auto']} tickFormatter={v => `$${v}`} width={65} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #D6E8FB', borderRadius: 8 }}
              labelStyle={{ color: '#5F5E5A' }} itemStyle={{ color: '#378ADD' }}
              formatter={v => [`$${v.toFixed(2)}`, 'Price']} />
            <Area type="monotone" dataKey="price" stroke="#378ADD" strokeWidth={2.5} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
