import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()
  const { triggerAuth }       = useApp()

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
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#3d6b35] p-12">
        <div className="flex items-center gap-3">
          <img src="/shamba.svg" alt="logo" className="w-9 h-9" />
          <span className="text-white font-bold text-xl tracking-wide">ShambaRecords</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Monitor your fields,<br />every season.
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Track crop stages, log field observations, and stay ahead of risks — all in one place.
          </p>
        </div>
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} ShambaRecords</p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#f4f6f3] px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/shamba.svg" alt="logo" className="w-8 h-8" />
            <span className="font-bold text-[#3d6b35] text-lg">ShambaRecords</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Username</label>
              <input
                type="text" required value={form.username}
                onChange={(e) => { setForm({ ...form, username: e.target.value }); setError('') }}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]/40 focus:border-[#3d6b35] transition"
                placeholder="Enter your username"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Password</label>
              <input
                type="password" required value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setError('') }}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]/40 focus:border-[#3d6b35] transition"
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#3d6b35] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#2f5429] active:scale-[0.98] transition cursor-pointer shadow-sm shadow-[#3d6b35]/30 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
