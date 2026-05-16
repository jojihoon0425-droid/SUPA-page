'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Profile } from '@/lib/types';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 6rem 2rem 4rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const Inner = styled.div`
  max-width: 860px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  position: relative;
`;

const Avatar = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid transparent;
  background: linear-gradient(#0a0a0f, #0a0a0f) padding-box,
    linear-gradient(135deg, #7c3aed, #06b6d4) border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background-color: #1a1a2e;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #7c3aed33, #06b6d433);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const Name = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(135deg, #7c3aed, #06b6d4, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Tagline = styled(motion.p)`
  font-size: clamp(1rem, 3vw, 1.3rem);
  color: #94a3b8;
  max-width: 600px;
`;

const BadgeRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
`;

const Badge = styled.span`
  padding: 0.4rem 1rem;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.35);
  border-radius: 9999px;
  font-size: 0.85rem;
  color: #c4b5fd;
`;

const InfoBadge = styled(Badge)`
  background: rgba(6, 182, 212, 0.12);
  border-color: rgba(6, 182, 212, 0.3);
  color: #67e8f9;
`;

const Bio = styled(motion.p)`
  max-width: 600px;
  color: #94a3b8;
  line-height: 1.8;
  font-size: 1rem;
`;

const ScrollArrow = styled(motion.div)`
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: #4b5563;
  font-size: 1.5rem;
  cursor: pointer;
`;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

interface Props {
  profile: Profile | null;
}

export default function HeroContent({ profile }: Props) {
  const name = profile?.name ?? '이름을 입력해주세요';
  const tagline = profile?.tagline ?? '어드민에서 소개글을 입력해주세요';
  const school = profile?.school;
  const age = profile?.age;
  const bio = profile?.bio;
  const interests = profile?.interests ?? [];

  return (
    <Section id="hero">
      <Inner
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Avatar
          variants={itemVariants}
          style={{ width: 120, height: 120 }}
        >
          {profile?.profile_image_url ? (
            <Image
              src={profile.profile_image_url}
              alt={name}
              width={120}
              height={120}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <AvatarPlaceholder>👤</AvatarPlaceholder>
          )}
        </Avatar>

        <Name variants={itemVariants}>{name}</Name>
        <Tagline variants={itemVariants}>{tagline}</Tagline>

        <BadgeRow variants={itemVariants}>
          {school && <InfoBadge>🏫 {school}</InfoBadge>}
          {age && <InfoBadge>🎂 {age}세</InfoBadge>}
          {interests.map((interest) => (
            <Badge key={interest}>{interest}</Badge>
          ))}
        </BadgeRow>

        {bio && <Bio variants={itemVariants}>{bio}</Bio>}
      </Inner>

      <ScrollArrow
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        onClick={() =>
          document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })
        }
      >
        ↓
      </ScrollArrow>
    </Section>
  );
}
