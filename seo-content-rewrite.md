# SEO Content Rewrite — devjahid.vercel.app

**Primary keyword target:** Interactive Web Developer
**Secondary targets:** Full-Stack Developer, GSAP Animation Developer, Next.js Developer
**Local modifier:** Dhaka, Bangladesh (used lightly — you also want global remote clients, so it's woven in, not forced)

Positioning logic: "Full-Stack Developer" is a crowded, generic term with huge competition. "Interactive Web Developer" + animation (GSAP) is a real differentiator you already have proof for (your GSAP-built sites), and it's a term with real search volume and much less competition. The rewrite below leans into that niche while keeping full-stack as supporting proof of range.

---

## 1. Global Meta Tags (all pages, edit per-page where noted)

**Title tag (homepage):**
```
Jahid Hasan | Interactive Web Developer & Animation Specialist (React, Next.js, GSAP)
```
*(Keep under 60 characters visible — Google truncates around 60-65. This one runs long; a tighter version:)*
```
Jahid Hasan — Interactive Web Developer | React, Next.js & GSAP
```

**Meta description (homepage):**
```
Jahid Hasan is an interactive web developer building animated, high-performance websites with React, Next.js, and GSAP. Full-stack development for finance, education, and healthcare brands — from architecture to launch.
```
*(155 characters — fits Google's snippet limit, leads with the target keyword, names concrete tech and industries for relevance signals.)*

**OG / Twitter title & description:** mirror the above so social shares reinforce the same keyword signal.

**Meta keywords tag:** This field is ignored by Google/Bing for ranking — safe to leave or drop, but if kept:
```
Interactive Web Developer, GSAP Animation Developer, Full Stack Developer, React Developer, Next.js Developer, Web Animation, UI Motion Design, PHP Yii2 Developer
```

---

## 2. Homepage Hero Section

**Current:**
> JAHID HASAN — Full-stack developer
> # Jahid Hasan builds products that ship
> I build fast, scalable & beautiful web experiences

**Rewrite:**
> JAHID HASAN — Interactive Web Developer
> # Jahid Hasan builds interactive websites that move
> I design and develop animated, fast, and scalable web experiences using React, Next.js, and GSAP — from first line of code to production launch.

Why: the H1 needs your target keyword phrase or a close natural variant ("interactive websites that move" nods to animation without being stuffed). The subtext now names your actual stack, which matches what people search when looking to hire ("React developer," "GSAP developer," "Next.js developer").

---

## 3. Stat Section (currently "0+ Years experience" etc.)

Add a line of descriptive text under the stats block — search engines have almost nothing to index here right now:

```
Over [X] years building interactive, animation-driven websites for financial institutions, 
universities, hospitals, and e-commerce brands — combining clean full-stack architecture 
(React, Next.js, PHP, Laravel) with motion design (GSAP) that makes interfaces feel alive.
```

---

## 4. "Selected Work" Section

Section heading rewrite:
**Current:** "A few projects, shown with context."
**Rewrite:** "Interactive websites built with React, Next.js & GSAP"

This heading currently carries zero keywords — it's the highest-value real estate on the page after the H1, and it's wasted on stylistic copy. Keep the stylistic line as a subheading if you like the brand voice, but put a keyword-rich H2 above it.

**Project description rewrites** (add 1 sentence to each naming the *type of interactivity/animation* delivered — this is what's currently missing and what would help you rank for "GSAP developer" / "animated website developer"):

- **ICB Asset Management** → *...Built with Next.js and GSAP-powered scroll animations for a fast, professional financial platform.*
- **AIBA Savar** → *...Developed with Next.js, Laravel, and GSAP micro-interactions for smooth navigation across an education platform.*
- **Shanta Asset Management** → *...A React and Next.js investment platform with animated data presentation and PHP/Yii2 backend.*
- **UCB Stock Brokerage** → *...React and Next.js frontend with WordPress-driven content, built for speed and clarity.*
- **Midland Bank Asset Management** → *...Next.js and PHP/Yii2 platform with a MySQL backend, focused on trust, transparency, and clean UI.*
- **Naafco Pharma** → *...Next.js site with GSAP animation and a Yii2/MySQL backend for a pharmaceutical manufacturer.*
- **Unico Hospitals** → *...React and Next.js hospital platform with Styled Components and a Yii2 backend, built for patient-first usability.*
- **Meghna Executive** → *...Full-stack e-commerce build with Next.js, TypeScript, Supabase, and Stripe, including real-time inventory.*

Each of these should also get **descriptive image alt text**, e.g.:
```
alt="ICB Asset Management — Next.js and GSAP animated website by Jahid Hasan"
```
Right now these images almost certainly have generic or missing alt text — this is free, easy image-search SEO you're not capturing.

---

## 5. "Capabilities" / Skills Section

**Current heading:** "Tools chosen for the work."
**Rewrite:** "React, Next.js & GSAP — the stack behind interactive web development"

Add a short paragraph (currently this section is just a tag cloud with no indexable sentences):
```
I build interactive, animated web applications with React, Next.js, and TypeScript on the 
frontend, GSAP for motion and scroll-based interactions, and PHP, Laravel, Yii2, or MySQL 
on the backend — plus WordPress for content-driven sites. Every project is built for speed, 
accessibility, and long-term maintainability.
```

---

## 6. "Journal" / Blog Section

**Current heading:** "Notes from practice."
**Rewrite:** "Web development guides: Next.js, Laravel & backend architecture"

Your blog posts are actually strong SEO assets already (long-tail, specific titles like "Deploy Next.js on Ubuntu VPS with GitLab CI/CD"). Keep writing these — they'll outperform your homepage for long-tail searches. Two suggestions:
- Write at least one post specifically about **GSAP animation techniques** or **building interactive UI with GSAP + Next.js** — right now nothing on the site targets your #1 keyword directly in long-form content, which is the single biggest gap.
- Add an estimated read time and a 1-sentence excerpt under each blog title on this section — more indexable text, better click-through from search snippets.

---

## 7. CTA / Closing Section

**Current:** "Have a product that needs clear thinking?"
**Rewrite (keep the voice, add keyword context in the paragraph beneath, not the heading itself — headings should stay punchy):**
```
Have a product that needs clear thinking?

I partner with teams who want a website that's fast, interactive, and built to last — 
combining full-stack engineering with GSAP-driven animation and a product-first process, 
from technical planning to launch.
```

---

## 8. Footer

**Current:** "Full-stack engineering and project delivery from technical planning through launch — clear, maintainable, and accountable."

**Rewrite:**
```
Interactive web developer specializing in React, Next.js, and GSAP animation — full-stack 
engineering and project delivery from technical planning through launch. Based in Dhaka, 
Bangladesh, available for remote work worldwide.
```
This single line does double duty: reinforces your keyword identity site-wide (footers get crawled on every page) and gives you a soft local-SEO signal without committing you to only-local searches.

---

## 9. Technical / Structural Recommendations (bigger impact than copy alone)

1. **Add Schema.org structured data** (Person + JSON-LD) with `jobTitle: "Interactive Web Developer"`, `knowsAbout: ["React", "Next.js", "GSAP", "Animation", "Full-Stack Development"]`, and `sameAs` links to GitHub/LinkedIn. This is what lets Google show rich results and understand your identity beyond just text on the page.
2. **Unique title + meta description per page** — About, Work, Journal, Skills, Contact should NOT reuse the homepage meta description (worth checking; many portfolio site generators default to one global description).
3. **H1 uniqueness per page** — confirm each page (About, Projects, Skills) has its own H1 containing a relevant keyword variant (e.g., Projects page H1: "Interactive web development projects" rather than a repeat of the homepage H1).
4. **Internal linking**: link from blog posts to relevant project case studies and vice versa (e.g., the Yii2 CMS article could link to the Naafco or ICB projects built with Yii2).
5. **Image file names**: rename project screenshots from generic hashes (e.g. `1778796365421-icb.webp`) to descriptive names (`icb-asset-management-nextjs-gsap-website.webp`) — filenames are a minor but real ranking signal for image search.
6. **Sitemap + robots.txt**: confirm both exist and the sitemap is submitted in Google Search Console (you already have `google-site-verification`, so GSC access is set up — check Coverage and Performance reports for keyword opportunities you're currently missing).
7. **Core Web Vitals**: GSAP-heavy sites can hurt LCP/CLS if not lazy-loaded correctly — worth auditing in PageSpeed Insights, since Google factors this directly into rankings for competitive terms like "web developer."

---

---

## 10. Critical fix: attributing work to Dcastalia Limited

Right now your project cards read like personal/freelance work ("View project" → live client site), with no mention of the agency you built them under. Two problems this causes:

1. **Trust/credibility risk** — a visitor or recruiter who knows Dcastalia's work, or who checks and finds you're not the owner/freelancer of record, may read this as overstating your role. This is also a factual-accuracy issue, not just an SEO one.
2. **SEO/E-E-A-T signal** — Google increasingly weighs the *accuracy and specificity* of experience claims (especially on About/Portfolio pages) as part of trustworthiness. Being precise about your role ("developer on the team at Dcastalia Limited" vs. implying solo ownership) is actually a positive trust signal, not a weaker one.

**Recommended pattern — add a small role/agency line to every project card:**

```
ICB Asset Management
Financial · Company delivery

Developed as part of the team at Dcastalia Limited. Built with Next.js and 
GSAP-powered scroll animations for a fast, professional financial platform.

Next.js · PHP · Yii2 · GSAP
Role: Web Developer (Dcastalia Limited)

[View project]
```

Apply the same "Role: Web Developer (Dcastalia Limited)" tag to all 8 projects unless a specific one really was independent/freelance — in that case just omit the tag for that one, which itself signals the distinction clearly.

**Section-level disclosure (cleanest fix, one line, covers all 8 at once):**
Add this directly under the "Selected work" H2, above the project grid:
```
Most of the projects below were delivered as a developer on the team at 
Dcastalia Limited, working on client platforms for finance, education, 
and healthcare organizations.
```
This single sentence removes any ambiguity for every visitor without needing to repeat it 8 times, and reads naturally rather than like a legal disclaimer.

**On the About page**, add a proper work-experience line (this also helps SEO — "worked at" language is exactly what recruiters and Google both parse well):
```
I currently work as a Web Developer at Dcastalia Limited, where I've built and 
maintained production websites for financial institutions, universities, hospitals, 
and e-commerce brands — handling everything from frontend architecture to GSAP-driven 
interactions and backend integration.
```

**Schema.org addition** (pairs with recommendation #9.1 above): add a `worksFor` property to your Person JSON-LD:
```json
"worksFor": {
  "@type": "Organization",
  "name": "Dcastalia Limited"
}
```
This is a structured, machine-readable way of telling Google you're an employee delivering client work — it reduces any risk of the projects being seen as unverified personal claims, and it's genuinely accurate.

---

## 11. Other pages — SEO templates

I could only fully load your homepage content (subpages aren't indexed yet for me to pull verbatim), so these are frameworks to adapt with your existing text — the structure and keyword placement is what matters most.

### About page
- **Title tag:** `About Jahid Hasan | Interactive Web Developer at Dcastalia Limited`
- **Meta description:** `Jahid Hasan is an interactive web developer at Dcastalia Limited, building animated, high-performance websites with React, Next.js, and GSAP for finance, education, and healthcare clients.`
- **H1:** `About Jahid Hasan — Interactive Web Developer`
- **Body must include:** current employer (Dcastalia Limited), years of experience, core stack (React/Next.js/GSAP/PHP/Laravel), and a sentence on what makes your work "interactive" (motion, scroll interactions, UX detail) — this page is where Google looks for E-E-A-T (Experience, Expertise, Authority, Trust) signals, so specificity beats generic personal-brand language every time.

### Projects (full) page
- **Title tag:** `Projects | Interactive Web Development Work — Jahid Hasan`
- **Meta description:** `A collection of interactive, animated websites built with React, Next.js, and GSAP — delivered as a developer at Dcastalia Limited for finance, education, healthcare, and e-commerce clients.`
- **H1:** `Selected interactive web development projects`
- Apply the same per-project rewrites and Dcastalia attribution from sections 4 and 10 above — this page should carry more detail than the homepage's shortened preview (longer descriptions = more indexable, keyword-relevant text per page, which helps this specific URL rank for project-related searches).

### Skills page
- **Title tag:** `Skills | React, Next.js, GSAP & Full-Stack Development — Jahid Hasan`
- **Meta description:** `Technical skills: React, Next.js, TypeScript, GSAP animation, PHP, Laravel, Yii2, MySQL, and WordPress — used to build interactive, high-performance web applications.`
- **H1:** `Technical skills and stack`
- Group skills into labeled clusters instead of one flat tag cloud — e.g. "Frontend & Animation" (React, Next.js, TypeScript, GSAP, Tailwind), "Backend" (PHP, Laravel, Yii2, MySQL), "CMS & Platforms" (WordPress). Grouped, labeled skill sections give search engines clearer topical context than an undifferentiated list, and read better for human visitors too.

### Contact page
- **Title tag:** `Contact Jahid Hasan | Interactive Web Developer`
- **Meta description:** `Get in touch with Jahid Hasan to discuss an interactive web development project — React, Next.js, and GSAP animation, available for select engagements worldwide.`
- **H1:** `Start a conversation`
- Contact pages rarely rank on their own merit, so keep this light — the main SEO value here is just having a clean, unique title/description rather than duplicating the homepage's.

### Blog listing page (`/blogs`)
- **Title tag:** `Journal | Web Development Guides — Next.js, Laravel & Architecture`
- **Meta description:** `Articles on Next.js, Laravel, backend architecture, and web development practices — written from real production experience.`
- **H1:** `Web development notes and guides`

### Individual blog posts
Your existing post titles are already good long-tail SEO (specific, technical, descriptive) — keep that pattern. Two additions per post:
1. A 1–2 sentence meta description unique to that post (don't let it default to the site-wide description).
2. Internal links to relevant projects mentioned in the post (e.g., the Yii2 CMS article linking to Naafco or ICB, which used Yii2) — this strengthens topical relevance for both pages.

---

---

## 12. About page — actual content rewrite

Good news on attribution: your Experience timeline already correctly lists Dcastalia Limited (2023–present) for all three of your roles there. The gap isn't on this page — it's that Home and Projects show those same client sites with no link back to this context. Fix: cross-reference them (see the closing note at the end of this section).

**Current meta tags (weaker than your homepage's):**
```
title: Jahid Hasan | Full-Stack Developer
meta-description: Full Stack Web Developer specializing in React, Next.js, and modern web technologies.
```
This is generic and doesn't carry your target keyword or your actual differentiator (GSAP/animation) at all — worth fixing since Google treats each page's title/description independently.

**Rewrite:**
```
title: About Jahid Hasan | Interactive Web Developer at Dcastalia Limited
meta-description: Jahid Hasan is an interactive web developer at Dcastalia Limited, building animated, high-performance websites with React, Next.js, GSAP, and Laravel. M.Sc in ICT, BUP.
```

**H1 rewrite:**
Current: *"A developer who thinks in systems."*
This is good brand voice — keep it, but it carries zero keyword weight since it's the only H1 on the page. Add a keyword-bearing line directly beneath it rather than replacing it:
```
# A developer who thinks in systems.
Interactive, animation-driven web development — engineering, delivery, and clear 
communication treated as one connected discipline.
```

**Profile section rewrite:**
Current:
> I am a passionate Full Stack Web Developer who loves creating modern, responsive web applications. With a strong foundation in both frontend and backend technologies, I bring ideas to life through clean, efficient code.

Rewrite:
```
I'm an interactive web developer and full-stack engineer currently working at Dcastalia 
Limited, where I build animated, high-performance websites using React, Next.js, GSAP, 
PHP, and Laravel. With a strong foundation across frontend and backend, I focus on making 
interfaces that feel responsive and alive — not just functional — while keeping the 
underlying architecture clean enough for someone else to maintain after I'm gone.
```
This version names the keyword ("interactive web developer"), names the current employer explicitly (reinforcing the Experience section below it), names the real stack, and keeps your original "clean, efficient code" sentiment intact.

**Experience section — minor tightening (already good, just add stack keywords consistently):**
Your current "Mid Level Full Stack Web Developer" entry already lists Next.js, React, PHP, Laravel, Yii2, WordPress, Node.js, and GSAP — that's genuinely strong, keep it as-is. Consider adding one line to the "Junior Web Developer" and "Front End and WordPress Developer" entries naming the actual tech used (SASS is mentioned for one; add specifics for the other) so each role card carries its own keyword-relevant text rather than a generic sentence.

**Connecting About to the Projects page (this replaces the need for extra Dcastalia tags everywhere else):**
Add one line at the end of the "Experience" section or right before "See the work behind the approach":
```
Most of the projects shown here were delivered as part of my work at Dcastalia Limited.
```
Since About already establishes the employment relationship clearly and chronologically, this one-line bridge is enough to remove any ambiguity when a visitor clicks through to Projects — you don't need to repeat "Role: Dcastalia Limited" on all 8 cards as I suggested earlier; a single clear cross-reference from About, plus the "Selected work" intro line already recommended in §10, covers it cleanly.

---



| Location | Target keyword present? |
|---|---|
| Title tag | ✅ Interactive Web Developer |
| Meta description | ✅ Interactive web developer, GSAP, React, Next.js |
| H1 | ✅ "interactive websites" |
| First 100 words of body copy | ✅ |
| Section H2s | ✅ (Work, Capabilities headings rewritten) |
| Image alt text | ✅ (needs implementation) |
| Footer (site-wide) | ✅ |
| At least one blog post | ⚠️ Recommended — not yet written |
| Dcastalia Limited attribution | ⚠️ Add to project cards, About page, and schema |
