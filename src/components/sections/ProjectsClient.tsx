'use client';

import styled from 'styled-components';
import type { Project } from '@/lib/types';
import ProjectCard from '@/components/ui/ProjectCard';
import AnimatedSection from '@/components/ui/AnimatedSection';

const Section = styled.section`
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionLabel = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #06b6d4;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #f1f5f9;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  padding: 4rem 2rem;
  border: 1px dashed rgba(255,255,255,0.1);
  border-radius: 16px;
`;

interface Props {
  projects: Project[];
}

export default function ProjectsClient({ projects }: Props) {
  return (
    <Section id="projects">
      <Inner>
        <AnimatedSection>
          <Header>
            <SectionLabel>프로젝트</SectionLabel>
            <SectionTitle>Projects</SectionTitle>
          </Header>
        </AnimatedSection>

        {projects.length === 0 ? (
          <EmptyState>어드민에서 프로젝트를 추가해주세요.</EmptyState>
        ) : (
          <Grid>
            {projects.map((project, i) => (
              <AnimatedSection key={project.id} delay={i * 0.08}>
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </Grid>
        )}
      </Inner>
    </Section>
  );
}
