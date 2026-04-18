const users = require('../models/userModel')

const getUsers  = async (req, res) => {
  try { res.json(await users.getAll()) }
  catch (err) { res.status(500).json({ message: err.message }) }
}

const getAgents = async (req, res) => {
  try { res.json(await users.getAgents()) }
  catch (err) { res.status(500).json({ message: err.message }) }
}

const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body
    if (!username || !password)
      return res.status(400).json({ message: 'username and password required' })
    res.status(201).json(await users.create({ username, password, role }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getUsers, getAgents, createUser }
