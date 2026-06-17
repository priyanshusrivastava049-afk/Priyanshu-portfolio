# Chatbot Integration Instructions

This adds an AI-style chatbot widget to your existing portfolio using **only HTML, CSS, and JavaScript** — no backend, no external AI APIs. It's a **rule-based knowledge system** built from content already in your portfolio (home.html, about.html, skills.html, contact.html, README.md, RESUME.docx).

---

## 1. New files created (copy these into your project folder, same folder as your HTML pages)

| File | Purpose |
|---|---|
| `chatbot-data.js` | **Knowledge base.** All extracted facts about you (About, Education, Skills, Projects, Experience, Achievements, Activities, Contact, Social, Technologies). Edit this file to update what the bot knows. |
| `chatbot.js` | **Chatbot engine.** Rule-based intent matching (keyword/phrase detection) + response generation. Reads from `chatbot-data.js` — you never need to edit this when adding new content. |
| `chatbot-ui.js` | **UI controller.** Handles opening/closing the widget, sending messages, typing indicator, auto-scroll, suggestion chips, and session chat history. |
| `chatbot.css` | **Styling.** Dark theme matched to your existing palette (`#0B1120` background, `#111827` panels, `#22D3EE` cyan accent). Mobile responsive. |

No existing file (home.html, about.html, skills.html, contact.html, their CSS, or any other JS) was modified in content — you only **add** a small snippet, shown below.

---

## 2. Which files to modify, and exactly what to add

You need to insert the **same snippet** into **all 4 pages**: `home.html`, `about.html`, `skills.html`, `contact.html`.

### Insertion location
Paste it immediately **before the closing `</body>` tag** in each file.

### Exact snippet to insert

```html
<!-- ============ PORTFOLIO CHATBOT WIDGET START ============ -->
<div id="pcb-root">

  <!-- Floating toggle button (bottom-right) -->
  <button id="pcb-toggle-btn" aria-label="Open chat assistant" aria-expanded="false">
    <i class="fa-solid fa-comment-dots pcb-icon-chat"></i>
    <i class="fa-solid fa-xmark pcb-icon-close"></i>
  </button>

  <!-- Chat window -->
  <div id="pcb-window" role="dialog" aria-label="Portfolio chat assistant">
    <div id="pcb-header">
      <div id="pcb-header-info">
        <div id="pcb-header-avatar">PS</div>
        <div id="pcb-header-text">
          <strong>Priyanshu's Assistant</strong>
          <span>Online</span>
        </div>
      </div>
      <button id="pcb-close-btn" aria-label="Close chat">&times;</button>
    </div>

    <div id="pcb-messages"></div>

    <div id="pcb-suggestions"></div>

    <form id="pcb-input-form" autocomplete="off">
      <input type="text" id="pcb-input" placeholder="Ask me anything..." aria-label="Type your message" />
      <button type="submit" id="pcb-send-btn" aria-label="Send message">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  </div>

</div>

<!-- Chatbot scripts: data (knowledge base) -> engine (NLU/logic) -> UI controller -->
<link rel="stylesheet" href="chatbot.css">
<script src="chatbot-data.js"></script>
<script src="chatbot.js"></script>
<script src="chatbot-ui.js"></script>
<!-- ============ PORTFOLIO CHATBOT WIDGET END ============ -->
```

**Note:** This snippet uses Font Awesome icons (`fa-comment-dots`, `fa-xmark`, `fa-paper-plane`). Your pages already load Font Awesome via CDN in the `<head>`, so no new dependency is needed.

### Example — `home.html`

Find this at the very end of the file:
```html
    </div>
</body>
</html>
```

Change it to:
```html
    </div>

<!-- ============ PORTFOLIO CHATBOT WIDGET START ============ -->
... (paste full snippet here) ...
<!-- ============ PORTFOLIO CHATBOT WIDGET END ============ -->
</body>
</html>
```

Repeat identically for `about.html`, `skills.html`, and `contact.html`.

---

## 3. Folder structure after integration

```
your-portfolio/
├── home.html              (modified: snippet added before </body>)
├── about.html              (modified: snippet added before </body>)
├── skills.html              (modified: snippet added before </body>)
├── contact.html             (modified: snippet added before </body>)
├── profile.jpg               (unchanged)
├── ps.jpeg                    (unchanged)
├── RESUME.docx                 (unchanged)
├── chatbot-data.js          ← NEW
├── chatbot.js                ← NEW
├── chatbot-ui.js               ← NEW
└── chatbot.css                  ← NEW
```

---

## 4. How the knowledge base was built (extraction logic)

Every fact in `chatbot-data.js` was extracted directly from your existing files:

| Data | Extracted from |
|---|---|
| About Me / intro | `home.html` hero text, `about.html` description |
| Education | `RESUME.docx` (ABES Engineering College, 2025–2029, coursework) |
| Skills | `skills.html` (Frontend, Problem-Solving cards) + `RESUME.docx` (Tools: Git, GitHub, VS Code) |
| Projects | `RESUME.docx` Projects section + `README.md` (live demo link, tech stack) |
| Achievements | `RESUME.docx` "Coding Profiles & Achievements" (200+ LeetCode problems, 100+ day streak) |
| Activities | `RESUME.docx` "Additional Activities" |
| Contact | `about.html` / `contact.html` (phone, email, city) |
| Social links | `about.html` (GitHub, LeetCode) + `contact.html` (LinkedIn) + `README.md` (GitHub repo) |
| Technologies | Combined from Skills + Projects technology lists |
| Hackathons | Not found anywhere in your content — left as an empty array with a graceful fallback reply. Add entries once you have some (see below). |
| Experience | No formal work experience found — left empty with a graceful fallback reply. |

---

## 5. How to update the chatbot later (e.g. add a new project)

Open `chatbot-data.js` only. You never need to touch `chatbot.js` or `chatbot-ui.js`.

**Add a new project:**
```js
projects: [
  // ...existing projects...
  {
    title: "Your New Project Name",
    technologies: ["React", "Node.js"],
    description: "A short description of what it does.",
    link: "https://your-live-link.com"
  }
]
```

**Add a new achievement:**
```js
achievements: [
  // ...existing...
  "Won 1st place in XYZ Hackathon 2026"
]
```

**Add a hackathon:**
```js
hackathons: [
  { name: "HackThisFest 2026", result: "Top 10 Finalist", year: "2026" }
]
```

**Update contact/social info:** edit the `contact` and `social` objects directly.

The chatbot automatically reflects these changes the next time the page loads — no other code changes needed.

---

## 6. Smart features supported

The bot uses keyword/phrase-based intent detection (see `chatbot.js`) so it understands many phrasings, including all of these (and similar variations):

- "Tell me about yourself" / "Who is Priyanshu?" → About Me
- "What projects have you built?" / "Show projects" → Projects
- "Show your skills" / "What are you good at?" → Skills
- "How can I contact you?" / "What's your email?" → Contact
- "What technologies do you use?" → Technologies
- "Are you available for internships?" → Availability
- "Show GitHub" / "Show LinkedIn" / "Show LeetCode" → Social Links
- "What hackathons have you participated in?" → Hackathons (currently none — graceful fallback)
- "What's your education?" / "Which college?" → Education
- "What are your achievements?" → Achievements
- Greetings, thanks, and goodbyes are also recognized.

If a question isn't understood, the bot replies with a friendly list of topics it can help with instead of failing silently.

---

## 7. UI features included

- Floating round button, bottom-right corner, on every page.
- Click to open/close with smooth scale + fade animation.
- Dark theme matching your site's palette and fonts.
- Session-only chat history (resets on page reload — no backend/storage used).
- Typing indicator (animated dots) before each bot reply.
- Auto-scroll to the latest message.
- Quick-reply suggestion chips shown on first open.
- Fully responsive on mobile (tested down to ~360px width).
