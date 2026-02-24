/**
 * Amelie Webchat Widget - Script para embeber en cualquier web (CDN).
 * Uso:
 *   <script src="https://tu-cdn.com/veloxiam-widget/amelie-webchat.js"></script>
 *   <script>
 *     AmelieWebchat.init({
 *       botId: 'uuid-del-bot',
 *       apiUrl: 'https://api.tudominio.com/api/v1',
 *       position: 'bottom-right',
 *       title: 'Chat'
 *     });
 *   </script>
 */
(function (global) {
  "use strict";

  var CSS = [
    '.amelie-wc-root{position:fixed;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;line-height:1.4;box-sizing:border-box}',
    ".amelie-wc-root *,.amelie-wc-root *::before,.amelie-wc-root *::after{box-sizing:border-box}",
    ".amelie-wc-btn{width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,0.25);transition:transform .2s,box-shadow .2s;background:#6366f1;color:#fff}",
    ".amelie-wc-btn:hover{transform:scale(1.05);box-shadow:0 6px 24px rgba(99,102,241,.4)}",
    ".amelie-wc-btn svg{width:28px;height:28px;fill:currentColor}",
    ".amelie-wc-panel{position:absolute;bottom:72px;right:0;width:380px;max-width:calc(100vw - 24px);height:480px;max-height:calc(100vh - 120px);background:#1a1a2e;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden;opacity:0;visibility:hidden;transform:translateY(8px) scale(.98);transition:opacity .2s,transform .2s,visibility .2s}",
    ".amelie-wc-panel.open{opacity:1;visibility:visible;transform:translateY(0) scale(1)}",
    ".amelie-wc-header{padding:14px 16px;background:#6366f1;color:#fff;font-weight:600;font-size:15px}",
    ".amelie-wc-close{position:absolute;top:12px;right:12px;width:32px;height:32px;border:none;background:rgba(255,255,255,.2);color:#fff;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1}",
    ".amelie-wc-close:hover{background:rgba(255,255,255,.3)}",
    ".amelie-wc-messages{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}",
    ".amelie-wc-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:14px;word-break:break-word;white-space:pre-wrap}",
    ".amelie-wc-msg-user{align-self:flex-end;background:#6366f1;color:#fff;border-bottom-right-radius:4px}",
    ".amelie-wc-msg-bot{align-self:flex-start;background:#252540;color:#e2e8f0;border-bottom-left-radius:4px}",
    ".amelie-wc-typing{align-self:flex-start;padding:10px 14px;color:#94a3b8;font-size:13px}",
    ".amelie-wc-input-row{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.08);background:#1a1a2e}",
    ".amelie-wc-input{flex:1;padding:12px 14px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(255,255,255,.05);color:#e2e8f0;font-size:15px;outline:none}",
    ".amelie-wc-input::placeholder{color:rgba(255,255,255,.4)}",
    ".amelie-wc-input:focus{border-color:#6366f1}",
    ".amelie-wc-input:disabled{opacity:.6;cursor:not-allowed}",
    ".amelie-wc-send{width:44px;height:44px;border:none;border-radius:12px;background:#6366f1;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
    ".amelie-wc-send:hover:not(:disabled){opacity:.9}",
    ".amelie-wc-send:disabled{opacity:.5;cursor:not-allowed}",
    ".amelie-wc-send svg{width:22px;height:22px;fill:currentColor}",
    ".amelie-wc-root.amelie-wc-pos-bl{bottom:20px;left:20px}",
    ".amelie-wc-root.amelie-wc-pos-bl .amelie-wc-panel{right:auto;left:0}",
    ".amelie-wc-root.amelie-wc-pos-br{bottom:20px;right:20px}",
    ".amelie-wc-root.amelie-wc-pos-tl{top:20px;left:20px}",
    ".amelie-wc-root.amelie-wc-pos-tl .amelie-wc-panel{bottom:auto;top:72px;right:auto;left:0}",
    ".amelie-wc-root.amelie-wc-pos-tr{top:20px;right:20px}",
    ".amelie-wc-root.amelie-wc-pos-tr .amelie-wc-panel{bottom:auto;top:72px}",
  ].join("");

  var ICON_CHAT =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>';
  var ICON_CLOSE =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
  var ICON_SEND =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';

  function injectStyles() {
    if (document.getElementById("amelie-wc-styles")) return;
    var style = document.createElement("style");
    style.id = "amelie-wc-styles";
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function createWidget(config) {
    var botId = config.botId || "";
    var apiUrl = (config.apiUrl || "").replace(/\/$/, "");
    var position = config.position || "bottom-right";
    var title = config.title || "Chat";
    var placeholder = config.placeholder || "Escribe un mensaje...";
    /** ID único por visitante: si la página pasa userId se usa; si no, uno persistente en localStorage por bot */
    var senderId = config.userId || getOrCreateVisitorId(botId);

    function getOrCreateVisitorId(bid) {
      try {
        var key = "amelie_wc_" + (bid || "");
        var stored = localStorage.getItem(key);
        if (stored) return stored;
        var id =
          "wc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
        localStorage.setItem(key, id);
        return id;
      } catch (e) {
        return (
          "wc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11)
        );
      }
    }

    if (!botId) {
      console.warn("AmelieWebchat: botId es requerido.");
      return null;
    }

    injectStyles();

    var root = document.createElement("div");
    var posMap = {
      "bottom-right": "br",
      "bottom-left": "bl",
      "top-left": "tl",
      "top-right": "tr",
    };
    root.className =
      "amelie-wc-root amelie-wc-pos-" + (posMap[position] || "br");

    var askUrl = apiUrl + "/webchat/ask";
    var messagesUrl = apiUrl + "/webchat/messages";
    var messages = [];
    var sending = false;
    var pollTimer = null;

    function buildMessagesFromList(list) {
      var out = [];
      for (var i = 0; i < list.length; i++) {
        var row = list[i];
        if (row.mensaje && row.mensaje.trim()) {
          out.push({
            role: "user",
            content: row.mensaje.trim(),
            id: row.id + "-u",
          });
        }
        if (row.respuesta && row.respuesta.trim()) {
          out.push({
            role: "assistant",
            content: row.respuesta.trim(),
            id: row.id + "-r",
          });
        }
      }
      return out;
    }

    function fetchAndRenderMessages(messagesEl) {
      var url =
        messagesUrl +
        "?botId=" +
        encodeURIComponent(botId) +
        "&senderId=" +
        encodeURIComponent(senderId);
      fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(function (res) {
          if (!res.ok) return [];
          return res.json();
        })
        .then(function (list) {
          if (Array.isArray(list) && list.length > 0) {
            messages = buildMessagesFromList(list);
            renderMessages(messagesEl);
            messagesEl.scrollTop = messagesEl.scrollHeight;
          }
        })
        .catch(function () {});
    }

    function startPolling(messagesEl) {
      if (pollTimer) return;
      fetchAndRenderMessages(messagesEl);
      pollTimer = setInterval(function () {
        fetchAndRenderMessages(messagesEl);
      }, 2500);
    }

    function stopPolling() {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }

    function renderMessages(container) {
      container.innerHTML = "";
      messages.forEach(function (m) {
        var div = document.createElement("div");
        div.className = "amelie-wc-msg amelie-wc-msg-" + m.role;
        div.textContent = m.content;
        container.appendChild(div);
      });
      container.scrollTop = container.scrollHeight;
    }

    function addTyping(container) {
      var div = document.createElement("div");
      div.className = "amelie-wc-msg amelie-wc-typing";
      div.textContent = "Escribiendo...";
      div.setAttribute("data-typing", "1");
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function removeTyping(container) {
      var el = container.querySelector('[data-typing="1"]');
      if (el) el.remove();
    }

    function sendMessage(text, messagesEl, inputEl) {
      if (sending || !text.trim()) return;
      messages.push({ role: "user", content: text.trim() });
      renderMessages(messagesEl);
      addTyping(messagesEl);
      inputEl.value = "";
      inputEl.disabled = true;
      sending = true;

      var mid =
        "webchat-" + Date.now() + "-" + Math.random().toString(36).slice(2);
      var payload = {
        botId: botId,
        pregunta: text.trim(),
        senderId: senderId,
        mid: mid,
      };

      fetch(askUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok)
            return res.json().then(function (j) {
              throw new Error(j.message || "Error " + res.status);
            });
          return res.json();
        })
        .then(function (data) {
          removeTyping(messagesEl);
          messages.push({
            role: "assistant",
            content:
              (data && data.content && data.content.trim()) ||
              "(Sin respuesta)",
          });
          renderMessages(messagesEl);
          messagesEl.scrollTop = messagesEl.scrollHeight;
        })
        .catch(function (err) {
          removeTyping(messagesEl);
          messages.push({
            role: "assistant",
            content:
              err && err.message ? err.message : "Error al enviar el mensaje.",
          });
          renderMessages(messagesEl);
          messagesEl.scrollTop = messagesEl.scrollHeight;
        })
        .finally(function () {
          sending = false;
          inputEl.disabled = false;
          inputEl.focus();
        });
    }

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "amelie-wc-btn";
    btn.setAttribute("aria-label", "Abrir chat");
    btn.innerHTML = ICON_CHAT;

    var panel = document.createElement("div");
    panel.className = "amelie-wc-panel";

    var header = document.createElement("div");
    header.className = "amelie-wc-header";
    header.textContent = title;

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "amelie-wc-close";
    closeBtn.setAttribute("aria-label", "Cerrar");
    closeBtn.innerHTML = ICON_CLOSE;

    var messagesEl = document.createElement("div");
    messagesEl.className = "amelie-wc-messages";

    var inputRow = document.createElement("div");
    inputRow.className = "amelie-wc-input-row";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "amelie-wc-input";
    input.placeholder = placeholder;
    input.setAttribute("autocomplete", "off");

    var sendBtn = document.createElement("button");
    sendBtn.type = "button";
    sendBtn.className = "amelie-wc-send";
    sendBtn.setAttribute("aria-label", "Enviar");
    sendBtn.innerHTML = ICON_SEND;

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input.value, messagesEl, input);
      }
    });
    sendBtn.addEventListener("click", function () {
      sendMessage(input.value, messagesEl, input);
    });

    header.appendChild(closeBtn);
    inputRow.appendChild(input);
    inputRow.appendChild(sendBtn);
    panel.appendChild(header);
    panel.appendChild(messagesEl);
    panel.appendChild(inputRow);
    root.appendChild(btn);
    root.appendChild(panel);

    btn.addEventListener("click", function () {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) {
        input.focus();
        startPolling(messagesEl);
      } else {
        stopPolling();
      }
    });
    closeBtn.addEventListener("click", function () {
      panel.classList.remove("open");
      stopPolling();
    });

    document.body.appendChild(root);

    return {
      open: function () {
        panel.classList.add("open");
        input.focus();
      },
      close: function () {
        panel.classList.remove("open");
      },
      destroy: function () {
        root.remove();
      },
    };
  }

  var instance = null;

  var AmelieWebchat = {
    init: function (config) {
      if (instance) instance.destroy();
      instance = createWidget(config || {});
      return instance;
    },
    destroy: function () {
      if (instance) {
        instance.destroy();
        instance = null;
      }
    },
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = AmelieWebchat;
  } else {
    global.AmelieWebchat = AmelieWebchat;
  }
})(typeof window !== "undefined" ? window : this);
