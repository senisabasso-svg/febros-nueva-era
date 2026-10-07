/**
 * Cloudflare Pages Function — POST /api/chat
 *
 * Env:
 *   WEB_CHAT_API_KEY (required)
 *   WEB_CHAT_API_BASE (Railway upstream, not the public custom domain)
 *   WEB_CHAT_PUBLIC_ORIGIN (optional; default = request origin)
 */
const RAILWAY_DEFAULT = 'https://febrosmarketing-production.up.railway.app';
const MAX_LEN = 1500;

function normalizeBase(raw) {
  let base = String(raw || '').trim().replace(/\/$/, '');
  if (!base) base = RAILWAY_DEFAULT;
  if (!/^https?:\/\//i.test(base)) base = 'https://' + base;
  return base.replace(/\/$/, '');
}

function resolveUpstreamBase(env, requestUrl) {
  let base = normalizeBase(env.WEB_CHAT_API_BASE);
  let host;
  try {
    host = new URL(base).hostname.toLowerCase();
  } catch {
    return RAILWAY_DEFAULT;
  }

  const reqHost = new URL(requestUrl).hostname.toLowerCase().replace(/^www\./, '');
  const upstreamHost = host.replace(/^www\./, '');
  if (upstreamHost === 'febrospuntodeventa.com' || upstreamHost === reqHost) {
    return normalizeBase(env.WEB_CHAT_RAILWAY_URL || RAILWAY_DEFAULT);
  }
  return base;
}

function publicOrigin(env, request) {
  const fromEnv = String(env.WEB_CHAT_PUBLIC_ORIGIN || '').trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  try {
    const u = new URL(request.url);
    return u.origin;
  } catch {
    return 'https://febrospuntodeventa.com';
  }
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

/** Never leak upstream/config details (URLs, env names) to the browser. */
function safeClientError(status) {
  if (status === 429) return { error: 'Demasiados mensajes. Probá en un momento.' };
  if (status === 503) return { error: 'Chat no disponible por ahora.' };
  if (status >= 500) return { error: 'No se pudo completar el mensaje.' };
  return { error: 'No pudimos enviar el mensaje. Intentá de nuevo.' };
}

export async function onRequestPost(context) {
  const env = context.env || {};
  const apiKey = String(env.WEB_CHAT_API_KEY || '').trim();
  if (!apiKey) return json(safeClientError(503), 503);

  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json({ error: 'Mensaje inválido.' }, 400);
  }

  const text = String(payload.message || '').trim();
  if (!text) return json({ error: 'Mensaje requerido.' }, 400);

  const sessionToken =
    typeof payload.sessionToken === 'string' && payload.sessionToken.trim()
      ? payload.sessionToken.trim()
      : undefined;

  const apiBase = resolveUpstreamBase(env, context.request.url);
  const origin = publicOrigin(env, context.request);
  const target = `${apiBase}/api/web-chat/message`;

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('X-Web-Chat-Key', apiKey);
  // Send an allowlisted public Origin (not pages.dev / leaked browser variants)
  headers.set('Origin', origin);
  headers.delete('Referer');

  let upstream;
  try {
    upstream = await fetch(target, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: text.slice(0, MAX_LEN),
        ...(sessionToken ? { sessionToken } : {})
      }),
      redirect: 'manual',
      referrerPolicy: 'no-referrer'
    });
  } catch {
    return json(safeClientError(502), 502);
  }

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return json(safeClientError(upstream.status), upstream.status);
  }

  return json(
    {
      reply: data.reply,
      sessionToken: data.sessionToken,
      paused: !!data.paused
    },
    200
  );
}

export async function onRequestGet() {
  return json({ error: 'Método no permitido.' }, 405);
}
