const fields = require('../models/fieldModel')

const getFields = (req, res) => {
  const data = req.user.role === 'admin'
    ? fields.getAll()
    : fields.getByAgent(req.user.id)
  res.json(data)
}

const getField = (req, res) => {
  const field = fields.getById(req.params.id)
  if (!field) return res.status(404).json({ message: 'Field not found' })
  if (req.user.role === 'agent' && field.assignedTo !== req.user.id)
    return res.status(403).json({ message: 'Access denied' })
  res.json(field)
}

const createField = (req, res) => {
  const { name, crop, plantingDate, assignedTo } = req.body
  if (!name || !crop || !plantingDate) return res.status(400).json({ message: 'name, crop and plantingDate are required' })
  res.status(201).json(fields.create({ name, crop, plantingDate, assignedTo }))
}

const updateField = (req, res) => {
  const { name, crop, plantingDate, assignedTo } = req.body
  const field = fields.update(req.params.id, { name, crop, plantingDate, assignedTo })
  if (!field) return res.status(404).json({ message: 'Field not found' })
  res.json(field)
}

const deleteField = (req, res) => {
  if (!fields.remove(req.params.id)) return res.status(404).json({ message: 'Field not found' })
  res.status(204).send()
}

const updateStage = (req, res) => {
  const { stage } = req.body
  if (!stage) return res.status(400).json({ message: 'stage is required' })
  const field = fields.updateStage(req.params.id, stage)
  if (!field) return res.status(400).json({ message: 'Invalid field or stage' })
  res.json(field)
}

const addNote = (req, res) => {
  const { text } = req.body
  if (!text?.trim()) return res.status(400).json({ message: 'text is required' })
  const field = fields.addNote(req.params.id, text.trim())
  if (!field) return res.status(404).json({ message: 'Field not found' })
  res.json(field)
}

const assignField = (req, res) => {
  const { agentId } = req.body
  const field = fields.assign(req.params.id, agentId)
  if (!field) return res.status(404).json({ message: 'Field not found' })
  res.json(field)
}

module.exports = { getFields, getField, createField, updateField, deleteField, updateStage, addNote, assignField }
