const pool = require('../config/db')

const RISK_KEYWORDS = ['pest', 'disease', 'drought', 'flood', 'damage', 'wilt', 'rot']
const STALE_DAYS    = 7

function computeStatus(field) {
  if (field.stage === 'Harvested') return 'Completed'
  const stale   = (Date.now() - new Date(field.updated_at)) / 86400000 > STALE_DAYS
  const hasRisk = (field.notes || []).some((n) =>
    RISK_KEYWORDS.some((kw) => n.text.toLowerCase().includes(kw))
  )
  return stale || hasRisk ? 'At Risk' : 'Active'
}

async function fetchFullField(id) {
  const { rows: fields } = await pool.query(
    `SELECT id, name, crop, planting_date AS "plantingDate", stage, assigned_to AS "assignedTo", updated_at AS "updatedAt"
     FROM fields WHERE id = $1`, [id]
  )
  if (!fields.length) return null
  const field = fields[0]

  const { rows: history } = await pool.query(
    `SELECT stage, date FROM stage_history WHERE field_id = $1 ORDER BY date ASC`, [id]
  )
  const { rows: notes } = await pool.query(
    `SELECT text, created_at AS "createdAt" FROM field_notes WHERE field_id = $1 ORDER BY created_at ASC`, [id]
  )

  return { ...field, stageHistory: history, notes, status: computeStatus({ ...field, notes }) }
}

const getAll = async () => {
  const { rows } = await pool.query(
    `SELECT id FROM fields ORDER BY id`
  )
  return Promise.all(rows.map((r) => fetchFullField(r.id)))
}

const getById = async (id) => fetchFullField(id)

const getByAgent = async (userId) => {
  const { rows } = await pool.query(
    `SELECT id FROM fields WHERE assigned_to = $1 ORDER BY id`, [userId]
  )
  return Promise.all(rows.map((r) => fetchFullField(r.id)))
}

const create = async ({ name, crop, plantingDate, assignedTo }) => {
  const { rows } = await pool.query(
    `INSERT INTO fields (name, crop, planting_date, stage, assigned_to)
     VALUES ($1,$2,$3,'Planted',$4) RETURNING id`,
    [name, crop, plantingDate, assignedTo || null]
  )
  const id = rows[0].id
  await pool.query(
    `INSERT INTO stage_history (field_id, stage) VALUES ($1, 'Planted')`, [id]
  )
  return fetchFullField(id)
}

const update = async (id, { name, crop, plantingDate, assignedTo }) => {
  await pool.query(
    `UPDATE fields SET name=$1, crop=$2, planting_date=$3, assigned_to=$4, updated_at=NOW() WHERE id=$5`,
    [name, crop, plantingDate, assignedTo || null, id]
  )
  return fetchFullField(id)
}

const updateStage = async (id, stage) => {
  const STAGES = ['Planted', 'Growing', 'Ready', 'Harvested']
  if (!STAGES.includes(stage)) return null
  await pool.query(
    `UPDATE fields SET stage=$1, updated_at=NOW() WHERE id=$2`, [stage, id]
  )
  await pool.query(
    `INSERT INTO stage_history (field_id, stage) VALUES ($1,$2)`, [id, stage]
  )
  return fetchFullField(id)
}

const addNote = async (id, text) => {
  await pool.query(
    `INSERT INTO field_notes (field_id, text) VALUES ($1,$2)`, [id, text]
  )
  await pool.query(`UPDATE fields SET updated_at=NOW() WHERE id=$1`, [id])
  return fetchFullField(id)
}

const assign = async (id, agentId) => {
  await pool.query(
    `UPDATE fields SET assigned_to=$1, updated_at=NOW() WHERE id=$2`, [agentId || null, id]
  )
  return fetchFullField(id)
}

const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM fields WHERE id=$1', [id])
  return rowCount > 0
}

module.exports = { getAll, getById, getByAgent, create, update, updateStage, addNote, assign, remove }
