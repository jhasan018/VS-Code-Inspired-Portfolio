import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeftIcon, CalendarIcon, EyeIcon } from "@heroicons/react/24/outline";
import parse from "html-react-parser";
import { Metadata } from "next";
import { getActiveTheme } from "@/lib/theme";
import DimensionArticle from "@/themes/dimension/DimensionArticle";
import LumeArticle from "@/themes/lume/LumeArticle";
import SolaceArticle from "@/themes/solace/SolaceArticle";
import Image from "next/image";
import BlogContent from "@/components/ui/BlogContent";
import LinkedInProfileBadge from "@/components/ui/LinkedInProfileBadge";
import { blogImageSrc } from "@/lib/content-seo";

function plainText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function conciseTitle(value: string, maxLength = 60) {
  const clean = plainText(value);
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength + 1).replace(/\s+\S*$/, "").trim();
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerClient();
  const { data: blog } = await supabase.from("blogs").select("*").eq("slug", slug).single();

  if (!blog) return {};

  const title = conciseTitle(blog.meta_title || blog.title);
  const description = plainText(blog.meta_description || blog.excerpt || blog.content).slice(0, 160);
  const url = `https://devjahid.vercel.app/blogs/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: blog.canonical_url || url },
    openGraph: {
      title: blog.og_title || title,
      description: blog.og_description || description,
      url,
      type: "article",
      publishedTime: blog.created_at,
      images: [blog.og_image || blog.cover_image || "/og-image-dimension.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.og_title || title,
      description: blog.og_description || description,
      images: [blog.og_image || blog.cover_image || "/og-image-dimension.png"],
    },
  };
}

export const revalidate = 60;

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerClient();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!blog || error) return notFound();

  // Increment views
  supabase.from("blogs").update({ views: (blog.views ?? 0) + 1 }).eq("id", blog.id).then();

  const theme = await getActiveTheme();
  if (theme === "dimension") {
    return <>
      {blog.schema_data && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.schema_data).replace(/</g, "\\u003c") }} />}
      <DimensionArticle blog={blog} />
    </>;
  }
  if (theme === "lume") {
    return <>
      {blog.schema_data && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.schema_data).replace(/</g, "\\u003c") }} />}
      <LumeArticle blog={blog} />
    </>;
  }
  if (theme === "solace") {
    return <>
      {blog.schema_data && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.schema_data).replace(/</g, "\\u003c") }} />}
      <SolaceArticle blog={blog} />
    </>;
  }

  return (
    <div className="md:max-w-[90%] mx-auto py-2 md:py-16 animate-in fade-in duration-600">
      {/* Schema.org JSON-LD */}
      {blog.schema_data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.schema_data).replace(/</g, "\\u003c") }}
        />
      )}

      <Link
        href="/blogs"
        prefetch={true}
        className="inline-flex items-center gap-2 text-[var(--vsc-text-dim)] hover:text-[var(--vsc-accent)] no-underline text-sm mb-8 md:mb-12 transition-colors group"
      >
        <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Articles
      </Link>

      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-5">
          {(blog.tags ?? []).map((t: string) => (
            <span key={t} className="vsc-tag text-[10px] md:text-xs px-2.5 py-0.5">{t}</span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--vsc-text-bright)] leading-[1.2] mb-6 tracking-tight font-jakarta">
          {parse(blog.title)}
        </h1>

        <div className="flex items-center gap-5 md:gap-8 text-[var(--vsc-text-dim)] text-xs md:text-sm border-b border-[var(--vsc-border)] pb-8 opacity-80">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4" />
            {format(new Date(blog.created_at), "MMMM dd, yyyy")}
          </div>
          <div className="flex items-center gap-1.5">
            <EyeIcon className="w-4 h-4" />
            {blog.views ?? 0} views
          </div>
        </div>
      </header>

      {blog.cover_image && (
        <div className="mb-12 md:mb-16 rounded-2xl overflow-hidden border relative aspect-1200/630 border-(--vsc-border) shadow-2xl shadow-black/40">
          <Image
            src={blogImageSrc(blog.cover_image)}
            alt={plainText(blog.title)}
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <article className="prose-vsc max-w-none">
        <BlogContent html={blog.content || ""} articleTitle={blog.title} />
      </article>

      <LinkedInProfileBadge
        className="mt-16 border-t border-[var(--vsc-border)] pt-10"
        headingClassName="font-jakarta text-xl font-bold text-[var(--vsc-text-bright)]"
      />

      <footer className="mt-20 pt-10 border-t border-[var(--vsc-border)] text-center">
        <p className="text-[var(--vsc-text-dim)] text-sm mb-6 italic font-mono opacity-60">
        </p>
        <Link href="/blogs" className="btn-primary px-8 py-3 rounded-md font-semibold inline-block">
          Explore more articles
        </Link>
      </footer>
    </div>
  );
}
