/**
 * DIAGNOSTICO TEMPORAL - se elimina despues de resolver.
 * Uso: /api/diag?key=artescenic2026&to=59178252871
 * Muestra el error exacto que devuelve la WhatsApp API.
 */
const { sendText } = require("../lib/wa");

module.exports = async (req, res) => {
  if (req.query.key !== process.env.VERIFY_TOKEN) {
    return res.status(401).json({ error: "no auth" });
  }
  const to = req.query.to;
  let result = null;
  try {
    result = await sendText(to, "✅ Prueba de diagnóstico del bot de Artescenic.");
  } catch (e) {
    result = { throw: String(e) };
  }
  const tok = process.env.WHATSAPP_TOKEN || "";
  return res.status(200).json({
    phone_number_id: process.env.PHONE_NUMBER_ID || "(vacío)",
    supabase_url: process.env.SUPABASE_URL || "(vacío)",
    token_presente: !!tok,
    token_largo: tok.length,
    token_empieza: tok.slice(0, 8),
    respuesta_whatsapp: result,
  });
};
