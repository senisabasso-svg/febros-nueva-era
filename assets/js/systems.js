SYSTEMS SHOWCASE tabs + thumbs */
(function(){
  const root = document.getElementById('sistemas');
  if(!root) return;
  const tabs = root.querySelectorAll('.sys-tab');
  const panels = root.querySelectorAll('.sys-panel');
  function activate(id){
    tabs.forEach(t => t.classList.toggle('active', t.dataset.sys === id));
    panels.forEach(p => p.classList.toggle('active', p.dataset.sys === id));
  }
  tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.sys)));
  root.querySelectorAll('.sys-panel').forEach(panel => {
    const main = panel.querySelector('.sys-main');
    const thumbs = panel.querySelectorAll('.sys-thumbs button');
    thumbs.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if(main && btn.dataset.src) main.src = btn.dataset.src;
      });
    });
  });
})();
