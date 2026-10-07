# Cloudflare Pages
# Build: (none / empty) — sitio estático
# Output directory: /
# Root: /
#
# Environment variables (Production):
#   WEB_CHAT_API_KEY=<misma key que Railway marketing>
#   WEB_CHAT_API_BASE=https://febrosmarketing-production.up.railway.app
#
# Importante: preferí la URL *.up.railway.app (no el dominio custom).
# Si WEB_CHAT_API_BASE apunta al mismo dominio Cloudflare que la landing,
# el Origin del browser puede reenviarse y el backend responde
# "Origen no permitido" aunque la API key sea válida.
#
# En el backend (Railway marketing), opcionalmente:
#   WEB_CHAT_ALLOWED_ORIGINS=https://febrospuntodeventa.com,https://www.febrospuntodeventa.com
#
# La Function en /functions/api/chat.js atiende POST /api/chat

# redeploy 2026-10-07T02:55:29.9590615-03:00
