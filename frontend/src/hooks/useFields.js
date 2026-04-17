import { useApp } from '../context/AppContext'

export function useFields() {
  const { fields, updateStage, addNote } = useApp()
  const userId = localStorage.getItem('userId')
  const agentFields = fields.filter((f) => f.assignedTo === userId)
  return { fields: agentFields, updateStage, addNote }
}
