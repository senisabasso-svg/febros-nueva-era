/**
 * Cloudflare Pages Function — POST /api/chat
 *
 * Env (Cloudflare Pages → Settings → Environment variables):
 *   WEB_CHAT_API_KEY   (required)
 *   WEB_CHAT_API_BASE  (recommended: https://febrosmarketing-production.up.railway.app)
 *
 * Do NOT point WEB_CHAT_API_BASE at febrospuntodeventa.com (same Cloudflare zone):
 * same-zone subrequests reenvían el Origin del browser y el backend responde 403.
 */
const RAILWAY_DEFAULT = 'https://febrosmarketing-production.up.railway.app';
const MAX_LEN = 1500;

function normalizeBase(raw) {
  let base = String(raw || '').trim().replace(/\/$/, '');
  if (!base) base = RAILWAY_DEFAULT;
  if (!/^https?:\/\//i.test(base)) base = 'https://' + base;
  return base.replace(/\/$/, '');
}

/** Avoid same-zone fetch (custom domain ↔ CF) which leaks browser Origin. */
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
  const isCustomDomain =
    upstreamHost === 'febrospuntodeventa.com' ||
    upstreamHost === reqHost;

  if (isCustomDomain) {
    // Prefer explicit Railway URL if they set a different var, else default Railway.
    const railway = normalizeBase(env.WEB_CHAT_RAILWAY_URL || RAILWAY_DEFAULT);
    return railway;
  }
  return base;
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

  const apiBase = resolveUpstreamBase(env, context.request.url);
  const target = `${apiBase}/api/web-chat/message`;

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('X-Web-Chat-Key', apiKey);
  // Ensure browser Origin/Referer never go upstream
  headers.delete('Origin');
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
    return json({ error: 'No se pudo contactar al chat' }, 502);
  }

  const data = await upstream.json().catch(() => ({}));

  // Helpful hint if backend still reject by Origin (misconfigured allowlist / same-zone)
  if (
    upstream.status === 403 &&
    typeof data.error === 'string' &&
    /origen|origin|ALLOWED_ORIGINS/i.test(data.error)
  ) {
    return json(
      {
        error: data.error,
        hint:
          'En Cloudflare Pages poné WEB_CHAT_API_BASE=https://febrosmarketing-production.up.railway.app (URL Railway, no el dominio custom). O en el backend: WEB_CHAT_ALLOWED_ORIGINS=https://febrospuntodeventa.com,https://www.febrospuntodeventa.com'
      },
      403
    );
  }

  return json(data, upstream.status);
}

export async function onRequestGet() {
  return json({
    error: 'Usá POST /api/chat',
    hint: 'El chatbox del sitio envía POST con { message, sessionToken }'
  }, 405);
}
