export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import AdminDashboard from './AdminDashboard';
import type { Profile, Skill, Project } from '@/lib/types';

export default async function AdminPage() {
  const supabase = createClient();

  let profile: Profile | null = null;
  let skills: Skill[] = [];
  let projects: Project[] = [];

  try {
    const [profileRes, skillsRes, projectsRes] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('skills').select('*').order('display_order', { ascending: true }),
      supabase.from('projects').select('*').order('display_order', { ascending: true }),
    ]);
    profile = profileRes.data;
    skills = skillsRes.data ?? [];
    projects = projectsRes.data ?? [];
  } catch {
    // DB 연결 실패 시 빈 데이터로 렌더링
  }

  return (
    <AdminDashboard
      profile={profile}
      skills={skills ?? []}
      projects={projects ?? []}
    />
  );
}
