import { useNavigate } from 'react-router-dom'

const NAV = [
  {
    key: 'overview', label: 'Overview',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    key: 'fields', label: 'Fields',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    key: 'agents', label: 'Agents',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    key: 'insights', label: 'Insights',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
]

export default function Sidebar({ active, onChange, open, onClose }) {
  const navigate = useNavigate()

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside className={`
        fixed top-0 left-0 h-full z-40 w-56 flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:h-auto lg:min-h-full
      `} style={{ backgroundColor: '#1a2e10', borderRight: '1px solid #243d16' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid #243d16' }}>
          <img src="/shamba.svg" alt="logo" className="w-7 h-7" />
          <span className="font-bold text-sm tracking-wide" style={{ color: '#a8c97a' }}>ShambaRecords</span>
          <button onClick={onClose} className="ml-auto lg:hidden cursor-pointer" style={{ color: '#6b8f4a' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#4a6741' }}>Menu</p>
          {NAV.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { onChange(key); onClose() }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition cursor-pointer"
              style={active === key
                ? { backgroundColor: '#2d4a1e', color: '#c8e6a0' }
                : { color: '#7aaa55' }
              }
              onMouseEnter={e => { if (active !== key) e.currentTarget.style.backgroundColor = '#243d16' }}
              onMouseLeave={e => { if (active !== key) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {icon}
              {label}
              {active === key && <span className="ml-auto w-1 h-4 rounded-full" style={{ backgroundColor: '#7aaa55' }} />}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid #243d16' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
              style={{ backgroundColor: '#2d4a1e', color: '#a8c97a' }}>
              {(localStorage.getItem('username') || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#c8e6a0' }}>{localStorage.getItem('username')}</p>
              <p className="text-[11px]" style={{ color: '#4a6741' }}>Admin</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.clear(); navigate('/') }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition cursor-pointer"
            style={{ color: '#7aaa55' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3d1a1a'; e.currentTarget.style.color = '#e07070' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#7aaa55' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
