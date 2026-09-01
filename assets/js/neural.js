/* ══════════════════════════════════════
   NEURAL NETWORK BACKGROUND
══════════════════════════════════════ */
(function(){
  const canvas = document.getElementById('bgCanvas');
  /* MOBILE_SKIP_NET */
  if(!canvas) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 700px), (prefers-reduced-data: reduce)').matches){
    canvas.style.display = 'none';
    return;
  }
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true }) || canvas.getContext('2d');
  let W, H, nodes = [], raf;

  const NODE_COUNT = 18;
  const MAX_DIST   = 110;
  const ORANGE     = [249, 115, 22];
  const AMBER      = [251, 189, 58];

  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init(){
    nodes = Array.from({length: NODE_COUNT}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.5,
      color: Math.random() > 0.6 ? ORANGE : AMBER
    }));
  }

  function draw(){
    ctx.clearRect(0, 0, W, H);

    // connections
    for(let i = 0; i < nodes.length; i++){
      for(let j = i+1; j < nodes.length; j++){
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if(d < MAX_DIST){
          const a = (1 - d/MAX_DIST) * 0.18;
          const c = nodes[i].color;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      const c = n.color;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.55)`;
      ctx.fill();
    });
  }

  function update(){
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if(n.x < 0 || n.x > W) n.vx *= -1;
      if(n.y < 0 || n.y > H) n.vy *= -1;
    });
  }

  let running = true, frame = 0;
  function loop(){
    if(!running) return;
    frame++;
    if((frame & 1) === 0){ update(); draw(); } // ~30fps
    raf = requestAnimationFrame(loop);
  }
  function start(){ if(running) return; running = true; raf = requestAnimationFrame(loop); }
  function stop(){ running = false; if(raf) cancelAnimationFrame(raf); }
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.getElementById('bgCanvas').style.display = 'none';
  } else {
    window.addEventListener('resize', () => { resize(); });
    resize();
    init();
    loop();
  }
})();
