import { createClient } from '@/lib/supabase/server';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const supabase = createClient();

  const [{ data: profile }, { data: skills }, { data: projects }] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('skills').select('*').order('display_order', { ascending: true }),
    supabase.from('projects').select('*').order('display_order', { ascending: true }),
  ]);

  return (
    <AdminDashboard
      profile={profile}
      skills={skills ?? []}
      projects={projects ?? []}
    />
  );
}
