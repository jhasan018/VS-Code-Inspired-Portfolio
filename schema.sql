-- ============================================================
-- VS Code Portfolio Database Schema (Updated)
-- Run this in your Supabase SQL editor
-- ============================================================

-- Profile table
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Jahid Hasan',
  title TEXT NOT NULL DEFAULT 'Full Stack Web Developer',
  subtitle TEXT NOT NULL DEFAULT 'Building beautiful digital experiences',
  bio TEXT DEFAULT '',
  email TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  location TEXT DEFAULT '',
  available_for_work BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  long_description TEXT DEFAULT '',
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  cover_image TEXT DEFAULT '', -- Updated from image_url
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'planned')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- About section table
CREATE TABLE IF NOT EXISTS about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT DEFAULT '',
  experience_years INTEGER DEFAULT 0,
  projects_count INTEGER DEFAULT 0,
  clients_count INTEGER DEFAULT 0,
  timeline JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]', -- Added education field
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read all" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read all" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read all" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public read all" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read all" ON about FOR SELECT USING (true);
CREATE POLICY "Anyone can insert messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Allow Dashboard access (Simplified for demo, usually use auth.uid())
CREATE POLICY "Full access for all" ON profile USING (true);
CREATE POLICY "Full access for all" ON projects USING (true);
CREATE POLICY "Full access for all" ON blogs USING (true);
CREATE POLICY "Full access for all" ON skills USING (true);
CREATE POLICY "Full access for all" ON about USING (true);
CREATE POLICY "Full access for all" ON contact_messages USING (true);
