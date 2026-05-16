'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Nav = styled(motion.nav)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
  background: ${({ $scrolled }) =>
    $scrolled
      ? 'rgba(10, 10, 15, 0.95)'
      : 'rgba(10, 10, 15, 0.6)'};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ $scrolled }) =>
    $scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'};
  transition: background 0.3s ease, border-color 0.3s ease;
`;

const Logo = styled.a`
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
`;

const Links = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 640px) {
    gap: 1rem;
  }
`;

const NavLink = styled.a`
  font-size: 0.9rem;
  font-weight: 500;
  color: #94a3b8;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: #f1f5f9;
  }
`;

const navLinks = [
  { label: '소개', href: '#hero' },
  { label: '스킬', href: '#skills' },
  { label: '프로젝트', href: '#projects' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <Nav
      $scrolled={scrolled}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Logo href="#hero">Portfolio</Logo>
      <Links>
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href}>
            {link.label}
          </NavLink>
        ))}
      </Links>
    </Nav>
  );
}
