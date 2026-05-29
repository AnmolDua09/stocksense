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
            style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid #1e1e3a',
              background: period === p ? '#6366f1' : 'transparent',
              color: period === p ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 13 }}>
            {p}
          </button>
        ))}
      </div>
      {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: 60 }}>Loading chart...</div> : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false}
              interval={Math.floor(data.length / 6)} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickLine={false}
              domain={['auto', 'auto']} tickFormatter={v => `$${v}`} width={65} />
            <Tooltip contentStyle={{ background: '#13131f', border: '1px solid #1e1e3a', borderRadius: 8 }}
              labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#6366f1' }}
              formatter={v => [`$${v.toFixed(2)}`, 'Price']} />
            <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
