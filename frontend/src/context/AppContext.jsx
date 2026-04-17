import { createContext, useContext, useState } from 'react'
import { computeStatus } from '../utils/fieldStatus'
import { USERS } from '../data/users'

const INITIAL_FIELDS = [
  { id: 1, name: 'Field A', crop: 'Maize',  plantingDate: '2025-01-10', stage: 'Growing',  assignedTo: 'u2', stageHistory: [{ stage: 'Planted', date: '2025-01-10T00:00:00.000Z' }, { stage: 'Growing', date: '2025-02-01T00:00:00.000Z' }], notes: [], updatedAt: new Date().toISOString() },
  { id: 2, name: 'Field B', crop: 'Wheat',  plantingDate: '2025-02-14', stage: 'Planted',  assignedTo: 'u3', stageHistory: [{ stage: 'Planted', date: '2025-02-14T00:00:00.000Z' }], notes: [], updatedAt: new Date().toISOString() },
  { id: 3, name: 'Field C', crop: 'Beans',  plantingDate: '2024-12-01', stage: 'Ready',    assignedTo: 'u2', stageHistory: [{ stage: 'Planted', date: '2024-12-01T00:00:00.000Z' }, { stage: 'Growing', date: '2025-01-15T00:00:00.000Z' }, { stage: 'Ready', date: '2025-03-10T00:00:00.000Z' }], notes: [], updatedAt: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 4, name: 'Field D', crop: 'Sorghum', plantingDate: '2025-03-01', stage: 'Planted', assignedTo: 'u4', stageHistory: [{ stage: 'Planted', date: '2025-03-01T00:00:00.000Z' }], notes: [], updatedAt: new Date().toISOString() },
]

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [fields, setFields] = useState(INITIAL_FIELDS)
  const agents = USERS.filter((u) => u.role === 'agent')

  const fieldsWithStatus = fields.map((f) => ({ ...f, status: computeStatus(f) }))

  const updateStage = (id, stage) =>
    setFields((prev) => prev.map((f) =>
      f.id === id ? { ...f, stage, stageHistory: [...f.stageHistory, { stage, date: new Date().toISOString() }], updatedAt: new Date().toISOString() } : f
    ))

  const addNote = (id, text) =>
    setFields((prev) => prev.map((f) =>
      f.id === id ? { ...f, notes: [...f.notes, { text, createdAt: new Date().toISOString() }], updatedAt: new Date().toISOString() } : f
    ))

  const createField = (data) =>
    setFields((prev) => [...prev, {
      ...data,
      id: Date.now(),
      stage: 'Planted',
      stageHistory: [{ stage: 'Planted', date: new Date().toISOString() }],
      notes: [],
      updatedAt: new Date().toISOString(),
    }])

  const updateField = (id, data) =>
    setFields((prev) => prev.map((f) => f.id === id ? { ...f, ...data } : f))

  const deleteField = (id) =>
    setFields((prev) => prev.filter((f) => f.id !== id))

  const assignField = (id, agentId) =>
    setFields((prev) => prev.map((f) => f.id === id ? { ...f, assignedTo: agentId } : f))

  return (
    <AppContext.Provider value={{ fields: fieldsWithStatus, agents, updateStage, addNote, createField, updateField, deleteField, assignField }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
