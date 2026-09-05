"use client";
import { Blog } from "@/lib/types";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { format } from "date-fns";
import { CalendarIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";
import parse from 'html-react-parser'
import { blogImageSrc } from "@/lib/content-seo";

interface Props { blogs: Blog[] }

export default function BlogsClient({ blogs }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate categories and their counts
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = { All: blogs.length };
    blogs.forEach(b => {
      const cat = b.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name === "All" ? -1 : b.name === "All" ? 1 : a.name.localeCompare(b.name));
  }, [blogs]);

  // Filter logic: Search + Category
  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      const matchesCategory = activeCategory === "All" || (b.category || "Uncategorized") === activeCategory;
      const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  return (
    <div className="max-w-[95%] md:max-w-[90%] mx-auto animate-in fade-in duration-400 pb-20">
      <div className="text-[var(--vsc-comment)] font-mono text-xs md:text-sm mb-6 opacity-80">
        {"// blogs.tsx — Articles & thoughts"}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--vsc-text-bright)] mb-4 tracking-tighter">
            <span className="text-[var(--vsc-keyword)] font-mono text-3xl md:text-4xl">export</span>
            {" "}Articles
          </h1>
          <p className="text-[var(--vsc-text-dim)] text-base md:text-lg max-w-2xl opacity-90 leading-relaxed font-sans">
            Sharing insights on full-stack development, modern architectures, and building digital products with purpose.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="w-full lg:w-96 space-y-6">
          {/* Search Bar */}
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vsc-text-dim)] group-focus-within:text-[var(--vsc-accent)] transition-colors" />
            <input
              aria-label="Search articles"
              type="text"
              placeholder="Search articles, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-[var(--vsc-border)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--vsc-text)] outline-none focus:border-[var(--vsc-accent)]/50 focus:bg-white/[0.05] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear article search"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <XMarkIcon className="w-3.5 h-3.5 text-[var(--vsc-text-dim)]" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categoryData.map(({ name, count }) => (
              <button
                key={name}
                onClick={() => setActiveCategory(name)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium font-mono transition-all duration-300 border
                  ${activeCategory === name
                    ? "bg-[var(--vsc-accent)] border-[var(--vsc-accent)] text-white shadow-lg shadow-[var(--vsc-accent)]/20 scale-105"
                    : "bg-white/5 border-white/5 text-[var(--vsc-text-dim)] hover:bg-white/10 hover:border-white/10 hover:text-[var(--vsc-text)]"}
                `}
              >
                {name}
                <span className={`opacity-50 text-[10px] ${activeCategory === name ? 'text-white' : 'text-[var(--vsc-accent)]'}`}>({count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count & Clear */}
      {(searchQuery || activeCategory !== "All") && (
        <div className="flex items-center gap-3 mb-8 text-xs font-mono text-[var(--vsc-text-dim)] animate-in slide-in-from-left duration-300">
          <span>Found {filteredBlogs.length} results</span>
          <div className="h-3 w-[1px] bg-[var(--vsc-border)]" />
          <button
            onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
            className="text-[var(--vsc-accent)] hover:underline flex items-center gap-1"
          >
            <XMarkIcon className="w-3 h-3" /> Clear filters
          </button>
        </div>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 gap-8 md:gap-10">
        {filteredBlogs.map(blog => (
          <Link key={blog.id} href={`/blogs/${blog.slug}`} prefetch={true} className="no-underline group">
            <div className="vsc-card flex flex-col md:flex-row gap-8 p-6 items-start cursor-pointer border border-[var(--vsc-border)] rounded-2xl transition-all duration-500 hover:border-[var(--vsc-accent)]/40 hover:bg-white/[0.03] relative overflow-hidden bg-gradient-to-br from-[var(--vsc-bg-alt)]/40 to-transparent backdrop-blur-md">

              {/* Desktop Category Badge */}
              <div className="hidden lg:flex absolute top-6 right-6 items-center gap-2 px-4 py-1.5 bg-[var(--vsc-bg)]/80 border border-[var(--vsc-border)] rounded-full text-[10px] text-[var(--vsc-accent)] uppercase font-bold tracking-[0.15em] z-10 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--vsc-accent)] animate-pulse" />
                {blog.category || "Uncategorized"}
              </div>

              {blog.cover_image && (
                <div className="w-full md:w-56 lg:w-80 aspect-video md:aspect-square lg:aspect-video rounded-xl overflow-hidden flex-shrink-0 border border-white/5 relative">
                  <SafeImage
                    src={blogImageSrc(blog.cover_image)}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 767px) 95vw, (max-width: 1023px) 224px, 320px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--vsc-bg)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}

              <div className="flex-1 w-full flex flex-col justify-center py-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="lg:hidden px-3 py-1 bg-[var(--vsc-accent)]/10 border border-[var(--vsc-accent)]/20 rounded-md text-[9px] text-[var(--vsc-accent)] uppercase font-bold tracking-widest">
                    {blog.category || "Uncategorized"}
                  </div>
                  <div className="flex items-center gap-2 text-[var(--vsc-text-dim)] text-[10px] md:text-xs font-mono">
                    <CalendarIcon className="w-4 h-4 opacity-50" />
                    {format(new Date(blog.created_at), "MMMM dd, yyyy")}
                  </div>
                </div>

                <h2 className="text-2xl  font-extrabold text-[var(--vsc-text-bright)] mb-4 font-jakarta group-hover:text-[var(--vsc-accent)] transition-all duration-300 leading-tight tracking-tight">
                  {parse(blog.title)}
                </h2>

                <p className="text-sm md:text-base text-[var(--vsc-text-dim)] leading-relaxed line-clamp-3 mb-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500 max-w-3xl">
                  {parse(blog.excerpt)}
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {(blog.tags ?? []).map(tag => (
                    <span key={tag} className="vsc-tag text-[9px] md:text-[11px] font-mono px-3 py-1 bg-white/[0.03] hover:bg-[var(--vsc-accent)]/10 transition-colors">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredBlogs.length === 0 && (
          <div className="flex flex-col items-start justify-center py-32 text-left animate-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-6 border border-dashed border-[var(--vsc-border)]">
              <MagnifyingGlassIcon className="w-8 h-8 text-[var(--vsc-text-dim)] opacity-30" />
            </div>
            <div className="text-[var(--vsc-text-bright)] font-bold text-xl mb-2">No matching articles</div>
            <p className="text-[var(--vsc-text-dim)] font-mono text-sm max-w-sm mb-8 opacity-60">
              {`// Try adjusting your search keywords or selecting a different category.`}
            </p>
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="btn-primary px-8 py-3 rounded-xl font-bold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
