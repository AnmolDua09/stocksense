import { useEffect, useState } from 'react'
import api from '../api/axios'

const Label = ({ label, color, bg }) => (
  <span style={{ background: bg, color, border: `1px solid ${color}33`,
    borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
    {label}
  </span>
)

const COLORS = {
  positive: { text: '#3B6D11', bg: '#EAF3DE' },
  negative: { text: '#A32D2D', bg: '#FCEBEB' },
  neutral: { text: '#854F0B', bg: '#FAEEDA' }
}

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
    <div style={{ color: '#888780', textAlign: 'center', padding: 60 }}>
      <p style={{ fontSize: 16, marginBottom: 8 }}>🔍 Fetching latest news...</p>
      <p style={{ fontSize: 13 }}>Analysing sentiment with VADER NLP</p>
    </div>
  )

  if (error) return <div style={{ color: '#A32D2D', textAlign: 'center', padding: 60 }}>{error}</div>
  if (!data) return null

  const overall = COLORS[data.overall] || COLORS.neutral
  const isBullish = data.overall === 'positive'
  const isNeutral = data.overall === 'neutral'

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ background: overall.bg, border: `1px solid ${overall.text}33`, borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 8 }}>Overall Sentiment</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: overall.text }}>
            {isBullish ? '😊 Positive' : isNeutral ? '😐 Neutral' : '😟 Negative'}
          </p>
          <p style={{ color: '#888780', fontSize: 12, marginTop: 4 }}>Score: {data.score} / 1.0</p>
        </div>

        <div style={{ background: '#F0F7FF', border: '1px solid #D6E8FB', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 12 }}>News Breakdown</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#3B6D11' }}>{data.breakdown.positive}</p>
              <p style={{ fontSize: 11, color: '#888780' }}>Positive</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#854F0B' }}>{data.breakdown.neutral}</p>
              <p style={{ fontSize: 11, color: '#888780' }}>Neutral</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#A32D2D' }}>{data.breakdown.negative}</p>
              <p style={{ fontSize: 11, color: '#888780' }}>Negative</p>
            </div>
          </div>
        </div>

        <div style={{ background: '#F0F7FF', border: '1px solid #D6E8FB', borderRadius: 10, padding: '16px 20px', flex: 1 }}>
          <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 8 }}>Powered by</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#0C447C' }}>VADER NLP</p>
          <p style={{ fontSize: 12, color: '#888780', marginTop: 4, lineHeight: 1.5 }}>
            Valence Aware Dictionary optimised for financial & social text
          </p>
        </div>
      </div>

      <div style={{ background: '#F0F7FF', border: '1px solid #D6E8FB', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
        <p style={{ color: '#5F5E5A', fontSize: 12, marginBottom: 10 }}>Sentiment Meter</p>
        <div style={{ background: '#D6E8FB', borderRadius: 99, height: 10, overflow: 'hidden' }}>
          <div style={{
            width: `${((data.score + 1) / 2) * 100}%`,
            height: '100%',
            background: overall.text,
            borderRadius: 99,
            transition: 'width 0.6s ease'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: '#A32D2D' }}>Very Negative</span>
          <span style={{ fontSize: 11, color: '#888780' }}>Neutral</span>
          <span style={{ fontSize: 11, color: '#3B6D11' }}>Very Positive</span>
        </div>
      </div>

      <h3 style={{ color: '#5F5E5A', fontSize: 13, fontWeight: 600, marginBottom: 12,
        textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Latest News — {symbol} ({data.articles.length} articles)
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.articles.map((article, i) => {
          const c = COLORS[article.label] || COLORS.neutral
          return (
            <a key={i} href={article.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #D6E8FB', borderRadius: 10,
                padding: '14px 16px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: 16, transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#85B7EB'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#D6E8FB'}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#2C2C2A', fontSize: 14, lineHeight: 1.5, marginBottom: 6 }}>
                    {article.title}
                  </p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ color: '#378ADD', fontSize: 12, fontWeight: 500 }}>{article.source}</span>
                    <span style={{ color: '#B4B2A9', fontSize: 12 }}>
                      {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  <Label label={article.label} color={c.text} bg={c.bg} />
                  <p style={{ color: '#888780', fontSize: 11, marginTop: 4 }}>{article.score > 0 ? '+' : ''}{article.score}</p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
      <p style={{ color: '#B4B2A9', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
        Sentiment powered by VADER NLP · News from NewsAPI · Cached 30 min · Not financial advice
      </p>
    </div>
  )
}
