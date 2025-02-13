import { defineConfig } from "unocss";
import presetUno from "@unocss/preset-uno";

export default defineConfig({
  presets: [presetUno()],
  // 添加安全列表，确保基础类名可用
  safelist: ["p-4", "mb-4", "text-2xl", "font-bold", "space-y-4"],
});
