const users = require('../models/userModel')

const getUsers  = (req, res) => res.json(users.getAll())
const getAgents = (req, res) => res.json(users.getAgents())

const createUser = (req, res) => {
  const { username, password, role } = req.body
  if (!username || !password) return res.status(400).json({ message: 'username and password required' })
  res.status(201).json(users.create({ username, password, role }))
}

module.exports = { getUsers, getAgents, createUser }
