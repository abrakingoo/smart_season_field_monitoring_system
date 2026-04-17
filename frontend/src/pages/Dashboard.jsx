import { useState } from 'react'
import Layout from '../components/Layout'
import FieldCard from '../components/FieldCard'
import StageUpdateModal from '../components/StageUpdateModal'
import FieldDetailModal from '../components/FieldDetailModal'
import { useFields } from '../hooks/useFields'

const STATS = [
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
  const { fields, updateStage, addNote } = useFields()
  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)

  const counts = fields.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1
    return acc
  }, {})

  const liveField = (f) => fields.find((x) => x.id === f.id) || f

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Page title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fields Overview</h2>
          <p className="text-sm text-gray-400 mt-1">Track and manage all your crop fields this season</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {STATS.map(({ key, label, icon, style }) => (
            <div key={key} className={`rounded-2xl border px-5 py-4 flex items-center gap-4 ${style}`}>
              <span className="opacity-60">{icon}</span>
              <div>
                <p className="text-2xl font-bold leading-none">{counts[key] || 0}</p>
                <p className="text-xs mt-0.5 opacity-70">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fields grid */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-4">All Fields ({fields.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onView={setViewing}
                onEdit={setEditing}
              />
            ))}
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
          onUpdateStage={(id, stage) => {
            updateStage(id, stage)
            setEditing((prev) => ({ ...prev, stage, stageHistory: [...prev.stageHistory, { stage, date: new Date().toISOString() }] }))
          }}
          onAddNote={(id, text) => {
            addNote(id, text)
            setEditing((prev) => ({ ...prev, notes: [...prev.notes, { text, createdAt: new Date().toISOString() }] }))
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </Layout>
  )
}
