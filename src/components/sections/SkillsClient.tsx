'use client';

import styled from 'styled-components';
import type { Skill } from '@/lib/types';
import SkillCard from '@/components/ui/SkillCard';
import AnimatedSection from '@/components/ui/AnimatedSection';

const Section = styled.section`
  padding: 6rem 2rem;
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
  color: #7c3aed;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #f1f5f9;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  padding: 3rem;
`;

interface Props {
  skills: Skill[];
}

export default function SkillsClient({ skills }: Props) {
  return (
    <Section id="skills">
      <AnimatedSection>
        <Header>
          <SectionLabel>관심분야</SectionLabel>
          <SectionTitle>Skills & Abilities</SectionTitle>
        </Header>
      </AnimatedSection>

      {skills.length === 0 ? (
        <EmptyState>어드민에서 스킬을 추가해주세요.</EmptyState>
      ) : (
        <Grid>
          {skills.map((skill, i) => (
            <AnimatedSection key={skill.id} delay={i * 0.06}>
              <SkillCard skill={skill} />
            </AnimatedSection>
          ))}
        </Grid>
      )}
    </Section>
  );
}
