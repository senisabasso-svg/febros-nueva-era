/* FEBROS — load scripts & styles on demand */
(function () {
  var MOBILE = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function load(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.onload = function () { resolve(src); };
      s.onerror = function () { reject(src); };
      document.body.appendChild(s);
    });
  }

  function loadCss(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  function idle(fn, timeout) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: timeout || 2500 });
    } else {
      setTimeout(fn, 800);
    }
  }

  function whenVisible(el, fn, margin) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        io.disconnect();
        fn();
      }
    }, { rootMargin: margin || '250px 0px' });
    io.observe(el);
  }

  var DEMO_CSS = [
    '/assets/css/device-demo.css',
    '/assets/css/showcase-demo.css',
    '/assets/css/demo-pelu-login.css',
    '/assets/css/demo-pelu-panel.css',
    '/assets/css/demo-tiendas-login.css',
    '/assets/css/demo-tiendas-panel.css',
    '/assets/css/demo-marketing-login.css',
    '/assets/css/demo-marketing-panel.css'
  ];

  function loadDemoAssets() {
    DEMO_CSS.forEach(loadCss);
    loadCss('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:wght@500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
  }

  load('/assets/js/scroll-fade.js');
  load('/assets/js/systems.js');
  load('/assets/js/showcase-demo.js');
  load('/assets/js/marquee.js');

  if (!REDUCE) {
    window.addEventListener('mousemove', function onMove() {
      window.removeEventListener('mousemove', onMove);
      load('/assets/js/cursor.js');
    }, { once: true, passive: true });
    if (!MOBILE) {
      idle(function () { load('/assets/js/neural.js'); }, 2000);
    }
  }

  whenVisible(document.getElementById('sistemas'), loadDemoAssets, '350px 0px');

  whenVisible(document.getElementById('deviceWrap'), function () {
    load('/assets/js/device.js');
  }, '350px 0px');

  whenVisible(document.getElementById('globeStage'), function () {
    idle(function () { load('/assets/js/globe.js'); }, 1200);
  }, '0px 0px');
})();
