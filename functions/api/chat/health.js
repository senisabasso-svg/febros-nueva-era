/**
 * Cloudflare Pages Function — GET /api/chat/health
 */
export async function onRequestGet(context) {
  const configured = Boolean(String((context.env && context.env.WEB_CHAT_API_KEY) || '').trim());
  return new Response(JSON.stringify({ ok: true, configured, runtime: 'cloudflare-pages' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
