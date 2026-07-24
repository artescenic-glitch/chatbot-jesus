/**
 * ============================================================
 *  PANEL DE INSCRITOS
 *  Abrelo en:  https://TU-APP.vercel.app/api/leads?key=TU_LEADS_KEY
 *  Protegido con LEADS_KEY para que no lo vea cualquiera.
 * ============================================================
 */

const { getInscripciones } = require("../lib/db");

module.exports = async (req, res) => {
  // Proteccion por clave
  if (req.query.key !== process.env.LEADS_KEY) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res
      .status(401)
      .send(
        "<h2>🔒 Acceso restringido</h2><p>Agrega tu clave a la URL: <code>?key=TU_CLAVE</code></p>"
      );
  }

  const rows = await getInscripciones();
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(render(rows));
};

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fecha(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function render(rows) {
  const filas = rows
    .map(
      (r) => `
      <tr>
        <td>${esc(fecha(r.created_at))}</td>
        <td><strong>${esc(r.nombre)}</strong></td>
        <td>${esc(r.edad)}</td>
        <td>${esc(r.telefono)}</td>
        <td><span class="tag">${esc(r.rol)}</span></td>
        <td>${esc(r.experiencia)}</td>
        <td>${esc(r.horario)}</td>
        <td><a href="https://wa.me/${esc(r.wa_from)}" target="_blank">${esc(
        r.wa_from
      )}</a></td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Inscripciones · Jesús de Nazaret</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    margin: 0; padding: 1.5rem; background: #f6f7f9; color: #1a1a1a;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #121212; color: #e6e6e6; }
    .card { background: #1c1c1c !important; }
    th { background: #262626 !important; }
    tr:hover td { background: #222 !important; }
    a { color: #8ab4f8; }
  }
  h1 { font-size: 1.5rem; margin: 0 0 .25rem; }
  .sub { color: #888; margin: 0 0 1.25rem; }
  .count { display:inline-block; background:#6d28d9; color:#fff; border-radius:999px;
           padding:.15rem .7rem; font-size:.9rem; font-weight:600; }
  .card { background:#fff; border-radius:12px; overflow-x:auto; box-shadow:0 1px 4px rgba(0,0,0,.08); }
  table { border-collapse: collapse; width: 100%; min-width: 760px; }
  th, td { padding:.7rem .9rem; text-align:left; border-bottom:1px solid rgba(128,128,128,.18); font-size:.92rem; white-space:nowrap; }
  th { background:#f0f0f3; font-weight:600; position:sticky; top:0; }
  tr:hover td { background:#faf9ff; }
  .tag { background:#ede9fe; color:#6d28d9; border-radius:6px; padding:.1rem .5rem; font-size:.82rem; }
  .empty { padding:3rem; text-align:center; color:#999; }
</style>
</head>
<body>
  <h1>🎭 Inscripciones — <em>Jesús de Nazaret</em></h1>
  <p class="sub">Centro de Artes Escénicas · Artescenic &nbsp; <span class="count">${
    rows.length
  } inscrito(s)</span></p>
  <div class="card">
    ${
      rows.length === 0
        ? `<div class="empty">Aún no hay inscripciones. Cuando alguien complete el registro por WhatsApp, aparecerá aquí.</div>`
        : `<table>
      <thead>
        <tr>
          <th>Fecha</th><th>Nombre</th><th>Edad</th><th>Teléfono</th>
          <th>Rol</th><th>Exp.</th><th>Horario</th><th>WhatsApp</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>`
    }
  </div>
</body>
</html>`;
}
