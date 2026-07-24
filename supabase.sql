-- ============================================================
--  TABLAS DEL BOT  (pegar en Supabase -> SQL Editor -> Run)
-- ============================================================

-- Inscripciones completadas
create table if not exists inscripciones (
  id          uuid primary key default gen_random_uuid(),
  nombre      text,
  edad        text,
  telefono    text,
  rol         text,
  experiencia text,
  horario     text,
  wa_from     text,           -- numero de WhatsApp desde el que escribio
  created_at  timestamptz default now()
);

-- Estado de las conversaciones en curso (memoria del bot)
create table if not exists bot_sessions (
  wa_from     text primary key,
  step        text,
  data        jsonb default '{}'::jsonb,
  updated_at  timestamptz default now()
);
