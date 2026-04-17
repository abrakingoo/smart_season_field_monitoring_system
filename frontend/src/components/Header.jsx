import { useNavigate } from 'react-router-dom'

export default function Header({ showLogout = true }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth')
    navigate('/')
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#3d6b35] shadow-md">
      <div className="flex items-center gap-3">
        <img src="/shamba.svg" alt="SmartSeason logo" className="w-8 h-8" />
        <span className="text-white font-bold text-lg tracking-wide">ShambaRecords</span>
      </div>
      {showLogout && (
        <button
          onClick={handleLogout}
          className="text-sm text-white border border-white/40 px-4 py-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
        >
          Logout
        </button>
      )}
    </header>
  )
}
