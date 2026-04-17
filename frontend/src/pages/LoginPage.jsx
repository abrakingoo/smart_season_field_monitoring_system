import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('auth', 'true')
    navigate('/dashboard')
  }

  return (
    <Layout showLogout={false}>
      <div className="flex items-center justify-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <img src="/shamba.svg" alt="SmartSeason logo" className="w-12 h-12" />
            <h1 className="text-2xl font-bold text-[#3d6b35] mt-2">Shamba Records</h1>
            <p className="text-sm text-gray-500">Field Monitoring System</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
            />
            <button
              type="submit"
              className="bg-[#3d6b35] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#2f5429] transition cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
