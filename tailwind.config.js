export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#050816',
        neon: '#7c90ff',
        pulse: '#7af9ff',
        violet: '#9f7dff',
        cyan: '#4ff7e4',
      },
      boxShadow: {
        glow: '0 0 24px rgba(79, 247, 228, 0.18)',
      },
      backgroundImage: {
        'circuit-grid': 'radial-gradient(circle at top left, rgba(79, 247, 228, 0.08), transparent 32%), radial-gradient(circle at bottom right, rgba(159, 125, 255, 0.08), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
      },
    },
  },
  plugins: [],
};
