'use client';

import { useState } from 'react';
import styled from 'styled-components';
import type { Profile, Skill, Project } from '@/lib/types';
import ProfileForm from '@/components/admin/ProfileForm';
import SkillManager from '@/components/admin/SkillManager';
import ProjectManager from '@/components/admin/ProjectManager';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  color: #f1f5f9;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.25rem;
  background: #13131a;
  padding: 0.25rem;
  border-radius: 10px;
  width: fit-content;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#f1f5f9' : '#64748b')};
  background: ${({ $active }) =>
    $active ? 'rgba(124, 58, 237, 0.25)' : 'transparent'};
  border: ${({ $active }) =>
    $active ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid transparent'};
  transition: all 0.2s;

  &:hover {
    color: #f1f5f9;
  }
`;

const Panel = styled.div`
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.75rem;
`;

const PanelTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

type TabKey = 'profile' | 'skills' | 'projects';

interface Props {
  profile: Profile | null;
  skills: Skill[];
  projects: Project[];
}

export default function AdminDashboard({ profile, skills, projects }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  return (
    <Page>
      <PageTitle>포트폴리오 관리</PageTitle>

      <Tabs>
        <Tab $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
          프로필
        </Tab>
        <Tab $active={activeTab === 'skills'} onClick={() => setActiveTab('skills')}>
          스킬
        </Tab>
        <Tab $active={activeTab === 'projects'} onClick={() => setActiveTab('projects')}>
          프로젝트
        </Tab>
      </Tabs>

      {activeTab === 'profile' && (
        <Panel>
          <PanelTitle>소개 정보</PanelTitle>
          <ProfileForm profile={profile} />
        </Panel>
      )}

      {activeTab === 'skills' && (
        <Panel>
          <PanelTitle>스킬 & 관심분야 관리</PanelTitle>
          <SkillManager skills={skills} />
        </Panel>
      )}

      {activeTab === 'projects' && (
        <Panel>
          <PanelTitle>프로젝트 관리</PanelTitle>
          <ProjectManager projects={projects} />
        </Panel>
      )}
    </Page>
  );
}
