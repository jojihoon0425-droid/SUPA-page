import styled from 'styled-components';
import { createClient } from '@/lib/supabase/server';
import SkillCard from '@/components/ui/SkillCard';
import SkillsClient from './SkillsClient';

export default async function SkillsSection() {
  const supabase = createClient();
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });

  return <SkillsClient skills={skills ?? []} />;
}
