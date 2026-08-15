# 🎭 Bot de WhatsApp — Escénika

Bot del número **+591 63558087** que atiende la campaña de Meta de
**LORQUIANAS · Las Mujeres de Lorca** y manda a comprar a
[escenika.vercel.app](https://escenika.vercel.app).

Corre en **Vercel** (sin servidor que mantener) + **Supabase** (estado de las
conversaciones). Repo: `artescenic-glitch/chatbot-jesus` — el nombre quedó de
la etapa anterior; el bot ya es de Escénika.

## ¿Qué hace?

- **Si el mensaje viene del anuncio** (click-to-WhatsApp de Facebook/Instagram),
  responde de una con la **imagen del QR + el link + los 4 pasos**, sin hacer
  elegir nada. Es el camino corto a la venta.
- Si no, saluda con un menú: **Comprar entradas · Sobre la obra · Lugar y
  fechas · Formas de pago · Hablar con alguien**.
- Entiende preguntas escritas ("cuánto cuestan", "dónde es", "a qué hora",
  "puedo pagar en efectivo") y responde corto, siempre terminando en el link.
- Si no entiende dos veces seguidas, pasa la conversación a una persona.
- **Hablar con alguien** deja al bot en silencio; respondes desde el inbox del
  CRM (cada mensaje se le reenvía firmado). La persona escribe `menu` para
  volver al bot.
- Sigue vivo el **flujo de inscripciones de Jesús de Nazaret**, aunque ya no
  está en el menú: se activa si escriben "inscripción", "casting", "quiero
  actuar"… Los registros se ven en `/api/leads?key=...`.

## Estructura

```
api/webhook.js   -> recibe y responde los mensajes de WhatsApp
api/leads.js     -> panel web con la lista de inscritos
lib/wa.js        -> enviar mensajes (texto, imagen, botones, listas)
lib/db.js        -> guardar/leer en Supabase
contenido.js     -> TODOS los textos (edita aquí sin tocar la lógica)
supabase.sql     -> crea las 2 tablas
```

## Cambiar los textos de la campaña

Todo está en `contenido.js`: precio, fechas, lugar, sinopsis, menú.
Editas, `git push`, y Vercel redepliega solo en un par de minutos.

**El QR que manda el bot** es una imagen alojada en el sitio de Escénika:
`escenika/public/qr-lorquianas-sitio.png` (apunta a `escenika.vercel.app`).
Si la quieres cambiar de sitio, pon la variable `QR_URL` en Vercel con la URL
nueva; tiene que ser pública y accesible sin login, porque quien la descarga
es Meta, no el bot.

## Variables de entorno (en Vercel)

| Variable | Valor |
|---|---|
| `WHATSAPP_TOKEN` | token permanente (System User) |
| `PHONE_NUMBER_ID` | ID del número 63558087 |
| `VERIFY_TOKEN` | el mismo del webhook en Meta |
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `LEADS_KEY` | clave para abrir el panel de inscritos |
| `CRM_WEBHOOK_URL` | webhook del CRM, para el inbox humano |
| `META_APP_SECRET` | App Secret de Meta; firma el reenvío al CRM |
| `SITIO_URL` | *(opcional)* por defecto `https://escenika.vercel.app` |
| `QR_URL` | *(opcional)* imagen del QR que se envía |

## Webhook en Meta

WhatsApp → Configuración → Webhook:

- **Callback URL:** `https://chatbot-jesus.vercel.app/api/webhook`
- **Verify token:** el mismo `VERIFY_TOKEN`
- Suscrito al campo **`messages`**.

Un número tiene **un solo** webhook: el bot lo recibe y le pasa copia al CRM.
