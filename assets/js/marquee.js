MARQUEE_PAUSE */
(function(){
  const track = document.querySelector('.marquee-track');
  if(!track) return;
  const io = new IntersectionObserver(([e]) => {
    track.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
  }, { threshold: 0 });
  io.observe(track);
})();
