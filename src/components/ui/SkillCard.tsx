'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { Skill } from '@/lib/types';

const Card = styled(motion.div)<{ $color: string }>`
  background: linear-gradient(135deg, #13131a 0%, #1a1a2e 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  cursor: default;
  transition: border-color 0.3s;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, ${({ $color }) => $color}25 0%, transparent 65%);
    pointer-events: none;
  }

  &:hover {
    border-color: ${({ $color }) => $color}60;
  }
`;

const Icon = styled.span`
  font-size: 2.2rem;
  line-height: 1;
`;

const Name = styled.p`
  font-weight: 600;
  font-size: 0.95rem;
  color: #f1f5f9;
`;

const Category = styled.p`
  font-size: 0.75rem;
  color: #64748b;
`;

const LevelDots = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.span<{ $active: boolean; $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active, $color }) => ($active ? $color : 'rgba(255,255,255,0.12)')};
  transition: background 0.2s;
`;

interface Props {
  skill: Skill;
}

export default function SkillCard({ skill }: Props) {
  const color = skill.color || '#7c3aed';

  return (
    <Card
      $color={color}
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Icon>{skill.icon || '⚡'}</Icon>
      <Name>{skill.name}</Name>
      {skill.category && <Category>{skill.category}</Category>}
      <LevelDots>
        {Array.from({ length: 5 }).map((_, i) => (
          <Dot key={i} $active={i < skill.level} $color={color} />
        ))}
      </LevelDots>
    </Card>
  );
}
