"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Code,
  Mail,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  About,
  Blog,
  Profile,
  Project,
  Skill,
} from "@/lib/types";

import ContactClient from "./DimensionContact";
import OpenStreetMap from "@/components/ui/OpenStreetMap";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { blogImageSrc, blogReadTime, projectDescription, projectImageAlt, projectRole } from "@/lib/content-seo";


function Reveal({
                  children,
                  className = "",
                }: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
      <motion.div
          className={className}
          initial={
            reduceMotion
                ? false
                : {
                  y: 20,
                  opacity: 0,
                }
          }
          whileInView={{
            y: 0,
            opacity: 1,
          }}
          viewport={{
            once: true,
            margin: "-40px",
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
      >
        {children}
      </motion.div>
  );
}


const projectTypeLabel = (
    type: Project["project_type"] | undefined,
) =>
    type === "client"
        ? "Client / freelance"
        : type === "personal"
            ? "Personal"
            : "Company delivery";


export function Home({
                       profile,
                       about,
                       skills,
                       projects,
                       blogs,
                     }: {
  profile: Profile | null;
  about: About | null;
  skills: Skill[];
  projects: Project[];
  blogs: Blog[];
}) {
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();

  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.25,
  });

  const portraitY = useTransform(
      scrollYProgress,
      [0, 0.2],
      [0, reduceMotion ? 0 : 36],
  );

  const featured = projects.slice(0, 4);
  const coreSkills = skills.slice(0, 8);

  return (
      <div className="dimension-page calm-home">
        <motion.div
            className="calm-scroll-progress"
            style={{
              scaleX: scrollProgress,
            }}
        />

        {/* Hero */}
        <section className="calm-hero">
          <div className="calm-hero-copy">
            <motion.span
                initial={
                  reduceMotion
                      ? false
                      : {
                        opacity: 0,
                        y: 12,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
            >
              JAHID HASAN · INTERACTIVE WEB DEVELOPER
            </motion.span>

            <h1>
              {[
                "Jahid Hasan builds",
                "interactive websites",
                "that move.",
              ].map((line, index) => (
                  <motion.span
                      key={line}
                      initial={
                        reduceMotion
                            ? false
                            : {
                              opacity: 0,
                              y: 34,
                            }
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.7,
                        delay: 0.12 + index * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={
                        index === 1
                            ? "quiet-accent"
                            : ""
                      }
                  >
                    {line}
                  </motion.span>
              ))}
            </h1>

            <motion.div
                className="calm-hero-summary"
                initial={
                  reduceMotion
                      ? false
                      : {
                        opacity: 0,
                      }
                }
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.48,
                }}
            >
              <p>I design and develop animated, fast, and scalable web experiences using React, Next.js, and GSAP — from first line of code to production launch.</p>

              <div className="calm-actions">
                <LiquidButton
                    asChild
                    size="large"
                >
                  <Link href="/projects">
                    View selected work
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </LiquidButton>

                <Link href="/contact">
                  Discuss a project
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.figure
              className="calm-portrait"
              style={{
                y: portraitY,
              }}
              initial={
                reduceMotion
                    ? false
                    : {
                      opacity: 0,
                      clipPath: "inset(0 0 100% 0)",
                    }
              }
              animate={{
                opacity: 1,
                clipPath: "inset(0 0 0% 0)",
              }}
              transition={{
                duration: 1,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
          >
            <Image
                src="/jahid-hero-professional.png"
                width={1200}
                height={1500}
                priority
                sizes="(max-width: 760px) 100vw, 40vw"
                alt={`${profile?.name || "Jahid Hasan"} working at his laptop`}
            />

            <figcaption>
                        <span>
                            {profile?.location || "Dhaka, Bangladesh"}
                        </span>

              <span>
                            {profile?.available_for_work
                                ? "Available for select work"
                                : "Currently engaged"}
                        </span>
            </figcaption>
          </motion.figure>
        </section>

        {/* Experience */}
        <section
            className="calm-proof"
            aria-label="Experience highlights"
        >
          <div className="calm-section-copy">
            <span>01 · PRACTICE</span>

            <h2>
              From brief to production.
            </h2>

            <p>
              Over {about?.experience_years ?? 3} years building interactive, animation-driven websites for financial institutions, universities, hospitals, and e-commerce brands — combining React, Next.js, PHP, and Laravel with GSAP motion design.
            </p>
          </div>

          <div className="calm-metrics">
            {[
              [
                `${about?.experience_years ?? 3}+`,
                "Years experience",
              ],
              [
                `${about?.projects_count ?? 30}+`,
                "Products delivered",
              ],
              [
                `${about?.clients_count ?? 15}+`,
                "Client relationships",
              ],
            ].map(([value, label], index) => (
                <motion.div
                    key={label}
                    initial={
                      reduceMotion
                          ? false
                          : {
                            opacity: 0,
                            y: 16,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.5,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.07,
                    }}
                >
                  <strong>{value}</strong>
                  <span>{label}</span>
                </motion.div>
            ))}
          </div>
        </section>

        {/* Selected Work */}
        <section className="calm-work">
          <header className="calm-section-head">
            <div>
              <span>02 · SELECTED WORK</span>

              <h2>
                Interactive websites built with
                <br />
                React, Next.js &amp; GSAP
              </h2>
            </div>

            <LiquidButton
                asChild
                size="large"
                className="calm-all-projects"
            >
              <Link href="/projects">
                All projects
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </LiquidButton>
          </header>

          <div className="calm-project-list">
            {featured.map((project, index) => (
                <motion.article
                    key={project.id}
                    initial={
                      reduceMotion
                          ? false
                          : {
                            opacity: 0,
                            y: 20,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: "-10%",
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                >
                  <div className="calm-project-media">
                    {project.cover_image ? (
                        <Image
                            src={project.cover_image}
                            alt={projectImageAlt(project)}
                            width={1200}
                            height={750}
                            sizes="(max-width: 760px) 100vw, 50vw"
                        />
                    ) : (
                        <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                    )}
                  </div>

                  <div className="calm-project-info">
                    <div>
                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                      {" / "}
                                      {project.category || "Digital product"}
                                    </span>

                      <small>
                        {projectTypeLabel(project.project_type)}
                      </small>
                    </div>

                    <h3>{project.title}</h3>

                    <p>{projectDescription(project)}</p>
                    {projectRole(project) && <small>{projectRole(project)}</small>}

                    <footer>
                      <div>
                        {project.tech_stack
                            ?.slice(0, 3)
                            .map((item) => (
                                <span key={item}>
                                                    {item}
                                                </span>
                            ))}
                      </div>

                      {project.live_url && (
                          <LiquidButton asChild>
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`View ${project.title}`}
                            >
                              View project
                              <ArrowUpRight aria-hidden="true" />
                            </a>
                          </LiquidButton>
                      )}
                    </footer>
                  </div>
                </motion.article>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="calm-capabilities">
          <div className="calm-section-copy">
            <span>03 · CAPABILITIES</span>

            <h2>
              React, Next.js &amp; GSAP — the stack behind interactive web development
            </h2>

            <p>
              I build animated web applications with React, Next.js, TypeScript, and GSAP, backed by PHP, Laravel, Yii2, MySQL, and WordPress. Every project is built for speed, accessibility, and maintainability.
            </p>

            <Link href="/skills">
              Full capability overview
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>

          <div className="calm-skill-list">
            {coreSkills.map((skill, index) => (
                <motion.div
                    key={skill.id}
                    initial={
                      reduceMotion
                          ? false
                          : {
                            opacity: 0,
                            x: 12,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.035,
                    }}
                >
                            <span>
                                {String(index + 1).padStart(2, "0")}
                            </span>

                  <strong>{skill.name}</strong>

                  <small>{skill.category}</small>
                </motion.div>
            ))}
          </div>
        </section>

        {/* Journal */}
        <section className="calm-journal">
          <header className="calm-section-head">
            <div>
              <span>04 · JOURNAL</span>

              <h2>
                Web development guides: Next.js, Laravel &amp; backend architecture
              </h2>
            </div>

            <Link href="/blogs">
              All articles
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </header>

          <div>
            {blogs.slice(0, 3).map((blog, index) => (
                <motion.div
                    key={blog.id}
                    initial={
                      reduceMotion
                          ? false
                          : {
                            opacity: 0,
                            y: 12,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.06,
                    }}
                >
                  <Link href={`/blogs/${blog.slug}`}>
                                <span>
                                    {new Date(
                                        blog.created_at,
                                    ).toLocaleDateString("en", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                </span>

                    <h3>
                      {blog.title.replace(/<[^>]*>/g, "")}
                    </h3>

                    <small>
                      {blog.category || "Article"} · {blogReadTime(blog)} min read
                    </small>

                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="calm-cta">
          <div>
                    <span>
                        AVAILABLE FOR SELECT ENGAGEMENTS
                    </span>

            <h2>
              Have a product that
              <br />
              needs clear thinking?
            </h2>
            <p>I partner with teams who want a website that&apos;s fast, interactive, and built to last — combining full-stack engineering with GSAP-driven animation from planning to launch.</p>
          </div>

          <LiquidButton
              asChild
              size="large"
          >
            <Link href="/contact">
              Start a conversation
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </LiquidButton>
        </section>
      </div>
  );
}


export function AboutPage({
                            profile,
                            about,
                          }: {
  profile: Profile | null;
  about: About | null;
}) {
  const timeline = about?.timeline || [];
  const education = about?.education || [];

  return (
      <div className="dimension-page calm-inner calm-about-page">
        <header className="calm-inner-hero">
          <span>ABOUT · PRACTICE</span>

          <h1>
            A developer who
            <br />
            <em>thinks in systems.</em>
          </h1>

          <p>
            Interactive, animation-driven web development — engineering, delivery, and clear communication treated as one connected discipline.
          </p>
        </header>

        <section className="calm-about-intro">
          <motion.figure
              className="calm-about-photo"
              initial={{
                opacity: 0,
                clipPath: "inset(0 0 18% 0)",
              }}
              whileInView={{
                opacity: 1,
                clipPath: "inset(0 0 0% 0)",
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
          >
            <Image
                src="/jahid-about-professional.png"
                width={1200}
                height={1500}
                sizes="(max-width: 700px) 100vw, 42vw"
                alt={profile?.name || "Jahid Hasan"}
            />

            <figcaption>
              {profile?.location || "Dhaka, Bangladesh"}
            </figcaption>
          </motion.figure>

          <div className="calm-about-copy">
            <span>01 · PROFILE</span>

            <h2>
              {profile?.name || "Jahid Hasan"}
            </h2>

            <p>{about?.bio || profile?.bio || "I'm an interactive web developer and full-stack engineer at Dcastalia Limited, building animated, high-performance websites with React, Next.js, GSAP, PHP, and Laravel."}</p>

            <div>
              {[
                [
                  `${about?.experience_years ?? 3}+`,
                  "Years in practice",
                ],
                [
                  `${about?.projects_count ?? 30}+`,
                  "Projects delivered",
                ],
              ].map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <small>{label}</small>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section className="calm-about-principles">
          <div>
            <span>02 · APPROACH</span>

            <h2>
              Clear decisions.
              <br />
              Dependable delivery.
            </h2>
          </div>

          <div>
            {[
              [
                "01",
                "Understand the constraint",
                "Good work begins with the business context, not the framework.",
              ],
              [
                "02",
                "Make the system legible",
                "Architecture should help the next person understand and change the product.",
              ],
              [
                "03",
                "Own the outcome",
                "Delivery includes communication, trade-offs, and what happens after launch.",
              ],
            ].map(([number, title, copy]) => (
                <Reveal key={number}>
                  <article>
                    <span>{number}</span>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </article>
                </Reveal>
            ))}
          </div>
        </section>

        <section className="calm-history">
          <header>
            <span>03 · EXPERIENCE</span>

            <h2>
              Roles that shaped
              <br />
              the practice.
            </h2>
          </header>

          <div>
            {timeline.length ? (
                timeline.map(
                    (
                        item: {
                          year?: string;
                          title?: string;
                          company?: string;
                          description?: string;
                        },
                        i: number,
                    ) => (
                        <Reveal key={`${item.year}-${i}`}>
                          <article>
                                        <span>
                                            {item.year ||
                                                String(i + 1).padStart(2, "0")}
                                        </span>

                            <div>
                              <small>{item.company}</small>
                              <h3>{item.title}</h3>
                              <p>{item.description}</p>
                            </div>
                          </article>
                        </Reveal>
                    ),
                )
            ) : (
                <p className="dimension-muted">
                  Experience details will appear here when added
                  from the dashboard.
                </p>
            )}
          </div>
        </section>

        <section className="calm-education">
          <header>
            <span>04 · FOUNDATIONS</span>
            <h2>Education</h2>
          </header>

          <div>
            {education.length ? (
                education.map(
                    (
                        item: {
                          degree?: string;
                          school?: string;
                          institution?: string;
                          year?: string;
                          description?: string;
                        },
                        i: number,
                    ) => (
                        <Reveal key={`${item.degree}-${i}`}>
                          <article>
                                        <span>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>

                            <small>
                              {item.year || "Academic"}
                            </small>

                            <h3>
                              {item.degree || "Education"}
                            </h3>

                            <p>
                              {item.school || item.institution}
                            </p>

                            {item.description && (
                                <em>{item.description}</em>
                            )}
                          </article>
                        </Reveal>
                    ),
                )
            ) : (
                <p className="dimension-muted">
                  Education details will appear here when added
                  from the dashboard.
                </p>
            )}
          </div>
        </section>

        <section className="calm-inner-cta">
          <h2>
            See the work behind
            <br />
            the approach.
          </h2>

          <LiquidButton
              asChild
              size="large"
          >
            <Link href="/projects">
              View selected projects
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </LiquidButton>
        </section>
      </div>
  );
}


export function ProjectsPage({
                               projects,
                             }: {
  projects: Project[];
}) {
  const [type, setType] =
      useState<Project["project_type"]>("company");

  const [industry, setIndustry] = useState("All");

  const industries = useMemo(
      () => [
        "All",
        ...Array.from(
            new Set(
                projects
                    .filter(
                        (p) =>
                            (p.project_type || "company") === type,
                    )
                    .map(
                        (p) =>
                            p.category || "General",
                    ),
            ),
        ).sort(),
      ],
      [projects, type],
  );

  const filtered = projects.filter(
      (p) =>
          (p.project_type || "company") === type &&
          (
              industry === "All" ||
              (p.category || "General") === industry
          ),
  );

  const changeType = (
      next: Project["project_type"],
  ) => {
    setType(next);
    setIndustry("All");
  };

  return (
      <div className="dimension-page calm-inner calm-work-page">
        <header className="calm-inner-hero">
          <span>WORK · SELECTED OUTPUT</span>

          <h1>
            Work judged by
            <br />
            <em>what it delivers.</em>
          </h1>

          <p>
            Selected client and independent work across complex
            products, platforms, and industries.
          </p>
        </header>

        <section
            className="calm-work-controls"
            aria-label="Project filters"
        >
          <div className="dimension-type-tabs">
            <button
                className={
                  type === "company"
                      ? "active"
                      : ""
                }
                onClick={() =>
                    changeType("company")
                }
            >
              <Building2 />
              Company projects

              <small>
                {
                  projects.filter(
                      (p) =>
                          (
                              p.project_type ||
                              "company"
                          ) === "company",
                  ).length
                }
              </small>
            </button>

            <button
                className={
                  type === "client"
                      ? "active"
                      : ""
                }
                onClick={() =>
                    changeType("client")
                }
            >
              <BriefcaseBusiness />
              Client / freelance

              <small>
                {
                  projects.filter(
                      (p) =>
                          p.project_type === "client",
                  ).length
                }
              </small>
            </button>

            <button
                className={
                  type === "personal"
                      ? "active"
                      : ""
                }
                onClick={() =>
                    changeType("personal")
                }
            >
              <UserRound />
              Personal projects

              <small>
                {
                  projects.filter(
                      (p) =>
                          p.project_type === "personal",
                  ).length
                }
              </small>
            </button>
          </div>

          {type === "company" && (
              <div className="dimension-compliance">
                <BriefcaseBusiness />

                <div>
                  <span>DELIVERY CONTEXT</span>

                  <strong>
                    Built as part of the Dcastalia
                    development team
                  </strong>

                  <p>
                    These client projects are owned and
                    delivered by Dcastalia. My role is
                    presented as a contributing developer
                    and project professional.
                  </p>
                </div>
              </div>
          )}

          <div className="dimension-industries">
            <span>FILTER BY INDUSTRY</span>

            <div>
              {industries.map((item) => (
                  <button
                      key={item}
                      className={
                        industry === item
                            ? "active"
                            : ""
                      }
                      onClick={() =>
                          setIndustry(item)
                      }
                  >
                    {item}
                  </button>
              ))}
            </div>
          </div>
        </section>

        <div className="calm-results">
          {String(filtered.length).padStart(2, "0")} projects shown
        </div>

        <section className="calm-work-list">
          {filtered.map((p, i) => (
              <Reveal key={p.id}>
                <article>
                  <div className="calm-work-media">
                    {p.cover_image ? (
                        <Image
                            src={p.cover_image}
                            alt={projectImageAlt(p)}
                            width={1200}
                            height={750}
                            sizes="(max-width: 760px) 100vw, 50vw"
                        />
                    ) : (
                        <span>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                    )}
                  </div>

                  <div className="calm-work-copy">
                    <header>
                                    <span>
                                        {String(i + 1).padStart(2, "0")}
                                      {" · "}
                                      {p.category || "Digital product"}
                                    </span>

                      <small>
                        {projectTypeLabel(p.project_type)}
                      </small>
                    </header>

                    <h2>{p.title}</h2>

                    <p>{projectDescription(p)}</p>
                    {projectRole(p) && <small>{projectRole(p)}</small>}

                    <footer>
                      <div>
                        {p.tech_stack
                            ?.slice(0, 4)
                            .map((t) => (
                                <span key={t}>
                                                    {t}
                                                </span>
                            ))}
                      </div>

                      <aside>
                        {p.live_url && (
                            <LiquidButton asChild>
                              <a
                                  href={p.live_url}
                                  target="_blank"
                                  rel="noreferrer"
                              >
                                View project
                                <ArrowUpRight aria-hidden="true" />
                              </a>
                            </LiquidButton>
                        )}

                        {p.github_url && (
                            <LiquidButton asChild>
                              <a
                                  href={p.github_url}
                                  target="_blank"
                                  rel="noreferrer"
                              >
                                Source
                                <Code aria-hidden="true" />
                              </a>
                            </LiquidButton>
                        )}
                      </aside>
                    </footer>
                  </div>
                </article>
              </Reveal>
          ))}
        </section>

        {!filtered.length && (
            <p className="calm-empty">
              No projects match this filter.
            </p>
        )}

        <section className="calm-inner-cta">
          <h2>
            Have something complex
            <br />
            to bring to life?
          </h2>

          <LiquidButton
              asChild
              size="large"
          >
            <Link href="/contact">
              Discuss the project
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </LiquidButton>
        </section>
      </div>
  );
}


export function SkillsPage({
                             skills,
                           }: {
  skills: Skill[];
}) {
  const groups = skills.reduce<Record<string, Skill[]>>(
      (all, skill) => {
        (all[skill.category] ||= []).push(skill);
        return all;
      },
      {},
  );

  return (
      <div className="dimension-page calm-inner calm-skills-page">
        <header className="calm-inner-hero">
          <span>CAPABILITIES · WORKING SET</span>

          <h1>
            Technology with
            <br />
            <em>a reason to exist.</em>
          </h1>

          <p>
            A focused working set built through production
            delivery—not a collection of logos.
          </p>
        </header>

        <section className="calm-skills-intro">
          <div>
            <span>01 · APPROACH</span>

            <h2>
              Choose for longevity.
              <br />
              Build for change.
            </h2>
          </div>

          <p>
            I use familiar, maintainable tools and introduce
            complexity only when the product earns it.
            Proficiency reflects hands-on delivery across real
            projects.
          </p>
        </section>

        <section className="calm-skill-groups">
          {Object.entries(groups).map(
              ([category, list], i) => (
                  <Reveal key={category}>
                    <article>
                      <header>
                                    <span>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                        <div>
                          <small>DISCIPLINE</small>
                          <h2>{category}</h2>
                        </div>

                        <em>
                          {list.length} capabilities
                        </em>
                      </header>

                      <div>
                        {list.map((skill) => (
                            <div
                                className="calm-skill-row"
                                key={skill.id}
                            >
                              <strong>
                                {skill.name}
                              </strong>

                              <span
                                  aria-label={`${skill.proficiency} percent proficiency`}
                              >
                                                <i
                                                    style={{
                                                      width: `${skill.proficiency}%`,
                                                    }}
                                                />
                                            </span>

                              <small>
                                {skill.proficiency}%
                              </small>
                            </div>
                        ))}
                      </div>
                    </article>
                  </Reveal>
              ),
          )}
        </section>

        <section className="calm-inner-cta">
          <h2>
            Need this capability
            <br />
            on a real product?
          </h2>

          <LiquidButton
              asChild
              size="large"
          >
            <Link href="/contact">
              Start a conversation
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </LiquidButton>
        </section>
      </div>
  );
}


export function BlogsPage({
                            blogs,
                          }: {
  blogs: Blog[];
}) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = [
    "All",
    ...Array.from(
        new Set(
            blogs.map(
                (blog) =>
                    blog.category || "Uncategorized",
            ),
        ),
    ).sort(),
  ];

  const filtered = blogs.filter(
      (blog) =>
          (
              category === "All" ||
              (blog.category || "Uncategorized") === category
          ) &&
          `${blog.title} ${blog.excerpt} ${(blog.tags || []).join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase()),
  );

  return (
      <div className="dimension-page calm-inner calm-blog-page">
        <header className="calm-inner-hero">
          <span>JOURNAL · FIELD NOTES</span>

          <h1>
            Notes from
            <br />
            <em>the work.</em>
          </h1>

          <p>
            Practical writing about architecture, deployment,
            product engineering, and lessons learned in
            production.
          </p>
        </header>

        <section className="calm-blog-controls">
          <label>
            <Search aria-hidden="true" />

            <input
                value={query}
                onChange={(e) =>
                    setQuery(e.target.value)
                }
                placeholder="Search articles or tags"
                aria-label="Search articles"
            />
          </label>

          <div>
            {categories.map((item) => (
                <button
                    key={item}
                    className={
                      category === item
                          ? "active"
                          : ""
                    }
                    onClick={() =>
                        setCategory(item)
                    }
                >
                  {item}
                </button>
            ))}
          </div>
        </section>

        <div className="calm-results">
          {String(filtered.length).padStart(2, "0")} articles shown
        </div>

        <section className="calm-blog-grid">
          {filtered.map((blog, i) => (
              <Reveal key={blog.id}>
                <Link
                    href={`/blogs/${blog.slug}`}
                    className="calm-blog-card"
                >
                  <div className="calm-blog-thumbnail">
                    {blog.cover_image ? (
                        <Image
                            src={blogImageSrc(blog.cover_image)}
                            alt=""
                            width={1200}
                            height={675}
                            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 387px"
                            className="object-cover"
                        />
                    ) : (
                        <span>
                                        FIELD NOTE ·{" "}
                          {String(i + 1).padStart(2, "0")}
                                    </span>
                    )}
                  </div>

                  <article>
                    <small>
                      {blog.category || "Article"}
                      {" · "}
                      {new Date(
                          blog.created_at,
                      ).toLocaleDateString("en", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </small>

                    <h2>
                      {blog.title.replace(
                          /<[^>]*>/g,
                          "",
                      )}
                    </h2>

                    <p>
                      {blog.excerpt.replace(
                          /<[^>]*>/g,
                          "",
                      )}
                    </p>

                    <footer>
                      <span>Read article</span>
                      <ArrowUpRight aria-hidden="true" />
                    </footer>
                  </article>
                </Link>
              </Reveal>
          ))}
        </section>

        {!filtered.length && (
            <p className="calm-empty">
              No articles match that search.
            </p>
        )}
      </div>
  );
}


export function ContactPage({
                              profile,
                            }: {
  profile: Profile | null;
}) {
  return (
      <div className="dimension-page calm-inner calm-contact-page">
        <header className="calm-inner-hero">
          <span>CONTACT · OPEN CHANNEL</span>

          <h1>
            Good work starts
            <br />
            <em>with a clear brief.</em>
          </h1>

          <p>
            For product development, web engineering, technical
            leadership, or a project that needs a dependable
            delivery partner.
          </p>
        </header>

        <section className="calm-contact-body">
          <aside>
            <span>01 · START HERE</span>

            <h2>
              Tell me what
              <br />
              needs to change.
            </h2>

            <p>
              Share the context, desired outcome, and important
              constraints. You’ll receive a practical
              response—not a sales sequence.
            </p>

            <div>
              <a
                  href={`mailto:${
                      profile?.email ||
                      "jahid.bubtcse29@gmail.com"
                  }`}
              >
                <Mail aria-hidden="true" />

                <span>
                                <small>Email</small>

                  {profile?.email ||
                      "jahid.bubtcse29@gmail.com"}
                            </span>
              </a>

              <div>
                <MapPin aria-hidden="true" />

                <span>
                                <small>Based in</small>

                  {profile?.location ||
                      "Bangladesh"}
                            </span>
              </div>
            </div>

            <footer>
              <i />

              <span>
                            {profile?.available_for_work
                                ? "Available for select projects"
                                : "Currently focused on active projects"}
                        </span>
            </footer>
          </aside>

          <div className="calm-contact-form">
            <header>
              <span>02 · PROJECT BRIEF</span>

              <small>
                Response within 2 business days
              </small>
            </header>

            <ContactClient />
          </div>
        </section>
        <OpenStreetMap theme="dimension" />
      </div>
  );
}
