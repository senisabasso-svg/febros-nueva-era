/* FEBROS — load scripts on demand */
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

  // Light — always
  load('/assets/js/scroll-fade.js');
  load('/assets/js/systems.js');
  load('/assets/js/showcase-demo.js');
  load('/assets/js/marquee.js');

  if (!REDUCE) {
    load('/assets/js/cursor.js');
    if (!MOBILE) load('/assets/js/neural.js');
  }

  // Heavy — near viewport only
  whenVisible(document.getElementById('cardstackSection'), function () {
    load('/assets/js/cardstack.js');
  }, '400px 0px');

  whenVisible(document.getElementById('deviceWrap'), function () {
    load('/assets/js/device.js');
  }, '400px 0px');

  whenVisible(document.getElementById('globeStage'), function () {
    load('/assets/js/globe.js');
  }, '0px 0px');
})();
