const pool   = require('../config/db')
const bcrypt = require('bcryptjs')

const findByUsername = async (username) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username])
  return rows[0] || null
}

const findById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return rows[0] || null
}

const getAgents = async () => {
  const { rows } = await pool.query(`SELECT id, username, role FROM users WHERE role = 'agent'`)
  return rows
}

const getAll = async () => {
  const { rows } = await pool.query('SELECT id, username, role FROM users')
  return rows
}

const create = async ({ username, password, role = 'agent' }) => {
  const hash = bcrypt.hashSync(password, 10)
  const { rows } = await pool.query(
    `INSERT INTO users (username, password, role) VALUES ($1,$2,$3) RETURNING id, username, role`,
    [username, hash, role]
  )
  return rows[0]
}

module.exports = { findByUsername, findById, getAgents, getAll, create }
