/* Systems showcase — tab selector switches phone demo + copy */
(function () {
  const root = document.getElementById('sistemas');
  if (!root) return;

  const tabs = root.querySelectorAll('.sys-tab');
  const panels = root.querySelectorAll('.sys-copy-wrap .sys-panel');
  const layers = root.querySelectorAll('.device-demo-layer');
  const hint = document.getElementById('sysDemoHint');

  const hints = {
    pelu: 'Tocá <b>Iniciar sesión</b> para ver informes del salón',
    sh: 'Tocá <b>Iniciar sesión</b> para ver Vivo TikTok',
    spa: 'Tocá <b>Ingresar</b> para ver el panel de socios'
  };

  function resetDemoLayer(layer) {
    if (!layer) return;
    const login = layer.querySelector('[data-view="login"]');
    const dash = layer.querySelector('[data-view="dash"]');
    const main = dash && dash.querySelector('.da-main, .sdemo-main');
    if (!login || !dash) return;
    dash.classList.remove('is-active');
    dash.classList.add('is-hidden');
    login.classList.remove('is-hidden');
    login.classList.add('is-active');
    if (main) main.scrollTop = 0;
  }

  function activate(id) {
    tabs.forEach(function (t) {
      const on = t.dataset.sys === id;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      p.classList.toggle('active', p.dataset.sys === id);
    });
    layers.forEach(function (layer) {
      const on = layer.dataset.sys === id;
      layer.classList.toggle('active', on);
      if (!on) resetDemoLayer(layer);
    });
    root.classList.toggle('systems-unified--gold', id === 'pelu');
    if (hint && hints[id]) hint.innerHTML = hints[id];
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      activate(t.dataset.sys);
    });
  });

  activate('pelu');
})();
