/**
 * Local / Railway / Render: static site + secure chat proxy.
 * Env: WEB_CHAT_API_KEY, WEB_CHAT_API_BASE, PORT
 */
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { proxyChat } = require('./lib/web-chat-proxy.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

app.post('/api/chat', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const result = await proxyChat(req);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[web-chat proxy]', err && err.message ? err.message : 'error');
    res.status(502).json({ error: 'No se pudo contactar al chat' });
  }
});

app.get('/api/chat/health', (_req, res) => {
  const configured = Boolean((process.env.WEB_CHAT_API_KEY || '').trim());
  res.json({ ok: true, configured });
});

app.use(express.static(__dirname, {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

app.listen(PORT, () => {
  console.log(`FEBROS landing on http://127.0.0.1:${PORT}`);
  if (!(process.env.WEB_CHAT_API_KEY || '').trim()) {
    console.warn('WEB_CHAT_API_KEY no configurada — /api/chat devolverá 503');
  }
});
