/**
 * ============================================================
 *  WEBHOOK de WhatsApp  ->  https://TU-APP.vercel.app/api/webhook
 *
 *  - GET  : Meta verifica el webhook (usa VERIFY_TOKEN).
 *  - POST : llegan los mensajes de los usuarios.
 *
 *  CAMPAÑA ACTUAL: venta de entradas de LORQUIANAS en Escénika.
 *  Todo mensaje sin intencion clara termina llevando a la web.
 *  Si el mensaje viene de un anuncio de Meta (click-to-WhatsApp),
 *  respondemos directo con el QR y el link, sin hacerle elegir nada.
 *
 *  Cada mensaje entrante se REENVIA al CRM (para responder como
 *  humano desde su inbox). Si la persona elige "Hablar con
 *  alguien", el bot se calla hasta que escriba "menu".
 * ============================================================
 */

const crypto = require("crypto");
const { sendText, sendImage, sendButtons, sendList } = require("../lib/wa");
const {
  getSession,
  saveSession,
  clearSession,
  addInscripcion,
} = require("../lib/db");
const C = require("../contenido");

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL; // opcional
const META_APP_SECRET = process.env.META_APP_SECRET; // opcional (para firmar el reenvio)

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
      // 1) Reenviar copia al CRM (para el inbox humano)
      await forwardToCRM(req.body);

      // 2) Logica del bot
      const value = req.body?.entry?.[0]?.changes?.[0]?.value;
      const msg = value?.messages?.[0];
      if (msg) {
        const from = msg.from;
        const text = msg.text?.body;
        const replyId =
          msg.interactive?.button_reply?.id ||
          msg.interactive?.list_reply?.id ||
          null;
        // Viene de un anuncio de Facebook/Instagram (click-to-WhatsApp)
        const desdeAnuncio = Boolean(msg.referral);
        await handleMessage(from, text, replyId, desdeAnuncio);
      }
    } catch (e) {
      console.error("Error procesando webhook:", e);
    }
    return res.status(200).send("OK");
  }

  return res.status(200).send("Bot de Escénika activo 🎭");
};

// ============================================================
//  REENVIO AL CRM (con firma HMAC que el CRM exige)
// ============================================================
async function forwardToCRM(payload) {
  if (!CRM_WEBHOOK_URL || !META_APP_SECRET || !payload) return;
  try {
    const body = JSON.stringify(payload);
    const signature =
      "sha256=" +
      crypto.createHmac("sha256", META_APP_SECRET).update(body).digest("hex");
    await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hub-Signature-256": signature,
      },
      body,
    });
  } catch (e) {
    console.error("forwardToCRM error:", e.message);
  }
}

// ============================================================
//  LOGICA DEL BOT
// ============================================================
async function handleMessage(from, text, replyId, desdeAnuncio) {
  const input = (replyId || text || "").trim();
  const low = input.toLowerCase();

  const session = await getSession(from);
  const step = session?.step;
  const data = session?.data || {};

  // ----- Modo humano: el bot se calla y responde una persona -----
  if (step === "humano") {
    if (/^(menu|menú|bot|inicio|volver|salir|automático|automatico)$/.test(low)) {
      await clearSession(from);
      return menu(from, C.bienvenida);
    }
    return; // silencio: el humano atiende desde el CRM
  }

  // ----- Flujo de inscripcion en curso (tiene prioridad) -----
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
    return sendList(
      from,
      C.pedirRolTexto,
      C.pedirRolBoton,
      C.roles,
      C.pedirRolTitulo
    );
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
    data.experiencia = input === "exp_si" || /^s[ií]/.test(low) ? "Sí" : "No";
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

  // ----- Llega desde el anuncio: al grano, QR + link -----
  if (desdeAnuncio) {
    await olvidarFallos(from, step);
    return enviarCompra(from);
  }

  // ----- Volver al menu -----
  if (/^(menu|menú|hola|buenas|buenos días|buenas tardes|buenas noches)$/.test(low)) {
    await olvidarFallos(from, step);
    return menu(from, C.bienvenida);
  }

  // ----- LO PRINCIPAL: comprar entradas -----
  if (
    replyId === "comprar" ||
    // ojo: nada de "cuanto" suelto, que se lleva "¿cuánto dura la obra?"
    /entrada|boleto|ticket|comprar|compro|precio|cuesta|vale|sale|valor|reserv|butaca|asiento|disponib/.test(
      low
    )
  ) {
    await olvidarFallos(from, step);
    return enviarCompra(from);
  }

  // ----- Lugar, fechas y horarios -----
  // Va ANTES que "la obra": "¿dónde es la obra?" pregunta por el lugar.
  if (
    replyId === "lugar" ||
    /lugar|d[oó]nde|donde|ubic|direcci|teatro|mapa|hora|horario|fecha|d[ií]a|cu[aá]ndo|cuando|septiembre/.test(
      low
    )
  ) {
    await olvidarFallos(from, step);
    await sendText(from, C.lugar);
    return seguirComprando(from);
  }

  // ----- Sobre la obra -----
  if (
    replyId === "obra" ||
    /obra|lorquiana|lorca|trata|elenco|actrices|espect[aá]culo|duraci[oó]n|dura/.test(
      low
    )
  ) {
    await olvidarFallos(from, step);
    await sendText(from, C.obra);
    return seguirComprando(from);
  }

  // ----- Formas de pago -----
  if (
    replyId === "pago" ||
    /pago|pagar|qr|transferen|dep[oó]sito|efectivo|tarjeta|banco|comprobante/.test(
      low
    )
  ) {
    await olvidarFallos(from, step);
    await sendText(from, C.pago);
    return seguirComprando(from);
  }

  // ----- Inscripciones (Jesús de Nazaret): ya no esta en el menu -----
  if (/inscrib|inscrip|casting|audici|quiero actuar|ser parte del elenco/.test(low)) {
    await saveSession(from, "nombre", {});
    return sendText(from, C.pedirNombre);
  }

  // ----- Pedir una persona -----
  if (replyId === "humano" || /asesor|persona|humano|hablar con|atenci[oó]n/.test(low)) {
    await saveSession(from, "humano", {});
    return sendText(from, C.handoff);
  }

  // ----- No entendimos: menu; si insiste, lo pasamos a un humano -----
  const fallos = (data.fallos || 0) + 1;
  if (fallos >= 2) {
    await saveSession(from, "humano", {});
    return sendText(from, C.noEntiendoInsiste);
  }
  await saveSession(from, "menu", { fallos });
  return menu(from, C.noEntiendo);
}

// ============================================================
//  BLOQUES DE RESPUESTA
// ============================================================

// El mensaje estrella: imagen del QR + pie con el link.
// Si WhatsApp no logra bajar la imagen, mandamos solo el texto.
async function enviarCompra(to) {
  const ok = await sendImage(to, C.QR_IMAGEN, C.comprarCaption);
  if (!ok) await sendText(to, C.comprarSinImagen);
  // Ya tiene el link: le ofrecemos lo que suele preguntar despues.
  return sendButtons(to, C.algoMas, [
    { id: "lugar", title: "📍 Lugar y fechas" },
    { id: "obra", title: "🎭 Sobre la obra" },
    { id: "humano", title: "🙋 Necesito ayuda" },
  ]);
}

// Despues de contar algo, siempre se vuelve a la venta.
// Ojo: los titulos de boton admiten 20 caracteres como maximo.
function seguirComprando(to) {
  return sendButtons(to, C.algoMas, [
    { id: "comprar", title: "🎟️ Comprar" },
    { id: "humano", title: "🙋 Necesito ayuda" },
  ]);
}

function menu(to, texto) {
  return sendList(to, texto, C.menuBoton, C.menuOpciones, C.menuTitulo);
}

// Borra el contador de "no entendi" cuando la conversacion retoma el rumbo
async function olvidarFallos(from, step) {
  if (step === "menu") await clearSession(from);
}
