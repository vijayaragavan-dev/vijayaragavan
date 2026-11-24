export type ProjectCategory = "fullstack" | "ai-ml" | "automation";

export type CoverVariant = "grid" | "orbit" | "wave" | "circuit";
export type CoverAccent = "emerald" | "violet" | "cyan";

export type Project = {
  id: string;
  number: string;
  title: string;
  description: string;
  category: ProjectCategory;
  stack: string[];
  demo?: string;
  code?: string;
  featured?: boolean;
  cover: {
    variant: CoverVariant;
    accent: CoverAccent;
  };
};

export const projectCategories: {
  id: "all" | ProjectCategory;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "ai-ml", label: "AI/ML" },
  { id: "automation", label: "Automation" },
];

export const categoryLabels: Record<ProjectCategory, string> = {
  fullstack: "Full-Stack",
  "ai-ml": "AI/ML",
  automation: "Automation",
};

export const projects: Project[] = [
  {
    id: "vcart",
    number: "01",
    title: "VCart, Full Stack E-Commerce Web App",
    description: "Auth, shopping cart, product management, responsive design.",
    category: "fullstack",
    stack: [
      "HTML5",
      "CSS3",
      "JavaScript (ES6)",
      "Python",
      "Flask",
      "Flask-CORS",
      "BCrypt",
      "MySQL",
      "Vercel",
      "Render",
      "Railway",
    ],
    code: "https://github.com/vijayaragavan-dev/Vcart-Ecommerce.git",
    demo: "https://vcart-ecommerce.vercel.app/",
    featured: true,
    cover: { variant: "grid", accent: "emerald" },
  },
  {
    id: "hopebridge",
    number: "02",
    title: "HopeBridge Foundation NGO Website",
    description:
      "Responsive NGO site showcasing social initiatives and community services.",
    category: "fullstack",
    stack: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Responsive Design",
      "Modern UI",
    ],
    code: "https://github.com/vijayaragavan-dev/HopeBridge_Foundation_NGO.git",
    demo: "https://hope-bridge-foundation-ngo.vercel.app/",
    cover: { variant: "wave", accent: "cyan" },
  },
  {
    id: "portfolio",
    number: "03",
    title: "Personal Portfolio Web Application",
    description:
      "Developer portfolio showcasing projects, skills, achievements, coding profiles.",
    category: "fullstack",
    stack: ["HTML", "CSS", "JavaScript", "TypeScript"],
    code: "https://github.com/vijayaragavan-dev/vj_portfolio.git",
    demo: "https://vijayaragavan.vercel.app/",
    cover: { variant: "orbit", accent: "violet" },
  },
  {
    id: "tnea-guider",
    number: "04",
    title: "TNEA Guider, Full Stack App",
    description:
      "Helps students with TNEA counselling and college guidance.",
    category: "fullstack",
    stack: ["HTML", "CSS", "Java", "Spring Boot", "Python"],
    code: "https://github.com/vijayaragavan-dev/tnea_guider.git",
    cover: { variant: "grid", accent: "emerald" },
  },
  {
    id: "ai-chatbot",
    number: "05",
    title: "AI Chatbot",
    description:
      "Built with and without LangChain, powered by Llama-3.1-8B-Instant.",
    category: "ai-ml",
    stack: [
      "React 19",
      "TypeScript",
      "Tailwind",
      "Vite",
      "FastAPI",
      "Python 3.13",
      "LangChain",
      "Groq",
      "Docker",
      "Railway",
      "Vercel",
    ],
    code: "https://github.com/vijayaragavan-dev/chatbot.git",
    featured: true,
    cover: { variant: "orbit", accent: "violet" },
  },
  {
    id: "pdf-analyzer",
    number: "06",
    title: "PDF Analyzer AI",
    description:
      "AI chatbot for extracting and understanding PDF content.",
    category: "ai-ml",
    stack: [
      "Python",
      "Streamlit",
      "Groq API",
      "Llama-3.1-8B-Instant",
      "pdfplumber",
      "python-dotenv",
    ],
    code: "https://github.com/vijayaragavan-dev/pdf_analyser-chatbot.git",
    cover: { variant: "wave", accent: "emerald" },
  },
  {
    id: "student-predictor",
    number: "07",
    title: "Student Performance Predictor",
    description: "ML model predicting student performance.",
    category: "ai-ml",
    stack: [
      "Python",
      "Pandas",
      "Scikit-learn",
      "Google Colab",
      "Jupyter",
    ],
    code: "https://github.com/vijayaragavan-dev/student-marks-prediction.git",
    cover: { variant: "grid", accent: "cyan" },
  },
  {
    id: "instaflow",
    number: "08",
    title: "InstaFlow, Social Media App",
    description: "Auth and user interactions with Spring Boot backend.",
    category: "fullstack",
    stack: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "JPA/Hibernate",
      "MySQL",
      "REST APIs",
      "HTML5",
      "CSS3",
      "JavaScript (ES6 Modules)",
      "LocalStorage",
    ],
    code: "https://github.com/vijayaragavan-dev/InstaFlow.git",
    featured: true,
    cover: { variant: "circuit", accent: "violet" },
  },
  {
    id: "telegram-bot",
    number: "09",
    title: "Telegram Chatbot Automation",
    description: "Telegram bot built with n8n workflows.",
    category: "automation",
    stack: ["n8n", "Telegram Bot API", "Workflow Automation"],
    cover: { variant: "circuit", accent: "emerald" },
  },
  {
    id: "birthday-automation",
    number: "10",
    title: "Birthday Wish Automation",
    description: "Automated birthday wishes via n8n.",
    category: "automation",
    stack: ["n8n", "Workflow Automation", "Scheduling"],
    cover: { variant: "wave", accent: "cyan" },
  },
];
