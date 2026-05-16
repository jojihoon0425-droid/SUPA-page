'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Project } from '@/lib/types';

const Card = styled(motion.div)`
  background: linear-gradient(135deg, #13131a 0%, #1a1a2e 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: default;
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e, #13131a);
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const Content = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <Card
      whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(124,58,237,0.25)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      <Thumbnail>
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Placeholder>🚀</Placeholder>
        )}
      </Thumbnail>
      <Content>
        <Title>{project.title}</Title>
        {project.description && <Description>{project.description}</Description>}
      </Content>
    </Card>
  );
}
