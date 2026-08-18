export interface Profile {
  id: string
  name: string
  title: string
  subtitle: string
  bio: string
  email: string
  github_url: string
  linkedin_url: string
  twitter_url: string
  resume_url: string
  avatar_url: string
  location: string
  available_for_work: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  category: string
  description: string
  long_description: string
  tech_stack: string[]
  github_url: string
  live_url: string
  cover_image: string; // Updated from image_url
  featured: boolean
  project_type: 'company' | 'client' | 'personal'
  status: 'completed' | 'in-progress' | 'planned'
  order_index: number
  created_at: string
  updated_at: string
  // SEO Fields
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  schema_data?: any;
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  cover_image: string
  tags: string[]
  published: boolean
  views: number
  created_at: string
  updated_at: string
  // SEO Fields
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  schema_data?: any;
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon: string
  order_index: number
  created_at: string
}

export interface About {
  id: string
  bio: string
  experience_years: number
  projects_count: number
  clients_count: number
  timeline: any[]
  education: any[]
  updated_at: string
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'blog' | 'project';
  created_at: string;
}

export interface PageMeta {
  id: string;
  page_slug: string;
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  schema_data?: any;
  updated_at: string;
}
