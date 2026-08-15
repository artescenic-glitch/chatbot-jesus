/**
 * ============================================================
 *  CONTENIDO EDITABLE DEL BOT — ESCÉNIKA
 *  Aqui puedes cambiar TODOS los textos sin tocar la logica.
 *  Despues de editar, vuelve a desplegar en Vercel (git push).
 *
 *  Regla de oro para esta campaña: mensajes CORTOS.
 *  El objetivo de cada respuesta es que la persona toque el link
 *  y compre en escenika.vercel.app.
 * ============================================================
 */

// El sitio y la imagen del QR se pueden cambiar por variables de
// entorno en Vercel sin tocar el codigo.
const SITIO = process.env.SITIO_URL || "https://escenika.vercel.app";
const QR_IMAGEN =
  process.env.QR_URL || "https://escenika.vercel.app/qr-lorquianas-sitio.png";

module.exports = {
  SITIO,
  QR_IMAGEN,

  // --- Bienvenida + menu principal ---
  bienvenida:
    "¡Hola! 👋 Soy el asistente de *Escénika*.\n\n" +
    "🎭 *LORQUIANAS — Las Mujeres de Lorca*\n" +
    "11 y 12 de septiembre · 19:30 · Teatro de la Cultura\n\n" +
    "¿Qué te muestro?",

  algoMas: "¿Te ayudo con algo más? 👇",

  // --- Menu principal (lista, titulos de 24 caracteres como maximo) ---
  menuBoton: "Ver opciones",
  menuTitulo: "LORQUIANAS",
  menuOpciones: [
    {
      id: "comprar",
      title: "🎟️ Comprar entradas",
      description: "Link, QR y cómo hacerlo",
    },
    {
      id: "obra",
      title: "🎭 Sobre la obra",
      description: "De qué trata Lorquianas",
    },
    {
      id: "lugar",
      title: "📍 Lugar y fechas",
      description: "Teatro de la Cultura, Tarija",
    },
    {
      id: "pago",
      title: "💳 Formas de pago",
      description: "QR bancario o efectivo",
    },
    {
      id: "humano",
      title: "🙋 Hablar con alguien",
      description: "Te atiende una persona",
    },
  ],

  // --- LO PRINCIPAL: comprar entradas ---
  // Se envia como pie de foto del QR. Cortito y con el link visible.
  comprarCaption:
    "🎟️ *Entradas · Bs 40*\n\n" +
    "Escanea el QR o entra aquí 👇\n" +
    SITIO +
    "\n\n" +
    "Eliges el día, tocas tu butaca en el plano, dejas tu nombre y pagas con QR. " +
    "Tus entradas llegan al momento en PDF.",

  // Si por lo que sea no se pudo mandar la imagen, va este texto solo.
  comprarSinImagen:
    "🎟️ *Entradas · Bs 40*\n\n" +
    "Compra aquí 👇\n" +
    SITIO +
    "\n\n" +
    "Eliges el día, tocas tu butaca en el plano, dejas tu nombre y pagas con QR. " +
    "Tus entradas llegan al momento en PDF.",

  // --- Sobre la obra ---
  obra:
    "🎭 *LORQUIANAS — Las Mujeres de Lorca*\n\n" +
    "Siete actrices dan voz a las grandes mujeres de Federico García Lorca: " +
    "Yerma, Bernarda Alba, Mariana Pineda, Doña Rosita y la madre de Bodas de sangre.\n\n" +
    "Presenta *Artescenic*.",

  // --- Lugar y fechas ---
  lugar:
    "📍 *Teatro de la Cultura* — Tarija\n\n" +
    "🗓️ Viernes 11 y sábado 12 de septiembre\n" +
    "🕢 19:30\n\n" +
    "Butaca numerada: eliges tu asiento en el plano al comprar.",

  // --- Formas de pago ---
  pago:
    "💳 *Cómo pagar*\n\n" +
    "• *En línea:* escaneas el QR del banco y subes la captura. Al confirmar el pago, bajas tus entradas en PDF.\n" +
    "• *En efectivo:* en Artescenic, Calle Bolívar N°1574, casi Av. Los Membrillos (Tarija).",

  // --- Derivacion a un humano ---
  handoff:
    "🙋 Listo, en un momento te responde una persona del equipo por aquí.\n\n" +
    "(Para volver al menú automático escribe *menu*.)",

  // --- Cuando no entendemos el mensaje ---
  noEntiendo: "No estoy seguro de haber entendido 🤔 Elige una opción:",
  noEntiendoInsiste:
    "Mejor te paso con una persona del equipo 🙋 En un momento te responden por aquí.\n\n" +
    "(Para volver al menú automático escribe *menu*.)",

  // ============================================================
  //  INSCRIPCIONES (Jesús de Nazaret)
  //  Ya no aparece en el menú, pero sigue viva: se activa si la
  //  persona escribe "inscripción", "casting", "quiero actuar"...
  // ============================================================
  pedirNombre:
    "¡Genial! Vamos con tu inscripción. 📝\n\nEscribe tu *nombre completo*:",
  pedirEdad: "Gracias. ¿Cuál es tu *edad*?",
  pedirTelefono: "Perfecto. ¿Cuál es tu *número de teléfono*?",
  pedirRolTexto: "¿Qué *área* te interesa? Toca el botón y elige 👇",
  pedirRolBoton: "Ver áreas",
  pedirRolTitulo: "Áreas",
  pedirExperiencia: "¿Tienes *experiencia previa* en el área elegida?",
  pedirHorario: "Por último, ¿en qué *horario* puedes ensayar?",

  roles: [
    { id: "rol_actor", title: "Actuación" },
    { id: "rol_esceno", title: "Escenografía" },
    { id: "rol_sonido", title: "Sonido" },
    { id: "rol_luces", title: "Luces" },
    { id: "rol_tramoya", title: "Tramoya" },
  ],
  rolesLabels: {
    rol_actor: "Actuación",
    rol_esceno: "Escenografía",
    rol_sonido: "Sonido",
    rol_luces: "Luces",
    rol_tramoya: "Tramoya",
  },

  gracias:
    "¡Gracias por inscribirte! 🎭✨\n\n" +
    "Te vamos a contactar en los próximos días.\n\n" +
    "*Artescenic*",
};
