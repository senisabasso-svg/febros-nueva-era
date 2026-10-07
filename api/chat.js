/**
 * Vercel serverless: POST /api/chat
 * Proxies to Febros web-chat without exposing WEB_CHAT_API_KEY.
 */
const { proxyChat } = require('../lib/web-chat-proxy.cjs');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const result = await proxyChat(req);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[web-chat proxy]', err && err.message ? err.message : 'error');
    res.status(502).json({ error: 'No se pudo contactar al chat' });
  }
};
