export type Skill = {
  name: string;
  /** Stable icon identifier resolved by the Skills detail panel. */
  icon: string;
  learning?: boolean;
};

export type SkillGroupId =
  | "programming"
  | "frontend"
  | "backend"
  | "database"
  | "fundamentals"
  | "aiml"
  | "genai";

export type SkillGroup = {
  id: SkillGroupId;
  index: string;
  code: string;
  label: string;
  shortLabel: string;
  accent: "emerald" | "violet" | "cyan";
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "programming",
    index: "01",
    code: "PRG",
    label: "Programming",
    shortLabel: "Languages",
    accent: "emerald",
    skills: [
      { name: "Java", icon: "java" },
      { name: "Python", icon: "python" },
      { name: "JavaScript", icon: "javascript" },
      { name: "C", icon: "c" },
      { name: "C++", icon: "cplusplus" },
    ],
  },
  {
    id: "frontend",
    index: "02",
    code: "UI",
    label: "Frontend",
    shortLabel: "Interface",
    accent: "cyan",
    skills: [
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
    ],
  },
  {
    id: "backend",
    index: "03",
    code: "API",
    label: "Backend",
    shortLabel: "Server",
    accent: "emerald",
    skills: [
      { name: "Spring Boot", icon: "springboot", learning: true },
      { name: "REST APIs", icon: "rest-api" },
      { name: "Client-Server Architecture", icon: "client-server" },
    ],
  },
  {
    id: "database",
    index: "04",
    code: "DB",
    label: "Database",
    shortLabel: "Data",
    accent: "violet",
    skills: [
      { name: "MySQL", icon: "mysql" },
      { name: "Oracle SQL", icon: "oracle" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Database Fundamentals", icon: "database" },
    ],
  },
  {
    id: "fundamentals",
    index: "05",
    code: "CS",
    label: "CS Fundamentals",
    shortLabel: "Foundations",
    accent: "cyan",
    skills: [
      { name: "Data Structures", icon: "data-structures" },
      { name: "Algorithms", icon: "algorithms" },
      { name: "OOP", icon: "oop" },
      { name: "DBMS", icon: "dbms" },
      { name: "AI/ML", icon: "ai-ml" },
      { name: "Computer Networks", icon: "networks" },
      { name: "Web Technologies", icon: "web-technologies" },
      { name: "Data Science", icon: "data-science" },
      { name: "Operating Systems", icon: "operating-systems" },
    ],
  },
  {
    id: "aiml",
    index: "06",
    code: "ML",
    label: "AI/ML",
    shortLabel: "Machine learning",
    accent: "emerald",
    skills: [
      { name: "NumPy", icon: "numpy", learning: true },
      { name: "Pandas", icon: "pandas", learning: true },
      { name: "Scikit-Learn", icon: "scikit-learn", learning: true },
      { name: "ML Fundamentals", icon: "ml-fundamentals" },
    ],
  },
  {
    id: "genai",
    index: "07",
    code: "GEN",
    label: "Generative & Agentic AI",
    shortLabel: "Generative AI",
    accent: "violet",
    skills: [
      { name: "GenAI Fundamentals", icon: "genai-fundamentals" },
      { name: "Agentic AI Fundamentals", icon: "agentic-ai" },
      { name: "Prompt Engineering", icon: "prompt-engineering" },
      { name: "LLM Fundamentals", icon: "llm-fundamentals" },
      { name: "RAG Basics", icon: "rag-basics" },
      { name: "LangChain Basics", icon: "langchain" },
      { name: "AI Agents", icon: "ai-agents" },
      { name: "Vector Databases", icon: "vector-databases" },
    ],
  },
];

export const totalSkillCount = skillGroups.reduce(
  (total, group) => total + group.skills.length,
  0,
);
