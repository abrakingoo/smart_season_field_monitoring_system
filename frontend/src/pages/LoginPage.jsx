import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const [form, setForm]             = useState({ username: '', password: '' })
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate                    = useNavigate()
  const { triggerAuth }             = useApp()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token',    data.token)
      localStorage.setItem('auth',     'true')
      localStorage.setItem('username', data.user.username)
      localStorage.setItem('role',     data.user.role)
      localStorage.setItem('userId',   data.user.id)
      triggerAuth()
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden" style={{ backgroundColor: '#1e3314' }}>
        {/* Field rows pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="rows" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M0 15 Q15 5 30 15 Q45 25 60 15" fill="none" stroke="#a8c97a" strokeWidth="1.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rows)"/>
        </svg>

        {/* Horizon illustration */}
        <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 160 Q100 120 200 140 Q300 160 400 130 Q500 100 600 120 L600 200 L0 200Z" fill="#4a7c35"/>
          <path d="M0 180 Q150 150 300 165 Q450 180 600 155 L600 200 L0 200Z" fill="#2d4a1e"/>
          <circle cx="480" cy="60" r="40" fill="#c8a84b" opacity="0.6"/>
        </svg>

        <div className="relative z-10 flex items-center gap-3">
          <img src="/shamba.svg" alt="logo" className="w-9 h-9" />
          <span className="text-white font-bold text-xl tracking-wide">ShambaRecords</span>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Monitor your fields,<br />every season.
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Track crop stages, log field observations, and stay ahead of risks — all in one place.
          </p>
        </div>
        <p className="relative z-10 text-white/20 text-xs">© {new Date().getFullYear()} ShambaRecords</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6" style={{ backgroundColor: '#f0ede6' }}>
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/shamba.svg" alt="logo" className="w-8 h-8" />
            <span className="font-bold text-sm tracking-wide" style={{ color: '#2d4a1e' }}>ShambaRecords</span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: '#1e3314' }}>Welcome back</h2>
          <p className="text-sm text-stone-400 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500">Username</label>
              <input
                type="text" required value={form.username}
                onChange={(e) => { setForm({ ...form, username: e.target.value }); setError('') }}
                className="border rounded-xl px-4 py-3 text-sm outline-none transition"
                style={{ backgroundColor: '#e8e4dc', borderColor: '#d4cfc6', color: '#1e3314' }}
                onFocus={e => e.target.style.borderColor = '#4a7c35'}
                onBlur={e => e.target.style.borderColor = '#d4cfc6'}
                placeholder="Enter your username"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setError('') }}
                  className="w-full border rounded-xl px-4 py-3 pr-11 text-sm outline-none transition"
                  style={{ backgroundColor: '#e8e4dc', borderColor: '#d4cfc6', color: '#1e3314' }}
                  onFocus={e => e.target.style.borderColor = '#4a7c35'}
                  onBlur={e => e.target.style.borderColor = '#d4cfc6'}
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition cursor-pointer">
                  {showPassword
                    ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="mt-2 text-white rounded-xl py-3 text-sm font-semibold active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: '#2d4a1e' }}
              onMouseEnter={e => e.target.style.backgroundColor = '#3a5c28'}
              onMouseLeave={e => e.target.style.backgroundColor = '#2d4a1e'}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
