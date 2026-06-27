import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'

export default function Register() {
  const [step, setStep] = useState('details') // 'details' | 'otp'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const sendOtp = async () => {
    setError('')
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register/send-otp', form)
      setStep('otp')
      startCooldown()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const verifyOtp = async () => {
    setError('')
    if (!otp || otp.length !== 6) {
      setError('Enter the 6-digit code')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register/verify', { ...form, otp })
      setAuth(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP')
    }
    setLoading(false)
  }

  const startCooldown = () => {
    setResendCooldown(30)
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const resendOtp = async () => {
    if (resendCooldown > 0) return
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register/send-otp', form)
      startCooldown()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo} onClick={() => navigate('/')}>📈 StockSense</div>

        {step === 'details' ? (
          <>
            <h2 style={styles.title}>Create account</h2>
            <p style={styles.sub}>Start with $100,000 virtual balance</p>
            {error && <div style={styles.error}>{error}</div>}
            <input style={styles.input} placeholder="Full Name"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input style={styles.input} placeholder="Email" type="email"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input style={styles.input} placeholder="Password" type="password"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && sendOtp()} />
            <p style={styles.hint}>Min 8 characters, 1 uppercase, 1 lowercase, 1 number</p>
            <button style={styles.btn} onClick={sendOtp} disabled={loading}>
              {loading ? 'Sending code...' : 'Continue'}
            </button>
            <p style={styles.link}>Already have an account? <Link to="/login" style={styles.a}>Sign in</Link></p>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Verify your email</h2>
            <p style={styles.sub}>We sent a 6-digit code to <strong>{form.email}</strong></p>
            {error && <div style={styles.error}>{error}</div>}
            <input style={{...styles.input, textAlign: 'center', fontSize: 22, letterSpacing: 6}}
              placeholder="000000" maxLength={6} inputMode="numeric"
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && verifyOtp()} />
            <button style={styles.btn} onClick={verifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <p style={styles.link}>
              Didn't get it?{' '}
              <span style={{...styles.a, cursor: resendCooldown > 0 ? 'default' : 'pointer', opacity: resendCooldown > 0 ? 0.5 : 1}}
                onClick={resendOtp}>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </span>
            </p>
            <p style={styles.link}>
              <span style={{...styles.a, cursor: 'pointer'}} onClick={() => { setStep('details'); setOtp(''); setError('') }}>
                ← Back to edit details
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F7FF' },
  card: { background: '#FFFFFF', border: '1px solid #D6E8FB', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 4px 20px rgba(55,138,221,0.08)' },
  logo: { fontSize: 24, fontWeight: 700, color: '#185FA5', marginBottom: 24, cursor: 'pointer' },
  title: { fontSize: 22, fontWeight: 600, color: '#0C447C', marginBottom: 6 },
  sub: { color: '#5F5E5A', fontSize: 14, marginBottom: 24, lineHeight: 1.5 },
  hint: { color: '#888780', fontSize: 12, marginTop: -6, marginBottom: 16 },
  error: { background: '#FCEBEB', border: '1px solid #F09595', color: '#A32D2D', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  input: { width: '100%', background: '#FFFFFF', border: '1px solid #D6E8FB', borderRadius: 8, padding: '12px 14px', color: '#2C2C2A', fontSize: 14, marginBottom: 12, outline: 'none', display: 'block' },
  btn: { width: '100%', background: '#378ADD', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
  link: { textAlign: 'center', marginTop: 16, color: '#5F5E5A', fontSize: 14 },
  a: { color: '#378ADD', textDecoration: 'none', fontWeight: 500 }
}
