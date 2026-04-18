const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const users  = require('../models/userModel')

const login = (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' })

    const user = users.findByUsername(username)
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: 'Invalid credentials' })

    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: 'JWT_SECRET is not configured on the server' })

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Internal server error', detail: err.message })
  }
}

module.exports = { login }
