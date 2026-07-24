# 🎭 Bot de inscripciones — Jesús de Nazaret (Artescenic)

Bot de WhatsApp que atiende inscripciones para la obra, corriendo en **Vercel** (gratis, sin servidor que mantener) + **Supabase** (base de datos gratis). Incluye un **panel web** para ver los inscritos.

## ¿Qué hace?

- Saluda y muestra un menú: **Inscripción · Información · Ubicación**.
- En la inscripción pide: nombre completo, edad, teléfono, rol (actuación/escenografía/sonido/luces/tramoya), experiencia previa y horario disponible (10:00 / 15:00 / 19:00).
- Guarda cada registro en Supabase y agradece al usuario.
- Panel de inscritos en `/api/leads?key=...`.

## Estructura

```
api/webhook.js   -> recibe y responde los mensajes de WhatsApp
api/leads.js     -> panel web con la lista de inscritos
lib/wa.js        -> enviar mensajes (texto, botones, listas)
lib/db.js        -> guardar/leer en Supabase
contenido.js     -> TODOS los textos (edita aquí sin tocar la lógica)
supabase.sql     -> crea las 2 tablas
```

## Puesta en marcha (una sola vez)

### 1. Crear las tablas en Supabase
Supabase → **SQL Editor** → pega el contenido de `supabase.sql` → **Run**.

### 2. Subir a GitHub
Crea un repo nuevo (ej. `chatbot-artescenic`) y sube esta carpeta.

### 3. Importar en Vercel
Vercel → **Add New → Project** → importa el repo.

### 4. Variables de entorno (en Vercel)
Copia los nombres de `.env.example` y pega los valores:

| Variable | Valor |
|---|---|
| `WHATSAPP_TOKEN` | token permanente (System User) |
| `PHONE_NUMBER_ID` | ID del número 63558087 |
| `VERIFY_TOKEN` | ej. `artescenic2026` |
| `SUPABASE_URL` | de Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | de Supabase → Settings → API |
| `LEADS_KEY` | una clave larga que inventes |

Deploy → obtienes una URL tipo `https://chatbot-artescenic.vercel.app`.

### 5. Conectar el webhook en Meta
WhatsApp → Configuración → Webhook → Editar:
- **Callback URL:** `https://TU-APP.vercel.app/api/webhook`
- **Verify token:** el mismo `VERIFY_TOKEN`
- Suscríbete al campo **`messages`**.

## Uso diario

- **Ver inscritos:** abre `https://TU-APP.vercel.app/api/leads?key=TU_LEADS_KEY`
- **Cambiar textos:** edita `contenido.js` y haz `git push` (Vercel redepliega solo).
