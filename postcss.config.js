module.exports = {
  plugins: [
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-px-to-viewport-8-plugin")({
      viewportWidth: 375,
    }),
  ],
};
