const fields = require('../models/fieldModel')

const getFields = async (req, res) => {
  try {
    const data = req.user.role === 'admin'
      ? await fields.getAll()
      : await fields.getByAgent(req.user.id)
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getField = async (req, res) => {
  try {
    const field = await fields.getById(req.params.id)
    if (!field) return res.status(404).json({ message: 'Field not found' })
    if (req.user.role === 'agent' && field.assignedTo !== req.user.id)
      return res.status(403).json({ message: 'Access denied' })
    res.json(field)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createField = async (req, res) => {
  try {
    const { name, crop, plantingDate, assignedTo } = req.body
    if (!name || !crop || !plantingDate)
      return res.status(400).json({ message: 'name, crop and plantingDate are required' })
    res.status(201).json(await fields.create({ name, crop, plantingDate, assignedTo }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateField = async (req, res) => {
  try {
    const { name, crop, plantingDate, assignedTo } = req.body
    const field = await fields.update(req.params.id, { name, crop, plantingDate, assignedTo })
    if (!field) return res.status(404).json({ message: 'Field not found' })
    res.json(field)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteField = async (req, res) => {
  try {
    if (!await fields.remove(req.params.id))
      return res.status(404).json({ message: 'Field not found' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateStage = async (req, res) => {
  try {
    const { stage } = req.body
    if (!stage) return res.status(400).json({ message: 'stage is required' })
    const field = await fields.updateStage(req.params.id, stage)
    if (!field) return res.status(400).json({ message: 'Invalid field or stage' })
    res.json(field)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const addNote = async (req, res) => {
  try {
    const { text } = req.body
    if (!text?.trim()) return res.status(400).json({ message: 'text is required' })
    const field = await fields.addNote(req.params.id, text.trim())
    if (!field) return res.status(404).json({ message: 'Field not found' })
    res.json(field)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const assignField = async (req, res) => {
  try {
    const { agentId } = req.body
    const field = await fields.assign(req.params.id, agentId)
    if (!field) return res.status(404).json({ message: 'Field not found' })
    res.json(field)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getFields, getField, createField, updateField, deleteField, updateStage, addNote, assignField }
