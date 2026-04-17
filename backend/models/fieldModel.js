const STAGES = ['Planted', 'Growing', 'Ready', 'Harvested']
const RISK_KEYWORDS = ['pest', 'disease', 'drought', 'flood', 'damage', 'wilt', 'rot']
const STALE_DAYS = 7

function computeStatus(field) {
  if (field.stage === 'Harvested') return 'Completed'
  const stale = (Date.now() - new Date(field.updatedAt)) / 86400000 > STALE_DAYS
  const hasRisk = field.notes.some((n) => RISK_KEYWORDS.some((kw) => n.text.toLowerCase().includes(kw)))
  return stale || hasRisk ? 'At Risk' : 'Active'
}

let fields = [
  { id: 1, name: 'Field A', crop: 'Maize',   plantingDate: '2025-01-10', stage: 'Growing',  assignedTo: 'u2', stageHistory: [{ stage: 'Planted', date: '2025-01-10T00:00:00.000Z' }, { stage: 'Growing', date: '2025-02-01T00:00:00.000Z' }], notes: [], updatedAt: new Date().toISOString() },
  { id: 2, name: 'Field B', crop: 'Wheat',   plantingDate: '2025-02-14', stage: 'Planted',  assignedTo: 'u3', stageHistory: [{ stage: 'Planted', date: '2025-02-14T00:00:00.000Z' }], notes: [], updatedAt: new Date().toISOString() },
  { id: 3, name: 'Field C', crop: 'Beans',   plantingDate: '2024-12-01', stage: 'Ready',    assignedTo: 'u2', stageHistory: [{ stage: 'Planted', date: '2024-12-01T00:00:00.000Z' }, { stage: 'Growing', date: '2025-01-15T00:00:00.000Z' }, { stage: 'Ready', date: '2025-03-10T00:00:00.000Z' }], notes: [], updatedAt: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 4, name: 'Field D', crop: 'Sorghum', plantingDate: '2025-03-01', stage: 'Planted',  assignedTo: 'u4', stageHistory: [{ stage: 'Planted', date: '2025-03-01T00:00:00.000Z' }], notes: [], updatedAt: new Date().toISOString() },
]

const withStatus  = (f)  => ({ ...f, status: computeStatus(f) })
const getAll      = ()   => fields.map(withStatus)
const getById     = (id) => { const f = fields.find((f) => f.id === Number(id)); return f ? withStatus(f) : null }
const getByAgent  = (uid)=> fields.filter((f) => f.assignedTo === uid).map(withStatus)

const create = ({ name, crop, plantingDate, assignedTo }) => {
  const field = {
    id: Date.now(), name, crop, plantingDate, assignedTo: assignedTo || null,
    stage: 'Planted',
    stageHistory: [{ stage: 'Planted', date: new Date().toISOString() }],
    notes: [],
    updatedAt: new Date().toISOString(),
  }
  fields.push(field)
  return withStatus(field)
}

const update = (id, data) => {
  const idx = fields.findIndex((f) => f.id === Number(id))
  if (idx === -1) return null
  fields[idx] = { ...fields[idx], ...data, updatedAt: new Date().toISOString() }
  return withStatus(fields[idx])
}

const updateStage = (id, stage) => {
  if (!STAGES.includes(stage)) return null
  const idx = fields.findIndex((f) => f.id === Number(id))
  if (idx === -1) return null
  fields[idx] = {
    ...fields[idx], stage,
    stageHistory: [...fields[idx].stageHistory, { stage, date: new Date().toISOString() }],
    updatedAt: new Date().toISOString(),
  }
  return withStatus(fields[idx])
}

const addNote = (id, text) => {
  const idx = fields.findIndex((f) => f.id === Number(id))
  if (idx === -1) return null
  fields[idx] = {
    ...fields[idx],
    notes: [...fields[idx].notes, { text, createdAt: new Date().toISOString() }],
    updatedAt: new Date().toISOString(),
  }
  return withStatus(fields[idx])
}

const assign = (id, agentId) => update(id, { assignedTo: agentId })
const remove  = (id) => { const exists = getById(id); fields = fields.filter((f) => f.id !== Number(id)); return !!exists }

module.exports = { getAll, getById, getByAgent, create, update, updateStage, addNote, assign, remove }
