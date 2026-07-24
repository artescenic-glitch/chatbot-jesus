/**
 * ============================================================
 *  Helpers para ENVIAR mensajes por la WhatsApp Cloud API.
 *  Lee el token y el phone number id de las variables de entorno
 *  (nunca van escritos aqui, por seguridad).
 * ============================================================
 */

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const API = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

async function send(payload) {
  const r = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
  });
  const data = await r.json();
  if (data.error) {
    console.error("WhatsApp API error:", JSON.stringify(data.error));
  }
  return data;
}

// Mensaje de texto simple
function sendText(to, body) {
  return send({ to, type: "text", text: { body } });
}

// Mensaje con botones (maximo 3). buttons: [{ id, title }]
function sendButtons(to, body, buttons) {
  return send({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: {
        buttons: buttons.map((b) => ({
          type: "reply",
          reply: { id: b.id, title: b.title },
        })),
      },
    },
  });
}

// Mensaje de lista (hasta 10 filas). rows: [{ id, title }]
function sendList(to, body, buttonText, rows) {
  return send({
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: body },
      action: {
        button: buttonText,
        sections: [{ title: "Áreas", rows }],
      },
    },
  });
}

module.exports = { sendText, sendButtons, sendList };
