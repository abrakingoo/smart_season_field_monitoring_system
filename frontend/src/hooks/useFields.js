import { useState } from 'react'
import { computeStatus } from '../utils/fieldStatus'

const INITIAL_FIELDS = [
  { id: 1, name: 'Field A', crop: 'Maize', plantingDate: '2025-01-10', stage: 'Growing', stageHistory: [{ stage: 'Planted', date: '2025-01-10T00:00:00.000Z' }, { stage: 'Growing', date: '2025-02-01T00:00:00.000Z' }], notes: [], updatedAt: new Date().toISOString() },
  { id: 2, name: 'Field B', crop: 'Wheat', plantingDate: '2025-02-14', stage: 'Planted', stageHistory: [{ stage: 'Planted', date: '2025-02-14T00:00:00.000Z' }], notes: [], updatedAt: new Date().toISOString() },
  { id: 3, name: 'Field C', crop: 'Beans', plantingDate: '2024-12-01', stage: 'Ready',  stageHistory: [{ stage: 'Planted', date: '2024-12-01T00:00:00.000Z' }, { stage: 'Growing', date: '2025-01-15T00:00:00.000Z' }, { stage: 'Ready', date: '2025-03-10T00:00:00.000Z' }], notes: [], updatedAt: new Date(Date.now() - 9 * 86400000).toISOString() },
]

export function useFields() {
  const [fields, setFields] = useState(INITIAL_FIELDS)

  const updateStage = (id, stage) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, stage, stageHistory: [...f.stageHistory, { stage, date: new Date().toISOString() }], updatedAt: new Date().toISOString() }
          : f
      )
    )
  }

  const addNote = (id, text) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, notes: [...f.notes, { text, createdAt: new Date().toISOString() }], updatedAt: new Date().toISOString() }
          : f
      )
    )
  }

  const fieldsWithStatus = fields.map((f) => ({ ...f, status: computeStatus(f) }))

  return { fields: fieldsWithStatus, updateStage, addNote }
}
