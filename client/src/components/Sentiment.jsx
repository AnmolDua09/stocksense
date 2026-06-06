import { useEffect, useState } from 'react'
import api from '../api/axios'

const Label = ({ label, color }) => (
  <span style={{ background: color + '22', color, border: `1px solid ${color}55`,
    borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
    {label}
  </span>
)

export default function Sentiment({ symbol }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: res } = await api.get(`/stocks/sentiment/${symbol}`)
        setData(res)
      } catch (err) {
        setError('Failed to load sentiment data')
      }
      setLoading(false)
    }
    fetch()
  }, [symbol])

  if (loading) return (
    <div style={{ color: '#64748b', textAlign: 'center', padding: 60 }}>
      <p style={{ fontSize: 16, marginBottom: 8 }}>🔍 Fetching latest news...</p>
      <p style={{ fontSize: 13 }}>Analysing sentiment with VADER NLP</p>
    </div>
  )

  if (error) return <div style={{ color: '#ef4444', textAlign: 'center', padding: 60 }}>{error}</div>
  if (!data) return null

  const isBullish = data.overall === 'positive'
  const isNeutral = data.overall === 'neutral'

  return (
    <div>
      {/* Overall cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#0d0d1a', border: `1px solid ${data.color}44`, borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Overall Sentiment</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: data.color }}>
            {isBullish ? '😊 Positive' : isNeutral ? '😐 Neutral' : '😟 Negative'}
          </p>
          <p style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>Score: {data.score} / 1.0</p>
        </div>

        <div style={{ background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 12 }}>News Breakdown</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#22c55e' }}>{data.breakdown.positive}</p>
              <p style={{ fontSize: 11, color: '#64748b' }}>Positive</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>{data.breakdown.neutral}</p>
              <p style={{ fontSize: 11, color: '#64748b' }}>Neutral</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#ef4444' }}>{data.breakdown.negative}</p>
              <p style={{ fontSize: 11, color: '#64748b' }}>Negative</p>
            </div>
          </div>
        </div>

        <div style={{ background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Powered by</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>VADER NLP</p>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
            Valence Aware Dictionary optimised for financial & social text analysis
          </p>
        </div>
      </div>

      {/* Sentiment meter */}
      <div style={{ background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 10 }}>Sentiment Meter</p>
        <div style={{ background: '#1e1e3a', borderRadius: 99, height: 10, overflow: 'hidden' }}>
          <div style={{
            width: `${((data.score + 1) / 2) * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, #ef4444, ${data.color})`,
            borderRadius: 99,
            transition: 'width 0.6s ease'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: '#ef4444' }}>Very Negative (-1.0)</span>
          <span style={{ fontSize: 11, color: '#f59e0b' }}>Neutral (0.0)</span>
          <span style={{ fontSize: 11, color: '#22c55e' }}>Very Positive (+1.0)</span>
        </div>
      </div>

      {/* Articles */}
      <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12,
        textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Latest News — {symbol} ({data.articles.length} articles)
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.articles.map((article, i) => (
          <a key={i} href={article.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 10,
              padding: '14px 16px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', gap: 16, transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#3730a3'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e3a'}>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.5, marginBottom: 6 }}>
                  {article.title}
                </p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ color: '#6366f1', fontSize: 12, fontWeight: 500 }}>{article.source}</span>
                  <span style={{ color: '#334155', fontSize: 12 }}>
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <Label label={article.label} color={article.color} />
                <p style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>{article.score > 0 ? '+' : ''}{article.score}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      <p style={{ color: '#334155', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
        Sentiment powered by VADER NLP · News from NewsAPI · Cached 30 min · Not financial advice
      </p>
    </div>
  )
}
