const STATUS_CONFIG = {
  Active:    { pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  'At Risk': { pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       dot: 'bg-amber-500'  },
  Completed: { pill: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',         dot: 'bg-gray-400'   },
}

const ALL_STAGES = ['Planted', 'Growing', 'Ready', 'Harvested']

const STAGE_CONFIG = {
  Planted:   { bg: 'bg-sky-500',     ring: 'ring-sky-200',     text: 'text-sky-600',     bar: 'bg-sky-500'     },
  Growing:   { bg: 'bg-emerald-500', ring: 'ring-emerald-200', text: 'text-emerald-600', bar: 'bg-emerald-500' },
  Ready:     { bg: 'bg-amber-400',   ring: 'ring-amber-200',   text: 'text-amber-600',   bar: 'bg-amber-400'   },
  Harvested: { bg: 'bg-gray-400',    ring: 'ring-gray-200',    text: 'text-gray-500',    bar: 'bg-gray-400'    },
}

export default function FieldDetailModal({ field, onEdit, onClose }) {
  const { pill, dot } = STATUS_CONFIG[field.status]
  const reachedStages = new Set(field.stageHistory.map((e) => e.stage))
  const currentIdx = ALL_STAGES.indexOf(field.stage)
  const stageDate = Object.fromEntries(field.stageHistory.map((e) => [e.stage, e.date]))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] flex flex-col">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{field.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {field.crop} · Planted {new Date(field.plantingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
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

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">

          {/* Stage Stepper */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Stage Progress</p>
            <div className="relative flex items-start justify-between">
              {/* connector line */}
              <div className="absolute top-4 left-0 right-0 h-px bg-gray-100 z-0" />
              <div
                className={`absolute top-4 left-0 h-px z-0 transition-all duration-500 ${STAGE_CONFIG[field.stage].bar}`}
                style={{ width: `${(currentIdx / (ALL_STAGES.length - 1)) * 100}%` }}
              />

              {ALL_STAGES.map((stage, i) => {
                const reached = reachedStages.has(stage)
                const isCurrent = stage === field.stage
                const cfg = STAGE_CONFIG[stage]
                return (
                  <div key={stage} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 transition-all ${
                      reached
                        ? `${cfg.bg} ring-white shadow-sm`
                        : 'bg-gray-100 ring-white'
                    } ${isCurrent ? `ring-2 ${cfg.ring} shadow-md` : ''}`}>
                      {reached ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`text-xs font-semibold ${reached ? cfg.text : 'text-gray-300'}`}>{stage}</span>
                      {stageDate[stage] && (
                        <span className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(stageDate[stage]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Observations */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Observations {field.notes.length > 0 && <span className="normal-case font-normal text-gray-400">({field.notes.length})</span>}
            </p>
            {field.notes.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p className="text-xs text-gray-300">No observations recorded yet</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {field.notes.map((n, i) => (
                  <li key={i} className="group relative bg-[#f4f6f3] hover:bg-[#eef1ec] rounded-xl px-4 py-3 transition">
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-[#3d6b35]/20 rounded-full ml-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">{n.text}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      {new Date(n.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => { onClose(); onEdit(field) }}
            className="w-full text-sm font-semibold bg-[#3d6b35] text-white rounded-xl py-3 hover:bg-[#2f5429] active:scale-[0.98] transition cursor-pointer"
          >
            Update Field
          </button>
        </div>
      </div>
    </div>
  )
}
