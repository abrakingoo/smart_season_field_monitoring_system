import { useNavigate } from 'react-router-dom'

export default function Header({ showLogout = true }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#3d6b35]/95 backdrop-blur border-b border-white/10 shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/shamba.svg" alt="ShambaRecords logo" className="w-8 h-8" />
        <span className="text-white font-bold text-base tracking-wide">ShambaRecords</span>
      </div>
      {showLogout && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              {(localStorage.getItem('username') || 'A')[0].toUpperCase()}
            </div>
            <span className="text-sm text-white/80 hidden sm:block">{localStorage.getItem('username') || 'Agent'}</span>
          </div>
          <button
            onClick={() => { localStorage.removeItem('auth'); localStorage.removeItem('username'); localStorage.removeItem('role'); localStorage.removeItem('userId'); navigate('/') }}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
