/* Webs templates — 40 local mobile landings (no Gemini).
 * Client fields injected via varsFrom(data). Random pick + estilo bias.
 */
(function () {
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

  function varsFrom(data) {
    var d = data || {};
    var nombre = String(d.nombre || 'Demo').trim() || 'Demo';
    var rubro = String(d.rubro || 'Negocio').trim() || 'Negocio';
    var ciudad = String(d.ciudad || 'Uruguay').trim() || 'Uruguay';
    var frase = String(d.frase || '').trim() || ('Atención real en ' + ciudad + ', sin vueltas.');
    var estilo = String(d.estilo || 'moderno').trim();
    var whatsapp = String(d.whatsapp || '092 331 019').trim();
    return {
      nombre: nombre,
      rubro: rubro,
      ciudad: ciudad,
      frase: frase,
      estilo: estilo,
      whatsapp: whatsapp,
      n: esc(nombre),
      r: esc(rubro),
      c: esc(ciudad),
      f: esc(frase),
      w: esc(whatsapp),
      e: esc(estilo),
      href: esc(waLink(whatsapp))
    };
  }

  function doc(title, css, body) {
    var fonts =
      '<link rel="preconnect" href="https://fonts.googleapis.com">' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=Fraunces:opsz,wght@9..144,500;700&family=Instrument+Sans:wght@400;600;700&family=Space+Grotesk:wght@500;700&family=DM+Sans:wght@400;600;700&family=Outfit:wght@500;700;800&display=swap" rel="stylesheet">';
    return (
      '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>' +
      title +
      '</title>' +
      fonts +
      '<style>' +
      css +
      '</style></head><body>' +
      body +
      '</body></html>'
    );
  }

  var TEMPLATES = [
    {
      id: 'editorial',
      name: 'Editorial type',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0A0A0B;color:#F4F1EC;font-family:\'Instrument Sans\',system-ui,sans-serif}\n.top{padding:22px 20px 8px;display:flex;justify-content:space-between;align-items:center;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#8B8680}\n.hero{padding:28px 20px 36px}\n.hero h1{font-family:\'Fraunces\',Georgia,serif;font-size:clamp(2.4rem,11vw,3.4rem);line-height:.95;font-weight:700;letter-spacing:-.03em}\n.hero h1 em{font-style:italic;color:#E8C878}\n.hero p{margin-top:16px;color:#A39E96;font-size:.95rem;line-height:1.5;max-width:28ch}\n.cta{margin-top:22px;display:inline-flex;padding:14px 22px;background:#F4F1EC;color:#0A0A0B;font-weight:700;border-radius:999px;font-size:.9rem}\n.rule{height:1px;background:#2A2826;margin:0 20px}\n.sec{padding:28px 20px}\n.sec h2{font-family:\'Fraunces\',serif;font-size:1.35rem;margin-bottom:14px}\n.item{padding:14px 0;border-bottom:1px solid #2A2826}\n.item strong{display:block;font-size:.95rem;margin-bottom:4px}\n.item span{color:#8B8680;font-size:.82rem;line-height:1.4}\n.quote{padding:28px 20px 40px;font-family:\'Fraunces\',serif;font-size:1.45rem;line-height:1.25;color:#E8C878}\n.foot{padding:0 20px 36px;font-size:.7rem;color:#5C5852}\n', 
'<div class="top"><span>'+v.r+' · '+v.c+'</span><span>'+v.n+'</span></div>'+
'<section class="hero"><h1>'+v.n+'<br><em>sin vueltas.</em></h1><p>'+v.f+'</p><a class="cta" href="'+v.href+'">Escribir por WhatsApp</a></section>'+
'<div class="rule"></div>'+
'<section class="sec"><h2>Qué ofrecemos</h2>'+
'<div class="item"><strong>Atención de '+v.r+'</strong><span>Hecho a medida para '+v.c+'.</span></div>'+
'<div class="item"><strong>Respuesta rápida</strong><span>Te contestamos por WhatsApp.</span></div>'+
'<div class="item"><strong>Resultados claros</strong><span>Sin humo: lo que ves es lo que hay.</span></div></section>'+
'<p class="quote">“'+v.f+'”</p>'+
'<p class="foot">'+v.n+' · '+v.c+' · '+v.w+'</p>'
);
      }
    },
    {
      id: 'bento',
      name: 'Bento grid',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#05070C;color:#EEF2F7;font-family:\'Outfit\',system-ui,sans-serif}\n.wrap{padding:16px;display:grid;gap:10px}\n.cell{background:#0E1420;border:1px solid #1C2638;border-radius:18px;padding:16px}\n.cell.hero{padding:22px 18px;background:linear-gradient(160deg,#121A2A,#0A101A);min-height:210px;display:flex;flex-direction:column;justify-content:flex-end}\n.cell.hero h1{font-size:2rem;line-height:1;letter-spacing:-.03em;font-weight:800}\n.cell.hero p{margin-top:10px;color:#8FA0B8;font-size:.85rem}\n.accent{background:linear-gradient(135deg,#FF7300,#FF9A3C);color:#fff;border:none}\n.accent a{font-weight:800;font-size:1rem}\n.tag{font-size:.65rem;letter-spacing:.16em;text-transform:uppercase;color:#6F8098;margin-bottom:8px}\n.mini h3{font-size:.95rem;margin-bottom:4px}\n.mini p{color:#8090A8;font-size:.78rem;line-height:1.35}\n.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}\n', 
'<div class="wrap">'+
'<div class="cell hero"><div class="tag">'+v.r+' · '+v.c+'</div><h1>'+v.n+'</h1><p>'+v.f+'</p></div>'+
'<div class="cell accent"><a href="'+v.href+'">WhatsApp → '+v.w+'</a></div>'+
'<div class="row">'+
'<div class="cell mini"><h3>Servicio</h3><p>Lo esencial de '+v.r+'.</p></div>'+
'<div class="cell mini"><h3>Zona</h3><p>Atendemos en '+v.c+'.</p></div></div>'+
'<div class="cell mini"><h3>Por qué nosotros</h3><p>Simple, moderno y directo. '+v.f+'</p></div>'+
'</div>'
);
      }
    },
    {
      id: 'neon',
      name: 'Neon bold',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#040406;color:#fff;font-family:\'Syne\',system-ui,sans-serif}\n.bar{height:4px;background:linear-gradient(90deg,#FF2D55,#FF7300,#FFE566)}\n.pad{padding:24px 18px}\n.kicker{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#FF2D55;margin-bottom:12px}\nh1{font-size:clamp(2.6rem,12vw,3.6rem);line-height:.9;font-weight:800;letter-spacing:-.04em;text-transform:uppercase}\nh1 span{display:block;background:linear-gradient(90deg,#FF2D55,#FF9538);-webkit-background-clip:text;background-clip:text;color:transparent}\n.sub{margin:18px 0 24px;color:#A8A0B0;font-family:\'DM Sans\',sans-serif;font-size:.95rem;line-height:1.45}\n.cta{display:block;text-align:center;padding:16px;border-radius:14px;background:#FF2D55;font-weight:800;box-shadow:0 0 40px rgba(255,45,85,.35)}\n.list{margin-top:28px;display:grid;gap:12px;font-family:\'DM Sans\',sans-serif}\n.list div{padding:14px 16px;border:1px solid #222;border-radius:12px;background:#0C0C10}\n.list strong{display:block;margin-bottom:2px}\n.list span{color:#8A8294;font-size:.8rem}\n', 
'<div class="bar"></div><div class="pad">'+
'<div class="kicker">'+v.r+' / '+v.c+'</div>'+
'<h1>'+v.n+'<span>ahora.</span></h1>'+
'<p class="sub">'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">HABLAR AHORA</a>'+
'<div class="list">'+
'<div><strong>01 · Especialistas</strong><span>'+v.r+' con criterio.</span></div>'+
'<div><strong>02 · Cerca tuyo</strong><span>En '+v.c+'.</span></div>'+
'<div><strong>03 · Sin vueltas</strong><span>Pedí por WhatsApp: '+v.w+'</span></div>'+
'</div></div>'
);
      }
    },
    {
      id: 'warm',
      name: 'Warm soft',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#1A120E;color:#F6EDE4;font-family:\'DM Sans\',system-ui,sans-serif}\n.shell{padding:20px}\n.card{background:#241914;border-radius:28px;padding:26px 20px;border:1px solid #3A2A22}\n.brand{font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:#E07A3A;margin-bottom:18px}\nh1{font-family:\'Fraunces\',serif;font-size:2.35rem;line-height:1.05;margin-bottom:12px}\np.lead{color:#C4A994;line-height:1.5;margin-bottom:22px}\n.cta{display:inline-flex;padding:13px 20px;border-radius:999px;background:#E07A3A;color:#1A120E;font-weight:700}\n.grid{margin-top:14px;display:grid;gap:10px}\n.tile{background:#1A120E;border-radius:18px;padding:16px;border:1px solid #3A2A22}\n.tile b{display:block;margin-bottom:4px}\n.tile span{color:#A88878;font-size:.82rem}\n', 
'<div class="shell"><div class="card">'+
'<div class="brand">'+v.n+' · '+v.c+'</div>'+
'<h1>Bienvenido a<br>'+v.n+'</h1>'+
'<p class="lead">'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Reservar por WhatsApp</a>'+
'<div class="grid">'+
'<div class="tile"><b>'+v.r+'</b><span>Calidad y calidez en cada detalle.</span></div>'+
'<div class="tile"><b>En '+v.c+'</b><span>Atención cercana, respuesta rápida.</span></div>'+
'<div class="tile"><b>'+v.w+'</b><span>Escribinos cuando quieras.</span></div>'+
'</div></div></div>'
);
      }
    },
    {
      id: 'minimal',
      name: 'Minimal mono',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#F7F6F3;color:#111;font-family:\'Space Grotesk\',system-ui,sans-serif}\n.nav{padding:18px 20px;display:flex;justify-content:space-between;font-size:.8rem;border-bottom:1px solid #E4E1DA}\n.hero{padding:48px 20px 32px}\nh1{font-size:2.6rem;line-height:.95;letter-spacing:-.04em;font-weight:700;max-width:10ch}\n.meta{margin-top:18px;color:#666;font-size:.85rem;line-height:1.5}\n.cta{margin:28px 20px;display:block;text-align:center;padding:15px;border:1.5px solid #111;font-weight:700;border-radius:4px}\n.sec{padding:8px 20px 40px}\n.sec li{list-style:none;padding:16px 0;border-top:1px solid #E4E1DA;font-size:.92rem}\n.sec li span{display:block;color:#777;font-size:.8rem;margin-top:4px;font-weight:400}\n', 
'<div class="nav"><strong>'+v.n+'</strong><span>'+v.c+'</span></div>'+
'<section class="hero"><h1>'+v.r+' con foco.</h1><p class="meta">'+v.f+'</p></section>'+
'<a class="cta" href="'+v.href+'">Contactar</a>'+
'<ul class="sec">'+
'<li>Propuesta clara<span>'+v.f+'</span></li>'+
'<li>Ubicación<span>'+v.c+'</span></li>'+
'<li>WhatsApp<span>'+v.w+'</span></li>'+
'</ul>'
);
      }
    },
    {
      id: 'mesh',
      name: 'Gradient mesh',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#070A12;color:#F2F5FA;font-family:\'Outfit\',system-ui,sans-serif;position:relative;overflow-x:hidden}\n.blob{position:fixed;width:280px;height:280px;border-radius:50%;filter:blur(70px);opacity:.55;pointer-events:none;z-index:0}\n.b1{top:-60px;right:-40px;background:#3B82F6}\n.b2{top:180px;left:-80px;background:#A855F7}\n.b3{bottom:40px;right:10px;background:#F97316;opacity:.35}\n.content{position:relative;z-index:1;padding:28px 20px 48px}\n.pill{display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:18px}\nh1{font-size:2.5rem;line-height:1.02;font-weight:800;letter-spacing:-.03em}\np{margin:14px 0 24px;color:#B7C0D0;line-height:1.5}\n.cta{display:inline-flex;padding:14px 22px;border-radius:999px;background:#fff;color:#070A12;font-weight:800}\n.cards{margin-top:32px;display:grid;gap:10px}\n.cards div{padding:16px;border-radius:16px;background:rgba(255,255,255,.06);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.1)}\n.cards b{display:block;margin-bottom:4px}\n.cards span{color:#9AA6BA;font-size:.8rem}\n', 
'<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>'+
'<div class="content"><div class="pill">'+v.r+' · '+v.c+'</div>'+
'<h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Abrir WhatsApp</a>'+
'<div class="cards">'+
'<div><b>Experiencia</b><span>Especialistas en '+v.r+'.</span></div>'+
'<div><b>Local</b><span>Cerca en '+v.c+'.</span></div>'+
'<div><b>Directo</b><span>'+v.w+'</span></div></div></div>'
);
      }
    },
    {
      id: 'magazine',
      name: 'Magazine',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#111;color:#F5F2EA;font-family:\'Instrument Sans\',system-ui,sans-serif}\n.mast{padding:14px 16px;border-bottom:2px solid #F5F2EA;display:flex;justify-content:space-between;align-items:baseline}\n.mast strong{font-family:\'Fraunces\',serif;font-size:1.1rem}\n.mast span{font-size:.65rem;letter-spacing:.16em;text-transform:uppercase;opacity:.6}\n.cover{padding:28px 16px;border-bottom:1px solid #333}\n.cover .vol{font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:#E8C878;margin-bottom:10px}\n.cover h1{font-family:\'Fraunces\',serif;font-size:2.8rem;line-height:.92;letter-spacing:-.03em}\n.cover p{margin-top:14px;font-size:.9rem;color:#B8B3A8;max-width:32ch;line-height:1.45}\n.cols{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#333;border-bottom:1px solid #333}\n.cols article{background:#111;padding:18px 14px}\n.cols h3{font-size:.85rem;margin-bottom:6px}\n.cols p{font-size:.75rem;color:#9A958A;line-height:1.4}\n.cta{margin:20px 16px 36px;display:block;text-align:center;padding:14px;background:#F5F2EA;color:#111;font-weight:700}\n', 
'<div class="mast"><strong>'+v.n+'</strong><span>'+v.c+'</span></div>'+
'<section class="cover"><div class="vol">Edición · '+v.r+'</div><h1>'+v.n+'</h1><p>'+v.f+'</p></section>'+
'<div class="cols"><article><h3>El enfoque</h3><p>Trabajamos '+v.r+' con criterio y detalle.</p></article>'+
'<article><h3>La zona</h3><p>Atención en '+v.c+' y alrededores.</p></article></div>'+
'<a class="cta" href="'+v.href+'">WhatsApp '+v.w+'</a>'
);
      }
    },
    {
      id: 'sticky',
      name: 'Sticky CTA',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0B1220;color:#E8EEF7;font-family:\'DM Sans\',system-ui,sans-serif;padding-bottom:88px}\n.hero{padding:32px 20px 20px;background:radial-gradient(ellipse at top,#1A2740,#0B1220 70%)}\n.badge{display:inline-block;padding:5px 10px;border-radius:8px;background:#163056;color:#7DD3FC;font-size:.7rem;font-weight:700;margin-bottom:14px}\nh1{font-family:\'Outfit\',sans-serif;font-size:2.3rem;line-height:1.05;font-weight:800;letter-spacing:-.03em}\n.lead{margin-top:12px;color:#93A4BC;line-height:1.5}\n.block{margin:14px 16px;padding:18px;border-radius:16px;background:#121A2C;border:1px solid #1E2A40}\n.block h2{font-size:1rem;margin-bottom:8px}\n.block p{color:#8A9BB3;font-size:.85rem;line-height:1.4}\n.sticky{position:fixed;left:12px;right:12px;bottom:12px;z-index:9}\n.sticky a{display:flex;align-items:center;justify-content:center;gap:8px;padding:16px;border-radius:16px;background:linear-gradient(180deg,#34D399,#10B981);color:#042F1E;font-weight:800;box-shadow:0 12px 40px rgba(16,185,129,.35)}\n', 
'<section class="hero"><div class="badge">'+v.r+'</div><h1>'+v.n+'</h1><p class="lead">'+v.f+'</p></section>'+
'<div class="block"><h2>Por qué elegirnos</h2><p>Somos tu mejor opción en '+v.c+'. Simple y directo.</p></div>'+
'<div class="block"><h2>Servicio</h2><p>'+v.r+' pensado para resultados que se notan.</p></div>'+
'<div class="block"><h2>Contacto</h2><p>'+v.w+' · '+v.c+'</p></div>'+
'<div class="sticky"><a href="'+v.href+'">WhatsApp ahora</a></div>'
);
      }
    },
    {
      id: 'steps',
      name: 'Numbered steps',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0C0F14;color:#F0F3F7;font-family:\'Space Grotesk\',system-ui,sans-serif}\n.head{padding:28px 20px 10px}\n.head span{color:#7DD3FC;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase}\nh1{margin-top:10px;font-size:2.1rem;line-height:1.05;letter-spacing:-.03em}\n.sub{margin-top:10px;color:#8B97A8;font-size:.9rem;line-height:1.45}\n.steps{padding:18px 20px 28px;display:grid;gap:12px}\n.step{display:grid;grid-template-columns:48px 1fr;gap:12px;align-items:start;padding:16px;border-radius:16px;background:#141A22;border:1px solid #222B38}\n.num{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:#7DD3FC;color:#0C0F14;font-weight:700;font-size:1.1rem}\n.step h3{font-size:.95rem;margin-bottom:4px}\n.step p{color:#8B97A8;font-size:.8rem;line-height:1.35}\n.cta{margin:0 20px 36px;display:block;text-align:center;padding:15px;border-radius:14px;background:#7DD3FC;color:#0C0F14;font-weight:800}\n', 
'<div class="head"><span>'+v.n+' · '+v.c+'</span><h1>Así de fácil</h1><p class="sub">'+v.f+'</p></div>'+
'<div class="steps">'+
'<div class="step"><div class="num">1</div><div><h3>Contanos</h3><p>Escribinos qué necesitás de '+v.r+'.</p></div></div>'+
'<div class="step"><div class="num">2</div><div><h3>Te guiamos</h3><p>Propuesta clara, sin rodeos.</p></div></div>'+
'<div class="step"><div class="num">3</div><div><h3>Listo</h3><p>Resultados en '+v.c+'.</p></div></div>'+
'</div><a class="cta" href="'+v.href+'">Empezar · '+v.w+'</a>'
);
      }
    },
    {
      id: 'luxury',
      name: 'Luxury gold',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0B0A0F;color:#F3EFE6;font-family:\'Instrument Sans\',system-ui,sans-serif}\n.frame{margin:14px;border:1px solid #C9A24D55;border-radius:20px;padding:28px 20px 32px;background:linear-gradient(180deg,#121018,#0B0A0F)}\n.brand{text-align:center;font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:#C9A24D;margin-bottom:22px}\nh1{text-align:center;font-family:\'Fraunces\',serif;font-size:2.4rem;line-height:1.05;font-weight:500}\n.line{width:48px;height:1px;background:#C9A24D;margin:18px auto}\n.lead{text-align:center;color:#A59B88;font-size:.9rem;line-height:1.5;max-width:28ch;margin:0 auto}\n.cta{display:block;margin:26px auto 0;width:fit-content;padding:12px 24px;border:1px solid #C9A24D;color:#C9A24D;letter-spacing:.08em;text-transform:uppercase;font-size:.75rem;font-weight:600}\n.meta{margin-top:28px;text-align:center;font-size:.75rem;color:#7A7266}\n', 
'<div class="frame"><div class="brand">'+v.r+'</div>'+
'<h1>'+v.n+'</h1><div class="line"></div>'+
'<p class="lead">'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Reservar</a>'+
'<p class="meta">'+v.c+' · '+v.w+'</p></div>'
);
      }
    },
    {
      id: 'glass',
      name: 'Soft glass',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:linear-gradient(165deg,#0F172A,#1E1B4B 55%,#0F172A);color:#F8FAFC;font-family:\'Outfit\',system-ui,sans-serif;min-height:100vh}\n.pad{padding:24px 16px 40px}\n.panel{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(16px);border-radius:24px;padding:22px 18px}\n.panel h1{font-size:2rem;line-height:1.05;font-weight:800;letter-spacing:-.02em}\n.panel .tag{margin-bottom:12px;font-size:.7rem;color:#A5B4FC;letter-spacing:.12em;text-transform:uppercase}\n.panel p{margin:12px 0 18px;color:#CBD5E1;font-size:.9rem;line-height:1.45}\n.cta{display:inline-flex;padding:12px 18px;border-radius:999px;background:#818CF8;color:#0F172A;font-weight:800}\n.stack{margin-top:12px;display:grid;gap:10px}\n.stack .panel{padding:14px 16px}\n.stack b{display:block;font-size:.9rem}\n.stack span{color:#94A3B8;font-size:.78rem}\n', 
'<div class="pad"><div class="panel"><div class="tag">'+v.r+' · '+v.c+'</div>'+
'<h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">WhatsApp</a></div>'+
'<div class="stack">'+
'<div class="panel"><b>Propuesta</b><span>'+v.f+'</span></div>'+
'<div class="panel"><b>Contacto</b><span>'+v.w+'</span></div></div></div>'
);
      }
    },
    {
      id: 'industrial',
      name: 'Industrial mono',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#101010;color:#EAEAEA;font-family:\'Space Grotesk\',system-ui,sans-serif}\n.top{padding:16px;border-bottom:3px solid #EAEAEA;display:flex;justify-content:space-between;font-weight:700;text-transform:uppercase;font-size:.75rem;letter-spacing:.06em}\n.hero{padding:32px 16px}\nh1{font-size:2.8rem;line-height:.9;text-transform:uppercase;letter-spacing:-.04em}\n.box{margin:0 16px 12px;padding:14px;border:2px solid #EAEAEA}\n.box strong{display:block;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}\n.cta{margin:20px 16px 40px;display:block;padding:16px;background:#EAEAEA;color:#101010;text-align:center;font-weight:800;text-transform:uppercase}\n', 
'<div class="top"><span>'+v.n+'</span><span>'+v.c+'</span></div>'+
'<section class="hero"><h1>'+v.r+'<br>sin filtro.</h1></section>'+
'<div class="box"><strong>Brief</strong>'+v.f+'</div>'+
'<div class="box"><strong>Canal</strong>WhatsApp '+v.w+'</div>'+
'<a class="cta" href="'+v.href+'">Contactar</a>'
);
      }
    },
    {
      id: 'strip',
      name: 'Vertical brand strip',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#07090E;color:#F1F5F9;font-family:\'Outfit\',system-ui,sans-serif;display:grid;grid-template-columns:56px 1fr;min-height:100vh}\n.rail{background:#FF7300;color:#1A0A00;writing-mode:vertical-rl;transform:rotate(180deg);display:flex;align-items:center;justify-content:center;font-weight:800;letter-spacing:.18em;text-transform:uppercase;font-size:.75rem;padding:18px 0}\n.main{padding:24px 18px 40px}\n.k{font-size:.7rem;color:#94A3B8;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px}\nh1{font-size:2.2rem;line-height:1.02;font-weight:800;letter-spacing:-.03em}\np{margin:12px 0 20px;color:#94A3B8;line-height:1.5}\n.cta{display:inline-flex;padding:13px 18px;background:#FF7300;color:#1A0A00;font-weight:800;border-radius:10px}\n.list{margin-top:28px;display:grid;gap:10px}\n.list div{padding-bottom:10px;border-bottom:1px solid #1E293B;font-size:.88rem}\n.list span{display:block;color:#64748B;font-size:.78rem;margin-top:3px}\n', 
'<div class="rail">'+v.n+'</div><div class="main">'+
'<div class="k">'+v.r+' · '+v.c+'</div>'+
'<h1>Tu mejor opción.</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">WhatsApp</a>'+
'<div class="list">'+
'<div>Servicio<span>'+v.r+' con foco en resultados.</span></div>'+
'<div>Zona<span>'+v.c+'</span></div>'+
'<div>Tel<span>'+v.w+'</span></div></div></div>'
);
      }
    },
    {
      id: 'stats',
      name: 'Big stats',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#050B16;color:#F0EEE8;font-family:\'Syne\',system-ui,sans-serif}\n.pad{padding:26px 18px 40px}\nh1{font-size:2rem;line-height:1.05;font-weight:800}\n.sub{margin:10px 0 22px;color:#8A9BB0;font-family:\'DM Sans\',sans-serif;line-height:1.45}\n.stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}\n.stat{background:#0A1526;border-radius:16px;padding:18px 14px;border:1px solid #1A2A40}\n.stat b{display:block;font-size:1.8rem;color:#FF7300;line-height:1}\n.stat span{display:block;margin-top:6px;font-size:.72rem;color:#8A9BB0;font-family:\'DM Sans\',sans-serif}\n.cta{display:block;text-align:center;padding:15px;border-radius:14px;background:#FF7300;font-weight:800;font-family:\'DM Sans\',sans-serif}\n.note{margin-top:14px;text-align:center;font-size:.75rem;color:#5A7089;font-family:\'DM Sans\',sans-serif}\n', 
'<div class="pad"><h1>'+v.n+'</h1><p class="sub">'+v.f+'</p>'+
'<div class="stats">'+
'<div class="stat"><b>24/7</b><span>WhatsApp abierto</span></div>'+
'<div class="stat"><b>TOP</b><span>'+v.r+' en '+v.c+'</span></div>'+
'<div class="stat"><b>100%</b><span>Sin vueltas</span></div>'+
'<div class="stat"><b>YA</b><span>Respuesta rápida</span></div></div>'+
'<a class="cta" href="'+v.href+'">Escribinos</a>'+
'<p class="note">'+v.w+' · '+v.c+'</p></div>'
);
      }
    },
    {
      id: 'chapters',
      name: 'Story chapters',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0E0E10;color:#F5F5F4;font-family:\'Fraunces\',Georgia,serif}\n.ch{padding:28px 20px;border-bottom:1px solid #2A2A2E}\n.ch .n{font-family:\'Instrument Sans\',sans-serif;font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:#A1A1AA;margin-bottom:10px}\n.ch h2{font-size:1.7rem;line-height:1.1;font-weight:700}\n.ch p{margin-top:10px;font-family:\'Instrument Sans\',sans-serif;color:#A1A1AA;font-size:.9rem;line-height:1.45}\n.cta{margin:24px 20px 40px;display:block;text-align:center;padding:14px;background:#F5F5F4;color:#0E0E10;font-family:\'Instrument Sans\',sans-serif;font-weight:700;border-radius:999px}\n', 
'<section class="ch"><div class="n">Capítulo 01</div><h2>'+v.n+'</h2><p>'+v.r+' en '+v.c+'.</p></section>'+
'<section class="ch"><div class="n">Capítulo 02</div><h2>La promesa</h2><p>'+v.f+'</p></section>'+
'<section class="ch"><div class="n">Capítulo 03</div><h2>El siguiente paso</h2><p>Escribinos al '+v.w+' y lo vemos.</p></section>'+
'<a class="cta" href="'+v.href+'">Continuar en WhatsApp</a>'
);
      }
    },
    {
      id: 'chips',
      name: 'Chip cloud',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#08111F;color:#EAF0F8;font-family:\'Outfit\',system-ui,sans-serif}\n.pad{padding:28px 18px 40px}\nh1{font-size:2.3rem;line-height:1.02;font-weight:800;letter-spacing:-.03em;max-width:12ch}\n.lead{margin:12px 0 20px;color:#90A0B8;line-height:1.45}\n.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}\n.chips span{padding:8px 12px;border-radius:999px;background:#122036;border:1px solid #1E3350;font-size:.78rem;color:#B8C7DA}\n.cta{display:inline-flex;padding:14px 20px;border-radius:999px;background:#38BDF8;color:#082F49;font-weight:800}\n.foot{margin-top:22px;font-size:.75rem;color:#64748B}\n', 
'<div class="pad"><h1>'+v.n+'</h1><p class="lead">'+v.f+'</p>'+
'<div class="chips">'+
'<span>'+v.r+'</span><span>'+v.c+'</span><span>WhatsApp</span><span>Rápido</span><span>Claro</span><span>Moderno</span>'+
'</div><a class="cta" href="'+v.href+'">Hablar ahora</a>'+
'<p class="foot">'+v.w+'</p></div>'
);
      }
    },
    {
      id: 'asymmetric',
      name: 'Asymmetric blocks',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#09090B;color:#FAFAFA;font-family:\'Syne\',system-ui,sans-serif}\n.a{margin:16px 16px 10px;padding:28px 18px;background:#18181B;border-radius:28px 28px 8px 28px}\n.a h1{font-size:2.2rem;line-height:.98;font-weight:800}\n.a p{margin-top:10px;color:#A1A1AA;font-family:\'DM Sans\',sans-serif;font-size:.88rem;line-height:1.45}\n.b{margin:0 16px 10px 40px;padding:18px;background:#FF7300;color:#1C0A00;border-radius:8px 28px 28px 28px;font-family:\'DM Sans\',sans-serif;font-weight:700}\n.c{margin:0 40px 10px 16px;padding:18px;background:#27272A;border-radius:28px 8px 28px 28px;font-family:\'DM Sans\',sans-serif;font-size:.88rem;color:#D4D4D8}\n.d{margin:0 16px 36px;padding:16px;text-align:center;border:1px dashed #3F3F46;border-radius:18px;font-family:\'DM Sans\',sans-serif}\n.d a{font-weight:800;color:#FF7300}\n', 
'<div class="a"><h1>'+v.n+'</h1><p>'+v.f+'</p></div>'+
'<div class="b">'+v.r+' · '+v.c+'</div>'+
'<div class="c">Pedí turno o consulta al instante. Sin formularios eternos.</div>'+
'<div class="d"><a href="'+v.href+'">WhatsApp '+v.w+' →</a></div>'
);
      }
    },
    {
      id: 'energy',
      name: 'Energy fitness',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#050505;color:#fff;font-family:\'Outfit\',system-ui,sans-serif}\n.hero{padding:36px 18px 24px;background:linear-gradient(180deg,#1A0505,#050505)}\n.k{color:#FB7185;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;font-weight:700}\nh1{margin-top:10px;font-size:2.7rem;line-height:.92;font-weight:800;text-transform:uppercase;letter-spacing:-.03em}\np{margin:14px 0 20px;color:#CBD5E1;font-size:.92rem;line-height:1.45;max-width:30ch}\n.cta{display:inline-flex;padding:14px 22px;background:#FB7185;color:#3F0A12;font-weight:800;border-radius:6px;text-transform:uppercase;letter-spacing:.04em}\n.row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:8px 18px 36px}\n.row div{background:#111;padding:14px 8px;text-align:center;border-radius:10px;font-size:.72rem;color:#94A3B8}\n.row b{display:block;color:#fff;font-size:1rem;margin-bottom:4px}\n', 
'<section class="hero"><div class="k">'+v.r+'</div><h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Empezar</a></section>'+
'<div class="row"><div><b>GO</b>'+v.c+'</div><div><b>WA</b>Chat</div><div><b>NOW</b>'+v.w+'</div></div>'
);
      }
    },
    {
      id: 'boutique',
      name: 'Boutique fashion',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#FAFAF8;color:#171717;font-family:\'Instrument Sans\',system-ui,sans-serif}\n.nav{padding:18px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #E7E5E4}\n.nav strong{font-family:\'Fraunces\',serif;font-size:1.15rem;font-weight:500}\n.nav span{font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:#78716C}\n.hero{padding:40px 18px 24px;text-align:center}\n.hero h1{font-family:\'Fraunces\',serif;font-size:2.6rem;line-height:1;font-weight:500}\n.hero p{margin:16px auto 0;max-width:28ch;color:#78716C;line-height:1.5}\n.cta{margin:28px 18px;display:block;text-align:center;padding:14px;background:#171717;color:#FAFAF8;letter-spacing:.08em;text-transform:uppercase;font-size:.75rem}\n.grid{padding:0 18px 40px;display:grid;gap:1px;background:#E7E5E4}\n.grid div{background:#FAFAF8;padding:18px;text-align:center;font-size:.85rem}\n.grid span{display:block;margin-top:4px;color:#A8A29E;font-size:.75rem}\n', 
'<div class="nav"><strong>'+v.n+'</strong><span>'+v.c+'</span></div>'+
'<section class="hero"><h1>'+v.r+'</h1><p>'+v.f+'</p></section>'+
'<a class="cta" href="'+v.href+'">Consultar</a>'+
'<div class="grid"><div>Pieza 01<span>Selección cuidada</span></div><div>Pieza 02<span>Atención personal</span></div><div>WhatsApp<span>'+v.w+'</span></div></div>'
);
      }
    },
    {
      id: 'cafe',
      name: 'Cafe menu',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#1C1410;color:#F5E6D3;font-family:\'Fraunces\',Georgia,serif}\n.head{padding:28px 18px 10px;text-align:center}\n.head .mark{font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:#D4A574;font-family:\'Instrument Sans\',sans-serif}\nh1{margin-top:10px;font-size:2.4rem}\n.menu{padding:10px 22px 20px}\n.row{display:flex;justify-content:space-between;gap:12px;padding:14px 0;border-bottom:1px dashed #3A2E26;font-size:.95rem}\n.row span{color:#B89A7E;font-family:\'Instrument Sans\',sans-serif;font-size:.8rem;text-align:right}\n.note{padding:8px 22px 20px;text-align:center;font-family:\'Instrument Sans\',sans-serif;color:#B89A7E;font-size:.85rem;line-height:1.45}\n.cta{margin:0 22px 36px;display:block;text-align:center;padding:14px;background:#D4A574;color:#1C1410;font-family:\'Instrument Sans\',sans-serif;font-weight:700;border-radius:999px}\n', 
'<div class="head"><div class="mark">'+v.c+'</div><h1>'+v.n+'</h1></div>'+
'<div class="menu">'+
'<div class="row"><b>Especialidad</b><span>'+v.r+'</span></div>'+
'<div class="row"><b>Propuesta</b><span>Calidad diaria</span></div>'+
'<div class="row"><b>Pedidos</b><span>WhatsApp</span></div></div>'+
'<p class="note">'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Pedir · '+v.w+'</a>'
);
      }
    },
    {
      id: 'spa',
      name: 'Spa calm',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0F1614;color:#E8F0EC;font-family:\'Instrument Sans\',system-ui,sans-serif}\n.pad{padding:36px 20px 40px;text-align:center}\n.orb{width:72px;height:72px;margin:0 auto 22px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#A7F3D0,#0D9488)}\nh1{font-family:\'Fraunces\',serif;font-size:2.3rem;font-weight:500;line-height:1.1}\n.tag{margin-top:8px;color:#6EE7B7;font-size:.75rem;letter-spacing:.16em;text-transform:uppercase}\np{margin:18px auto;max-width:28ch;color:#9CB5AB;line-height:1.5}\n.cta{display:inline-flex;padding:13px 22px;border-radius:999px;border:1px solid #6EE7B7;color:#6EE7B7;font-weight:600}\n.meta{margin-top:28px;font-size:.75rem;color:#6B7F76}\n', 
'<div class="pad"><div class="orb"></div><h1>'+v.n+'</h1>'+
'<div class="tag">'+v.r+' · '+v.c+'</div><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Agendar</a>'+
'<p class="meta">'+v.w+'</p></div>'
);
      }
    },
    {
      id: 'tech',
      name: 'Tech service',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#020617;color:#E2E8F0;font-family:\'Space Grotesk\',system-ui,sans-serif}\n.top{padding:16px 18px;display:flex;justify-content:space-between;border-bottom:1px solid #1E293B;font-size:.75rem;color:#64748B}\n.dot{width:8px;height:8px;border-radius:50%;background:#22C55E;display:inline-block;margin-right:6px}\n.pad{padding:28px 18px}\nh1{font-size:2.1rem;line-height:1.05;letter-spacing:-.03em}\n.code{margin:16px 0;padding:14px;border-radius:12px;background:#0F172A;border:1px solid #1E293B;font-size:.8rem;color:#94A3B8;line-height:1.5}\n.cta{display:block;text-align:center;padding:14px;border-radius:10px;background:#22C55E;color:#052E16;font-weight:800}\n.kv{margin-top:18px;display:grid;gap:8px;font-size:.82rem}\n.kv div{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1E293B;color:#94A3B8}\n.kv b{color:#E2E8F0}\n', 
'<div class="top"><span><i class="dot"></i>online</span><span>'+v.n+'</span></div>'+
'<div class="pad"><h1>'+v.r+' que escala.</h1>'+
'<div class="code">// '+v.c+'<br>status: ready<br>channel: whatsapp<br>msg: '+v.f+'</div>'+
'<a class="cta" href="'+v.href+'">Conectar</a>'+
'<div class="kv"><div><span>marca</span><b>'+v.n+'</b></div><div><span>tel</span><b>'+v.w+'</b></div></div></div>'
);
      }
    },
    {
      id: 'poster',
      name: 'Poster brutal',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#FFEDD5;color:#111;font-family:\'Syne\',system-ui,sans-serif}\n.sheet{min-height:100vh;padding:18px;display:flex;flex-direction:column}\n.stamp{align-self:flex-start;padding:6px 10px;background:#111;color:#FFEDD5;font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}\nh1{margin-top:28px;font-size:clamp(2.8rem,14vw,4rem);line-height:.85;font-weight:800;text-transform:uppercase;letter-spacing:-.05em}\n.band{margin-top:auto;background:#111;color:#FFEDD5;padding:18px;border-radius:8px}\n.band p{font-family:\'DM Sans\',sans-serif;font-size:.9rem;line-height:1.4;margin-bottom:12px}\n.band a{font-weight:800;text-decoration:underline}\n', 
'<div class="sheet"><div class="stamp">'+v.r+' / '+v.c+'</div>'+
'<h1>'+v.n+'</h1>'+
'<div class="band"><p>'+v.f+'</p><a href="'+v.href+'">WhatsApp '+v.w+'</a></div></div>'
);
      }
    },
    {
      id: 'app',
      name: 'App-like shell',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0B0F19;color:#F1F5F9;font-family:\'Outfit\',system-ui,sans-serif}\n.status{padding:10px 16px;display:flex;justify-content:space-between;font-size:.65rem;color:#64748B}\n.card{margin:8px 14px;padding:20px 16px;border-radius:22px;background:#121826;border:1px solid #1F2A3D}\n.card h1{font-size:1.7rem;font-weight:800;letter-spacing:-.02em}\n.card p{margin-top:8px;color:#94A3B8;font-size:.88rem;line-height:1.45}\n.actions{margin:14px;display:grid;gap:8px}\n.actions a{display:block;text-align:center;padding:14px;border-radius:14px;font-weight:800}\n.primary{background:#FF7300;color:#fff}\n.ghost{background:#121826;border:1px solid #1F2A3D;color:#CBD5E1}\n.list{margin:6px 14px 30px;border-radius:18px;overflow:hidden;border:1px solid #1F2A3D}\n.list div{padding:14px 16px;background:#121826;border-bottom:1px solid #1F2A3D;display:flex;justify-content:space-between;font-size:.85rem}\n.list div:last-child{border-bottom:0}\n.list span{color:#64748B}\n', 
'<div class="status"><span>FEBROS preview</span><span>'+v.c+'</span></div>'+
'<div class="card"><h1>'+v.n+'</h1><p>'+v.f+'</p></div>'+
'<div class="actions"><a class="primary" href="'+v.href+'">Abrir WhatsApp</a><a class="ghost" href="'+v.href+'">'+v.w+'</a></div>'+
'<div class="list"><div><b>Rubro</b><span>'+v.r+'</span></div><div><b>Ciudad</b><span>'+v.c+'</span></div><div><b>Estilo</b><span>'+v.e+'</span></div></div>'
);
      }
    },
    {
      id: 'split',
      name: 'Split hero',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0A0A0A;color:#fff;font-family:\'Outfit\',system-ui,sans-serif}\n.top{background:#FF7300;color:#1A0A00;padding:14px 18px;font-weight:800;font-size:.85rem}\n.bot{padding:28px 18px 40px}\nh1{font-size:2.4rem;line-height:1;font-weight:800;letter-spacing:-.03em}\np{margin:12px 0 20px;color:#A3A3A3;line-height:1.5}\n.cta{display:inline-flex;padding:13px 20px;background:#fff;color:#0A0A0A;font-weight:800;border-radius:999px}\n.meta{margin-top:28px;font-size:.75rem;color:#737373}\n', 
'<div class="top">'+v.r+' · '+v.c+'</div><div class="bot">'+
'<h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">WhatsApp</a>'+
'<p class="meta">'+v.w+'</p></div>'
);
      }
    },
    {
      id: 'ticker',
      name: 'Marquee ticker',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#050505;color:#F5F5F5;font-family:\'Syne\',system-ui,sans-serif;overflow-x:hidden}\n.tick{white-space:nowrap;padding:10px 0;background:#111;border-bottom:1px solid #222;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#FF7300}\n.pad{padding:32px 18px 40px}\nh1{font-size:2.5rem;line-height:.95;font-weight:800}\np{margin:14px 0 22px;color:#A3A3A3;font-family:\'DM Sans\',sans-serif;line-height:1.45}\n.cta{display:block;text-align:center;padding:15px;background:#FF7300;color:#1A0A00;font-weight:800;border-radius:12px;font-family:\'DM Sans\',sans-serif}\n', 
'<div class="tick">'+v.n+' · '+v.r+' · '+v.c+' · '+v.n+' · '+v.r+' · '+v.c+'</div>'+
'<div class="pad"><h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Escribir · '+v.w+'</a></div>'
);
      }
    },
    {
      id: 'duo',
      name: 'Two-tone duo',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{margin:0;font-family:\'Space Grotesk\',system-ui,sans-serif}\n.half{padding:36px 20px}\n.a{background:#111;color:#fff;min-height:45vh}\n.b{background:#F4F4F5;color:#111}\nh1{font-size:2.2rem;line-height:1.05;letter-spacing:-.03em}\np{margin-top:12px;opacity:.75;line-height:1.45;font-size:.9rem}\n.cta{display:inline-flex;margin-top:20px;padding:12px 18px;background:#111;color:#fff;font-weight:700;border-radius:8px}\n', 
'<div class="half a"><h1>'+v.n+'</h1><p>'+v.r+' en '+v.c+'</p></div>'+
'<div class="half b"><p>'+v.f+'</p><a class="cta" href="'+v.href+'">WhatsApp '+v.w+'</a></div>'
);
      }
    },
    {
      id: 'orbit',
      name: 'Orbit accent',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#071018;color:#E8F4FF;font-family:\'Outfit\',system-ui,sans-serif;text-align:center;padding:40px 18px}\n.ring{width:120px;height:120px;margin:0 auto 24px;border-radius:50%;border:2px dashed #38BDF8;display:grid;place-items:center;font-weight:800;font-size:.8rem;letter-spacing:.1em}\nh1{font-size:2.2rem;line-height:1.05}\np{margin:12px auto 22px;max-width:28ch;color:#94A3B8;line-height:1.45}\n.cta{display:inline-flex;padding:13px 22px;border-radius:999px;background:#38BDF8;color:#082F49;font-weight:800}\n', 
'<div class="ring">'+v.c+'</div><h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Contactar</a><p style="margin-top:18px;font-size:.75rem;color:#64748B">'+v.r+' · '+v.w+'</p>'
);
      }
    },
    {
      id: 'ledger',
      name: 'Ledger lines',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#FAFAF9;color:#1C1917;font-family:\'Instrument Sans\',system-ui,sans-serif}\n.pad{padding:24px 18px 40px}\n.line{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #E7E5E4;font-size:.9rem}\n.line b{font-weight:600}\n.line span{color:#78716C}\nh1{font-family:\'Fraunces\',serif;font-size:2.3rem;margin:8px 0 20px}\n.cta{margin-top:24px;display:block;text-align:center;padding:14px;background:#1C1917;color:#FAFAF9;font-weight:700}\n', 
'<div class="pad"><h1>'+v.n+'</h1>'+
'<div class="line"><b>Rubro</b><span>'+v.r+'</span></div>'+
'<div class="line"><b>Ciudad</b><span>'+v.c+'</span></div>'+
'<div class="line"><b>Propuesta</b><span>'+v.f+'</span></div>'+
'<div class="line"><b>WhatsApp</b><span>'+v.w+'</span></div>'+
'<a class="cta" href="'+v.href+'">Hablar</a></div>'
);
      }
    },
    {
      id: 'pulse',
      name: 'Pulse dark',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#050505;color:#fff;font-family:\'Syne\',system-ui,sans-serif}\n.pad{padding:36px 18px}\n.badge{display:inline-block;padding:4px 10px;border-radius:999px;background:#221;color:#FB7185;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px}\nh1{font-size:2.6rem;line-height:.92;font-weight:800}\n.bar{height:6px;width:64px;background:#FB7185;margin:18px 0;border-radius:99px}\np{color:#A1A1AA;font-family:\'DM Sans\',sans-serif;line-height:1.45;margin-bottom:22px}\n.cta{display:inline-flex;padding:14px 22px;background:#FB7185;color:#3F0A12;font-weight:800;border-radius:10px}\n', 
'<div class="pad"><div class="badge">'+v.r+'</div><h1>'+v.n+'</h1><div class="bar"></div>'+
'<p>'+v.f+'</p><a class="cta" href="'+v.href+'">WhatsApp</a>'+
'<p style="margin-top:20px;font-size:.75rem;color:#525252">'+v.c+' · '+v.w+'</p></div>'
);
      }
    },
    {
      id: 'folio',
      name: 'Studio folio',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0C0C0C;color:#F5F5F4;font-family:\'Instrument Sans\',system-ui,sans-serif}\n.nav{padding:16px 18px;display:flex;justify-content:space-between;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:#A1A1AA;border-bottom:1px solid #27272A}\n.hero{padding:40px 18px 20px}\nh1{font-size:2.4rem;line-height:1.02;letter-spacing:-.03em}\n.grid{padding:10px 18px 36px;display:grid;gap:10px}\n.card{padding:18px;border:1px solid #27272A;border-radius:14px}\n.card b{display:block;margin-bottom:6px}\n.card span{color:#A1A1AA;font-size:.82rem;line-height:1.4}\n.cta{margin:0 18px 36px;display:block;text-align:center;padding:14px;border:1px solid #F5F5F4;font-weight:700}\n', 
'<div class="nav"><span>'+v.n+'</span><span>'+v.c+'</span></div>'+
'<section class="hero"><h1>'+v.r+'</h1></section>'+
'<div class="grid"><div class="card"><b>Propuesta</b><span>'+v.f+'</span></div>'+
'<div class="card"><b>Contacto</b><span>'+v.w+'</span></div></div>'+
'<a class="cta" href="'+v.href+'">Abrir chat</a>'
);
      }
    },
    {
      id: 'signal',
      name: 'Signal bars',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#020617;color:#E2E8F0;font-family:\'Space Grotesk\',system-ui,sans-serif}\n.pad{padding:28px 18px 40px}\n.bars{display:flex;gap:6px;align-items:flex-end;height:48px;margin-bottom:20px}\n.bars i{display:block;width:10px;background:#22D3EE;border-radius:3px}\nh1{font-size:2.1rem;line-height:1.05}\np{margin:12px 0 20px;color:#94A3B8;line-height:1.45}\n.cta{display:inline-flex;padding:13px 18px;background:#22D3EE;color:#083344;font-weight:800;border-radius:8px}\n', 
'<div class="pad"><div class="bars"><i style="height:14px"></i><i style="height:24px"></i><i style="height:36px"></i><i style="height:48px"></i></div>'+
'<h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Conectar</a>'+
'<p style="margin-top:18px;font-size:.75rem;color:#64748B">'+v.r+' · '+v.c+' · '+v.w+'</p></div>'
);
      }
    },
    {
      id: 'ink',
      name: 'Ink wash',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#F8F5F0;color:#1A1510;font-family:\'Fraunces\',Georgia,serif}\n.pad{padding:36px 20px 40px}\n.mark{font-family:\'Instrument Sans\',sans-serif;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#8B7355;margin-bottom:16px}\nh1{font-size:2.8rem;line-height:.95;font-weight:500}\np{margin:16px 0 24px;font-family:\'Instrument Sans\',sans-serif;color:#6B5E4E;line-height:1.5}\n.cta{display:inline-flex;padding:12px 20px;border-bottom:2px solid #1A1510;font-family:\'Instrument Sans\',sans-serif;font-weight:700}\n', 
'<div class="pad"><div class="mark">'+v.r+' · '+v.c+'</div>'+
'<h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">WhatsApp '+v.w+'</a></div>'
);
      }
    },
    {
      id: 'metro',
      name: 'Metro cards',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0F172A;color:#F8FAFC;font-family:\'Outfit\',system-ui,sans-serif}\n.pad{padding:16px;display:grid;gap:10px}\n.hero{padding:24px 18px;border-radius:20px;background:linear-gradient(135deg,#1D4ED8,#7C3AED)}\n.hero h1{font-size:1.9rem;line-height:1.05}\n.hero p{margin-top:8px;opacity:.9;font-size:.85rem}\n.card{padding:16px;border-radius:16px;background:#1E293B}\n.card b{display:block;margin-bottom:4px}\n.card span{color:#94A3B8;font-size:.8rem}\n.cta{display:block;text-align:center;padding:14px;border-radius:14px;background:#F8FAFC;color:#0F172A;font-weight:800}\n', 
'<div class="pad"><div class="hero"><h1>'+v.n+'</h1><p>'+v.f+'</p></div>'+
'<div class="card"><b>'+v.r+'</b><span>En '+v.c+'</span></div>'+
'<div class="card"><b>WhatsApp</b><span>'+v.w+'</span></div>'+
'<a class="cta" href="'+v.href+'">Escribir</a></div>'
);
      }
    },
    {
      id: 'serifbig',
      name: 'Giant serif',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#111;color:#F5F2EA;font-family:\'Fraunces\',Georgia,serif}\n.pad{padding:40px 18px}\nh1{font-size:clamp(3rem,16vw,4.5rem);line-height:.85;font-weight:500;letter-spacing:-.04em}\n.sub{margin-top:20px;font-family:\'Instrument Sans\',sans-serif;color:#A8A29E;font-size:.9rem;line-height:1.45;max-width:28ch}\n.cta{margin-top:28px;display:inline-flex;padding:13px 20px;background:#F5F2EA;color:#111;font-family:\'Instrument Sans\',sans-serif;font-weight:700;border-radius:999px}\n.meta{margin-top:24px;font-family:\'Instrument Sans\',sans-serif;font-size:.72rem;color:#78716C}\n', 
'<div class="pad"><h1>'+v.n+'</h1><p class="sub">'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Reservar</a>'+
'<p class="meta">'+v.r+' · '+v.c+' · '+v.w+'</p></div>'
);
      }
    },
    {
      id: 'checklist',
      name: 'Checklist proof',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#F0FDF4;color:#052E16;font-family:\'DM Sans\',system-ui,sans-serif}\n.pad{padding:28px 18px 40px}\nh1{font-family:\'Outfit\',sans-serif;font-size:2.1rem;line-height:1.05;font-weight:800}\np{margin:10px 0 18px;color:#166534;line-height:1.45}\n.ul{display:grid;gap:10px;margin-bottom:22px}\n.ul div{padding:12px 14px;background:#fff;border-radius:12px;border:1px solid #BBF7D0;font-size:.9rem}\n.cta{display:block;text-align:center;padding:14px;background:#16A34A;color:#fff;font-weight:800;border-radius:12px}\n', 
'<div class="pad"><h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<div class="ul"><div>✓ '+v.r+' de calidad</div><div>✓ Atención en '+v.c+'</div><div>✓ WhatsApp '+v.w+'</div></div>'+
'<a class="cta" href="'+v.href+'">Empezar</a></div>'
);
      }
    },
    {
      id: 'night',
      name: 'Night market',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#0B0520;color:#F5E9FF;font-family:\'Outfit\',system-ui,sans-serif}\n.pad{padding:28px 18px 40px}\n.glow{height:4px;background:linear-gradient(90deg,#C026D3,#7C3AED,#2563EB);border-radius:99px;margin-bottom:22px}\nh1{font-size:2.3rem;line-height:1.02;font-weight:800}\np{margin:12px 0 20px;color:#D8B4FE;line-height:1.45}\n.cta{display:inline-flex;padding:13px 20px;background:#C026D3;color:#fff;font-weight:800;border-radius:999px}\n.meta{margin-top:22px;font-size:.75rem;color:#A78BFA}\n', 
'<div class="pad"><div class="glow"></div><h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">WhatsApp</a>'+
'<p class="meta">'+v.r+' · '+v.c+' · '+v.w+'</p></div>'
);
      }
    },
    {
      id: 'frame',
      name: 'Picture frame',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#E7E5E4;color:#1C1917;font-family:\'Instrument Sans\',system-ui,sans-serif}\n.outer{padding:16px}\n.inner{background:#FAFAF9;border:8px solid #1C1917;padding:28px 18px;min-height:70vh}\n.tag{font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:#78716C;margin-bottom:14px}\nh1{font-family:\'Fraunces\',serif;font-size:2.4rem;line-height:1.05}\np{margin:14px 0 22px;color:#57534E;line-height:1.45}\n.cta{display:inline-flex;padding:12px 18px;background:#1C1917;color:#FAFAF9;font-weight:700}\n', 
'<div class="outer"><div class="inner"><div class="tag">'+v.r+' / '+v.c+'</div>'+
'<h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">'+v.w+'</a></div></div>'
);
      }
    },
    {
      id: 'wave',
      name: 'Wave footer',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#ECFEFF;color:#083344;font-family:\'Outfit\',system-ui,sans-serif}\n.pad{padding:32px 18px 20px}\nh1{font-size:2.3rem;line-height:1.05;font-weight:800}\np{margin:12px 0 20px;color:#0E7490;line-height:1.45}\n.cta{display:inline-flex;padding:13px 20px;background:#0891B2;color:#fff;font-weight:800;border-radius:999px}\n.wave{margin-top:40px;padding:28px 18px 36px;background:#083344;color:#A5F3FC;border-radius:28px 28px 0 0}\n.wave b{display:block;font-size:1.1rem;margin-bottom:6px;color:#fff}\n', 
'<div class="pad"><h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">Hablar</a></div>'+
'<div class="wave"><b>'+v.r+' en '+v.c+'</b>'+v.w+'</div>'
);
      }
    },
    {
      id: 'monoaccent',
      name: 'Mono + accent',
      build: function (v) {
        return doc(v.n, '*{box-sizing:border-box;margin:0;padding:0}html,body{min-height:100%;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}\nbody{background:#FAFAFA;color:#111;font-family:\'Space Grotesk\',system-ui,sans-serif}\n.pad{padding:28px 18px 40px}\n.k{color:#FF7300;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin-bottom:10px}\nh1{font-size:2.5rem;line-height:.95;letter-spacing:-.04em}\np{margin:14px 0 22px;color:#525252;line-height:1.45}\n.cta{display:block;text-align:center;padding:15px;background:#FF7300;color:#fff;font-weight:800}\n.foot{margin-top:16px;text-align:center;font-size:.75rem;color:#737373}\n', 
'<div class="pad"><div class="k">'+v.r+'</div><h1>'+v.n+'</h1><p>'+v.f+'</p>'+
'<a class="cta" href="'+v.href+'">WhatsApp ahora</a>'+
'<p class="foot">'+v.c+' · '+v.w+'</p></div>'
);
      }
    }
  ];

  var ESTILO_BIAS = {
    moderno: ['bento', 'mesh', 'sticky', 'app', 'stats', 'chips', 'metro', 'signal', 'monoaccent', 'split'],
    elegante: ['editorial', 'luxury', 'magazine', 'boutique', 'spa', 'chapters', 'serifbig', 'ink', 'frame', 'folio'],
    'cálido': ['warm', 'cafe', 'spa', 'chips', 'asymmetric', 'wave', 'ink', 'checklist'],
    calido: ['warm', 'cafe', 'spa', 'chips', 'asymmetric', 'wave', 'ink', 'checklist'],
    minimal: ['minimal', 'industrial', 'steps', 'tech', 'strip', 'ledger', 'duo', 'folio'],
    bold: ['neon', 'poster', 'energy', 'asymmetric', 'stats', 'strip', 'ticker', 'pulse', 'night', 'monoaccent']
  };

  function pickIndex(data) {
    var estilo = String((data && data.estilo) || 'moderno').toLowerCase();
    var bias = ESTILO_BIAS[estilo] || ESTILO_BIAS.moderno;
    var last = -1;
    try {
      last = parseInt(sessionStorage.getItem('febrosWebTpl') || '-1', 10);
    } catch (e) {}

    var preferred = [];
    var all = [];
    for (var i = 0; i < TEMPLATES.length; i++) {
      if (i === last) continue;
      all.push(i);
      if (bias.indexOf(TEMPLATES[i].id) !== -1) preferred.push(i);
    }
    if (!all.length) all = [0];

    var seed =
      String((data && data.nombre) || '') +
      '|' +
      String((data && data.rubro) || '') +
      '|' +
      String(Date.now()) +
      '|' +
      String(Math.random());
    var h = 2166136261;
    for (var k = 0; k < seed.length; k++) {
      h ^= seed.charCodeAt(k);
      h = Math.imul(h, 16777619);
    }
    h = h >>> 0;
    var useBias = preferred.length && h % 100 < 55;
    var pool = useBias ? preferred : all;
    var idx = pool[h % pool.length];
    try {
      sessionStorage.setItem('febrosWebTpl', String(idx));
    } catch (e2) {}
    return idx;
  }

  window.FEBROS_WEB_TEMPLATES = TEMPLATES;

  window.febrosBuildWebHtml = function (data) {
    var v = varsFrom(data || {});
    var idx = pickIndex(data || {});
    return TEMPLATES[idx].build(v);
  };

  window.febrosListWebTemplates = function () {
    return TEMPLATES.map(function (t) {
      return { id: t.id, name: t.name };
    });
  };
})();
