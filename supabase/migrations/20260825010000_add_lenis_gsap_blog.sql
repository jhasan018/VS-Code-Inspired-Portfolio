-- Publish-ready SEO article. Safe to run repeatedly in the Supabase SQL editor.
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Technical';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_title TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS og_title TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS og_description TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS og_image TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS canonical_url TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS schema_data JSONB;

INSERT INTO blogs (
  title, slug, excerpt, content, cover_image, category, tags, published,
  meta_title, meta_description, og_title, og_description, og_image,
  canonical_url, schema_data, updated_at
)
VALUES (
  'Lenis Smooth Scroll with GSAP ScrollTrigger in Next.js',
  'lenis-smooth-scroll-gsap-scrolltrigger-nextjs',
  'Learn how to connect Lenis smooth scrolling with GSAP ScrollTrigger in Next.js or React using one animation loop, safe cleanup, and responsive motion.',
  $article$
<p>Combining <strong>Lenis smooth scroll with GSAP ScrollTrigger in Next.js</strong> is one of my preferred ways to build polished, animation-driven websites. Lenis makes wheel and trackpad movement feel controlled, while ScrollTrigger connects animation progress to the visitor’s position on the page.</p>

<p>The integration is small, but a few details matter. Running two animation loops, initializing browser-only libraries in a Server Component, or forgetting cleanup can create jitter and duplicate triggers. This guide shows the production setup I use for React and the Next.js App Router.</p>

<h2>What Lenis and GSAP ScrollTrigger each do</h2>

<p><a href="https://github.com/darkroomengineering/lenis" target="_blank" rel="noopener noreferrer">Lenis</a> is a lightweight smooth-scroll library. It interpolates native scroll input to create more consistent movement without requiring every animation to know how scrolling works.</p>

<p><a href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/" target="_blank" rel="noopener noreferrer">GSAP ScrollTrigger</a> controls animations based on scroll position. It calculates trigger start and end points, updates animation progress, supports pinning and scrubbing, and provides responsive helpers.</p>

<p>The goal is not to make both libraries manage scrolling. Lenis owns the smooth scroll calculation; ScrollTrigger reads the resulting position and updates the animation.</p>

<h2>Install Lenis and GSAP</h2>

<pre><code class="language-bash">npm install lenis gsap</code></pre>

<p>Use the current <code>lenis</code> package. Older tutorials may reference <code>@studio-freight/lenis</code>, which is no longer the package name used by the official project.</p>

<h2>Create a client-side smooth scroll provider</h2>

<p>Next.js pages and layouts are Server Components by default. Lenis and GSAP depend on browser APIs, so their setup belongs behind a <code>"use client"</code> boundary.</p>

<p>Create <code>src/components/SmoothScrollProvider.tsx</code>:</p>

<pre><code class="language-tsx">"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() =&gt; {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    const updateScrollTrigger = () =&gt; ScrollTrigger.update();
    const updateLenis = (time: number) =&gt; {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () =&gt; {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return children;
}</code></pre>

<p>GSAP’s ticker reports time in seconds, while <code>lenis.raf()</code> expects milliseconds. Multiplying by <code>1000</code> is therefore essential. Feeding Lenis from GSAP’s ticker also avoids maintaining a second independent <code>requestAnimationFrame</code> loop.</p>

<p><code>lenis.on("scroll", ScrollTrigger.update)</code> tells ScrollTrigger to check the current position when Lenis emits a scroll event. Calling <code>ScrollTrigger.refresh()</code> is different: refresh recalculates trigger measurements, so it should run after layout-changing content such as fonts or images has settled—not continuously.</p>

<h2>Add the provider to the Next.js App Router</h2>

<p>Wrap the rendered application in the root layout while keeping the layout itself as a Server Component:</p>

<pre><code class="language-tsx">import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function RootLayout({
  children,
}: Readonly&lt;{ children: React.ReactNode }&gt;) {
  return (
    &lt;html lang="en"&gt;
      &lt;body&gt;
        &lt;SmoothScrollProvider&gt;
          {children}
        &lt;/SmoothScrollProvider&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>

<p>For a regular React application, place the same provider around your router or top-level <code>App</code> component. The Lenis and GSAP code does not otherwise change.</p>

<h2>Build a ScrollTrigger reveal animation</h2>

<p>With the scroll engine connected, individual components only need normal GSAP code:</p>

<pre><code class="language-tsx">"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeatureSection() {
  const sectionRef = useRef&lt;HTMLElement&gt;(null);

  useEffect(() =&gt; {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () =&gt; {
      const context = gsap.context(() =&gt; {
        gsap.from("[data-reveal]", {
          y: 48,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        });
      }, section);

      return () =&gt; context.revert();
    });

    return () =&gt; media.revert();
  }, []);

  return (
    &lt;section ref={sectionRef}&gt;
      &lt;p data-reveal&gt;Interactive development&lt;/p&gt;
      &lt;h2 data-reveal&gt;Motion that supports the story.&lt;/h2&gt;
      &lt;p data-reveal&gt;
        Lenis smooths the journey. ScrollTrigger controls the reveal.
      &lt;/p&gt;
    &lt;/section&gt;
  );
}</code></pre>

<p><code>gsap.context()</code> scopes selectors to the component and makes cleanup reliable. This is especially important in React development, where Strict Mode can mount effects more than once to expose unsafe side effects.</p>

<h2>Scrub an animation with smooth scrolling</h2>

<p>For progress-based motion, add <code>scrub</code>. A small numeric value creates gentle catch-up without making the animation feel disconnected:</p>

<pre><code class="language-ts">gsap.to(".project-image", {
  yPercent: -12,
  ease: "none",
  scrollTrigger: {
    trigger: ".project-card",
    start: "top bottom",
    end: "bottom top",
    scrub: 0.6,
  },
});</code></pre>

<p>Avoid stacking a very slow Lenis interpolation with a large scrub value. Both introduce smoothing, and too much smoothing makes the interface feel delayed.</p>

<h2>Do you need ScrollTrigger.scrollerProxy()?</h2>

<p>Usually, no. When Lenis controls the normal document scroll, ScrollTrigger can read the window position directly. The official Lenis integration uses the scroll event and GSAP ticker without a proxy.</p>

<p><code>ScrollTrigger.scrollerProxy()</code> is useful when a third-party library transforms a custom scrolling container and ScrollTrigger cannot read its position normally. Adding it to a standard Lenis root setup creates unnecessary complexity.</p>

<h2>Common Lenis and ScrollTrigger problems</h2>

<h3>Animations trigger at the wrong position</h3>
<p>Images, web fonts, accordions, and asynchronously rendered content can change page geometry after triggers are created. Run <code>ScrollTrigger.refresh()</code> after that layout change. Do not call refresh on every scroll frame.</p>

<h3>The page feels jittery</h3>
<p>Check that Lenis has only one RAF source. If <code>autoRaf: true</code> is enabled while Lenis is also connected to <code>gsap.ticker</code>, two loops may update the same instance. Use one approach only.</p>

<h3>Animations run twice in development</h3>
<p>React Strict Mode is often exposing missing cleanup. Remove the ticker callback, destroy Lenis, and revert component-scoped GSAP contexts when effects unmount.</p>

<h3>Anchor links do not feel smooth</h3>
<p>Lenis can handle anchor scrolling through its options or <code>lenis.scrollTo()</code>. Avoid combining it with global CSS <code>scroll-behavior: smooth</code>, because two smoothing systems can compete.</p>

<h3>Mobile scrolling feels unnatural</h3>
<p>Start with Lenis defaults and test on real iOS and Android devices. Do not force desktop-style smoothing onto touch input simply for visual consistency. Motion should improve orientation, not make the page harder to control.</p>

<h2>Performance and accessibility checklist</h2>

<ul>
  <li>Respect <code>prefers-reduced-motion</code> and keep content visible without animation.</li>
  <li>Animate transforms and opacity instead of layout-heavy properties.</li>
  <li>Use <code>once: true</code> for reveals that do not need to replay.</li>
  <li>Keep one animation frame loop for Lenis and GSAP.</li>
  <li>Clean up ticker callbacks, Lenis instances, and GSAP contexts.</li>
  <li>Refresh ScrollTrigger only after meaningful layout changes.</li>
  <li>Test keyboard navigation, anchor links, and native browser find behavior.</li>
  <li>Avoid excessive pinning on small screens.</li>
</ul>

<h2>Final setup</h2>

<p>A reliable <strong>Lenis smooth scroll and GSAP ScrollTrigger setup in Next.js</strong> comes down to clear ownership: Lenis calculates the smooth position, GSAP’s ticker advances Lenis, and ScrollTrigger reads the result. React effects create the integration once and clean it up completely.</p>

<p>This approach gives me a strong foundation for animated portfolio sites, product storytelling, and scroll-driven interfaces without turning every component into scroll infrastructure. You can see the same focus on motion, maintainability, and full-stack delivery in my <a href="/projects">interactive web development projects</a> and <a href="/skills">React, Next.js, and GSAP skills</a>.</p>

<h2>Official references</h2>
<ul>
  <li><a href="https://github.com/darkroomengineering/lenis" target="_blank" rel="noopener noreferrer">Lenis documentation and GSAP integration</a></li>
  <li><a href="https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md" target="_blank" rel="noopener noreferrer">Lenis React documentation</a></li>
  <li><a href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/" target="_blank" rel="noopener noreferrer">GSAP ScrollTrigger documentation</a></li>
</ul>
  $article$,
  '/blog/lenis-gsap-scrolltrigger-nextjs.png',
  'Animation',
  ARRAY['Lenis', 'GSAP', 'ScrollTrigger', 'Next.js', 'React', 'Web Animation'],
  true,
  'Lenis Smooth Scroll + GSAP ScrollTrigger in Next.js',
  'Set up Lenis smooth scroll with GSAP ScrollTrigger in Next.js or React. Includes client components, cleanup, accessibility, and debugging tips.',
  'Lenis Smooth Scroll with GSAP ScrollTrigger in Next.js',
  'A production-ready Lenis and GSAP ScrollTrigger setup for smooth, accessible animations in Next.js and React.',
  'https://devjahid.vercel.app/blog/lenis-gsap-scrolltrigger-nextjs.png',
  'https://devjahid.vercel.app/blogs/lenis-smooth-scroll-gsap-scrolltrigger-nextjs',
  jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'TechArticle',
    'headline', 'Lenis Smooth Scroll with GSAP ScrollTrigger in Next.js',
    'description', 'Set up Lenis smooth scroll with GSAP ScrollTrigger in Next.js or React using one animation loop, safe cleanup, and accessible motion.',
    'author', jsonb_build_object('@type', 'Person', 'name', 'Jahid Hasan', 'url', 'https://devjahid.vercel.app/about'),
    'publisher', jsonb_build_object('@type', 'Person', 'name', 'Jahid Hasan'),
    'mainEntityOfPage', 'https://devjahid.vercel.app/blogs/lenis-smooth-scroll-gsap-scrolltrigger-nextjs',
    'keywords', 'Lenis smooth scroll, GSAP ScrollTrigger, Next.js, React, web animation',
    'proficiencyLevel', 'Intermediate'
  ),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  og_title = EXCLUDED.og_title,
  og_description = EXCLUDED.og_description,
  og_image = EXCLUDED.og_image,
  canonical_url = EXCLUDED.canonical_url,
  schema_data = EXCLUDED.schema_data,
  updated_at = NOW();
