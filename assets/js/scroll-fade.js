/* ══════════════════════════════════════
   SCROLL FADE-IN for sections
══════════════════════════════════════ */
(function(){
  const targets = document.querySelectorAll('.service,.step,.line-card,.reach-item');
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.15});

  targets.forEach(el => obs.observe(el));
})();
