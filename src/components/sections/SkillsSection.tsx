import styled from 'styled-components';
import { createClient } from '@/lib/supabase/server';
import SkillCard from '@/components/ui/SkillCard';
import SkillsClient from './SkillsClient';
import type { Skill } from '@/lib/types';

export default async function SkillsSection() {
  let skills: Skill[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    skills = data ?? [];
  } catch {
    // DB 연결 실패 시 빈 배열로 렌더링
  }

  return <SkillsClient skills={skills} />;
}
