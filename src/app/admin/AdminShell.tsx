'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const Layout = styled.div`
  min-height: 100vh;
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  height: 56px;
  background: #13131a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled.span`
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HomeLink = styled.a`
  font-size: 0.85rem;
  color: #64748b;
  transition: color 0.2s;

  &:hover {
    color: #94a3b8;
  }
`;

const SignOutBtn = styled.button`
  font-size: 0.85rem;
  color: #ef4444;
  padding: 0.35rem 0.75rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem 1.5rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <Layout>
      <TopBar>
        <Logo>Admin Dashboard</Logo>
        <TopActions>
          <HomeLink href="/" target="_blank">← 사이트 보기</HomeLink>
          <SignOutBtn onClick={handleSignOut}>로그아웃</SignOutBtn>
        </TopActions>
      </TopBar>
      <Content>{children}</Content>
    </Layout>
  );
}
