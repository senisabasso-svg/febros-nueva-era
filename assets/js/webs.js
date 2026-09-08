/* Webs — pick a modern local template and inject client fields (no AI) */
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

  function generate(data) {
    if (typeof window.febrosBuildWebHtml !== 'function') {
      throw new Error('templates missing');
    }
    return window.febrosBuildWebHtml(data);
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

      window.setTimeout(function () {
        try {
          var html = generate(data);
          showPreview(html);
          setStatus('Listo. Tocá Generar de nuevo para ver otro estilo.', 'is-ok');
        } catch (err) {
          setStatus('No se pudo armar el preview. Recargá e intentá de nuevo.', 'is-error');
        } finally {
          setLoading(false);
        }
      }, 280);
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
