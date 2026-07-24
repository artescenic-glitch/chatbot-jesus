/**
 * ============================================================
 *  Acceso a la base de datos (Supabase).
 *  - bot_sessions: guarda en que paso va cada conversacion
 *    (Vercel es "sin memoria", por eso el estado va aqui).
 *  - inscripciones: guarda cada registro completado.
 * ============================================================
 */

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Devuelve { step, data } o null si no hay conversacion en curso
async function getSession(from) {
  const { data, error } = await supabase
    .from("bot_sessions")
    .select("step, data")
    .eq("wa_from", from)
    .maybeSingle();
  if (error) console.error("getSession error:", error.message);
  return data;
}

// Crea o actualiza el paso actual de una conversacion
async function saveSession(from, step, dataObj) {
  const { error } = await supabase.from("bot_sessions").upsert({
    wa_from: from,
    step,
    data: dataObj,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("saveSession error:", error.message);
}

// Borra la conversacion (al terminar la inscripcion)
async function clearSession(from) {
  const { error } = await supabase
    .from("bot_sessions")
    .delete()
    .eq("wa_from", from);
  if (error) console.error("clearSession error:", error.message);
}

// Guarda una inscripcion completada
async function addInscripcion(row) {
  const { error } = await supabase.from("inscripciones").insert(row);
  if (error) console.error("addInscripcion error:", error.message);
}

// Lee todas las inscripciones (para el panel)
async function getInscripciones() {
  const { data, error } = await supabase
    .from("inscripciones")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error("getInscripciones error:", error.message);
  return data || [];
}

module.exports = {
  getSession,
  saveSession,
  clearSession,
  addInscripcion,
  getInscripciones,
};
