import { useNavigate } from 'react-router-dom'

export default function Header({ showLogout = true }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 shadow-sm"
      style={{ backgroundColor: '#1a2e10', borderBottom: '1px solid #243d16' }}>
      <div className="flex items-center gap-3">
        <img src="/shamba.svg" alt="ShambaRecords logo" className="w-8 h-8" />
        <span className="font-bold text-base tracking-wide" style={{ color: '#a8c97a' }}>ShambaRecords</span>
      </div>
      {showLogout && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: '#2d4a1e', color: '#a8c97a' }}>
              {(localStorage.getItem('username') || 'A')[0].toUpperCase()}
            </div>
            <span className="text-sm hidden sm:block" style={{ color: '#7aaa55' }}>
              {localStorage.getItem('username') || 'Agent'}
            </span>
          </div>
          <button
            onClick={() => { localStorage.removeItem('auth'); localStorage.removeItem('username'); localStorage.removeItem('role'); localStorage.removeItem('userId'); localStorage.removeItem('token'); navigate('/') }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
            style={{ color: '#7aaa55', border: '1px solid #2d4a1e' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2d4a1e'; e.currentTarget.style.color = '#c8e6a0' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#7aaa55' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
