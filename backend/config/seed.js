require('dotenv').config()
const pool   = require('./db')
const bcrypt = require('bcryptjs')
const fs     = require('fs')
const path   = require('path')

async function seed() {
  // Drop and recreate tables cleanly
  await pool.query(`
    DROP TABLE IF EXISTS field_notes, stage_history, fields, users CASCADE;
  `)
  console.log('✓ Old tables dropped')

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(schema)
  console.log('✓ Tables created with UUID ids')

  // Users
  const users = [
    { username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
    { username: 'john',  password: bcrypt.hashSync('pass123',  10), role: 'agent' },
    { username: 'mary',  password: bcrypt.hashSync('pass123',  10), role: 'agent' },
    { username: 'james', password: bcrypt.hashSync('pass123',  10), role: 'agent' },
  ]

  const userIds = {}
  for (const u of users) {
    const { rows } = await pool.query(
      `INSERT INTO users (username, password, role) VALUES ($1,$2,$3) RETURNING id, username`,
      [u.username, u.password, u.role]
    )
    userIds[u.username] = rows[0].id
  }
  console.log('✓ Users seeded')

  // Fields
  const fields = [
    { name: 'Field A', crop: 'Maize',   planting_date: '2025-01-10', stage: 'Growing',  assigned_to: userIds['john'],  updated_at: new Date(),
      history: [{ stage: 'Planted', date: '2025-01-10' }, { stage: 'Growing', date: '2025-02-01' }] },
    { name: 'Field B', crop: 'Wheat',   planting_date: '2025-02-14', stage: 'Planted',  assigned_to: userIds['mary'],  updated_at: new Date(),
      history: [{ stage: 'Planted', date: '2025-02-14' }] },
    { name: 'Field C', crop: 'Beans',   planting_date: '2024-12-01', stage: 'Ready',    assigned_to: userIds['john'],  updated_at: new Date(Date.now() - 9 * 86400000),
      history: [{ stage: 'Planted', date: '2024-12-01' }, { stage: 'Growing', date: '2025-01-15' }, { stage: 'Ready', date: '2025-03-10' }] },
    { name: 'Field D', crop: 'Sorghum', planting_date: '2025-03-01', stage: 'Planted',  assigned_to: userIds['james'], updated_at: new Date(),
      history: [{ stage: 'Planted', date: '2025-03-01' }] },
  ]

  for (const f of fields) {
    const { rows } = await pool.query(
      `INSERT INTO fields (name, crop, planting_date, stage, assigned_to, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [f.name, f.crop, f.planting_date, f.stage, f.assigned_to, f.updated_at]
    )
    const fieldId = rows[0].id
    for (const h of f.history) {
      await pool.query(
        `INSERT INTO stage_history (field_id, stage, date) VALUES ($1,$2,$3)`,
        [fieldId, h.stage, h.date]
      )
    }
  }
  console.log('✓ Fields seeded')

  await pool.end()
  console.log('✓ Done')
}

seed().catch((err) => { console.error(err); process.exit(1) })
