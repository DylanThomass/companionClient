const { defineConfig } = require("unocss");
const presetUno = require("@unocss/preset-uno").default;

module.exports = defineConfig({
  presets: [presetUno()],
  safelist: ["p-4", "mb-4", "text-2xl", "font-bold", "space-y-4"],
});
