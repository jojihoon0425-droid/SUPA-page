import { createClient } from '@/lib/supabase/server';
import ProjectsClient from './ProjectsClient';
import type { Project } from '@/lib/types';

export default async function ProjectsSection() {
  let projects: Project[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    projects = data ?? [];
  } catch {
    // DB 연결 실패 시 빈 배열로 렌더링
  }

  return <ProjectsClient projects={projects} />;
}
