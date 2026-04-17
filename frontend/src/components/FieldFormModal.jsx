import { useState } from 'react'

export default function FieldFormModal({ field, agents, onSave, onClose }) {
  const [form, setForm] = useState({
    name:         field?.name         ?? '',
    crop:         field?.crop         ?? '',
    plantingDate: field?.plantingDate ?? '',
    assignedTo:   field?.assignedTo   ?? '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  const input = 'bg-[#f4f6f3] border border-transparent rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]/40 focus:border-[#3d6b35] transition w-full'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl">

        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{field ? 'Edit Field' : 'New Field'}</h3>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition cursor-pointer p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Field Name</label>
            <input className={input} required placeholder="e.g. North Field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Crop Type</label>
            <input className={input} required placeholder="e.g. Maize" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Planting Date</label>
            <input type="date" className={input} required value={form.plantingDate} onChange={(e) => setForm({ ...form, plantingDate: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Assign to Agent</label>
            <select className={input} value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
              <option value="">Unassigned</option>
              {agents.map((a) => <option key={a.id} value={a.id}>{a.username}</option>)}
            </select>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer font-medium">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 text-sm bg-[#3d6b35] text-white rounded-xl hover:bg-[#2f5429] transition cursor-pointer font-semibold">{field ? 'Save Changes' : 'Create Field'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
