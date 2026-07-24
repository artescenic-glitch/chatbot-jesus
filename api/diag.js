/**
 * DIAGNOSTICO TEMPORAL - se elimina despues de resolver.
 * Uso: /api/diag?key=artescenic2026
 * Pregunta a Meta que numeros puede ver el token y sus IDs reales.
 */
const TOKEN = process.env.WHATSAPP_TOKEN || "";
const WABA_ID = "1317571360447282"; // Artescenic Consultas

async function g(url) {
  try {
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return await r.json();
  } catch (e) {
    return { throw: String(e) };
  }
}

module.exports = async (req, res) => {
  if (req.query.key !== process.env.VERIFY_TOKEN) {
    return res.status(401).json({ error: "no auth" });
  }

  // 1) Info del token: a que app pertenece
  const tokenInfo = await g(
    `https://graph.facebook.com/v21.0/me?fields=id,name`
  );

  // 2) Numeros reales bajo la WABA Artescenic Consultas (con sus IDs)
  const numeros = await g(
    `https://graph.facebook.com/v21.0/${WABA_ID}/phone_numbers?fields=id,display_phone_number,verified_name`
  );

  // 3) Info del PHONE_NUMBER_ID que tenemos configurado
  const pnid = process.env.PHONE_NUMBER_ID || "";
  const numeroConfig = await g(
    `https://graph.facebook.com/v21.0/${pnid}?fields=id,display_phone_number,verified_name`
  );

  return res.status(200).json({
    token_empieza: TOKEN.slice(0, 10),
    token_largo: TOKEN.length,
    phone_number_id_configurado: pnid,
    "1_token_pertenece_a": tokenInfo,
    "2_numeros_reales_de_la_WABA": numeros,
    "3_info_del_id_configurado": numeroConfig,
  });
};
