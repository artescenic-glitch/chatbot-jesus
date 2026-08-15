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

// Una conversacion parada mas de estas horas se da por terminada.
// Sobre todo importa para el modo "humano": si nadie contesto desde el
// CRM, al dia siguiente el bot vuelve a atender en vez de quedarse mudo.
const HORAS_DE_VIDA = 12;

// Devuelve { step, data } o null si no hay conversacion en curso
async function getSession(from) {
  const { data, error } = await supabase
    .from("bot_sessions")
    .select("step, data, updated_at")
    .eq("wa_from", from)
    .maybeSingle();
  if (error) console.error("getSession error:", error.message);
  if (!data) return null;

  const edadMs = Date.now() - new Date(data.updated_at).getTime();
  if (data.updated_at && edadMs > HORAS_DE_VIDA * 3600 * 1000) {
    await clearSession(from);
    return null;
  }
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
