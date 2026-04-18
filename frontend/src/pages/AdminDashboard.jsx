import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import FieldFormModal from '../components/FieldFormModal'
import FieldDetailModal from '../components/FieldDetailModal'
import AgentFormModal from '../components/AgentFormModal'
import { useApp } from '../context/AppContext'

const STATUS_CONFIG = {
  Active:    { pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  'At Risk': { pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       dot: 'bg-amber-500'  },
  Completed: { pill: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',         dot: 'bg-gray-400'   },
}

export default function AdminDashboard() {
  const { fields, agents, createField, updateField, deleteField, assignField, createAgent } = useApp()
  const [section, setSection]               = useState('overview')
  const [formTarget, setFormTarget]         = useState(null)
  const [viewing, setViewing]               = useState(null)
  const [confirmDelete, setConfirmDelete]   = useState(null)
  const [showAgentForm, setShowAgentForm]   = useState(false)

  const counts = fields.reduce((acc, f) => { acc[f.status] = (acc[f.status] || 0) + 1; return acc }, {})
  const staleFields    = fields.filter((f) => f.status === 'At Risk').length
  const harvestReady   = fields.filter((f) => f.stage === 'Ready').length
  const unassigned     = fields.filter((f) => !f.assignedTo).length
  const mostActiveCrop = (() => {
    const tally = fields.reduce((acc, f) => { acc[f.crop] = (acc[f.crop] || 0) + 1; return acc }, {})
    return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  })()

  const statCards = [
    { label: 'Total Fields',  value: fields.length,          style: 'bg-white border-gray-100',                        icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#3d6b35]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { label: 'Active',        value: counts.Active || 0,     style: 'bg-emerald-50 border-emerald-100 text-emerald-700', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { label: 'At Risk',       value: counts['At Risk'] || 0, style: 'bg-amber-50 border-amber-100 text-amber-700',      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { label: 'Completed',     value: counts.Completed || 0,  style: 'bg-gray-50 border-gray-100 text-gray-500',         icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  ]

  return (
    <AdminLayout activeSection={section} onSectionChange={setSection}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">

        {/* Page title + action buttons */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">{section}</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage fields, agents and monitor season progress</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFormTarget('new')}
            className="flex items-center gap-1.5 bg-[#3d6b35] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-[#2f5429] transition cursor-pointer shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Field
          </button>
          <button
            onClick={() => setShowAgentForm(true)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3d6b35] border border-[#3d6b35] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-[#3d6b35] hover:text-white transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            New Agent
          </button>
        </div>

        {/* Overview */}
        {(section === 'overview' || section === 'insights') && (
          <>
            {section === 'overview' && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statCards.map(({ label, value, style, icon }) => (
                  <div key={label} className={`rounded-2xl border px-3 sm:px-5 py-3 sm:py-4 flex items-center gap-2 sm:gap-4 ${style}`}>
                    <span className="opacity-60 hidden sm:block">{icon}</span>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold leading-none">{value}</p>
                      <p className="text-[11px] sm:text-xs mt-0.5 opacity-70">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Insights</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Ready to Harvest', value: harvestReady,   sub: 'fields',         color: 'text-amber-600'  },
                  { label: 'At Risk Fields',   value: staleFields,    sub: 'need attention', color: 'text-red-500'    },
                  { label: 'Unassigned',       value: unassigned,     sub: 'fields',         color: 'text-gray-500'   },
                  { label: 'Top Crop',         value: mostActiveCrop, sub: 'most planted',   color: 'text-[#3d6b35]' },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 px-3 sm:px-4 py-3">
                    <p className="text-[11px] sm:text-xs text-gray-400">{label}</p>
                    <p className={`text-lg sm:text-xl font-bold mt-1 truncate ${color}`}>{value}</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-300 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Fields */}
        {(section === 'overview' || section === 'fields') && (
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">All Fields ({fields.length})</p>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-xs sm:text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    <th className="text-left px-3 sm:px-5 py-3">Field</th>
                    <th className="text-left px-3 sm:px-5 py-3">Crop</th>
                    <th className="text-left px-3 sm:px-5 py-3 hidden sm:table-cell">Stage</th>
                    <th className="text-left px-3 sm:px-5 py-3">Status</th>
                    <th className="text-left px-3 sm:px-5 py-3 hidden md:table-cell">Agent</th>
                    <th className="text-left px-3 sm:px-5 py-3 hidden lg:table-cell">Last Updated</th>
                    <th className="px-3 sm:px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field) => {
                    const { pill, dot } = STATUS_CONFIG[field.status]
                    return (
                      <tr key={field.id} className="border-b border-gray-50 hover:bg-[#f4f6f3] transition">
                        <td className="px-3 sm:px-5 py-3 font-medium text-gray-800 cursor-pointer hover:text-[#3d6b35]" onClick={() => setViewing(field)}>
                          {field.name}
                        </td>
                        <td className="px-3 sm:px-5 py-3 text-gray-500">{field.crop}</td>
                        <td className="px-3 sm:px-5 py-3 text-gray-500 hidden sm:table-cell">{field.stage}</td>
                        <td className="px-3 sm:px-5 py-3">
                          <span className={`flex items-center gap-1 w-fit text-xs px-2 py-1 rounded-full font-medium ${pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{field.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-5 py-3 hidden md:table-cell">
                          <select
                            value={field.assignedTo || ''}
                            onChange={(e) => assignField(field.id, e.target.value)}
                            className="text-xs text-gray-600 bg-[#f4f6f3] border-none rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#3d6b35]/30 cursor-pointer"
                          >
                            <option value="">Unassigned</option>
                            {agents.map((a) => <option key={a.id} value={a.id}>{a.username}</option>)}
                          </select>
                        </td>
                        <td className="px-3 sm:px-5 py-3 text-xs text-gray-400 hidden lg:table-cell">
                          {new Date(field.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-3 sm:px-5 py-3">
                          <div className="flex items-center gap-1 sm:gap-2 justify-end">
                            <button onClick={() => setFormTarget(field)} className="text-gray-400 hover:text-[#3d6b35] transition cursor-pointer p-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => setConfirmDelete(field)} className="text-gray-400 hover:text-red-500 transition cursor-pointer p-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Agents */}
        {(section === 'overview' || section === 'agents') && (
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Agent Overview</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {agents.map((agent) => {
                const agentFields = fields.filter((f) => f.assignedTo === agent.id)
                const atRisk = agentFields.filter((f) => f.status === 'At Risk').length
                return (
                  <div key={agent.id} className="bg-white rounded-2xl border border-gray-100 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#3d6b35]/10 flex items-center justify-center text-[#3d6b35] font-bold text-sm shrink-0">
                      {agent.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-700 text-sm truncate">{agent.username}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{agentFields.length} field{agentFields.length !== 1 ? 's' : ''} assigned</p>
                    </div>
                    {atRisk > 0 && (
                      <span className="text-xs bg-amber-50 text-amber-600 ring-1 ring-amber-200 px-2 py-1 rounded-full font-medium shrink-0">
                        {atRisk} at risk
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showAgentForm && (
        <AgentFormModal onSave={createAgent} onClose={() => setShowAgentForm(false)} />
      )}

      {formTarget && (
        <FieldFormModal
          field={formTarget === 'new' ? null : formTarget}
          agents={agents}
          onSave={async (data) => { formTarget === 'new' ? await createField(data) : await updateField(formTarget.id, data); setFormTarget(null) }}
          onClose={() => setFormTarget(null)}
        />
      )}

      {viewing && (
        <FieldDetailModal
          field={viewing}
          onEdit={(f) => { setViewing(null); setFormTarget(f) }}
          onClose={() => setViewing(null)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="font-bold text-gray-800 mb-1">Delete {confirmDelete.name}?</h3>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer font-medium">Cancel</button>
              <button onClick={() => { deleteField(confirmDelete.id); setConfirmDelete(null) }} className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition cursor-pointer font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
