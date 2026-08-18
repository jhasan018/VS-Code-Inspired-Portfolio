"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { LiquidButton } from "@/components/ui/liquid-glass-button";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/projects", "Work"],
  ["/blogs", "Blog"],
  ["/skills", "Skills"],
  ["/contact", "Contact"],
];

export default function DimensionShell({
                                         children,
                                       }: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
      <div className="dimension-theme">
        <a
            className="dimension-skip"
            href="#main-content"
        >
          Skip to content
        </a>

        {/* Header */}
        <header className="dimension-nav">
          <Link
              href="/"
              className="dimension-mark"
              aria-label="Jahid Hasan — home"
          >
            <Image
                src="/jahid-brand-logo.png"
                width={286}
                height={100}
                priority
                alt=""
            />
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary navigation">
            {links.map(([href, label]) => {
              const isActive =
                  pathname === href ||
                  (
                      href !== "/" &&
                      pathname.startsWith(href)
                  );

              return (
                  <Link
                      key={href}
                      href={href}
                      className={isActive ? "active" : ""}
                  >
                    {label}

                    {isActive && (
                        <motion.i layoutId="nav-orb" />
                    )}
                  </Link>
              );
            })}
          </nav>

          <LiquidButton asChild>
            <Link
                className="dimension-nav-cta"
                href="/contact"
            >
              Let&apos;s talk
              <ArrowUpRight />
            </Link>
          </LiquidButton>

          {/* Mobile Menu Button */}
          <button
              className="dimension-menu"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </header>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {open && (
              <motion.nav
                  id="mobile-navigation"
                  className="dimension-mobile"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
              >
                {links.map(([href, label], i) => (
                    <motion.div
                        key={href}
                        initial={
                          reduceMotion
                              ? false
                              : {
                                y: 20,
                                opacity: 0,
                              }
                        }
                        animate={{
                          y: 0,
                          opacity: 1,
                        }}
                        transition={{
                          delay: reduceMotion
                              ? 0
                              : i * 0.045,
                        }}
                    >
                      <Link
                          href={href}
                          onClick={() => setOpen(false)}
                      >
                        {String(i + 1).padStart(2, "0")}

                        <span>
                                        {label}
                                    </span>
                      </Link>
                    </motion.div>
                ))}
              </motion.nav>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.main
              id="main-content"
              key={pathname}
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
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: reduceMotion
                    ? 0
                    : 0.25,
              }}
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <footer className="dimension-footer">
          <div className="dimension-footer-lead">
            <div className="dimension-footer-portrait">
              <Image
                  src="/jahid-footer-mark.png"
                  fill
                  sizes="(max-width: 650px) 120px, 150px"
                  alt=""
              />
            </div>

            <div>
                        <span className="dimension-footer-index">
                            JH — {new Date().getFullYear()}
                        </span>

              <h2>
                Building useful digital products with care.
              </h2>
            </div>
          </div>

          {/* Footer Navigation */}
          <div>
            <span>NAVIGATE</span>

            {links
                .slice(1)
                .map(([href, label]) => (
                    <Link
                        key={href}
                        href={href}
                    >
                      {label}
                    </Link>
                ))}
          </div>

          {/* Social Links */}
          <div>
            <span>CONNECT</span>

            <a href="mailto:jahid.bubtcse29@gmail.com">
              Email
              <ArrowUpRight />
            </a>

            <a
                href="https://github.com/jhasan018"
                target="_blank"
                rel="noreferrer"
            >
              GitHub
              <ArrowUpRight />
            </a>

            <a
                href="https://www.linkedin.com/in/jhasan14152/"
                target="_blank"
                rel="noreferrer"
            >
              LinkedIn
              <ArrowUpRight />
            </a>
          </div>

          <aside>
                    <span>
                        FULL-STACK DEVELOPMENT / PROJECT DELIVERY
                    </span>

            <span>
                        DHAKA, BANGLADESH
                    </span>
          </aside>
        </footer>
      </div>
  );
}