const STATUS_CONFIG = {
  Active:    { pill: 'text-[#3a5c28]',  dot: '#5a8a3a', bg: '#e8f0e0' },
  'At Risk': { pill: 'text-[#7a4a1e]',  dot: '#b07040', bg: '#f5ede0' },
  Completed: { pill: 'text-[#5a5550]',  dot: '#8a8278', bg: '#e8e4dc' },
}

const STAGE_PROGRESS = { Planted: 1, Growing: 2, Ready: 3, Harvested: 4 }
const STAGE_BAR = {
  Planted:   '#8a7a5a',
  Growing:   '#5a8a3a',
  Ready:     '#c8a84b',
  Harvested: '#6b6560',
}

export default function FieldCard({ field, onView, onEdit }) {
  const progress = (STAGE_PROGRESS[field.stage] / 4) * 100
  const { pill, dot, bg } = STATUS_CONFIG[field.status]

  return (
    <div
      onClick={() => onView(field)}
      className="rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
      style={{ backgroundColor: '#faf8f4', border: '1px solid #e0dbd2' }}
    >
      {/* Accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: STAGE_BAR[field.stage] }} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-base leading-tight" style={{ color: '#1e3314' }}>{field.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#8a8278' }}>{field.crop}</p>
          </div>
          <span className={`shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${pill}`}
            style={{ backgroundColor: bg }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot }} />
            {field.status}
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5" style={{ color: '#8a8278' }}>
            <span className="font-medium" style={{ color: '#4a3f30' }}>{field.stage}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#e0dbd2' }}>
            <div className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: STAGE_BAR[field.stage] }} />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs" style={{ color: '#8a8278' }}>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {new Date(field.plantingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span>{field.notes.length} {field.notes.length === 1 ? 'note' : 'notes'}</span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(field) }}
          className="w-full text-xs font-medium rounded-xl py-2 transition cursor-pointer"
          style={{ border: '1px solid #5a8a3a', color: '#3a5c28', backgroundColor: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3a5c28'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#3a5c28' }}
        >
          Update Field
        </button>
      </div>
    </div>
  )
}
