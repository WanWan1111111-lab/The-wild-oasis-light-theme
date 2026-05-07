/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 奶油白豪宅主题 - 浅色系
        primary: {
          50:  "#FDFCFA",  // 最浅，接近纯白
          100: "#F7F5F0",  // 奶油白主背景
          200: "#EDE9E1",  // 卡片/区块背景
          300: "#E7E1D8",  // 边框色
          400: "#C8C0B4",  // 次级边框/分割线
          500: "#9E9488",  // 占位符/禁用文字
          600: "#6E6A63",  // 次文字
          700: "#4A4640",  // 辅助文字
          800: "#2C2A26",  // 主文字（深）
          900: "#1C1C1C",  // 最深文字
          950: "#0F0E0C",  // 极深（几乎不用）
        },
        accent: {
          50:  "#FFF8E7",
          100: "#FEF0C4",
          200: "#FDE08A",
          300: "#FBCE50",
          400: "#FBBD36",
          500: "#D38816",  // 主色
          600: "#EB9C00",
          700: "#B87200",
          800: "#8A5500",
          900: "#5C3800",
          950: "#3A2200",
        },
      },
      boxShadow: {
        cinema: "0 20px 60px rgba(0,0,0,0.08)",
        card:   "0 4px 24px rgba(0,0,0,0.06)",
        hover:  "0 8px 32px rgba(0,0,0,0.12)",
        float:  "0 2px 12px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
