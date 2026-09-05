import type { Blog, Project } from "./types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://devjahid.vercel.app").replace(/\/$/, "");

export const PAGE_SEO = {
  home: {
    title: "Jahid Hasan — Interactive Web Developer | React, Next.js & GSAP",
    description: "Jahid Hasan is an interactive web developer building animated, high-performance websites with React, Next.js, and GSAP for global clients.",
  },
  about: {
    title: "About Jahid Hasan | Interactive Web Developer at Dcastalia Limited",
    description: "Jahid Hasan is an interactive web developer at Dcastalia Limited, building animated, high-performance websites with React, Next.js, GSAP, and Laravel. M.Sc in ICT, BUP.",
  },
  projects: {
    title: "Projects | Interactive Web Development Work — Jahid Hasan",
    description: "Interactive websites built with React, Next.js, and GSAP for finance, education, healthcare, and e-commerce clients as a developer at Dcastalia Limited.",
  },
  skills: {
    title: "Skills | React, Next.js, GSAP & Full-Stack Development — Jahid Hasan",
    description: "Technical skills in React, Next.js, TypeScript, GSAP animation, PHP, Laravel, Yii2, MySQL, and WordPress for high-performance web applications.",
  },
  contact: {
    title: "Contact Jahid Hasan | Interactive Web Developer",
    description: "Contact Jahid Hasan about interactive web development with React, Next.js, and GSAP animation. Available for select engagements worldwide.",
  },
  blogs: {
    title: "Journal | Web Development Guides — Next.js, Laravel & Architecture",
    description: "Articles on Next.js, Laravel, backend architecture, and web development practices, written from real production experience.",
  },
} as const;

export type SeoPageSlug = keyof typeof PAGE_SEO;

const projectCopy: Record<string, string> = {
  "icb asset management": "Built with Next.js and GSAP-powered scroll animations for a fast, professional financial platform.",
  "aiba savar": "Developed with Next.js, Laravel, and GSAP micro-interactions for smooth navigation across an education platform.",
  "shanta asset management": "A React and Next.js investment platform with animated data presentation and a PHP/Yii2 backend.",
  "ucb stock brokerage": "A React and Next.js frontend with WordPress-driven content, built for speed and clarity.",
  "midland bank asset management": "A Next.js and PHP/Yii2 platform with a MySQL backend, focused on trust, transparency, and clean UI.",
  "naafco pharma": "A Next.js site with GSAP animation and a Yii2/MySQL backend for a pharmaceutical manufacturer.",
  "unico hospitals": "A React and Next.js hospital platform with Styled Components and a Yii2 backend, built for patient-first usability.",
  "meghna executive": "A full-stack e-commerce build with Next.js, TypeScript, Supabase, and Stripe, including real-time inventory.",
};

export function projectDescription(project: Project) {
  const addition = project.seo_description || projectCopy[project.title.trim().toLowerCase()];
  if (!addition || project.description.includes(addition)) return project.description;
  return `${project.description.trim()} ${addition}`.trim();
}

export function projectImageAlt(project: Project) {
  return project.image_alt?.trim() || `${project.title} — interactive website developed by Jahid Hasan`;
}

export function projectRole(project: Project) {
  if (project.role_label?.trim()) return project.role_label;
  return project.project_type === "company" ? "Web Developer · Dcastalia Limited" : null;
}

export function blogReadTime(blog: Pick<Blog, "content">) {
  const words = (blog.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function blogImageSrc(source: string) {
  return source.includes("1781468201326-cover.svg")
    ? "/blog/twelve-factor-cover.webp"
    : source;
}
