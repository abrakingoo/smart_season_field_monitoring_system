CREATE TABLE IF NOT EXISTS users (
  id        TEXT PRIMARY KEY,
  username  TEXT UNIQUE NOT NULL,
  password  TEXT NOT NULL,
  role      TEXT NOT NULL DEFAULT 'agent'
);

CREATE TABLE IF NOT EXISTS fields (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  crop          TEXT NOT NULL,
  planting_date DATE NOT NULL,
  stage         TEXT NOT NULL DEFAULT 'Planted',
  assigned_to   TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stage_history (
  id         SERIAL PRIMARY KEY,
  field_id   INTEGER NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  stage      TEXT NOT NULL,
  date       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_notes (
  id         SERIAL PRIMARY KEY,
  field_id   INTEGER NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
