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

export default function LumeArticle({ blog }: { blog: Blog }) {
  const cleanTitle = blog.title.replace(/<[^>]*>/g, "");

  return (
    <article className="relative overflow-hidden bg-[#0c0a08]">
      {/* Header */}
      <header className="relative px-6 pb-16 pt-44 sm:px-8 sm:pt-52">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(258_94%_76%_/_0.4),transparent)]"
        />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#a89e8e] transition-colors hover:text-[#f4efe6]"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Journal index
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-[hsl(43_70%_60%)]">
            <span>{blog.category || "Field note"}</span>
            <span className="text-[#938a7d]">
              {format(new Date(blog.created_at), "MMMM dd, yyyy")}
            </span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-medium leading-[1.04] tracking-[-0.01em] text-[#f4efe6] sm:text-5xl md:text-6xl">
            {parse(blog.title)}
          </h1>

          {blog.excerpt && (
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#a89e8e] sm:text-lg">
              {blog.excerpt.replace(/<[^>]*>/g, "")}
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-[#8a8174]">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4 text-[hsl(43_70%_60%)]" />
              {readingTime(blog.content || "")} min read
            </span>
            <span>{blog.views ?? 0} views</span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1 rounded-full bg-[hsl(258_94%_76%)] shadow-[0_0_8px_hsl(258_94%_76%)]" />
              By Jahid Hasan
            </span>
          </div>
        </div>
      </header>

      {/* Cover */}
      {blog.cover_image && (
        <figure className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/[0.07]">
            <Image
              src={blogImageSrc(blog.cover_image)}
              alt={cleanTitle}
              width={1280}
              height={720}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,#0c0a08)]"
            />
          </div>
          <figcaption className="py-4 text-center text-[10px] uppercase tracking-[0.22em] text-[#8a8174]">
            {blog.category || "Engineering field note"} / Jahid Hasan
          </figcaption>
        </figure>
      )}

      {/* Body */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8">
        {!!blog.tags?.length && (
          <div className="mb-10 flex flex-wrap gap-2" role="list" aria-label="Article tags">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                role="listitem"
                className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-[#a89e8e]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="lume-prose">
          <BlogContent html={blog.content || ""} articleTitle={cleanTitle} />
        </div>

        <LinkedInProfileBadge
          className="mt-16 border-t border-white/[0.08] pt-12"
          headingClassName="font-display text-2xl font-medium text-[#f4efe6]"
        />
      </div>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-white/[0.06]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[760px] -translate-x-1/2 rounded-[50%] opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 100%, hsl(258 94% 66% / 0.45), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-6 py-20 sm:flex-row sm:items-end sm:px-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[hsl(43_70%_60%)]">
              Continue reading
            </span>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] text-[#f4efe6] sm:text-5xl">
              More notes from
              <br />
              <em className="text-[hsl(258_94%_84%)]">the work.</em>
            </h2>
          </div>
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#f4efe6] transition-colors hover:text-[hsl(258_94%_84%)]"
          >
            Browse the journal
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </footer>
    </article>
  );
}
