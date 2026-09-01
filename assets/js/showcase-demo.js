/* Interactive demos — login → dashboard (product + systems phones) */
(function () {
  if (window.__febrosDemoInit) return;
  window.__febrosDemoInit = true;

  function initDemo(root) {
    if (root.dataset.demoReady) return;
    root.dataset.demoReady = '1';

    var loginView = root.querySelector('[data-view="login"]');
    var dashView = root.querySelector('[data-view="dash"]');
    var form = root.querySelector('form');
    var backBtn = root.querySelector('[data-action="back-login"]');
    var submitBtn = form && form.querySelector('button[type="submit"]');
    if (!loginView || !dashView || !form) return;

    function showDash() {
      loginView.classList.remove('is-active');
      loginView.classList.add('is-hidden');
      dashView.classList.remove('is-hidden');
      dashView.classList.add('is-active');
      var main = dashView.querySelector('.da-main, .sdemo-main');
      if (main) main.scrollTop = 0;
    }

    function showLogin() {
      dashView.classList.remove('is-active');
      dashView.classList.add('is-hidden');
      loginView.classList.remove('is-hidden');
      loginView.classList.add('is-active');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showDash();
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showDash();
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', showLogin);
    }

    dashView.querySelectorAll('.da-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        dashView.querySelectorAll('.da-tab').forEach(function (t) {
          t.classList.remove('is-active');
        });
        tab.classList.add('is-active');
      });
    });

    root.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  function boot() {
    document.querySelectorAll('[data-interactive-demo]').forEach(initDemo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
