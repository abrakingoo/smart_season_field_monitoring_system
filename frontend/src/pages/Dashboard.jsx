import { useState } from 'react'
import AgentLayout from '../components/AgentLayout'
import FieldCard from '../components/FieldCard'
import StageUpdateModal from '../components/StageUpdateModal'
import FieldDetailModal from '../components/FieldDetailModal'
import { useApp } from '../context/AppContext'
import api from '../services/api'

const STATS = [
  {
    key: 'total', label: 'Total Fields',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    activeBg: '#2d4a1e', activeText: '#c8e6a0', bg: '#faf8f4', text: '#3a5c28', border: '#d4cfc6',
  },
  {
    key: 'Active', label: 'Active',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    activeBg: '#3a5c28', activeText: '#e8f5d8', bg: '#e8f0e0', text: '#3a5c28', border: '#c8ddb8',
  },
  {
    key: 'At Risk', label: 'At Risk',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    activeBg: '#7a4a1e', activeText: '#f5e8d8', bg: '#f5ede0', text: '#7a4a1e', border: '#e0c8a8',
  },
  {
    key: 'Completed', label: 'Completed',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    activeBg: '#4a4540', activeText: '#e8e4dc', bg: '#e8e4dc', text: '#5a5550', border: '#d4cfc6',
  },
]

export default function Dashboard() {
  const { fields, updateStage, addNote } = useApp()
  const [section, setSection]   = useState(() => sessionStorage.getItem('agentSection') || 'fields')

  const handleSectionChange = (s) => {
    sessionStorage.setItem('agentSection', s)
    setSection(s)
  }
  const [viewing, setViewing]   = useState(null)
  const [editing, setEditing]   = useState(null)
  const [filter, setFilter]     = useState('total')

  // Settings state
  const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwError, setPwError]   = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const counts    = fields.reduce((acc, f) => { acc[f.status] = (acc[f.status] || 0) + 1; return acc }, {})
  const liveField = (f) => fields.find((x) => x.id === f.id) || f
  const filtered  = filter === 'total' ? fields : fields.filter((f) => f.status === filter)

  const fieldCounts = { total: fields.length, ...counts }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm)
      return setPwError('New passwords do not match')
    setPwLoading(true); setPwError(''); setPwSuccess('')
    try {
      await api.patch('/users/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwSuccess('Password updated successfully')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setPwLoading(false)
    }
  }

  const inputStyle = { backgroundColor: '#e8e4dc', borderColor: '#d4cfc6', color: '#1e3314' }
  const inputClass = 'w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition'

  return (
    <AgentLayout activeSection={section} onSectionChange={handleSectionChange} fieldCounts={fieldCounts}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">

        {/* Fields section */}
        {section === 'fields' && (
          <>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#1e3314' }}>My Fields</h2>
              <p className="text-xs sm:text-sm mt-1" style={{ color: '#8a8278' }}>Track and manage your assigned crop fields</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {STATS.map(({ key, label, icon, activeBg, activeText, bg, text, border }) => {
                const isActive = filter === key
                return (
                  <button
                    key={key}
                    onClick={() => setFilter(filter === key ? 'total' : key)}
                    className="rounded-2xl px-3 sm:px-5 py-3 sm:py-4 flex items-center gap-2 sm:gap-4 text-left transition cursor-pointer"
                    style={{
                      backgroundColor: isActive ? activeBg : bg,
                      color: isActive ? activeText : text,
                      border: `1px solid ${isActive ? activeBg : border}`,
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    }}
                  >
                    <span className="opacity-70 hidden sm:block">{icon}</span>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold leading-none">{key === 'total' ? fields.length : counts[key] || 0}</p>
                      <p className="text-[11px] sm:text-xs mt-0.5 opacity-80">{label}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4" style={{ color: '#6b6560' }}>
                {filter === 'total' ? `All Fields (${fields.length})` : `${filter} (${filtered.length})`}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((field) => (
                  <FieldCard key={field.id} field={field} onView={setViewing} onEdit={setEditing} />
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm col-span-full text-center py-10" style={{ color: '#8a8278' }}>No fields match this filter.</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Settings section */}
        {section === 'settings' && (
          <>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#1e3314' }}>Settings</h2>
              <p className="text-xs sm:text-sm mt-1" style={{ color: '#8a8278' }}>Manage your account preferences</p>
            </div>

            {/* Account info */}
            <div className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4" style={{ backgroundColor: '#faf8f4', border: '1px solid #e0dbd2' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#1e3314' }}>Account Information</h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: '#8a8278' }}>Username</label>
                  <div className="flex items-center gap-3">
                    <input
                      disabled value={localStorage.getItem('username') || ''}
                      className={`${inputClass} flex-1 opacity-60 cursor-not-allowed`}
                      style={inputStyle}
                    />
                    <span className="text-xs px-2 py-1 rounded-lg shrink-0" style={{ backgroundColor: '#e8e4dc', color: '#8a8278' }}>
                      Admin only
                    </span>
                  </div>
                  <p className="text-[11px]" style={{ color: '#a8a09a' }}>Username can only be changed by an administrator.</p>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: '#8a8278' }}>Role</label>
                  <input disabled value="Field Agent" className={`${inputClass} opacity-60 cursor-not-allowed`} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Change password */}
            <div className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4" style={{ backgroundColor: '#faf8f4', border: '1px solid #e0dbd2' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#1e3314' }}>Change Password</h3>
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
                {[
                  { key: 'currentPassword', label: 'Current Password' },
                  { key: 'newPassword',     label: 'New Password' },
                  { key: 'confirm',         label: 'Confirm New Password' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: '#8a8278' }}>{label}</label>
                    <input
                      type="password" required value={pwForm[key]}
                      onChange={(e) => { setPwForm({ ...pwForm, [key]: e.target.value }); setPwError(''); setPwSuccess('') }}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#4a7c35'}
                      onBlur={e => e.target.style.borderColor = '#d4cfc6'}
                    />
                  </div>
                ))}
                {pwError   && <p className="text-xs text-red-600">{pwError}</p>}
                {pwSuccess && <p className="text-xs" style={{ color: '#3a5c28' }}>{pwSuccess}</p>}
                <button
                  type="submit" disabled={pwLoading}
                  className="mt-1 text-white rounded-xl py-2.5 text-sm font-semibold transition cursor-pointer disabled:opacity-60"
                  style={{ backgroundColor: '#2d4a1e' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3a5c28'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2d4a1e'}
                >
                  {pwLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {viewing && (
        <FieldDetailModal
          field={liveField(viewing)}
          onEdit={(f) => { setViewing(null); setEditing(f) }}
          onClose={() => setViewing(null)}
        />
      )}
      {editing && (
        <StageUpdateModal
          field={liveField(editing)}
          onUpdateStage={async (id, stage) => { await updateStage(id, stage); setEditing(null) }}
          onAddNote={async (id, text) => { await addNote(id, text); setEditing(null) }}
          onClose={() => setEditing(null)}
        />
      )}
    </AgentLayout>
  )
}
