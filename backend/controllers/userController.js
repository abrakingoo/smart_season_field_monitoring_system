const users  = require('../models/userModel')
const bcrypt = require('bcryptjs')
const pool   = require('../config/db')

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

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'currentPassword and newPassword are required' })
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' })

    const user = await users.findById(req.user.id)
    if (!user || !bcrypt.compareSync(currentPassword, user.password))
      return res.status(401).json({ message: 'Current password is incorrect' })

    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [bcrypt.hashSync(newPassword, 10), req.user.id])
    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateAgent = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username) return res.status(400).json({ message: 'username is required' })
    const updates = ['username = $1']
    const values  = [username]
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
      updates.push(`password = $${values.length + 1}`)
      values.push(bcrypt.hashSync(password, 10))
    }
    values.push(req.params.id)
    const { rows } = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING id, username, role`,
      values
    )
    if (!rows.length) return res.status(404).json({ message: 'User not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getUsers, getAgents, createUser, changePassword, updateAgent }
