import { useState } from 'react'

const STATUS_DOT = {
  Active:    '#5a8a3a',
  'At Risk': '#b07040',
  Completed: '#8a8278',
}

const STAGE_BAR = {
  Planted: '#8a7a5a', Growing: '#5a8a3a', Ready: '#c8a84b', Harvested: '#6b6560',
}

export default function AgentDetailModal({ agent, fields, onUpdate, onClose }) {
  const [mode, setMode]         = useState('view')
  const [form, setForm]         = useState({ username: agent.username, password: '', confirm: '' })
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)

  const agentFields = fields.filter((f) => f.assignedTo === agent.id)
  const allNotes    = agentFields.flatMap((f) =>
    f.notes.map((n) => ({ ...n, fieldName: f.name, fieldCrop: f.crop }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const counts = agentFields.reduce((acc, f) => { acc[f.status] = (acc[f.status] || 0) + 1; return acc }, {})

  const handleSave = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.confirm)
      return setError('Passwords do not match')
    if (form.password && form.password.length < 6)
      return setError('Password must be at least 6 characters')
    setSaving(true); setError('')
    try {
      const payload = { username: form.username }
      if (form.password) payload.password = form.password
      await onUpdate(agent.id, payload)
      setMode('view')
      setForm((f) => ({ ...f, password: '', confirm: '' }))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update agent')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition'
  const inputStyle = { backgroundColor: '#e8e4dc', borderColor: '#d4cfc6', color: '#1e3314' }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] flex flex-col"
        style={{ backgroundColor: '#faf8f4' }}>

        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#d4cfc6' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #e0dbd2' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: '#2d4a1e', color: '#a8c97a' }}>
              {agent.username[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: '#1e3314' }}>{agent.username}</h3>
              <p className="text-xs" style={{ color: '#8a8278' }}>Field Agent · {agentFields.length} field{agentFields.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMode(mode === 'edit' ? 'view' : 'edit'); setError('') }}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition cursor-pointer"
              style={mode === 'edit'
                ? { backgroundColor: '#e8e4dc', color: '#5a5550' }
                : { backgroundColor: '#2d4a1e', color: '#c8e6a0' }
              }
            >
              {mode === 'edit' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </>
              )}
            </button>
            <button onClick={onClose} className="cursor-pointer p-1" style={{ color: '#a8a09a' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Status summary */}
        <div className="flex gap-3 px-6 py-3" style={{ borderBottom: '1px solid #e0dbd2' }}>
          {[['Active', '#e8f0e0', '#3a5c28'], ['At Risk', '#f5ede0', '#7a4a1e'], ['Completed', '#e8e4dc', '#5a5550']].map(([s, bg, color]) => (
            <div key={s} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: bg, color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_DOT[s] }} />
              {counts[s] || 0} {s}
            </div>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">

          {/* Edit form */}
          {mode === 'edit' && (
            <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: '#f0ede6', border: '1px solid #e0dbd2' }}>
              <h4 className="text-sm font-semibold" style={{ color: '#1e3314' }}>Edit Agent Details</h4>
              <form onSubmit={handleSave} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: '#8a8278' }}>Username</label>
                  <input
                    required value={form.username}
                    onChange={(e) => { setForm({ ...form, username: e.target.value }); setError('') }}
                    className={inputClass} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4a7c35'}
                    onBlur={e => e.target.style.borderColor = '#d4cfc6'}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: '#8a8278' }}>New Password <span style={{ color: '#a8a09a' }}>(leave blank to keep current)</span></label>
                  <input
                    type="password" value={form.password} placeholder="Enter new password"
                    onChange={(e) => { setForm({ ...form, password: e.target.value }); setError('') }}
                    className={inputClass} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4a7c35'}
                    onBlur={e => e.target.style.borderColor = '#d4cfc6'}
                  />
                </div>
                {form.password && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: '#8a8278' }}>Confirm Password</label>
                    <input
                      type="password" value={form.confirm} placeholder="Confirm new password"
                      onChange={(e) => { setForm({ ...form, confirm: e.target.value }); setError('') }}
                      className={inputClass} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#4a7c35'}
                      onBlur={e => e.target.style.borderColor = '#d4cfc6'}
                    />
                  </div>
                )}
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="submit" disabled={saving}
                  className="text-white rounded-xl py-2.5 text-sm font-semibold transition cursor-pointer disabled:opacity-60"
                  style={{ backgroundColor: '#2d4a1e' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3a5c28'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2d4a1e'}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Assigned Fields */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#8a8278' }}>Assigned Fields</p>
            {agentFields.length === 0 ? (
              <p className="text-sm" style={{ color: '#a8a09a' }}>No fields assigned.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {agentFields.map((f) => (
                  <div key={f.id} className="rounded-xl px-4 py-3 flex items-center gap-4"
                    style={{ backgroundColor: '#f0ede6', border: '1px solid #e0dbd2' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#1e3314' }}>{f.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#8a8278' }}>{f.crop} · {f.stage}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: '#e0dbd2' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${{ Planted:25, Growing:50, Ready:75, Harvested:100 }[f.stage]}%`, backgroundColor: STAGE_BAR[f.stage] }} />
                      </div>
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: f.status === 'Active' ? '#e8f0e0' : f.status === 'At Risk' ? '#f5ede0' : '#e8e4dc', color: STATUS_DOT[f.status] }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_DOT[f.status] }} />
                        {f.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#8a8278' }}>
              All Observations {allNotes.length > 0 && <span className="normal-case font-normal">({allNotes.length})</span>}
            </p>
            {allNotes.length === 0 ? (
              <p className="text-sm" style={{ color: '#a8a09a' }}>No observations recorded yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {allNotes.map((n, i) => (
                  <li key={i} className="rounded-xl px-4 py-3" style={{ backgroundColor: '#f0ede6', border: '1px solid #e0dbd2' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#e0dbd2', color: '#5a5550' }}>{n.fieldName}</span>
                      <span className="text-[11px]" style={{ color: '#a8a09a' }}>{n.fieldCrop}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#3a3530' }}>{n.text}</p>
                    <p className="text-[11px] mt-1.5" style={{ color: '#a8a09a' }}>
                      {new Date(n.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
