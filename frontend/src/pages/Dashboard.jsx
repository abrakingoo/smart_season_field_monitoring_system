import { useState } from 'react'
import Layout from '../components/Layout'
import FieldCard from '../components/FieldCard'
import StageUpdateModal from '../components/StageUpdateModal'
import FieldDetailModal from '../components/FieldDetailModal'
import { useApp } from '../context/AppContext'

const STATS = [
  {
    key: 'total', label: 'Total Fields', style: 'bg-white border-gray-100 text-[#3d6b35]',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    key: 'Active', label: 'Active', style: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a9 9 0 0 1 9 9c0 4.97-9 13-9 13S3 15.97 3 11a9 9 0 0 1 9-9z"/><circle cx="12" cy="11" r="3"/></svg>,
  },
  {
    key: 'At Risk', label: 'At Risk', style: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  {
    key: 'Completed', label: 'Completed', style: 'bg-gray-50 text-gray-500 border-gray-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  },
]

export default function Dashboard() {
  const { fields, updateStage, addNote } = useApp()
  const [viewing, setViewing]   = useState(null)
  const [editing, setEditing]   = useState(null)
  const [filter, setFilter]     = useState('total')

  const counts    = fields.reduce((acc, f) => { acc[f.status] = (acc[f.status] || 0) + 1; return acc }, {})
  const liveField = (f) => fields.find((x) => x.id === f.id) || f
  const filtered  = filter === 'total' ? fields : fields.filter((f) => f.status === filter)

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Fields Overview</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Track and manage your assigned crop fields</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map(({ key, label, icon, style }) => (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? 'total' : key)}
              className={`rounded-2xl border px-3 sm:px-5 py-3 sm:py-4 flex items-center gap-2 sm:gap-4 text-left transition cursor-pointer ${style} ${
                filter === key ? 'ring-2 ring-offset-1 ring-current shadow-md scale-[1.02]' : 'opacity-80 hover:opacity-100 hover:shadow-sm'
              }`}
            >
              <span className="opacity-60 hidden sm:block">{icon}</span>
              <div>
                <p className="text-xl sm:text-2xl font-bold leading-none">{key === 'total' ? fields.length : counts[key] || 0}</p>
                <p className="text-[11px] sm:text-xs mt-0.5 opacity-70">{label}</p>
              </div>
            </button>
          ))}
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">
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
    </Layout>
  )
}
