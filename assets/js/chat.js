/* FEBROS chatbox — calls ONLY local /api/chat (never exposes API key) */
(function () {
  var root = document.getElementById('febrosChat');
  if (!root) return;

  var SESSION_KEY = 'febrosWebChatSession';
  var MAX_LEN = 1500;
  var PROXY = '/api/chat';

  var launcher = root.querySelector('[data-chat-open]');
  var panel = root.querySelector('[data-chat-panel]');
  var closer = root.querySelector('[data-chat-close]');
  var log = root.querySelector('[data-chat-log]');
  var form = root.querySelector('[data-chat-form]');
  var input = root.querySelector('[data-chat-input]');
  var submit = root.querySelector('[data-chat-submit]');

  var busy = false;
  var welcomed = false;

  function getSession() {
    try {
      return sessionStorage.getItem(SESSION_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setSession(token) {
    if (!token) return;
    try {
      sessionStorage.setItem(SESSION_KEY, token);
    } catch (e) {}
  }

  function scrollBottom() {
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }

  function addMsg(text, kind) {
    var el = document.createElement('div');
    el.className = 'febros-chat-msg febros-chat-msg--' + kind;
    el.textContent = text;
    log.appendChild(el);
    scrollBottom();
    return el;
  }

  function setOpen(open) {
    root.classList.toggle('is-open', open);
    if (launcher) launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (panel) panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open && !welcomed) {
      welcomed = true;
      addMsg('Hola, soy el asistente de FEBROS. ¿En qué te podemos ayudar?', 'bot');
      if (input) input.focus();
    }
  }

  function setBusy(on) {
    busy = !!on;
    if (submit) submit.disabled = busy;
    if (input) input.disabled = busy;
  }

  async function sendMessage(text) {
    var typing = document.createElement('div');
    typing.className = 'febros-chat-typing';
    typing.textContent = 'Escribiendo…';
    log.appendChild(typing);
    scrollBottom();
    setBusy(true);

    try {
      var body = { message: text };
      var token = getSession();
      if (token) body.sessionToken = token;

      var res = await fetch(PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      var data = await res.json().catch(function () {
        return {};
      });

      typing.remove();

      if (!res.ok) {
        var msg = data.error || 'No pudimos enviar el mensaje. Intentá de nuevo.';
        if (res.status === 405) {
          msg =
            'El proxy del chat no está activo en este hosting (405). Revisá el deploy de /api/chat.';
        } else if (res.status === 503) {
          msg = 'Chat no configurado en el servidor (falta WEB_CHAT_API_KEY).';
        } else if (res.status === 403 && data.hint) {
          msg = data.error + ' — ' + data.hint;
        }
        addMsg(msg, 'error');
        return;
      }

      if (data.sessionToken) setSession(data.sessionToken);

      if (data.paused) {
        addMsg('Un asesor humano va a continuar esta conversación.', 'meta');
      }

      addMsg(String(data.reply || 'Sin respuesta por ahora.'), 'bot');
    } catch (err) {
      typing.remove();
      addMsg('Sin conexión con el chat. Probá más tarde.', 'error');
    } finally {
      setBusy(false);
      if (input) input.focus();
    }
  }

  if (launcher) {
    launcher.addEventListener('click', function () {
      setOpen(!root.classList.contains('is-open'));
    });
  }

  if (closer) {
    closer.addEventListener('click', function () {
      setOpen(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) {
      setOpen(false);
    }
  });

  if (form && input) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      var text = String(input.value || '').trim();
      if (!text) return;
      if (text.length > MAX_LEN) text = text.slice(0, MAX_LEN);
      addMsg(text, 'user');
      input.value = '';
      sendMessage(text);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
  }
})();
