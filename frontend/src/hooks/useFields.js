import { useApp } from '../context/AppContext'

export function useFields() {
  const { fields, updateStage, addNote } = useApp()
  return { fields, updateStage, addNote }
}
