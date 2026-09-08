/* Webs — schema-bounded AI plan + deterministic local assembler */
(function () {
  var root = document.getElementById('webs');
  if (!root) return;

  var form = root.querySelector('#websForm');
  var statusEl = root.querySelector('#websStatus');
  var frame = root.querySelector('#websPreview');
  var placeholder = root.querySelector('#websPlaceholder');
  var loading = root.querySelector('#websLoading');
  var submitBtn = root.querySelector('#websSubmit');
  var resetBtn = root.querySelector('#websReset');

  var BUSY_MSG = 'Sitio con demasiada demanda, intentelo mas tarde';
  var MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'];

  var RESPONSE_SCHEMA = {
    type: 'OBJECT',
    properties: {
      nav: { type: 'STRING', format: 'enum', enum: ['brand-left', 'centered', 'minimal'] },
      hero: { type: 'STRING', format: 'enum', enum: ['impact', 'editorial', 'banner', 'story'] },
      services: { type: 'STRING', format: 'enum', enum: ['cards', 'list', 'grid', 'steps'] },
      proof: { type: 'STRING', format: 'enum', enum: ['reasons', 'chips', 'quote', 'none'] },
      contact: { type: 'STRING', format: 'enum', enum: ['card', 'panel', 'sticky'] },
      nombre: { type: 'STRING' },
      eyebrow: { type: 'STRING' },
      headline: { type: 'STRING' },
      headlineAccent: { type: 'STRING' },
      subline: { type: 'STRING' },
      cta: { type: 'STRING' },
      servicesItems: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' },
            desc: { type: 'STRING' }
          },
          required: ['title', 'desc']
        }
      },
      reasons: { type: 'ARRAY', items: { type: 'STRING' } },
      quote: { type: 'STRING' },
      contactTitle: { type: 'STRING' },
      contactText: { type: 'STRING' }
    },
    required: [
      'nav',
      'hero',
      'services',
      'proof',
      'contact',
      'nombre',
      'eyebrow',
      'headline',
      'headlineAccent',
      'subline',
      'cta',
      'servicesItems',
      'reasons',
      'contactTitle',
      'contactText'
    ]
  };

  function apiUrl(model) {
    return (
      'https://generativelanguage.googleapis.com/v1beta/models/' +
      model +
      ':generateContent'
    );
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function isBusyError(status, message) {
    var msg = String(message || '').toLowerCase();
    return (
      status === 429 ||
      status === 503 ||
      status === 500 ||
      msg.indexOf('high demand') !== -1 ||
      msg.indexOf('resource_exhausted') !== -1 ||
      msg.indexOf('unavailable') !== -1 ||
      msg.indexOf('try again') !== -1 ||
      msg.indexOf('overloaded') !== -1 ||
      msg.indexOf('quota') !== -1
    );
  }

  function getApiKey() {
    return (
      window.FEBROS_GEMINI_API_KEY ||
      (window.__ENV__ && window.__ENV__.GEMINI_API_KEY) ||
      ''
    ).trim();
  }

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.classList.remove('is-error', 'is-ok');
    if (type) statusEl.classList.add(type);
  }

  function setLoading(on) {
    if (loading) loading.classList.toggle('is-on', !!on);
    if (submitBtn) {
      submitBtn.disabled = !!on;
      submitBtn.textContent = on ? 'Generando…' : 'Generar mi web →';
    }
  }

  function buildPrompt(data) {
    return [
      'Planificá una landing mobile uruguaya. NO generes HTML.',
      'Devolvé un plan de composición + copy (el renderer local arma la UI).',
      'Negocio: ' + data.nombre + ' | Rubro: ' + data.rubro + ' | Ciudad: ' + (data.ciudad || 'Uruguay') + ' | Estilo: ' + data.estilo + ' | Frase: ' + (data.frase || ''),
      'Elegí variantes distintas según rubro/estilo. Variá mucho el copy (nada genérico).',
      'Español rioplatense. 3 servicesItems. 3 reasons. headlineAccent corto. cta corto.'
    ].join('\n');
  }

  function extractJson(text) {
    if (!text) return null;
    var cleaned = String(text).trim();
    var fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) cleaned = fence[1].trim();
    var start = cleaned.indexOf('{');
    var end = cleaned.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch (e) {
      return null;
    }
  }

  function normalizeAi(content) {
    if (!content) return null;
    // Keep content.services as layout variant (string).
    // Copy items live in servicesItems — webs-example reads both.
    if (
      Array.isArray(content.services) &&
      content.services[0] &&
      typeof content.services[0] === 'object'
    ) {
      content.servicesItems = content.services;
      delete content.services;
    }
    return content;
  }

  function showPreview(html) {
    if (!frame) return;
    frame.srcdoc = html;
    if (placeholder) placeholder.classList.add('is-hidden');
  }

  function resetPreview() {
    if (frame) frame.srcdoc = '';
    if (placeholder) placeholder.classList.remove('is-hidden');
    setStatus('');
  }

  async function callModel(key, model, prompt) {
    var body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 900,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA
      }
    };

    var res = await fetch(apiUrl(model) + '?key=' + encodeURIComponent(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    var json = await res.json().catch(function () {
      return null;
    });
    var apiMsg =
      (json && json.error && json.error.message) || ('Error ' + res.status);

    if (!res.ok) {
      // retry once without schema if schema rejected
      if (res.status === 400 && /schema|mime|format/i.test(apiMsg)) {
        return callModelLoose(key, model, prompt);
      }
      var err = new Error(apiMsg);
      err.status = res.status;
      err.busy = isBusyError(res.status, apiMsg);
      throw err;
    }

    var parts =
      json &&
      json.candidates &&
      json.candidates[0] &&
      json.candidates[0].content &&
      json.candidates[0].content.parts;
    var text = (parts || [])
      .map(function (p) {
        return p.text || '';
      })
      .join('\n');

    var content = normalizeAi(extractJson(text));
    if (!content) {
      var parseErr = new Error('bad payload');
      parseErr.busy = true;
      throw parseErr;
    }
    return content;
  }

  async function callModelLoose(key, model, prompt) {
    var res = await fetch(apiUrl(model) + '?key=' + encodeURIComponent(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 900,
          responseMimeType: 'application/json'
        }
      })
    });
    var json = await res.json().catch(function () {
      return null;
    });
    if (!res.ok) {
      var apiMsg =
        (json && json.error && json.error.message) || ('Error ' + res.status);
      var err = new Error(apiMsg);
      err.status = res.status;
      err.busy = isBusyError(res.status, apiMsg);
      throw err;
    }
    var parts =
      json &&
      json.candidates &&
      json.candidates[0] &&
      json.candidates[0].content &&
      json.candidates[0].content.parts;
    var text = (parts || [])
      .map(function (p) {
        return p.text || '';
      })
      .join('\n');
    var content = normalizeAi(extractJson(text));
    if (!content) {
      var parseErr = new Error('bad payload');
      parseErr.busy = true;
      throw parseErr;
    }
    return content;
  }

  async function generate(data) {
    var key = getApiKey();
    if (!key || key.indexOf('PEGÁ_TU') === 0) {
      var missing = new Error(BUSY_MSG);
      missing.busy = true;
      throw missing;
    }

    var prompt = buildPrompt(data);

    for (var m = 0; m < MODELS.length; m++) {
      var model = MODELS[m];
      for (var attempt = 0; attempt < 2; attempt++) {
        try {
          var content = await callModel(key, model, prompt);
          if (typeof window.febrosBuildWebHtml !== 'function') {
            throw new Error(BUSY_MSG);
          }
          return window.febrosBuildWebHtml(content, data);
        } catch (err) {
          if (err && err.busy && attempt === 0) {
            await sleep(1200);
            continue;
          }
          if (err && err.busy) break;
          break;
        }
      }
    }

    var fail = new Error(BUSY_MSG);
    fail.busy = true;
    throw fail;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var data = {
        nombre: String(fd.get('nombre') || '').trim(),
        rubro: String(fd.get('rubro') || '').trim(),
        ciudad: String(fd.get('ciudad') || '').trim(),
        estilo: String(fd.get('estilo') || 'moderno').trim(),
        whatsapp: String(fd.get('whatsapp') || '').trim(),
        frase: String(fd.get('frase') || '').trim()
      };

      if (!data.nombre || !data.rubro) {
        setStatus('Completá al menos Nombre y Rubro.', 'is-error');
        return;
      }

      setLoading(true);
      setStatus('Armando tu web…');

      generate(data)
        .then(function (html) {
          showPreview(html);
          setStatus('Listo. Así de rápido armamos una web para tu rubro.', 'is-ok');
        })
        .catch(function () {
          setStatus(BUSY_MSG, 'is-error');
        })
        .finally(function () {
          setLoading(false);
        });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (form) form.reset();
      resetPreview();
    });
  }

  if (typeof window.febrosBindDeviceTilt === 'function') {
    window.febrosBindDeviceTilt();
  }
})();
