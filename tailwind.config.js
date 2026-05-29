/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#020617',
        surface: '#081225',
        accent: {
          cyan: '#06B6D4',
          violet: '#8B5CF6',
        },
        muted: '#94A3B8',
      },
      boxShadow: {
        glow: '0 0 32px rgba(6, 182, 212, 0.12)',
        'glow-violet': '0 0 32px rgba(139, 92, 246, 0.12)',
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.15), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139, 92, 246, 0.12), transparent), radial-gradient(ellipse 50% 30% at 0% 100%, rgba(6, 182, 212, 0.08), transparent)',
        'circuit-grid':
          'linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
    },
  },
  plugins: [],
};
