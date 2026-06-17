/* ============================================================================
   CHATBOT-UI.JS
   ----------------------------------------------------------------------------
   Handles all DOM interaction for the chatbot widget:
     - Toggling open/close with animation
     - Rendering user & bot messages
     - Typing indicator simulation
     - Auto-scroll to latest message
     - Quick suggestion chips
     - Session-only chat history (resets on page reload, per requirements)

   This file assumes chatbot-data.js and chatbot.js are loaded BEFORE it,
   since it relies on window.PortfolioChatbot.getBotResponse().
   ============================================================================ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const toggleBtn = document.getElementById("pcb-toggle-btn");
    const windowEl = document.getElementById("pcb-window");
    const closeBtn = document.getElementById("pcb-close-btn");
    const form = document.getElementById("pcb-input-form");
    const input = document.getElementById("pcb-input");
    const messagesEl = document.getElementById("pcb-messages");
    const suggestionsEl = document.getElementById("pcb-suggestions");

    if (!toggleBtn || !windowEl) return; // widget not present on this page

    let hasGreeted = false;

    const QUICK_SUGGESTIONS = [
      "Tell me about yourself",
      "Show your skills",
      "What projects have you built?",
      "How can I contact you?",
      "Show GitHub"
    ];

    /* ---------------- Toggle open/close ---------------- */
    toggleBtn.addEventListener("click", () => {
      const isOpen = windowEl.classList.contains("pcb-open");
      if (isOpen) {
        closeChat();
      } else {
        openChat();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeChat);
    }

    function openChat() {
      windowEl.classList.add("pcb-open");
      toggleBtn.classList.add("pcb-active");
      toggleBtn.setAttribute("aria-expanded", "true");
      if (!hasGreeted) {
        hasGreeted = true;
        renderBotMessage(
          "👋 Hi! I'm Priyanshu's portfolio assistant. Ask me anything about his background, skills, projects, or how to get in touch!"
        );
        renderSuggestions();
      }
      setTimeout(() => input && input.focus(), 200);
    }

    function closeChat() {
      windowEl.classList.remove("pcb-open");
      toggleBtn.classList.remove("pcb-active");
      toggleBtn.setAttribute("aria-expanded", "false");
    }

    /* ---------------- Sending a message ---------------- */
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendMessage();
      });
    }

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      renderUserMessage(text);
      input.value = "";
      removeSuggestions();
      showTypingIndicator();

      // Simulate a short "thinking" delay for a more natural feel
      const delay = 500 + Math.random() * 500;
      setTimeout(() => {
        hideTypingIndicator();
        const response = window.PortfolioChatbot.getBotResponse(text);
        renderBotMessage(response);
      }, delay);
    }

    /* ---------------- Rendering helpers ---------------- */
    function renderUserMessage(text) {
      const bubble = document.createElement("div");
      bubble.className = "pcb-msg pcb-msg-user";
      bubble.textContent = text;
      messagesEl.appendChild(bubble);
      scrollToBottom();
    }

    function renderBotMessage(html) {
      const bubble = document.createElement("div");
      bubble.className = "pcb-msg pcb-msg-bot";
      bubble.innerHTML = html;
      messagesEl.appendChild(bubble);
      scrollToBottom();
    }

    function renderSuggestions() {
      if (!suggestionsEl) return;
      suggestionsEl.innerHTML = "";
      QUICK_SUGGESTIONS.forEach((s) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "pcb-chip";
        chip.textContent = s;
        chip.addEventListener("click", () => {
          input.value = s;
          sendMessage();
        });
        suggestionsEl.appendChild(chip);
      });
      scrollToBottom();
    }

    function removeSuggestions() {
      if (suggestionsEl) suggestionsEl.innerHTML = "";
    }

    /* ---------------- Typing indicator ---------------- */
    function showTypingIndicator() {
      const typing = document.createElement("div");
      typing.className = "pcb-msg pcb-msg-bot pcb-typing";
      typing.id = "pcb-typing-indicator";
      typing.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(typing);
      scrollToBottom();
    }

    function hideTypingIndicator() {
      const typing = document.getElementById("pcb-typing-indicator");
      if (typing) typing.remove();
    }

    /* ---------------- Auto-scroll ---------------- */
    function scrollToBottom() {
      requestAnimationFrame(() => {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      });
    }
  }
})();
