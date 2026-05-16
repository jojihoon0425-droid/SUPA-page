'use client';

import styled from 'styled-components';

const FooterWrapper = styled.footer`
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: #0a0a0f;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <p>© {new Date().getFullYear()} Portfolio. Built with Next.js & Supabase.</p>
    </FooterWrapper>
  );
}
