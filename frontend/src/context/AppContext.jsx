import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [fields, setFields]   = useState([])
  const [agents, setAgents]   = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFields = useCallback(async () => {
    try {
      const { data } = await api.get('/fields')
      setFields(data)
    } catch (_) {}
  }, [])

  const fetchAgents = useCallback(async () => {
    try {
      const { data } = await api.get('/users/agents')
      setAgents(data)
    } catch (_) {}
  }, [])

  const [authKey, setAuthKey] = useState(0)

  const triggerAuth = useCallback(() => setAuthKey((k) => k + 1), [])

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (!role) { setLoading(false); return }
    setLoading(true)
    const init = role === 'admin'
      ? Promise.all([fetchFields(), fetchAgents()])
      : fetchFields()
    init.finally(() => setLoading(false))
  }, [authKey, fetchFields, fetchAgents])

  const createField = async (data) => {
    const { data: field } = await api.post('/fields', data)
    setFields((prev) => [...prev, field])
  }

  const updateField = async (id, data) => {
    const { data: field } = await api.put(`/fields/${id}`, data)
    setFields((prev) => prev.map((f) => f.id === id ? field : f))
  }

  const deleteField = async (id) => {
    await api.delete(`/fields/${id}`)
    setFields((prev) => prev.filter((f) => f.id !== id))
  }

  const assignField = async (id, agentId) => {
    const { data: field } = await api.patch(`/fields/${id}/assign`, { agentId })
    setFields((prev) => prev.map((f) => f.id === id ? field : f))
  }

  const createAgent = async ({ username, password }) => {
    const { data: agent } = await api.post('/users', { username, password, role: 'agent' })
    setAgents((prev) => [...prev, agent])
  }

  const updateStage = async (id, stage) => {
    const { data: field } = await api.patch(`/fields/${id}/stage`, { stage })
    setFields((prev) => prev.map((f) => f.id === id ? field : f))
  }

  const addNote = async (id, text) => {
    const { data: field } = await api.post(`/fields/${id}/notes`, { text })
    setFields((prev) => prev.map((f) => f.id === id ? field : f))
  }

  return (
    <AppContext.Provider value={{ fields, agents, loading, createField, updateField, deleteField, assignField, updateStage, addNote, createAgent, refetch: fetchFields, triggerAuth }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
