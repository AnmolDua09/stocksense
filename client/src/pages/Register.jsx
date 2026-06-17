import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register', form)
      setAuth(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo} onClick={() => navigate('/')}>📈 StockSense</div>
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.sub}>Start with $100,000 virtual balance</p>
        {error && <div style={styles.error}>{error}</div>}
        <input style={styles.input} placeholder="Full Name"
          value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input style={styles.input} placeholder="Email" type="email"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input style={styles.input} placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({...form, password: e.target.value})}
          onKeyDown={e => e.key === 'Enter' && submit()} />
        <button style={styles.btn} onClick={submit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <p style={styles.link}>Already have an account? <Link to="/login" style={styles.a}>Sign in</Link></p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F7FF' },
  card: { background: '#FFFFFF', border: '1px solid #D6E8FB', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 4px 20px rgba(55,138,221,0.08)' },
  logo: { fontSize: 24, fontWeight: 700, color: '#185FA5', marginBottom: 24, cursor: 'pointer' },
  title: { fontSize: 22, fontWeight: 600, color: '#0C447C', marginBottom: 6 },
  sub: { color: '#5F5E5A', fontSize: 14, marginBottom: 24 },
  error: { background: '#FCEBEB', border: '1px solid #F09595', color: '#A32D2D', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  input: { width: '100%', background: '#FFFFFF', border: '1px solid #D6E8FB', borderRadius: 8, padding: '12px 14px', color: '#2C2C2A', fontSize: 14, marginBottom: 12, outline: 'none', display: 'block' },
  btn: { width: '100%', background: '#378ADD', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
  link: { textAlign: 'center', marginTop: 20, color: '#5F5E5A', fontSize: 14 },
  a: { color: '#378ADD', textDecoration: 'none', fontWeight: 500 }
}
