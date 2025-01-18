module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
  daisyui: {},
  theme: {
    extend: {
      backgroundImage: {
        'gradient-blue': 'linear-gradient(to top, #00c6fb 0%, #005bea 100%)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('flowbite/plugin'),
    require('daisyui'),
  ],
};
