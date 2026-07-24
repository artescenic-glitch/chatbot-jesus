/**
 * ============================================================
 *  CONTENIDO EDITABLE DEL BOT
 *  Aqui puedes cambiar TODOS los textos sin tocar la logica.
 *  Despues de editar, vuelve a desplegar en Vercel (git push).
 * ============================================================
 */

module.exports = {
  // --- Mensaje de bienvenida y menu principal ---
  bienvenida:
    "¡Hola! 👋 Te saluda el *Centro de Artes Escénicas – Artescenic*.\n\n" +
    "Estamos abriendo inscripciones para nuestra obra *Jesús de Nazaret* 🎭\n\n" +
    "¿En qué te podemos ayudar?",

  algoMas: "¿Necesitas algo más? 👇",

  // --- Flujo de inscripcion (preguntas paso a paso) ---
  pedirNombre:
    "¡Genial! Vamos con tu inscripción. 📝\n\nPor favor, escribe tu *nombre completo*:",
  pedirEdad: "Gracias. ¿Cuál es tu *edad*?",
  pedirTelefono:
    "Perfecto. ¿Cuál es tu *número de teléfono* de contacto?",
  pedirRolTexto: "¿Qué *rol* te interesa? Toca el botón y elige un área 👇",
  pedirExperiencia: "¿Tienes *experiencia previa* en teatro o en el área elegida?",
  pedirHorario:
    "Por último, ¿en qué *horario* tienes disponibilidad para los ensayos?",

  // --- Opciones de ROL (mensaje de lista, hasta 10) ---
  // El "id" es lo que se guarda internamente; el texto lo defines en rolesLabels.
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

  // --- Mensaje final de agradecimiento ---
  gracias:
    "¡Muchas gracias por inscribirte! 🎭✨\n\n" +
    "Tu registro se completó correctamente. En los próximos días nos comunicaremos contigo.\n\n" +
    "*Centro de Artes Escénicas – Artescenic*",

  // --- Opcion "Información de inscripción" ---
  informacion:
    "ℹ️ *Información de inscripción*\n\n" +
    "Estamos formando el elenco y el equipo técnico de la obra *Jesús de Nazaret*.\n\n" +
    "• Abierto a todas las edades\n" +
    "• No necesitas experiencia previa\n" +
    "• Áreas disponibles: actuación, escenografía, sonido, luces y tramoya\n" +
    "• Ensayos según tu disponibilidad (10:00, 15:00 o 19:00)\n\n" +
    "Para registrarte, elige la opción *Inscripción*.",

  // --- Opcion "Ubicación" ---
  // EDITA con tu dirección real y un link de Google Maps.
  ubicacion:
    "📍 *Ubicación*\n\n" +
    "Centro de Artes Escénicas – Artescenic\n" +
    "Tarija, Bolivia\n\n" +
    "(Edita este texto en contenido.js con tu dirección exacta y un enlace de Google Maps)",
};
