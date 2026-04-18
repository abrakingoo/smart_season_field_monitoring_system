require('dotenv').config()
const pool   = require('./db')
const bcrypt = require('bcryptjs')
const fs     = require('fs')
const path   = require('path')

async function seed() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(schema)
  console.log('✓ Tables created')

  // Users
  const users = [
    { id: 'u1', username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
    { id: 'u2', username: 'john',  password: bcrypt.hashSync('pass123',  10), role: 'agent' },
    { id: 'u3', username: 'mary',  password: bcrypt.hashSync('pass123',  10), role: 'agent' },
    { id: 'u4', username: 'james', password: bcrypt.hashSync('pass123',  10), role: 'agent' },
  ]
  for (const u of users) {
    await pool.query(
      `INSERT INTO users (id, username, password, role) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`,
      [u.id, u.username, u.password, u.role]
    )
  }
  console.log('✓ Users seeded')

  // Fields
  const fields = [
    { name: 'Field A', crop: 'Maize',   planting_date: '2025-01-10', stage: 'Growing',  assigned_to: 'u2', updated_at: new Date() },
    { name: 'Field B', crop: 'Wheat',   planting_date: '2025-02-14', stage: 'Planted',  assigned_to: 'u3', updated_at: new Date() },
    { name: 'Field C', crop: 'Beans',   planting_date: '2024-12-01', stage: 'Ready',    assigned_to: 'u2', updated_at: new Date(Date.now() - 9 * 86400000) },
    { name: 'Field D', crop: 'Sorghum', planting_date: '2025-03-01', stage: 'Planted',  assigned_to: 'u4', updated_at: new Date() },
  ]

  const stageHistories = [
    [{ stage: 'Planted', date: '2025-01-10' }, { stage: 'Growing', date: '2025-02-01' }],
    [{ stage: 'Planted', date: '2025-02-14' }],
    [{ stage: 'Planted', date: '2024-12-01' }, { stage: 'Growing', date: '2025-01-15' }, { stage: 'Ready', date: '2025-03-10' }],
    [{ stage: 'Planted', date: '2025-03-01' }],
  ]

  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    const { rows } = await pool.query(
      `INSERT INTO fields (name, crop, planting_date, stage, assigned_to, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING RETURNING id`,
      [f.name, f.crop, f.planting_date, f.stage, f.assigned_to, f.updated_at]
    )
    if (rows.length) {
      for (const h of stageHistories[i]) {
        await pool.query(
          `INSERT INTO stage_history (field_id, stage, date) VALUES ($1,$2,$3)`,
          [rows[0].id, h.stage, h.date]
        )
      }
    }
  }
  console.log('✓ Fields seeded')
  await pool.end()
  console.log('✓ Done')
}

seed().catch((err) => { console.error(err); process.exit(1) })
