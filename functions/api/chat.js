/**
 * Cloudflare Pages Function — POST /api/chat
 * Env (Cloudflare Pages → Settings → Environment variables):
 *   WEB_CHAT_API_KEY
 *   WEB_CHAT_API_BASE (opcional, default https://www.febrospuntodeventa.com)
 */
const DEFAULT_BASE = 'https://www.febrospuntodeventa.com';
const MAX_LEN = 1500;

function normalizeBase(raw) {
  let base = String(raw || DEFAULT_BASE).trim().replace(/\/$/, '');
  if (!base) base = DEFAULT_BASE;
  if (!/^https?:\/\//i.test(base)) base = 'https://' + base;
  return base.replace(/\/$/, '');
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export async function onRequestPost(context) {
  const env = context.env || {};
  const apiKey = String(env.WEB_CHAT_API_KEY || '').trim();
  if (!apiKey) return json({ error: 'Chat no configurado' }, 503);

  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const text = String(payload.message || '').trim();
  if (!text) return json({ error: 'Mensaje requerido' }, 400);

  const sessionToken =
    typeof payload.sessionToken === 'string' && payload.sessionToken.trim()
      ? payload.sessionToken.trim()
      : undefined;

  const apiBase = normalizeBase(env.WEB_CHAT_API_BASE);
  let upstream;
  try {
    upstream = await fetch(`${apiBase}/api/web-chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Web-Chat-Key': apiKey
      },
      body: JSON.stringify({
        message: text.slice(0, MAX_LEN),
        ...(sessionToken ? { sessionToken } : {})
      })
    });
  } catch {
    return json({ error: 'No se pudo contactar al chat' }, 502);
  }

  const data = await upstream.json().catch(() => ({}));
  return json(data, upstream.status);
}

export async function onRequestGet() {
  return json({
    error: 'Usá POST /api/chat',
    hint: 'El chatbox del sitio envía POST con { message, sessionToken }'
  }, 405);
}
