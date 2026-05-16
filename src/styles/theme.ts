export const theme = {
  colors: {
    background: '#0a0a0f',
    surface: '#13131a',
    surfaceAlt: '#1a1a2e',
    surfaceHover: '#1e1e30',
    primary: '#7c3aed',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    textDim: '#64748b',
    border: 'rgba(255,255,255,0.08)',
    borderHover: 'rgba(255,255,255,0.16)',
    danger: '#ef4444',
    success: '#22c55e',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 50%, #f59e0b 100%)',
    text: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
    textAlt: 'linear-gradient(90deg, #06b6d4, #f59e0b)',
    card: 'linear-gradient(135deg, #13131a 0%, #1a1a2e 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(124,58,237,0.25) 0%, transparent 70%)',
    glowCyan: 'radial-gradient(ellipse at center, rgba(6,182,212,0.2) 0%, transparent 70%)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    pill: '9999px',
  },
  shadow: {
    card: '0 4px 24px rgba(0,0,0,0.4)',
    glow: '0 0 40px rgba(124,58,237,0.3)',
    glowCyan: '0 0 40px rgba(6,182,212,0.3)',
  },
} as const;

export type Theme = typeof theme;
