const bcrypt = require('bcryptjs')

const users = [
  { id: 'u1', username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
  { id: 'u2', username: 'john',  password: bcrypt.hashSync('pass123',  10), role: 'agent' },
  { id: 'u3', username: 'mary',  password: bcrypt.hashSync('pass123',  10), role: 'agent' },
  { id: 'u4', username: 'james', password: bcrypt.hashSync('pass123',  10), role: 'agent' },
]

const findByUsername = (username) => users.find((u) => u.username === username)
const findById       = (id)       => users.find((u) => u.id === id)
const getAgents      = ()         => users.filter((u) => u.role === 'agent').map(({ password, ...u }) => u)
const getAll         = ()         => users.map(({ password, ...u }) => u)

const create = ({ username, password, role = 'agent' }) => {
  const user = { id: `u${Date.now()}`, username, password: bcrypt.hashSync(password, 10), role }
  users.push(user)
  const { password: _, ...safe } = user
  return safe
}

module.exports = { findByUsername, findById, getAgents, getAll, create }
