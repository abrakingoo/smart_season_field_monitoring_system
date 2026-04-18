const bcrypt = require('bcryptjs')

const users = [
  { id: 'u1', username: 'admin', password: '$2b$10$tID1iJMbLgIPB.yG3Fzxj.DcUe1jF8KR/fALQJr5RXJJ/dkPyP2Ly', role: 'admin' },
  { id: 'u2', username: 'john',  password: '$2b$10$O82.ZDE.HGb7IY0BPHW5HuzoYCdQw8Yqp5/uznTX8GOr9n8QQdVWO', role: 'agent' },
  { id: 'u3', username: 'mary',  password: '$2b$10$O82.ZDE.HGb7IY0BPHW5HuzoYCdQw8Yqp5/uznTX8GOr9n8QQdVWO', role: 'agent' },
  { id: 'u4', username: 'james', password: '$2b$10$O82.ZDE.HGb7IY0BPHW5HuzoYCdQw8Yqp5/uznTX8GOr9n8QQdVWO', role: 'agent' },
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
