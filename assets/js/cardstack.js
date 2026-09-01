/* ══════════════════════════════════════
   CARD STACK (perf)
══════════════════════════════════════ */
(function(){
  const section = document.getElementById('cardstackSection');
  const scene   = document.getElementById('cardScene');
  if(!section || !scene) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 700px)').matches
    || window.matchMedia('(pointer: coarse)').matches;

  const ALL = [
    { shot:'/assets/cards/card-0.jpg', kicker:'Web del salón', name:'demo', chip:'Diseño + desarrollo', accent:'#FF9538' },
    { shot:'/assets/cards/card-1.jpg', kicker:'Agenda online', name:'Reservá tu turno', chip:'Sin llamadas', accent:'#C9992E' },
    { shot:'/assets/cards/card-2.jpg', kicker:'Servicios y precios', name:'Cargados por el salón', chip:'Se cobran solos', accent:'#C9992E' },
    { shot:'/assets/cards/card-3.jpg', kicker:'Galería del salón', name:'Fotos del lugar real', chip:'Parte de la web', accent:'#FF9538' },
    { shot:'/assets/cards/card-4.jpg', kicker:'Gestión de Peluquerías', name:'El sistema, por dentro', chip:'Turnos · Stock · Caja', accent:'#C9992E' }
  ];
  const CARDS = isMobile ? ALL.slice(0, 3) : ALL;
  const N = CARDS.length;
  const cardEls = [];

  scene.innerHTML = '';
  CARDS.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'feat-card';
    el.style.zIndex = String(N - i);
    el.innerHTML =
      '<div class="feat-chrome">' +
        '<span class="feat-dots"><i></i><i></i><i></i></span>' +
        '<span class="feat-chrome-name">' + c.name + '</span>' +
        '<span class="feat-chrome-tag" style="color:' + c.accent + '"><i style="background:' + c.accent + '"></i>' + c.kicker + '</span>' +
      '</div>' +
      '<img class="feat-shot" src="' + c.shot + '" alt="' + c.name + '" width="700" height="441" loading="lazy" decoding="async">' +
      '<div class="feat-card-brand">FEBROS</div>' +
      '<div class="feat-card-edge"></div>';
    scene.appendChild(el);
    cardEls.push(el);
  });

  const FAN_Z  = [24, 12, 0, -13, -28];
  const FAN_Y  = [-7, -3, 0.5, 4, 8];
  const FAN_TZ = [0, -5, -10, -15, -21];

  const lerp = (a,b,t) => a + (b - a) * t;
  const easeInOut = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function getProgress(){
    const r = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    if(total <= 0) return 1;
    const scrolled = -r.top;
    return Math.max(0, Math.min(1, scrolled / total));
  }

  let lastP = -1;
  let mouseX = 0, mouseY = 0, hoverActive = false;
  let visible = true;
  let scrolling = false;

  function render(force){
    if(!visible && !force) return;
    const raw = reduce ? 1 : getProgress();
    // skip tiny changes
    if(!force && Math.abs(raw - lastP) < 0.004) return;
    lastP = raw;

    const p = raw < 0.8
      ? easeInOut(raw / 0.8) * 0.9
      : 0.9 + easeOut((raw - 0.8) / 0.2) * 0.1;
    const isStacked = raw > 0.95;

    for(let i = 0; i < N; i++){
      const el = cardEls[i];
      const norm = N === 1 ? 0 : i / (N - 1);
      const fZ = FAN_Z[i] || 0, fY = FAN_Y[i] || 0, fTZ = FAN_TZ[i] || 0;
      const fTY = norm * norm * (isMobile ? 14 : 24);
      const sTZ = -i * 1.4, sTY = -i * 0.5;

      let rZ = lerp(fZ, 0, p);
      let rY = lerp(fY, 0, p);
      const tZ = lerp(fTZ, sTZ, p);
      const tY = lerp(fTY, sTY, p);

      if(!isMobile && i === 0 && isStacked && hoverActive){
        rY += mouseX * 8;
        const rX = -mouseY * 5;
        el.style.transform = 'rotateZ(' + rZ.toFixed(1) + 'deg) rotateY(' + rY.toFixed(1) + 'deg) rotateX(' + rX.toFixed(1) + 'deg) translate3d(0,' + tY.toFixed(1) + 'px,' + tZ.toFixed(1) + 'px)';
      } else {
        el.style.transform = 'rotateZ(' + rZ.toFixed(1) + 'deg) rotateY(' + rY.toFixed(1) + 'deg) translate3d(0,' + tY.toFixed(1) + 'px,' + tZ.toFixed(1) + 'px)';
      }
    }
  }

  let scrollScheduled = false;
  function onScroll(){
    if(scrollScheduled || !visible) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      scrollScheduled = false;
      render();
    });
  }

  // Only animate while section is on screen
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if(visible) render(true);
  }, { rootMargin: '10% 0px', threshold: 0 });
  io.observe(section);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => render(true), { passive: true });
  render(true);

  // Desktop-only tilt
  if(!isMobile && !reduce){
    let hoverRaf = 0;
    scene.addEventListener('mousemove', e => {
      const r = scene.getBoundingClientRect();
      mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouseY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      hoverActive = true;
      if(!hoverRaf){
        hoverRaf = requestAnimationFrame(() => { hoverRaf = 0; render(true); });
      }
    });
    scene.addEventListener('mouseleave', () => {
      hoverActive = false;
      mouseX = 0; mouseY = 0;
      render(true);
    });
  }
})();
