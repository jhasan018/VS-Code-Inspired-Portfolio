import Link from "next/link";
import parse from "html-react-parser";
import { format } from "date-fns";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import type { Blog } from "@/lib/types";

function readingTime(content: string) {
  const words = content
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

export default function DimensionArticle({ blog }: { blog: Blog }) {
  const cleanTitle = blog.title.replace(/<[^>]*>/g, "");

  return (
      <article className="dimension-article">
        <header className="dimension-article-head">
          <Link
              href="/blogs"
              className="dimension-article-back"
          >
            <ArrowLeft aria-hidden="true" />
            Journal index
          </Link>

          <div className="dimension-article-label">
            <span>{blog.category || "Field note"}</span>

            <span>
                        {format(
                            new Date(blog.created_at),
                            "MMMM dd, yyyy",
                        )}
                    </span>
          </div>

          <h1>{parse(blog.title)}</h1>

          <p>
            {blog.excerpt?.replace(/<[^>]*>/g, "")}
          </p>

          <div className="dimension-article-meta">
                    <span>
                        <Clock3 aria-hidden="true" />
                      {readingTime(blog.content || "")} min read
                    </span>

            <span>{blog.views ?? 0} views</span>

            <span>By Jahid Hasan</span>
          </div>
        </header>

        {blog.cover_image && (
            <figure className="dimension-article-cover">
              <img
                  src={blog.cover_image}
                  alt={cleanTitle}
              />

              <figcaption>
                {blog.category || "Engineering field note"} / Jahid Hasan
              </figcaption>
            </figure>
        )}

        <div className="dimension-article-layout">
          {!!blog.tags?.length && (
              <div
                  className="dimension-article-tags"
                  aria-label="Article tags"
              >
                {blog.tags.map((tag) => (
                    <span key={tag}>
                                {tag}
                            </span>
                ))}
              </div>
          )}

          <div className="dimension-article-prose">
            {parse(blog.content || "")}
          </div>
        </div>

        <footer className="dimension-article-footer">
          <div>
            <span>CONTINUE READING</span>

            <h2>
              More notes from
              <br />
              the work.
            </h2>
          </div>

          <Link href="/blogs">
            Browse the journal
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </footer>
      </article>
  );
}