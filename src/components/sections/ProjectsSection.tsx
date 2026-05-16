import { createClient } from '@/lib/supabase/server';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsSection() {
  const supabase = createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  return <ProjectsClient projects={projects ?? []} />;
}
