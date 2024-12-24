export const theme = {
  colors: {
    primary: '#2D5A27', // Forest green
    secondary: '#8B9D77', // Sage
    accent: '#E6B17E', // Earth tone
    background: '#F7F7F2', // Off-white
    text: '#333333',
    white: '#FFFFFF',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  },
} as const;

export type Theme = typeof theme;
