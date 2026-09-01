/* ══════════════════════════════════════
   CURSOR SPOTLIGHT
══════════════════════════════════════ */
(function(){
  const glow = document.getElementById('cursor-glow');
  if(!glow || !window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    if(glow) glow.style.display='none'; return;
  }
  let cx = -700, cy = -700, tx = -700, ty = -700, active = false;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    if(!active){
      glow.style.opacity = '1';
      active = true;
      raf();
    }
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    active = false;
  });

  function raf(){
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;
    glow.style.transform = `translate(${cx - 350}px,${cy - 350}px)`;
    if(active) requestAnimationFrame(raf);
  }
})();
