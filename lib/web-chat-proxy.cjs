/**
 * Shared web-chat proxy helpers (no API key / URL leakage to clients).
 */

const DEFAULT_BASE = 'https://febrosmarketing-production.up.railway.app';
const MAX_LEN = 1500;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;

const hits = new Map();

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.trim()) return xf.split(',')[0].trim();
  return req.socket?.remoteAddress || req.ip || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  let bucket = hits.get(ip);
  if (!bucket || now - bucket.start > RATE_WINDOW_MS) {
    bucket = { start: now, count: 0 };
    hits.set(ip, bucket);
  }
  bucket.count += 1;
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (now - v.start > RATE_WINDOW_MS) hits.delete(k);
    }
  }
  return bucket.count > RATE_MAX;
}

function normalizeBase(raw) {
  let base = String(raw || DEFAULT_BASE).trim().replace(/\/$/, '');
  if (!base) base = DEFAULT_BASE;
  if (!/^https?:\/\//i.test(base)) base = 'https://' + base;
  return base.replace(/\/$/, '');
}

function getConfig() {
  return {
    apiBase: normalizeBase(process.env.WEB_CHAT_API_BASE),
    apiKey: (process.env.WEB_CHAT_API_KEY || '').trim(),
    publicOrigin: String(process.env.WEB_CHAT_PUBLIC_ORIGIN || 'https://febrospuntodeventa.com')
      .trim()
      .replace(/\/$/, '')
  };
}

function safeClientError(status) {
  if (status === 429) return { error: 'Demasiados mensajes. Probá en un momento.' };
  if (status === 503) return { error: 'Chat no disponible por ahora.' };
  if (status >= 500) return { error: 'No se pudo completar el mensaje.' };
  return { error: 'No pudimos enviar el mensaje. Intentá de nuevo.' };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.json === 'function') return req.json();
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

async function proxyChat(req) {
  const { apiBase, apiKey, publicOrigin } = getConfig();
  if (!apiKey) {
    return { status: 503, body: safeClientError(503) };
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return { status: 429, body: safeClientError(429) };
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    return { status: 400, body: { error: 'Mensaje inválido.' } };
  }

  const text = String(payload.message || '').trim();
  if (!text) {
    return { status: 400, body: { error: 'Mensaje requerido.' } };
  }

  const sessionToken =
    typeof payload.sessionToken === 'string' && payload.sessionToken.trim()
      ? payload.sessionToken.trim()
      : undefined;

  const upstream = await fetch(`${apiBase}/api/web-chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Web-Chat-Key': apiKey,
      Origin: publicOrigin
    },
    body: JSON.stringify({
      message: text.slice(0, MAX_LEN),
      ...(sessionToken ? { sessionToken } : {})
    }),
    redirect: 'manual'
  });

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return { status: upstream.status, body: safeClientError(upstream.status) };
  }

  return {
    status: 200,
    body: {
      reply: data.reply,
      sessionToken: data.sessionToken,
      paused: !!data.paused
    }
  };
}

module.exports = { proxyChat, getConfig, MAX_LEN };
