# Cloudflare Pages — chat proxy
#
# Variables (Production), sin documentarlas en la UI del chat:
#   WEB_CHAT_API_KEY
#   WEB_CHAT_API_BASE          → host Railway del backend (*.up.railway.app)
#   WEB_CHAT_PUBLIC_ORIGIN     → origen público allowlisteado (ej. https://febrospuntodeventa.com)
#
# Function: /functions/api/chat.js → POST /api/chat
# Las respuestas de error al browser son genéricas (sin URLs ni nombres de env).
