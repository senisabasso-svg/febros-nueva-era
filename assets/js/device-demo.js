/* Interactive Gestión demo — login → dashboard */
(function () {
  const loginView = document.getElementById('deviceLogin');
  const dashView = document.getElementById('deviceDash');
  const form = document.getElementById('deviceLoginForm');
  const backBtn = document.getElementById('deviceBackLogin');
  if (!loginView || !dashView || !form) return;

  function showDash() {
    loginView.classList.remove('is-active');
    loginView.classList.add('is-hidden');
    dashView.classList.remove('is-hidden');
    dashView.classList.add('is-active');
    const main = dashView.querySelector('.da-main');
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

  if (backBtn) {
    backBtn.addEventListener('click', showLogin);
  }

  // Tabs decorativas (solo visual)
  dashView.querySelectorAll('.da-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      dashView.querySelectorAll('.da-tab').forEach(function (t) {
        t.classList.remove('is-active');
      });
      tab.classList.add('is-active');
    });
  });

  // Evitar que clicks salgan del demo
  const app = document.getElementById('deviceApp');
  if (app) {
    app.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }
})();
