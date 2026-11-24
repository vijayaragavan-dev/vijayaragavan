import { projects } from "./projects";
import { totalSkillCount } from "./skills";

export type AchievementStat = {
  key: "projects" | "problemsSolved" | "technologies" | "certifications";
  label: string;
  value: number | null;
  detail: string;
};

// Counts for projects and technologies are derived directly from the
// maintained data files, so they stay in sync with the portfolio.
// Problems solved and certifications remain unverified and are never invented.
export const stats: AchievementStat[] = [
  {
    key: "projects",
    label: "Projects",
    value: projects.length,
    detail: "Shipped builds across full-stack, AI and automation.",
  },
  {
    key: "problemsSolved",
    label: "Problems Solved",
    value: null,
    detail: "Ongoing DSA practice; platform count awaiting verification.",
  },
  {
    key: "technologies",
    label: "Technologies",
    value: totalSkillCount,
    detail: "Languages, frameworks and tools listed across seven skill groups.",
  },
  {
    key: "certifications",
    label: "Certifications",
    value: null,
    detail: "Formal learning records will appear once verified.",
  },
];

export const todoStatCount = stats.filter((stat) => stat.value === null).length;
