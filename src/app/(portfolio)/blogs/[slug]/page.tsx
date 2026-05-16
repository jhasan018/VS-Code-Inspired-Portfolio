import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeftIcon, CalendarIcon, EyeIcon } from "@heroicons/react/24/outline";
import parse from "html-react-parser";

interface Props { params: Promise<{ slug: string }> }

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

  return (
    <div className="md:max-w-[90%] mx-auto py-2 md:py-16 animate-in fade-in duration-600">
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

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[var(--vsc-text-bright)] leading-[1.2] mb-6 tracking-tight font-jakarta">
          {blog.title}
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
        <div className="mb-12 md:mb-16 rounded-2xl overflow-hidden border border-[var(--vsc-border)] shadow-2xl shadow-black/40">
          <img src={blog.cover_image} alt={blog.title} className="w-full h-auto block" />
        </div>
      )}

      <article className="prose-vsc max-w-none">
        {parse(blog.content || "")}
      </article>

      <footer className="mt-20 pt-10 border-t border-[var(--vsc-border)] text-center">
        <p className="text-[var(--vsc-text-dim)] text-sm mb-6 italic font-mono opacity-60">
          // Thanks for reading!
        </p>
        <Link href="/blogs" className="btn-primary px-8 py-3 rounded-md font-semibold inline-block">
          Explore more articles
        </Link>
      </footer>
    </div>
  );
}
