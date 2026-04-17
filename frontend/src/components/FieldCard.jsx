const STATUS_CONFIG = {
  Active:     { pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',  dot: 'bg-emerald-500' },
  'At Risk':  { pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',        dot: 'bg-amber-500'   },
  Completed:  { pill: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',          dot: 'bg-gray-400'    },
}

const STAGE_PROGRESS = { Planted: 1, Growing: 2, Ready: 3, Harvested: 4 }
const STAGE_COLOR = {
  Planted:   'bg-sky-400',
  Growing:   'bg-emerald-500',
  Ready:     'bg-[#f5a623]',
  Harvested: 'bg-gray-400',
}

export default function FieldCard({ field, onView, onEdit }) {
  const progress = (STAGE_PROGRESS[field.stage] / 4) * 100
  const { pill, dot } = STATUS_CONFIG[field.status]

  return (
    <div
      onClick={() => onView(field)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Accent bar */}
      <div className={`h-1 w-full ${STAGE_COLOR[field.stage]}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-800 text-base leading-tight">{field.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{field.crop}</p>
          </div>
          <span className={`shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {field.status}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span className="font-medium text-gray-600">{field.stage}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`${STAGE_COLOR[field.stage]} h-1.5 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {new Date(field.plantingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span>{field.notes.length} {field.notes.length === 1 ? 'note' : 'notes'}</span>
        </div>
      </div>

      {/* Update button */}
      <div className="px-5 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(field) }}
          className="w-full text-xs font-medium border border-[#3d6b35] text-[#3d6b35] rounded-xl py-2 hover:bg-[#3d6b35] hover:text-white transition cursor-pointer"
        >
          Update Field
        </button>
      </div>
    </div>
  )
}
