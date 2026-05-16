export interface Profile {
  id: string;
  name: string;
  tagline: string | null;
  school: string | null;
  age: number | null;
  bio: string | null;
  interests: string[];
  profile_image_url: string | null;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  category: string;
  color: string;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}
