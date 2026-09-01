/* ══════════════════════════════════════
   DEVICE MOCKUP — real product footage
   Plays only while on screen; tilts to cursor.
══════════════════════════════════════ */
(function(){
  const vid   = document.getElementById('appVideo');
  const wrap  = document.getElementById('deviceWrap');
  const frame = document.getElementById('deviceFrame');
  if(!vid || !wrap || !frame) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting && !reduce){
        const p = vid.play();
        if(p && p.catch) p.catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.15 });
  io.observe(wrap);
  if(reduce) vid.pause();

  if(reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const BASE_Y = -16, BASE_X = 3;
  let tx = 0, ty = 0, cxv = 0, cyv = 0, active = false;

  function tick(){
    cxv += (tx - cxv) * 0.10;
    cyv += (ty - cyv) * 0.10;
    frame.style.transform =
      `rotateY(${(BASE_Y + cxv * 11).toFixed(2)}deg) rotateX(${(BASE_X - cyv * 7).toFixed(2)}deg)`;
    if(active || Math.abs(cxv) > 0.002 || Math.abs(cyv) > 0.002) requestAnimationFrame(tick);
  }

  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    tx = (e.clientX - (r.left + r.width / 2))  / (r.width / 2);
    ty = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    if(!active){ active = true; frame.style.transition = 'none'; requestAnimationFrame(tick); }
  });
  wrap.addEventListener('mouseleave', () => {
    active = false; tx = 0; ty = 0; requestAnimationFrame(tick);
  });
})();
