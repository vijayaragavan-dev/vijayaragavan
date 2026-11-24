export const site = {
  name: "Vijayaragavan",
  title: "Vijayaragavan — Aspiring Software Developer",
  description:
    "Computer Science student passionate about Backend Development, AI/ML, and building practical software solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vijayaragavan.vercel.app",
} as const;

export const navigation = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "coding", label: "Profiles" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export const links = {
  github: "https://github.com/vijayaragavan-dev",
  githubHandle: "vijayaragavan-dev",
  linkedin: "https://www.linkedin.com/in/vijaya-ragavan-ki10052007",
  leetcode: "https://leetcode.com/u/uvijayaragavan-dev/",
  leetcodeHandle: "uvijayaragavan-dev",
  contributionGraph: "https://ghchart.rshah.org/vijayaragavan-dev",
  email: "uvijayaragavan03@gmail.com",
  phone: "+91 8667834495",
  phoneHref: "+918667834495",
  resume: "/resume.pdf",
} as const;

// LeetCode profile verified by loading https://leetcode.com/u/uvijayaragavan-dev/
// on 2026-11-23. No live statistics are displayed to avoid stale or invented data.
export const leetcodeVerified = true;

export const socialLinks = [
  { id: "github", label: "GitHub", href: links.github },
  { id: "linkedin", label: "LinkedIn", href: links.linkedin },
  { id: "leetcode", label: "LeetCode", href: links.leetcode },
  { id: "email", label: "Email", href: `mailto:${links.email}` },
] as const;
