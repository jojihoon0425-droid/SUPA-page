import { createClient } from '@/lib/supabase/server';
import HeroContent from './HeroContent';

export default async function HeroSection() {
  let profile = null;
  try {
    const supabase = createClient();
    const { data } = await supabase.from('profile').select('*').single();
    profile = data;
  } catch {
    // DB 연결 실패 시 기본값으로 렌더링
  }

  return <HeroContent profile={profile} />;
}
