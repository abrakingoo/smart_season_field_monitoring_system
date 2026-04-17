import { useState } from 'react'

const STAGES = ['Planted', 'Growing', 'Ready', 'Harvested']
const STAGE_COLORS = {
  Planted:   { active: 'bg-sky-400 border-sky-400',         inactive: 'border-gray-100' },
  Growing:   { active: 'bg-emerald-500 border-emerald-500', inactive: 'border-gray-100' },
  Ready:     { active: 'bg-[#f5a623] border-[#f5a623]',     inactive: 'border-gray-100' },
  Harvested: { active: 'bg-gray-400 border-gray-400',       inactive: 'border-gray-100' },
}

const STATUS_CONFIG = {
  Active:    { pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  'At Risk': { pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       dot: 'bg-amber-500'  },
  Completed: { pill: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',         dot: 'bg-gray-400'   },
}

export default function StageUpdateModal({ field, onUpdateStage, onAddNote, onClose }) {
  const [stage, setStage] = useState(field.stage)
  const [note, setNote] = useState('')
  const { pill, dot } = STATUS_CONFIG[field.status]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (stage !== field.stage) onUpdateStage(field.id, stage)
    if (note.trim()) onAddNote(field.id, note.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">{field.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{field.crop} · Planted {new Date(field.plantingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {field.status}
            </span>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition cursor-pointer p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">

          {/* Stage selector */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block mb-3">Stage</label>
            <div className="grid grid-cols-4 gap-2">
              {STAGES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStage(s)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition cursor-pointer ${
                    stage === s
                      ? `text-white border-transparent shadow-sm ${STAGE_COLORS[s].active}`
                      : `bg-gray-50 text-gray-500 ${STAGE_COLORS[s].inactive} hover:border-[#3d6b35]/40`
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${stage === s ? 'bg-white/70' : STAGE_COLORS[s].active.split(' ')[0]}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block mb-2">Add Observation</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Signs of pest activity on north side..."
              rows={3}
              className="w-full bg-[#f4f6f3] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]/40 focus:border-[#3d6b35] transition resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm bg-[#3d6b35] text-white rounded-xl hover:bg-[#2f5429] active:scale-[0.98] transition cursor-pointer font-semibold shadow-sm shadow-[#3d6b35]/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
