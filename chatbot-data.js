/* ============================================================================
   CHATBOT-DATA.JS
   ----------------------------------------------------------------------------
   This file is the KNOWLEDGE BASE for the portfolio chatbot.

   WHERE THIS DATA CAME FROM (knowledge extraction):
   Every field below was extracted directly from the existing portfolio files:
     - home.html      -> name, tagline, intro/about-me summary, CV link
     - about.html     -> bio, birthday, degree, city, age, phone, email,
                         GitHub link, LeetCode link
     - skills.html    -> skill categories + descriptions
     - contact.html   -> phone, email, LinkedIn
     - README.md      -> live demo URL, tech stack, GitHub repo, project
                         description
     - RESUME.docx    -> education (college name, years, coursework),
                         technical skills, projects list, achievements,
                         additional activities

   HOW TO UPDATE THIS FILE (so new info is picked up automatically):
     1. To add a NEW PROJECT          -> add an object to the PROJECTS array.
     2. To add a NEW SKILL             -> add an object to the SKILLS array.
     3. To add a NEW ACHIEVEMENT       -> add a string to ACHIEVEMENTS array.
     4. To add a NEW ACTIVITY          -> add a string to ACTIVITIES array.
     5. To update CONTACT/SOCIAL info  -> edit the CONTACT object.
     6. To update EDUCATION            -> edit the EDUCATION array.
     7. To update the ABOUT summary    -> edit the ABOUT object.

   No other file needs to change when you update data here — the chatbot
   engine (chatbot.js) reads everything dynamically from this object.
   ============================================================================ */

const PORTFOLIO_DATA = {

  // ---------------------------------------------------------------------
  // ABOUT ME  (sourced from home.html intro + about.html descp section)
  // ---------------------------------------------------------------------
  about: {
    name: "Priyanshu Srivastav",
    tagline: "B.Tech Computer Science Engineering student",
    summary:
      "I'm Priyanshu Srivastav, a B.Tech Computer Science Engineering student passionate about building impactful digital experiences and solving complex problems through technology. I'm currently focused on mastering Data Structures & Algorithms in C++ while expanding my expertise in Web Development and modern UI design. I enjoy transforming ideas into responsive, user-friendly projects and continuously exploring new technologies to strengthen my development skills.",
    extra:
      "I'm skilled in frontend development — proficient in HTML, CSS and JavaScript. I excel in problem solving and have experience tackling problems in DSA. I'm passionate about exploring the realm of data science, and I enjoy sharing insights and knowledge.",
    personal: {
      birthday: "03/09/2006",
      age: "20",
      city: "Ghaziabad",
      degree: "B.Tech"
    },
    cvLink: "RESUME.docx"
  },

  // ---------------------------------------------------------------------
  // EDUCATION  (sourced from RESUME.docx)
  // ---------------------------------------------------------------------
  education: [
    {
      degree: "Bachelor of Technology (B.Tech) – Computer Science",
      institute: "ABES Engineering College, Ghaziabad",
      duration: "2025 – 2029",
      coursework: [
        "Data Structures",
        "Programming in C++",
        "Discrete Mathematics",
        "Object-Oriented Programming"
      ]
    }
  ],

  // ---------------------------------------------------------------------
  // SKILLS  (sourced from skills.html + RESUME.docx technical skills)
  // ---------------------------------------------------------------------
  skills: [
    {
      category: "Frontend",
      items: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      description:
        "A frontend proficient with expertise in crafting responsive and user-centric interfaces. Skilled in HTML, CSS and JavaScript to create engaging web experiences."
    },
    {
      category: "Problem-Solving Ability",
      items: ["Data Structures", "Algorithms", "C++", "OOP"],
      description:
        "Proficient in optimizing algorithms, debugging code, and developing efficient solutions. Solved a range of DSA questions, enhancing logical reasoning and coding efficiency."
    },
    {
      category: "Tools",
      items: ["Git", "GitHub", "VS Code"],
      description: "Comfortable using Git & GitHub for version control and VS Code as a primary editor."
    }
  ],

  // ---------------------------------------------------------------------
  // PROJECTS  (sourced from RESUME.docx + README.md)
  // To add a new project later, just push a new object into this array —
  // the chatbot will automatically include it when answering "projects"
  // questions.
  // ---------------------------------------------------------------------
  projects: [
    {
      title: "Personal Portfolio Website",
      technologies: ["HTML", "CSS", "JavaScript", "Vercel"],
      description:
        "A personal developer portfolio website showcasing skills, projects and achievements as a Computer Science student. Includes an About section, Projects/Skills showcase, and Contact information, with a clean responsive design deployed online.",
      link: "https://priyanshu-portfolio-roan-sigma.vercel.app/"
    },
    {
      title: "Replica of College Website (ABES Webpage)",
      technologies: ["HTML", "CSS"],
      description:
        "Used HTML to design the website layout and CSS to make it more visually attractive, then deployed the project online for public access.",
      link: "https://abes-webpage.vercel.app/"
    }
  ],

  // ---------------------------------------------------------------------
  // EXPERIENCE
  // No formal work experience was found in the portfolio content. This is
  // intentionally left as an empty array with a friendly fallback message
  // used by the chatbot engine. Update here once internships/jobs happen.
  // ---------------------------------------------------------------------
  experience: [],

  // ---------------------------------------------------------------------
  // ACHIEVEMENTS  (sourced from RESUME.docx "Coding Profiles & Achievements")
  // ---------------------------------------------------------------------
  achievements: [
    "Solved 200+ problems on LeetCode",
    "Maximum coding streak of 100+ days",
    "Active participant in coding contests and problem-solving platforms"
  ],

  // ---------------------------------------------------------------------
  // ACTIVITIES  (sourced from RESUME.docx "Additional Activities")
  // ---------------------------------------------------------------------
  activities: [
    "Actively learning Data Structures and Algorithms",
    "Exploring web development and building small projects",
    "Interested in competitive programming and problem solving"
  ],

  // ---------------------------------------------------------------------
  // HACKATHONS
  // None found in the current portfolio/resume content. Left as an empty
  // array — chatbot will respond gracefully. Add entries like:
  // { name: "...", result: "...", year: "..." }
  // ---------------------------------------------------------------------
  hackathons: [],

  // ---------------------------------------------------------------------
  // CONTACT INFORMATION  (sourced from contact.html / about.html)
  // ---------------------------------------------------------------------
  contact: {
    phone: "+91 7390868642",
    email: "priyanshusrivastav047@gmail.com",
    location: "Ghaziabad, Uttar Pradesh, India"
  },

  // ---------------------------------------------------------------------
  // SOCIAL / PROFESSIONAL LINKS  (sourced from about.html / contact.html / README.md)
  // ---------------------------------------------------------------------
  social: {
    github: "https://github.com/priyanshusrivastava049-afk",
    linkedin: "https://www.linkedin.com/in/priyanshu-srivastav-313989345/",
    leetcode: "https://leetcode.com/u/Priyanshu-srivastav/",
    livePortfolio: "https://priyanshu-portfolio-roan-sigma.vercel.app/"
  },

  // ---------------------------------------------------------------------
  // AVAILABILITY  (not explicitly stated in portfolio; reasonable default
  // based on "student actively building/learning" framing. Edit freely.)
  // ---------------------------------------------------------------------
  availability: {
    openToInternships: true,
    message:
      "Yes — I'm a Computer Science student actively learning and building, and I'm open to internship opportunities, especially in web development and software engineering. Feel free to reach out via email or LinkedIn!"
  }
};

// Expose to the rest of the chatbot app
if (typeof window !== "undefined") {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
