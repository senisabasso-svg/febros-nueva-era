/* DEVICE MOCKUP — tilt for any [data-tilt] wrap not yet bound */
(function () {
  function bindTilt() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('.device-wrap[data-tilt]:not([data-tilt-ready])').forEach(function (wrap) {
      var frame = wrap.querySelector('.device');
      if (!frame) return;
      wrap.setAttribute('data-tilt-ready', '1');

      var BASE_Y = -16,
        BASE_X = 3;
      var tx = 0,
        ty = 0,
        cxv = 0,
        cyv = 0,
        active = false;

      function tick() {
        cxv += (tx - cxv) * 0.1;
        cyv += (ty - cyv) * 0.1;
        frame.style.transform =
          'rotateY(' +
          (BASE_Y + cxv * 11).toFixed(2) +
          'deg) rotateX(' +
          (BASE_X - cyv * 7).toFixed(2) +
          'deg)';
        if (active || Math.abs(cxv) > 0.002 || Math.abs(cyv) > 0.002) {
          requestAnimationFrame(tick);
        }
      }

      wrap.addEventListener('mousemove', function (e) {
        var r = wrap.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        ty = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        if (!active) {
          active = true;
          frame.style.transition = 'none';
          requestAnimationFrame(tick);
        }
      });
      wrap.addEventListener('mouseleave', function () {
        active = false;
        tx = 0;
        ty = 0;
        requestAnimationFrame(tick);
      });
    });
  }

  window.febrosBindDeviceTilt = bindTilt;
  bindTilt();
})();
