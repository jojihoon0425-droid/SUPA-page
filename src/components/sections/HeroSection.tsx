import { createClient } from '@/lib/supabase/server';
import HeroContent from './HeroContent';

export default async function HeroSection() {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .single();

  return <HeroContent profile={profile} />;
}
