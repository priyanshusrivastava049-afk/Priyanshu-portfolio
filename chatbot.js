/* ============================================================================
   CHATBOT.JS
   ----------------------------------------------------------------------------
   Rule-based chatbot engine for the portfolio site.
   No backend. No external AI APIs. Pure JavaScript running in the browser.

   ARCHITECTURE OVERVIEW
   ----------------------------------------------------------------------------
   1. INTENTS: Each "intent" (About, Skills, Projects, Contact, etc.) has a
      list of trigger keywords/phrases. We do NOT do exact string matching —
      instead we normalize the user's message (lowercase, strip punctuation)
      and then score every intent by counting how many of its keywords
      appear in the message. The highest-scoring intent above a minimum
      threshold wins. This is what lets the bot understand different
      phrasings like "Who is Priyanshu?" and "Tell me about yourself" as
      the SAME intent (about_me).

   2. RESPONSE BUILDERS: Each intent maps to a function that reads from
      window.PORTFOLIO_DATA (chatbot-data.js) and formats a human-readable
      answer. Because answers are generated from the data object instead of
      being hardcoded strings, updating chatbot-data.js automatically
      updates what the bot says — no need to touch this file when content
      changes.

   3. FALLBACK: If no intent scores high enough, we return a friendly
      "I didn't quite get that" message with quick suggestions.
   ============================================================================ */

(function () {
  "use strict";

  // Guard: make sure the knowledge base loaded before this file runs
  const DATA = window.PORTFOLIO_DATA || {};

  /* --------------------------------------------------------------------
     STEP 1: TEXT NORMALIZATION
     Lowercases input and strips punctuation so "Who's Priyanshu??" and
     "who is priyanshu" match identically against our keyword lists.
  -------------------------------------------------------------------- */
  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ") // strip punctuation
      .replace(/\s+/g, " ")
      .trim();
  }

  /* --------------------------------------------------------------------
     Helper: escape a string for safe use inside a RegExp.
  -------------------------------------------------------------------- */
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* --------------------------------------------------------------------
     Helper: does `keyword` appear in `msg` as a whole word/phrase match?
     We use word-boundary regex (\b) rather than plain substring matching,
     because plain substring checks produce false positives — e.g. the
     2-letter keyword "hi" would incorrectly match inside "internships"
     (...s-HI-ps). Word boundaries ensure "hi" only matches the standalone
     word "hi", not a fragment buried inside a longer word.
  -------------------------------------------------------------------- */
  function hasKeyword(msg, keyword) {
    const pattern = new RegExp("\\b" + escapeRegExp(keyword) + "\\b");
    return pattern.test(msg);
  }

  /* --------------------------------------------------------------------
     STEP 2: INTENT DEFINITIONS
     Each intent = { keywords: [...], handler: function() }
     Keywords are short phrases/words a user is likely to type. The
     matcher checks for whole-word/phrase presence of each keyword inside
     the normalized message, so multi-word keywords like "tell me about
     yourself" still match naturally.
  -------------------------------------------------------------------- */
  const INTENTS = [
    {
      name: "greeting",
      keywords: ["hi", "hello", "hey", "good morning", "good evening", "yo", "hii", "namaste"],
      handler: handleGreeting
    },
    {
      name: "about_me",
      keywords: [
        "about you", "about yourself", "about priyanshu", "who is priyanshu",
        "who are you", "tell me about yourself", "introduce yourself", "your story",
        "bio", "background", "yourself", "who r u", "tell me about you"
      ],
      handler: handleAbout
    },
    {
      name: "education",
      keywords: [
        "education", "college", "degree", "study", "studies", "studying",
        "university", "academic", "qualification", "btech", "b.tech", "school"
      ],
      handler: handleEducation
    },
    {
      name: "skills",
      keywords: [
        "skill", "skills", "what can you do", "good at", "expertise",
        "proficient", "show your skills", "tech stack", "abilities"
      ],
      handler: handleSkills
    },
    {
      name: "technologies",
      keywords: [
        "technologies", "technology", "tools", "languages", "frameworks",
        "what technologies", "tech you use", "programming language"
      ],
      handler: handleTechnologies
    },
    {
      name: "projects",
      keywords: [
        "project", "projects", "what have you built", "what have you built",
        "show projects", "your work", "portfolio projects", "built", "made any"
      ],
      handler: handleProjects
    },
    {
      name: "experience",
      keywords: [
        "experience", "work experience", "job", "internship experience",
        "worked at", "employment", "career"
      ],
      handler: handleExperience
    },
    {
      name: "achievements",
      keywords: [
        "achievement", "achievements", "accomplishment", "awards",
        "leetcode", "competitive programming", "coding streak", "rank"
      ],
      handler: handleAchievements
    },
    {
      name: "hackathons",
      keywords: ["hackathon", "hackathons", "hack", "competed"],
      handler: handleHackathons
    },
    {
      name: "activities",
      keywords: [
        "activities", "extracurricular", "hobbies", "interests",
        "what do you do in free time", "other activities"
      ],
      handler: handleActivities
    },
    {
      name: "contact",
      keywords: [
        "contact", "reach you", "email", "phone", "number", "call you",
        "get in touch", "how can i contact", "mail"
      ],
      handler: handleContact
    },
    {
      name: "social",
      keywords: [
        "github", "linkedin", "social", "social links", "social media",
        "show github", "show linkedin", "profile link", "leetcode profile"
      ],
      handler: handleSocial
    },
    {
      name: "availability",
      keywords: [
        "available", "availability", "internship", "hire", "open to work",
        "looking for", "freelance", "open for"
      ],
      handler: handleAvailability
    },
    {
      name: "resume",
      keywords: ["resume", "cv", "download resume", "download cv"],
      handler: handleResume
    },
    {
      name: "thanks",
      keywords: ["thank", "thanks", "thank you", "thx", "appreciate"],
      handler: handleThanks
    },
    {
      name: "bye",
      keywords: ["bye", "goodbye", "see you", "exit", "close chat"],
      handler: handleBye
    }
  ];

  const MIN_SCORE = 1; // at least one keyword must match

  /* --------------------------------------------------------------------
     STEP 3: INTENT SCORING / MATCHING
  -------------------------------------------------------------------- */
  function detectIntent(rawMessage) {
    const msg = normalize(rawMessage);
    let bestIntent = null;
    let bestScore = 0;

    INTENTS.forEach((intent) => {
      let score = 0;
      intent.keywords.forEach((kw) => {
        if (hasKeyword(msg, kw)) {
          // longer/more specific keywords count for more, so a precise
          // multi-word phrase outranks a generic single-word overlap
          score += kw.split(" ").length;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    });

    if (bestIntent && bestScore >= MIN_SCORE) {
      return bestIntent;
    }
    return null;
  }

  /* --------------------------------------------------------------------
     STEP 4: RESPONSE HANDLERS
     Each handler returns a string (can include simple HTML like <br>,
     <a>, <strong> since we render with innerHTML in the UI layer).
  -------------------------------------------------------------------- */
  function handleGreeting() {
    const name = (DATA.about && DATA.about.name) || "there";
    return `Hey! 👋 I'm ${name.split(" ")[0]}'s portfolio assistant. Ask me about his About, Education, Skills, Projects, Experience, Achievements, Activities, Contact info, Social links, or Technologies he uses!`;
  }

  function handleAbout() {
    if (!DATA.about) return "I don't have info about that yet.";
    return `${DATA.about.summary}<br><br>${DATA.about.extra}`;
  }

  function handleEducation() {
    if (!DATA.education || !DATA.education.length) {
      return "I don't have education details yet.";
    }
    return DATA.education
      .map(
        (e) =>
          `🎓 <strong>${e.degree}</strong><br>${e.institute}<br>${e.duration}<br>Coursework: ${e.coursework.join(", ")}`
      )
      .join("<br><br>");
  }

  function handleSkills() {
    if (!DATA.skills || !DATA.skills.length) return "No skills listed yet.";
    return (
      "Here's a breakdown of my skills:<br><br>" +
      DATA.skills
        .map((s) => `🛠️ <strong>${s.category}</strong>: ${s.items.join(", ")}<br><span style="opacity:0.85;font-size:0.92em;">${s.description}</span>`)
        .join("<br><br>")
    );
  }

  function handleTechnologies() {
    if (!DATA.skills || !DATA.skills.length) return "No technologies listed yet.";
    const allTech = new Set();
    DATA.skills.forEach((s) => s.items.forEach((i) => allTech.add(i)));
    if (DATA.projects) {
      DATA.projects.forEach((p) => p.technologies.forEach((t) => allTech.add(t)));
    }
    return `I work with: <strong>${Array.from(allTech).join(", ")}</strong>.`;
  }

  function handleProjects() {
    if (!DATA.projects || !DATA.projects.length) return "No projects listed yet.";
    return (
      "Here are my projects:<br><br>" +
      DATA.projects
        .map(
          (p, i) =>
            `${i + 1}. <strong>${p.title}</strong><br>${p.description}<br>Tech: ${p.technologies.join(", ")}` +
            (p.link ? `<br>🔗 <a href="${p.link}" target="_blank" rel="noopener">View Project</a>` : "")
        )
        .join("<br><br>")
    );
  }

  function handleExperience() {
    if (!DATA.experience || !DATA.experience.length) {
      return "I don't have formal work experience listed yet — currently focused on academics, personal projects, and strengthening my DSA & web development skills. Feel free to check my Projects or Achievements instead!";
    }
    return DATA.experience
      .map((e) => `💼 <strong>${e.role}</strong> at ${e.company} (${e.duration})<br>${e.description}`)
      .join("<br><br>");
  }

  function handleAchievements() {
    if (!DATA.achievements || !DATA.achievements.length) return "No achievements listed yet.";
    return "🏆 Achievements:<br>" + DATA.achievements.map((a) => `• ${a}`).join("<br>");
  }

  function handleHackathons() {
    if (!DATA.hackathons || !DATA.hackathons.length) {
      return "I haven't participated in any hackathons yet, but I'm always open to new opportunities to learn and build under pressure!";
    }
    return DATA.hackathons
      .map((h) => `🏁 <strong>${h.name}</strong> (${h.year}) — ${h.result}`)
      .join("<br>");
  }

  function handleActivities() {
    if (!DATA.activities || !DATA.activities.length) return "No activities listed yet.";
    return "🎯 Outside of core coursework, I'm involved in:<br>" + DATA.activities.map((a) => `• ${a}`).join("<br>");
  }

  function handleContact() {
    if (!DATA.contact) return "Contact info not available yet.";
    return `📞 Phone: ${DATA.contact.phone}<br>📧 Email: <a href="mailto:${DATA.contact.email}">${DATA.contact.email}</a><br>📍 Location: ${DATA.contact.location}`;
  }

  function handleSocial() {
    if (!DATA.social) return "Social links not available yet.";
    const s = DATA.social;
    let out = "Here's where you can find me:<br>";
    if (s.github) out += `💻 <a href="${s.github}" target="_blank" rel="noopener">GitHub</a><br>`;
    if (s.linkedin) out += `🔗 <a href="${s.linkedin}" target="_blank" rel="noopener">LinkedIn</a><br>`;
    if (s.leetcode) out += `🧠 <a href="${s.leetcode}" target="_blank" rel="noopener">LeetCode</a><br>`;
    if (s.livePortfolio) out += `🌐 <a href="${s.livePortfolio}" target="_blank" rel="noopener">Live Portfolio</a>`;
    return out;
  }

  function handleAvailability() {
    if (!DATA.availability) return "Not specified yet.";
    return DATA.availability.message;
  }

  function handleResume() {
    const link = (DATA.about && DATA.about.cvLink) || "#";
    return `You can download my resume here: <a href="${link}" download>Download CV</a>`;
  }

  function handleThanks() {
    return "You're welcome! 😊 Let me know if you'd like to know anything else — About, Skills, Projects, Education, Contact, or Social links.";
  }

  function handleBye() {
    return "Thanks for stopping by! 👋 Feel free to reopen this chat anytime if you have more questions.";
  }

  function handleFallback() {
    return (
      "Hmm, I'm not sure I understood that. 🤔 You can ask me about:<br>" +
      "• About Me &nbsp; • Education &nbsp; • Skills &nbsp; • Projects<br>" +
      "• Experience &nbsp; • Achievements &nbsp; • Activities<br>" +
      "• Contact &nbsp; • Social Links &nbsp; • Technologies"
    );
  }

  /* --------------------------------------------------------------------
     STEP 5: PUBLIC API
     getBotResponse(message) -> string (HTML-safe-ish response)
     Exposed on window so chatbot-ui.js can call it.
  -------------------------------------------------------------------- */
  function getBotResponse(message) {
    if (!message || !message.trim()) {
      return "Could you type a question? 🙂";
    }
    const intent = detectIntent(message);
    if (intent) {
      try {
        return intent.handler();
      } catch (err) {
        console.error("Chatbot handler error:", err);
        return handleFallback();
      }
    }
    return handleFallback();
  }

  window.PortfolioChatbot = {
    getBotResponse: getBotResponse
  };
})();
