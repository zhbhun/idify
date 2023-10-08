module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@idify/common/src/**/*.{js,ts,jsx,tsx}"
  ],
  corePlugins: {
    preflight: false,
  },
  important: '#root',
  theme: {
    extend: {},
  },
  plugins: [],
}
