/**
 * Shared web-chat proxy helpers (no API key logging).
 * Used by Express (server.mjs) and Vercel (api/chat.js).
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
  // Accept host-only values like "foo.up.railway.app"
  if (!/^https?:\/\//i.test(base)) base = 'https://' + base;
  return base.replace(/\/$/, '');
}

function getConfig() {
  return {
    apiBase: normalizeBase(process.env.WEB_CHAT_API_BASE),
    apiKey: (process.env.WEB_CHAT_API_KEY || '').trim()
  };
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
  const { apiBase, apiKey } = getConfig();
  if (!apiKey) {
    return { status: 503, body: { error: 'Chat no configurado' } };
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return { status: 429, body: { error: 'Demasiados mensajes. Probá en un momento.' } };
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    return { status: 400, body: { error: 'JSON inválido' } };
  }

  const text = String(payload.message || '').trim();
  if (!text) {
    return { status: 400, body: { error: 'Mensaje requerido' } };
  }

  const sessionToken =
    typeof payload.sessionToken === 'string' && payload.sessionToken.trim()
      ? payload.sessionToken.trim()
      : undefined;

  // Server→server: never forward browser Origin/Referer to Febros.
  const upstream = await fetch(`${apiBase}/api/web-chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Web-Chat-Key': apiKey
    },
    body: JSON.stringify({
      message: text.slice(0, MAX_LEN),
      ...(sessionToken ? { sessionToken } : {})
    }),
    redirect: 'manual'
  });

  const data = await upstream.json().catch(() => ({}));
  return { status: upstream.status, body: data };
}

module.exports = { proxyChat, getConfig, MAX_LEN };
