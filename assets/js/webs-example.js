/**
 * Compositional landing renderer
 * Pattern: LLM plans schema-bounded JSON → deterministic assembler fills vetted section catalog.
 * Refs: Portal UX Agent (slot composition), LandingAgent (avoid full-HTML template collapse),
 * GRID2 ("AI for understanding, algorithms for execution").
 */
(function () {
  var NAV = ['brand-left', 'centered', 'minimal'];
  var HERO = ['impact', 'editorial', 'banner', 'story'];
  var SERVICES = ['cards', 'list', 'grid', 'steps'];
  var PROOF = ['reasons', 'chips', 'quote', 'none'];
  var CONTACT = ['card', 'panel', 'sticky'];

  var PALETTES = {
    moderno: { bg: '#050B16', surface: '#0A1526', a: '#FF7300', a2: '#FF9538', muted: '#8A9BB0' },
    elegante: { bg: '#0B0A0F', surface: '#16141C', a: '#C9A24D', a2: '#E8C878', muted: '#9A9184' },
    'cálido': { bg: '#140E0A', surface: '#1E1510', a: '#E07A3A', a2: '#F0A06A', muted: '#B09A88' },
    minimal: { bg: '#0C1016', surface: '#141A22', a: '#7DD3FC', a2: '#BAE6FD', muted: '#8A9BB0' },
    bold: { bg: '#08060C', surface: '#140F1A', a: '#FF2D55', a2: '#FF6B3D', muted: '#A898A8' }
  };

  window.FEBROS_WEB_SCHEMA = {
    nav: NAV,
    hero: HERO,
    services: SERVICES,
    proof: PROOF,
    contact: CONTACT
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function waLink(phone) {
    var digits = String(phone || '').replace(/\D/g, '');
    if (digits.length === 8) digits = '598' + digits;
    if (digits.length === 9 && digits.charAt(0) === '0') digits = '598' + digits.slice(1);
    return 'https://wa.me/' + (digits || '59892331019');
  }

  function pick(arr, key) {
    return arr.indexOf(key) !== -1 ? key : arr[0];
  }

  function hashSeed(str) {
    var h = 2166136261;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededPick(arr, seed, salt) {
    var h = hashSeed(String(seed) + ':' + salt);
    return arr[h % arr.length];
  }

  /** Lightweight recipe scorer (beam-search lite): rank compositions for rubro/estilo */
  function scorePlan(plan, data) {
    var score = 0;
    var rubro = String(data.rubro || '').toLowerCase();
    var estilo = String(data.estilo || '').toLowerCase();

    if (estilo.indexOf('bold') !== -1) {
      if (plan.hero === 'banner' || plan.hero === 'impact') score += 3;
      if (plan.services === 'grid') score += 3;
      if (plan.nav === 'minimal') score += 1;
    }
    if (estilo.indexOf('elegant') !== -1) {
      if (plan.hero === 'editorial') score += 4;
      if (plan.services === 'list') score += 2;
      if (plan.proof === 'quote') score += 2;
    }
    if (estilo.indexOf('minimal') !== -1) {
      if (plan.nav === 'centered' || plan.nav === 'minimal') score += 2;
      if (plan.services === 'list' || plan.services === 'steps') score += 2;
      if (plan.proof === 'chips' || plan.proof === 'none') score += 1;
    }
    if (estilo.indexOf('cálido') !== -1 || estilo.indexOf('calido') !== -1) {
      if (plan.hero === 'story') score += 3;
      if (plan.contact === 'panel') score += 1;
    }
    if (/mec[aá]n|herrer|taller|auto|construc|metal/.test(rubro)) {
      if (plan.hero === 'banner' || plan.hero === 'story') score += 3;
      if (plan.services === 'steps' || plan.services === 'grid') score += 2;
    }
    if (/pelu|sal[oó]n|spa|est[eé]tica|beauty/.test(rubro)) {
      if (plan.hero === 'editorial' || plan.hero === 'impact') score += 3;
      if (plan.services === 'cards') score += 2;
    }
    if (/gastro|restau|caf[eé]|panader|comida/.test(rubro)) {
      if (plan.hero === 'story') score += 2;
      if (plan.proof === 'chips') score += 2;
    }
    // diversity bonus vs last plan
    try {
      var last = JSON.parse(sessionStorage.getItem('febrosWebPlan') || 'null');
      if (last) {
        if (last.hero === plan.hero) score -= 4;
        if (last.services === plan.services) score -= 3;
        if (last.nav === plan.nav) score -= 1;
        if (last.proof === plan.proof) score -= 2;
      }
    } catch (e) {}
    return score;
  }

  function planFromAiOrAlgo(content, data) {
    var seed = (data.nombre || '') + '|' + (data.rubro || '') + '|' + Date.now();
    var candidates = [];

    // candidate from AI (if valid)
    if (content && (content.nav || content.hero || content.services)) {
      candidates.push({
        nav: pick(NAV, content.nav),
        hero: pick(HERO, content.hero),
        services: pick(SERVICES, content.services),
        proof: pick(PROOF, content.proof || 'reasons'),
        contact: pick(CONTACT, content.contact),
        fromAi: true
      });
    }

    // generate algorithmic candidates and keep top-scoring
    for (var i = 0; i < 12; i++) {
      candidates.push({
        nav: seededPick(NAV, seed, 'n' + i),
        hero: seededPick(HERO, seed, 'h' + i),
        services: seededPick(SERVICES, seed, 's' + i),
        proof: seededPick(PROOF, seed, 'p' + i),
        contact: seededPick(CONTACT, seed, 'c' + i),
        fromAi: false
      });
    }

    candidates.sort(function (a, b) {
      var sb = scorePlan(b, data) + (b.fromAi ? 2 : 0);
      var sa = scorePlan(a, data) + (a.fromAi ? 2 : 0);
      return sb - sa;
    });

    // pick among top 3 for controlled randomness (anti-template)
    var top = candidates.slice(0, 3);
    var chosen = top[hashSeed(seed + ':win') % top.length];
    // if AI proposed a valid plan and it's in the top band, prefer it
    for (var t = 0; t < top.length; t++) {
      if (top[t].fromAi) {
        chosen = top[t];
        break;
      }
    }

    try {
      sessionStorage.setItem(
        'febrosWebPlan',
        JSON.stringify({
          nav: chosen.nav,
          hero: chosen.hero,
          services: chosen.services,
          proof: chosen.proof,
          contact: chosen.contact
        })
      );
    } catch (e2) {}

    return chosen;
  }

  function normalizeCopy(content, data) {
    var c = content || {};
    return {
      nombre: c.nombre || data.nombre || 'Demo',
      eyebrow: c.eyebrow || ((data.rubro || 'Negocio') + ' · ' + (data.ciudad || 'Uruguay')),
      headline: c.headline || data.nombre || 'Tu negocio',
      accent: c.headlineAccent || 'sin vueltas.',
      sub: c.subline || data.frase || 'Atención profesional y resultados que se notan.',
      cta: c.cta || 'Escribinos',
      services:
        Array.isArray(c.servicesItems) && c.servicesItems.length
          ? c.servicesItems
          : Array.isArray(c.services) && c.services.length && typeof c.services[0] === 'object'
            ? c.services
            : [
                { title: 'Servicio principal', desc: 'Lo esencial de tu rubro, bien hecho.' },
                { title: 'Asesoramiento', desc: 'Te orientamos antes de decidir.' },
                { title: 'Entrega', desc: 'Cumplimos plazos y calidad.' }
              ],
      reasons:
        Array.isArray(c.reasons) && c.reasons.length
          ? c.reasons
          : ['Atención personalizada', 'Respuesta rápida', 'Resultados que se notan'],
      quote: c.quote || data.frase || 'Calidad que se nota desde el primer contacto.',
      contactTitle: c.contactTitle || 'Hablemos',
      contactText: c.contactText || 'Escribinos y lo resolvemos en minutos.',
      href: waLink(data.whatsapp || '092 331 019'),
      palette: PALETTES[data.estilo] || PALETTES.moderno
    };
  }

  function baseCss(p) {
    return (
      '*{box-sizing:border-box;margin:0;padding:0}' +
      ':root{--bg:' +
      p.bg +
      ';--surface:' +
      p.surface +
      ';--a:' +
      p.a +
      ';--a2:' +
      p.a2 +
      ';--text:#F0EEE8;--muted:' +
      p.muted +
      '}' +
      'html,body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;line-height:1.45;-webkit-font-smoothing:antialiased}' +
      'body{min-height:100vh;overflow-x:hidden}' +
      'a{color:inherit;text-decoration:none}' +
      '.cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 18px;border-radius:999px;background:linear-gradient(180deg,var(--a2),var(--a));color:#fff;font-weight:700;font-size:.9rem;box-shadow:0 10px 28px rgba(0,0,0,.35)}' +
      '.foot{padding:16px 18px 28px;text-align:center;color:#5A7089;font-size:.68rem}'
    );
  }

  /* —— NAV —— */
  function renderNav(variant, v) {
    if (variant === 'minimal') {
      return (
        '<header style="padding:16px 18px 0;display:flex;justify-content:flex-end"><a href="#c" style="color:var(--a2);font-size:.78rem;font-weight:600">' +
        esc(v.cta) +
        ' →</a></header>'
      );
    }
    if (variant === 'centered') {
      return (
        '<header style="padding:20px 18px 0;text-align:center"><div style="font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--a);font-weight:700">' +
        esc(v.nombre) +
        '</div></header>'
      );
    }
    return (
      '<header style="display:flex;justify-content:space-between;align-items:center;padding:18px"><div style="font-weight:800;font-size:1.05rem">' +
      esc(v.nombre) +
      '</div><a href="#c" style="color:var(--a2);font-size:.78rem;font-weight:600">' +
      esc(v.cta) +
      ' →</a></header>'
    );
  }

  /* —— HERO —— */
  function renderHero(variant, v) {
    if (variant === 'editorial') {
      return (
        '<section style="padding:28px 18px 24px;text-align:center"><p style="font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--a);margin-bottom:14px">' +
        esc(v.eyebrow) +
        '</p><h1 style="font-size:clamp(2.1rem,9vw,2.7rem);font-weight:800;letter-spacing:-.045em;line-height:1.02;margin-bottom:12px">' +
        esc(v.headline) +
        '<span style="display:block;color:var(--a2)">' +
        esc(v.accent) +
        '</span></h1><p style="color:var(--muted);max-width:28ch;margin:0 auto 18px">' +
        esc(v.sub) +
        '</p><div style="height:3px;width:48px;margin:0 auto 20px;border-radius:99px;background:linear-gradient(90deg,var(--a),var(--a2))"></div><a class="cta" href="' +
        esc(v.href) +
        '">' +
        esc(v.cta) +
        '</a></section>'
      );
    }
    if (variant === 'banner') {
      return (
        '<section style="margin:10px 14px 18px;padding:22px 16px;border-radius:22px;background:linear-gradient(145deg,color-mix(in srgb,var(--a) 28%,#111),var(--surface));border:1px solid color-mix(in srgb,var(--a) 30%,transparent)"><p style="font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;opacity:.85;margin-bottom:10px">' +
        esc(v.eyebrow) +
        '</p><h1 style="font-size:clamp(1.75rem,8vw,2.3rem);font-weight:850;letter-spacing:-.04em;line-height:1.05;margin-bottom:10px">' +
        esc(v.headline) +
        ' <em style="font-style:normal;color:var(--a2)">' +
        esc(v.accent) +
        '</em></h1><p style="color:var(--muted);margin-bottom:16px">' +
        esc(v.sub) +
        '</p><a class="cta" href="' +
        esc(v.href) +
        '">' +
        esc(v.cta) +
        '</a></section>'
      );
    }
    if (variant === 'story') {
      return (
        '<section style="min-height:52vh;display:flex;flex-direction:column;justify-content:flex-end;padding:22px 18px 26px;background:radial-gradient(circle at 80% 12%,color-mix(in srgb,var(--a) 30%,transparent),transparent 45%),linear-gradient(180deg,#0000 15%,var(--bg) 88%),var(--surface)"><div style="font-size:.78rem;opacity:.8;margin-bottom:14px">' +
        esc(v.nombre) +
        ' · ' +
        esc(v.eyebrow) +
        '</div><h1 style="font-size:clamp(2rem,9vw,2.55rem);font-weight:850;letter-spacing:-.045em;line-height:1.02;margin-bottom:10px">' +
        esc(v.headline) +
        '<br><em style="font-style:normal;color:var(--a2)">' +
        esc(v.accent) +
        '</em></h1><p style="color:var(--muted);max-width:28ch;margin-bottom:16px">' +
        esc(v.sub) +
        '</p><a class="cta" href="' +
        esc(v.href) +
        '">' +
        esc(v.cta) +
        '</a></section>'
      );
    }
    // impact default
    return (
      '<section style="padding:22px 18px 28px"><p style="font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--a);font-weight:600;margin-bottom:12px">' +
      esc(v.eyebrow) +
      '</p><h1 style="font-size:clamp(1.9rem,8.8vw,2.5rem);font-weight:800;letter-spacing:-.04em;line-height:1.05;margin-bottom:12px">' +
      esc(v.headline) +
      ' <em style="font-style:normal;background:linear-gradient(120deg,var(--a),var(--a2));-webkit-background-clip:text;color:transparent">' +
      esc(v.accent) +
      '</em></h1><p style="color:var(--muted);max-width:30ch;margin-bottom:18px">' +
      esc(v.sub) +
      '</p><a class="cta" href="' +
      esc(v.href) +
      '">' +
      esc(v.cta) +
      '</a></section>'
    );
  }

  /* —— SERVICES —— */
  function renderServices(variant, v) {
    var items = (v.services || []).slice(0, 4);
    if (variant === 'list') {
      return (
        '<section style="padding:6px 18px 22px"><div style="font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:var(--a);font-weight:600;margin-bottom:8px">Servicios</div>' +
        items
          .map(function (s) {
            return (
              '<div style="padding:14px 0;border-top:1px solid rgba(255,255,255,.08)"><strong style="display:block;margin-bottom:4px">' +
              esc(s.title || '') +
              '</strong><span style="color:var(--muted);font-size:.84rem">' +
              esc(s.desc || '') +
              '</span></div>'
            );
          })
          .join('') +
        '</section>'
      );
    }
    if (variant === 'grid') {
      return (
        '<section style="padding:6px 18px 22px"><div style="font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:var(--a);font-weight:600;margin-bottom:10px">Servicios</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
        items
          .map(function (s, i) {
            var span = i === 0 ? 'grid-column:1/-1;' : '';
            var bg =
              i === 0
                ? 'background:linear-gradient(135deg,color-mix(in srgb,var(--a) 32%,#111),var(--surface));'
                : 'background:var(--surface);';
            return (
              '<article style="' +
              span +
              bg +
              'min-height:88px;border-radius:14px;padding:12px;border:1px solid rgba(255,255,255,.07)"><strong style="display:block;font-size:.88rem;margin-bottom:4px">' +
              esc(s.title || '') +
              '</strong><span style="color:var(--muted);font-size:.75rem">' +
              esc(s.desc || '') +
              '</span></article>'
            );
          })
          .join('') +
        '</div></section>'
      );
    }
    if (variant === 'steps') {
      return (
        '<section style="padding:6px 18px 22px"><div style="font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:var(--a);font-weight:600;margin-bottom:10px">Cómo trabajamos</div>' +
        items
          .map(function (s, i) {
            return (
              '<div style="display:grid;grid-template-columns:28px 1fr;gap:10px;margin:12px 0"><div style="width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:var(--a);color:#fff;font-size:.75rem;font-weight:700">' +
              (i + 1) +
              '</div><div><strong style="display:block;font-size:.9rem">' +
              esc(s.title || '') +
              '</strong><span style="color:var(--muted);font-size:.8rem">' +
              esc(s.desc || '') +
              '</span></div></div>'
            );
          })
          .join('') +
        '</section>'
      );
    }
    // cards
    return (
      '<section style="padding:6px 18px 22px"><div style="font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:var(--a);font-weight:600;margin-bottom:8px">Servicios</div><h2 style="font-size:1.25rem;font-weight:750;letter-spacing:-.03em;margin-bottom:12px">Lo que hacemos</h2><div style="display:grid;gap:10px">' +
      items
        .map(function (s) {
          return (
            '<article style="border:1px solid color-mix(in srgb,var(--a) 20%,transparent);border-radius:16px;padding:14px;background:linear-gradient(160deg,color-mix(in srgb,var(--a) 10%,transparent),rgba(255,255,255,.02))"><strong style="display:block;margin-bottom:4px">' +
            esc(s.title || '') +
            '</strong><span style="color:var(--muted);font-size:.82rem">' +
            esc(s.desc || '') +
            '</span></article>'
          );
        })
        .join('') +
      '</div></section>'
    );
  }

  /* —— PROOF —— */
  function renderProof(variant, v) {
    if (variant === 'none') return '';
    if (variant === 'chips') {
      return (
        '<section style="padding:4px 18px 20px"><div style="display:flex;flex-wrap:wrap;gap:6px">' +
        (v.reasons || [])
          .map(function (r) {
            return (
              '<span style="font-size:.72rem;padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)">' +
              esc(r) +
              '</span>'
            );
          })
          .join('') +
        '</div></section>'
      );
    }
    if (variant === 'quote') {
      return (
        '<section style="padding:8px 18px 22px"><blockquote style="margin:0;padding:18px;border-radius:18px;background:var(--surface);border-left:3px solid var(--a);font-size:1.05rem;font-weight:600;letter-spacing:-.02em;line-height:1.35">“' +
        esc(v.quote) +
        '”</blockquote></section>'
      );
    }
    return (
      '<section style="padding:6px 18px 22px"><div style="font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:var(--a);font-weight:600;margin-bottom:8px">Por qué nosotros</div><div style="display:grid;gap:8px">' +
      (v.reasons || [])
        .map(function (r) {
          return (
            '<div style="display:flex;gap:10px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);font-size:.86rem"><i style="width:7px;height:7px;margin-top:6px;border-radius:50%;background:var(--a);flex:none;display:block"></i><span>' +
            esc(r) +
            '</span></div>'
          );
        })
        .join('') +
      '</div></section>'
    );
  }

  /* —— CONTACT —— */
  function renderContact(variant, v) {
    if (variant === 'sticky') {
      return (
        '<div style="padding:8px 18px 10px"><a class="cta" style="width:100%;position:sticky;bottom:14px" href="' +
        esc(v.href) +
        '" id="c">' +
        esc(v.cta) +
        '</a></div>'
      );
    }
    if (variant === 'panel') {
      return (
        '<section id="c" style="margin:8px 18px 20px;padding:22px 18px;border-radius:22px;background:var(--surface);text-align:center"><h2 style="font-size:1.2rem;margin-bottom:6px">' +
        esc(v.contactTitle) +
        '</h2><p style="color:var(--muted);font-size:.86rem;margin:0 0 14px">' +
        esc(v.contactText) +
        '</p><a class="cta" href="' +
        esc(v.href) +
        '">WhatsApp</a></section>'
      );
    }
    return (
      '<section id="c" style="margin:8px 18px 20px;padding:18px;border-radius:18px;border:1px solid color-mix(in srgb,var(--a) 22%,transparent);background:linear-gradient(145deg,#0d1b30,var(--surface))"><h2 style="font-size:1.15rem">' +
      esc(v.contactTitle) +
      '</h2><p style="color:var(--muted);font-size:.85rem;margin:6px 0 14px">' +
      esc(v.contactText) +
      '</p><a class="cta" href="' +
      esc(v.href) +
      '">WhatsApp</a></section>'
    );
  }

  window.febrosBuildWebHtml = function (content, data) {
    var plan = planFromAiOrAlgo(content, data || {});
    var v = normalizeCopy(content, data || {});
    var html =
      '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' +
      esc(v.nombre) +
      '</title><style>' +
      baseCss(v.palette) +
      '</style></head><body>' +
      renderNav(plan.nav, v) +
      renderHero(plan.hero, v) +
      renderServices(plan.services, v) +
      renderProof(plan.proof, v) +
      renderContact(plan.contact, v) +
      '<footer class="foot">Hecho con FEBROS</footer></body></html>';
    return html;
  };
})();
