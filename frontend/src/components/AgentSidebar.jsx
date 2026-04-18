import { useNavigate } from 'react-router-dom'

const NAV = [
  {
    key: 'fields', label: 'My Fields',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    key: 'settings', label: 'Settings',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  },
]

export default function AgentSidebar({ active, onChange, open, onClose, fieldCounts }) {
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

        {/* Field count summary */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid #243d16' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a6741' }}>Season Summary</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Total',     value: fieldCounts.total,     color: '#a8c97a' },
              { label: 'Active',    value: fieldCounts.Active,    color: '#7aaa55' },
              { label: 'At Risk',   value: fieldCounts['At Risk'], color: '#c8a84b' },
              { label: 'Completed', value: fieldCounts.Completed, color: '#6b8f6b' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#6b8f4a' }}>{label}</span>
                <span className="text-sm font-bold" style={{ color }}>{value || 0}</span>
              </div>
            ))}
          </div>
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
              <p className="text-[11px]" style={{ color: '#4a6741' }}>Field Agent</p>
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
