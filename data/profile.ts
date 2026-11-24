export const profile = {
  name: "Vijayaragavan",
  firstName: "Vijayaragavan",
  title: "Aspiring Software Developer",
  tagline:
    "Computer Science student passionate about Backend Development, AI/ML, and building practical software solutions.",
  intro:
    "I enjoy learning modern technologies, solving problems through code, and continuously improving my development skills through projects and hands-on practice.",
  roles: [
    "Aspiring Software Developer",
    "Backend Developer",
    "AI/ML Enthusiast",
  ],
  about: [
    "Computer Science student with strong interest in software development, backend engineering and AI. Experience with Java, HTML, CSS, JavaScript, Python; currently expanding into Spring Boot, DSA and Machine Learning.",
    "Enjoys understanding how systems work behind the scenes: APIs, databases, client-server communication, architecture.",
    "Goal: keep learning, build meaningful projects, grow into a skilled software engineer.",
  ],
  quickFacts: [
    { key: "education", label: "Education", value: "B.E. Computer Science" },
    { key: "year", label: "Academic status", value: "Third Year" },
    { key: "location", label: "Location", value: "Tamil Nadu, India" },
    {
      key: "focus",
      label: "Current focus",
      value: "Backend Development & AI/ML",
    },
    {
      key: "learning",
      label: "Learning",
      value: "Spring Boot, DSA, Machine Learning",
    },
    {
      key: "availability",
      label: "Availability",
      value: "Open to Internships",
    },
  ],
  email: "uvijayaragavan03@gmail.com",
  phone: "+91 8667834495",
  phoneHref: "+918667834495",
  location: "Tamil Nadu, India",
  photo: "/profile.jpeg",
  resume: "/resume.pdf",
  education: "B.E. Computer Science",
} as const;

export const terminalSession = [
  { command: "whoami", output: ["vijayaragavan"] },
  { command: "title", output: ["Aspiring Software Developer"] },
  { command: "education", output: ["B.E. Computer Science"] },
  { command: "year", output: ["Third Year"] },
  { command: "location", output: ["Tamil Nadu, India"] },
  { command: "focus", output: ["Backend Development", "AI / ML"] },
  { command: "learning", output: ["Spring Boot", "DSA", "Machine Learning"] },
] as const;
