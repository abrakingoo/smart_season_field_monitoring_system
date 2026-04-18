import { useState } from 'react'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function AdminLayout({ children, activeSection, onSectionChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0ede6' }}>
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden shadow-sm"
        style={{ backgroundColor: '#1a2e10', borderBottom: '1px solid #243d16' }}>
        <button onClick={() => setSidebarOpen(true)} className="cursor-pointer p-1" style={{ color: '#a8c97a' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div className="flex items-center gap-2">
          <img src="/shamba.svg" alt="logo" className="w-7 h-7" />
          <span className="font-bold text-sm tracking-wide" style={{ color: '#a8c97a' }}>ShambaRecords</span>
        </div>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: '#2d4a1e', color: '#a8c97a' }}>
          {(localStorage.getItem('username') || 'A')[0].toUpperCase()}
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar active={activeSection} onChange={onSectionChange} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
