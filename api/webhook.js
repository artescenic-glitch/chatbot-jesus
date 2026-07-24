/**
 * ============================================================
 *  WEBHOOK de WhatsApp  ->  https://TU-APP.vercel.app/api/webhook
 *
 *  - GET  : Meta verifica el webhook (usa VERIFY_TOKEN).
 *  - POST : llegan los mensajes de los usuarios.
 *
 *  El estado de cada conversacion se guarda en Supabase
 *  (bot_sessions) porque Vercel no mantiene memoria entre
 *  mensajes.
 * ============================================================
 */

const { sendText, sendButtons, sendList } = require("../lib/wa");
const {
  getSession,
  saveSession,
  clearSession,
  addInscripcion,
} = require("../lib/db");
const C = require("../contenido");

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

module.exports = async (req, res) => {
  // ---------- Verificacion del webhook (GET) ----------
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Token de verificación incorrecto");
  }

  // ---------- Mensajes entrantes (POST) ----------
  if (req.method === "POST") {
    try {
      const value = req.body?.entry?.[0]?.changes?.[0]?.value;
      const msg = value?.messages?.[0];
      if (msg) {
        const from = msg.from;
        const text = msg.text?.body;
        const replyId =
          msg.interactive?.button_reply?.id ||
          msg.interactive?.list_reply?.id ||
          null;
        await handleMessage(from, text, replyId);
      }
    } catch (e) {
      console.error("Error procesando webhook:", e);
    }
    // Siempre respondemos 200 para que Meta no reintente ni desactive el webhook.
    return res.status(200).send("OK");
  }

  return res.status(200).send("Bot de Artescenic activo 🎭");
};

// ============================================================
//  LOGICA DEL BOT
// ============================================================
async function handleMessage(from, text, replyId) {
  const input = (replyId || text || "").trim();
  const low = input.toLowerCase();

  const session = await getSession(from);
  const step = session?.step;
  const data = session?.data || {};

  // ----- Flujo de inscripcion (tiene prioridad) -----
  if (step === "nombre") {
    data.nombre = input;
    await saveSession(from, "edad", data);
    return sendText(from, C.pedirEdad);
  }
  if (step === "edad") {
    data.edad = input;
    await saveSession(from, "telefono", data);
    return sendText(from, C.pedirTelefono);
  }
  if (step === "telefono") {
    data.telefono = input;
    await saveSession(from, "rol", data);
    return sendList(from, C.pedirRolTexto, "Ver áreas", C.roles);
  }
  if (step === "rol") {
    data.rol = C.rolesLabels[input] || input;
    await saveSession(from, "experiencia", data);
    return sendButtons(from, C.pedirExperiencia, [
      { id: "exp_si", title: "Sí" },
      { id: "exp_no", title: "No" },
    ]);
  }
  if (step === "experiencia") {
    data.experiencia =
      input === "exp_si" || /^s[ií]/.test(low) ? "Sí" : "No";
    await saveSession(from, "horario", data);
    return sendButtons(from, C.pedirHorario, [
      { id: "10:00", title: "10:00" },
      { id: "15:00", title: "15:00" },
      { id: "19:00", title: "19:00" },
    ]);
  }
  if (step === "horario") {
    data.horario = input;
    await addInscripcion({
      nombre: data.nombre || null,
      edad: data.edad || null,
      telefono: data.telefono || null,
      rol: data.rol || null,
      experiencia: data.experiencia || null,
      horario: data.horario || null,
      wa_from: from,
    });
    await clearSession(from);
    return sendText(from, C.gracias);
  }

  // ----- Menu principal -----
  if (replyId === "inscripcion" || /inscrib|inscrip|registr|anotar/.test(low)) {
    await saveSession(from, "nombre", {});
    return sendText(from, C.pedirNombre);
  }
  if (replyId === "informacion" || /informaci|info|detalle/.test(low)) {
    await sendText(from, C.informacion);
    return menu(from, C.algoMas);
  }
  if (replyId === "ubicacion" || /ubic|direcci|d[oó]nde|lugar|mapa/.test(low)) {
    await sendText(from, C.ubicacion);
    return menu(from, C.algoMas);
  }

  // ----- Cualquier otra cosa: saludo + menu -----
  return menu(from, C.bienvenida);
}

function menu(to, texto) {
  return sendButtons(to, texto, [
    { id: "inscripcion", title: "📝 Inscripción" },
    { id: "informacion", title: "ℹ️ Información" },
    { id: "ubicacion", title: "📍 Ubicación" },
  ]);
}
