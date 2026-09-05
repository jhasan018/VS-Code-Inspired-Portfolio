import Link from "next/link";
import parse from "html-react-parser";
import { format } from "date-fns";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import type { Blog } from "@/lib/types";
import Image from "next/image";
import BlogContent from "@/components/ui/BlogContent";
import LinkedInProfileBadge from "@/components/ui/LinkedInProfileBadge";
import { blogImageSrc } from "@/lib/content-seo";

function readingTime(content: string) {
  const words = content
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

export default function SolaceArticle({ blog }: { blog: Blog }) {
  const cleanTitle = blog.title.replace(/<[^>]*>/g, "");

  return (
    <article className="relative overflow-hidden bg-[var(--sol-paper)]">
      {/* Header */}
      <header className="relative px-6 pb-14 pt-36 sm:px-8 sm:pt-44">
        <div
          aria-hidden
          className="solace-blob -top-20 right-[-8%] size-[420px]"
          style={{ background: "radial-gradient(circle, #dcebe1, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--sol-muted)] transition-colors hover:text-[var(--sol-accent)]"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Journal index
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono-label text-[10px] uppercase tracking-[0.22em]">
            <span className="text-[var(--sol-accent)]">{blog.category || "Field note"}</span>
            <span className="text-[var(--sol-faint)]">
              {format(new Date(blog.created_at), "MMMM dd, yyyy")}
            </span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-[-0.01em] sm:text-5xl md:text-[3.4rem]">
            {parse(blog.title)}
          </h1>

          {blog.excerpt && (
            <p className="mt-7 max-w-2xl font-display text-lg font-light leading-relaxed text-[var(--sol-muted)] sm:text-xl">
              {blog.excerpt.replace(/<[^>]*>/g, "")}
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[var(--sol-line)] pt-6 font-mono-label text-xs text-[var(--sol-muted)]">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4 text-[var(--sol-accent)]" />
              {readingTime(blog.content || "")} min read
            </span>
            <span>{blog.views ?? 0} views</span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--sol-accent)]" />
              By Jahid Hasan
            </span>
          </div>
        </div>
      </header>

      {/* Cover */}
      {blog.cover_image && (
        <figure className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--sol-line)]">
            <Image
              src={blogImageSrc(blog.cover_image)}
              alt={cleanTitle}
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
              priority
            />
          </div>
          <figcaption className="py-4 text-center font-mono-label text-[10px] uppercase tracking-[0.22em] text-[var(--sol-faint)]">
            {blog.category || "Engineering field note"} / Jahid Hasan
          </figcaption>
        </figure>
      )}

      {/* Body */}
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-6 text-base sm:px-8 sm:text-lg">
        {!!blog.tags?.length && (
          <div className="mb-10 flex flex-wrap gap-2" role="list" aria-label="Article tags">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                role="listitem"
                className="rounded-full border border-[var(--sol-line)] bg-white px-3.5 py-1.5 text-xs text-[var(--sol-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="solace-prose"><BlogContent html={blog.content || ""} articleTitle={cleanTitle} /></div>

        <LinkedInProfileBadge
          className="mt-16 border-t border-[var(--sol-line)] pt-12"
          headingClassName="font-display text-2xl font-medium text-[var(--sol-ink)]"
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--sol-line)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-6 py-20 sm:flex-row sm:items-end sm:px-8">
          <div>
            <span className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[var(--sol-accent)]">
              Continue reading
            </span>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.06] sm:text-5xl">
              More notes from
              <br />
              <em>the work.</em>
            </h2>
          </div>
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--sol-ink)] px-7 py-3.5 text-sm font-semibold text-[var(--sol-paper)] transition-colors duration-300 hover:bg-[var(--sol-accent)]"
          >
            Browse the journal
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </footer>
    </article>
  );
}
