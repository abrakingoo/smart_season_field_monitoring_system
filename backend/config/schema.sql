CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username  TEXT UNIQUE NOT NULL,
  password  TEXT NOT NULL,
  role      TEXT NOT NULL DEFAULT 'agent'
);

CREATE TABLE IF NOT EXISTS fields (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  crop          TEXT NOT NULL,
  planting_date DATE NOT NULL,
  stage         TEXT NOT NULL DEFAULT 'Planted',
  assigned_to   UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stage_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id   UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  stage      TEXT NOT NULL,
  date       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id   UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
