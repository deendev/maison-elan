export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ivory: '#F5F1EA', cream: '#EAE3D8', charcoal: '#222222', taupe: '#A99B8A', ink: '#111111', sand: '#DDD4C6' },
      fontFamily: { serif: ['"Bodoni Moda"', 'Didot', 'Georgia', 'serif'], sans: ['Manrope', 'system-ui', 'sans-serif'] },
      letterSpacing: { wider2: '.18em', widest2: '.28em' },
      transitionTimingFunction: { lux: 'cubic-bezier(.22,.61,.36,1)' },
    },
  },
  plugins: [],
};
