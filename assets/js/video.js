VIDEO: play only when on screen */
(function(){
  const v = document.getElementById('appVideo');
  if(!v) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ v.play().catch(()=>{}); }
      else { v.pause(); }
    });
  }, { threshold: 0.35 });
  io.observe(v);
})();
