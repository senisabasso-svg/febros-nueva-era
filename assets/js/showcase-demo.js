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
      var main = dashView.querySelector('.da-main, .sdemo-main, .mkt-main, .main');
      if (main) main.scrollTop = 0;
      var shell = dashView.querySelector('.app--shell');
      if (shell) {
        shell.classList.remove('app--nav-open');
        var header = shell.querySelector('.header--mobile-bar');
        if (header) header.classList.remove('header--nav-open');
      }
    }

    function showLogin() {
      dashView.classList.remove('is-active');
      dashView.classList.add('is-hidden');
      loginView.classList.remove('is-hidden');
      loginView.classList.add('is-active');
      var shell = dashView.querySelector('.app--shell');
      if (shell) {
        shell.classList.remove('app--nav-open');
        var header = shell.querySelector('.header--mobile-bar');
        if (header) header.classList.remove('header--nav-open');
      }
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

    dashView.querySelectorAll('.da-tab, .mkt-range__tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var group = tab.closest('.da-tabs, .mkt-range__tabs');
        if (!group) return;
        group.querySelectorAll('.da-tab, .mkt-range__tab').forEach(function (t) {
          t.classList.remove('is-active');
        });
        tab.classList.add('is-active');
      });
    });

    dashView.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
      });
    });

    initPeluNav(root);

    root.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  function initPeluNav(root) {
    var shell = root.querySelector('.app--shell');
    if (!shell) return;

    var toggle = shell.querySelector('.header-nav-toggle');
    var backdrop = shell.querySelector('.header-nav-backdrop');
    var collapse = shell.querySelector('.app-sidebar__collapse');
    var header = shell.querySelector('.header--mobile-bar');

    function setNavOpen(open) {
      shell.classList.toggle('app--nav-open', open);
      if (header) header.classList.toggle('header--nav-open', open);
      if (toggle) {
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Mostrar menú lateral');
      }
    }

    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setNavOpen(!shell.classList.contains('app--nav-open'));
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setNavOpen(false);
      });
    }

    if (collapse) {
      collapse.addEventListener('click', function () {
        setNavOpen(false);
      });
    }

    setNavOpen(false);
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
