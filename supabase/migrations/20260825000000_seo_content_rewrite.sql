-- SEO content rewrite: safe to run more than once in the Supabase SQL editor.
CREATE TABLE IF NOT EXISTS page_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_title TEXT DEFAULT '',
  og_description TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  schema_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_alt TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role_label TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT '';

INSERT INTO page_meta (page_slug, meta_title, meta_description, og_title, og_description, canonical_url)
VALUES
  ('home', 'Jahid Hasan — Interactive Web Developer | React, Next.js & GSAP', 'Jahid Hasan is an interactive web developer building animated, high-performance websites with React, Next.js, and GSAP for global clients.', 'Jahid Hasan — Interactive Web Developer | React, Next.js & GSAP', 'Interactive, high-performance websites built with React, Next.js, and GSAP.', 'https://devjahid.vercel.app'),
  ('about', 'About Jahid Hasan | Interactive Web Developer at Dcastalia Limited', 'Jahid Hasan is an interactive web developer at Dcastalia Limited, building animated, high-performance websites with React, Next.js, GSAP, and Laravel. M.Sc in ICT, BUP.', 'About Jahid Hasan | Interactive Web Developer', 'Interactive web developer at Dcastalia Limited specializing in React, Next.js, GSAP, and Laravel.', 'https://devjahid.vercel.app/about'),
  ('projects', 'Projects | Interactive Web Development Work — Jahid Hasan', 'Interactive websites built with React, Next.js, and GSAP for finance, education, healthcare, and e-commerce clients as a developer at Dcastalia Limited.', 'Interactive Web Development Projects — Jahid Hasan', 'React, Next.js, and GSAP projects delivered across finance, education, healthcare, and e-commerce.', 'https://devjahid.vercel.app/projects'),
  ('skills', 'Skills | React, Next.js, GSAP & Full-Stack Development — Jahid Hasan', 'Technical skills in React, Next.js, TypeScript, GSAP animation, PHP, Laravel, Yii2, MySQL, and WordPress for high-performance web applications.', 'Jahid Hasan — React, Next.js & GSAP Skills', 'Frontend animation and full-stack web development capabilities.', 'https://devjahid.vercel.app/skills'),
  ('contact', 'Contact Jahid Hasan | Interactive Web Developer', 'Contact Jahid Hasan about interactive web development with React, Next.js, and GSAP animation. Available for select engagements worldwide.', 'Contact Jahid Hasan | Interactive Web Developer', 'Discuss an interactive React, Next.js, or GSAP web project with Jahid Hasan.', 'https://devjahid.vercel.app/contact'),
  ('blogs', 'Journal | Web Development Guides — Next.js, Laravel & Architecture', 'Articles on Next.js, Laravel, backend architecture, and web development practices, written from real production experience.', 'Web Development Guides — Jahid Hasan', 'Production notes on Next.js, Laravel, backend architecture, and modern web development.', 'https://devjahid.vercel.app/blogs')
ON CONFLICT (page_slug) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  og_title = EXCLUDED.og_title,
  og_description = EXCLUDED.og_description,
  canonical_url = EXCLUDED.canonical_url,
  updated_at = NOW();

UPDATE projects SET
  role_label = CASE WHEN project_type = 'company' THEN 'Web Developer · Dcastalia Limited' ELSE role_label END,
  image_alt = CASE WHEN COALESCE(image_alt, '') = '' THEN title || ' — interactive website developed by Jahid Hasan' ELSE image_alt END;

UPDATE projects SET seo_description = CASE lower(title)
  WHEN 'icb asset management' THEN 'Built with Next.js and GSAP-powered scroll animations for a fast, professional financial platform.'
  WHEN 'aiba savar' THEN 'Developed with Next.js, Laravel, and GSAP micro-interactions for smooth navigation across an education platform.'
  WHEN 'shanta asset management' THEN 'A React and Next.js investment platform with animated data presentation and a PHP/Yii2 backend.'
  WHEN 'ucb stock brokerage' THEN 'A React and Next.js frontend with WordPress-driven content, built for speed and clarity.'
  WHEN 'midland bank asset management' THEN 'A Next.js and PHP/Yii2 platform with a MySQL backend, focused on trust, transparency, and clean UI.'
  WHEN 'naafco pharma' THEN 'A Next.js site with GSAP animation and a Yii2/MySQL backend for a pharmaceutical manufacturer.'
  WHEN 'unico hospitals' THEN 'A React and Next.js hospital platform with Styled Components and a Yii2 backend, built for patient-first usability.'
  WHEN 'meghna executive' THEN 'A full-stack e-commerce build with Next.js, TypeScript, Supabase, and Stripe, including real-time inventory.'
  ELSE seo_description
END;

UPDATE profile
SET title = 'Interactive Web Developer',
    subtitle = 'Animated, fast, and scalable web experiences with React, Next.js, and GSAP',
    updated_at = NOW()
WHERE title IN ('Full Stack Web Developer', 'Full-Stack Developer');

UPDATE about
SET bio = 'I''m an interactive web developer and full-stack engineer currently working at Dcastalia Limited, where I build animated, high-performance websites using React, Next.js, GSAP, PHP, and Laravel. I focus on interfaces that feel responsive and alive while keeping the architecture clean and maintainable.',
    updated_at = NOW()
WHERE COALESCE(bio, '') = ''
   OR bio ILIKE 'I am a passionate Full Stack Web Developer%';

ALTER TABLE page_meta ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read page meta" ON page_meta;
CREATE POLICY "Public read page meta" ON page_meta FOR SELECT USING (true);
DROP POLICY IF EXISTS "Dashboard update page meta" ON page_meta;
CREATE POLICY "Dashboard update page meta" ON page_meta FOR UPDATE USING (true) WITH CHECK (true);
