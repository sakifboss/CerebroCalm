import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          bg: "#1C1917",
          "bg-deep": "#161412",
          "bg-surface": "#25211E",
          "bg-card": "#211D1A",
          "bg-elevated": "#2E2824",
          border: "#38322D",
          "border-focus": "#574D45",
          text: "#FEF3C7",
          "text-muted": "#FDE68A",
          "text-dim": "#D6C7A1",
          sage: "#A7F3D0",
          "sage-dark": "#065F46",
          "sage-surface": "#132E27",
          amber: "#FBBF24",
          "amber-muted": "#D97706",
          "amber-surface": "#2D2211",
          emergency: "#B91C1C",
          "emergency-dark": "#7F1D1D",
          "emergency-surface": "#2D1212",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Lexend",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      lineHeight: {
        relaxed: "1.75",
        loose: "2",
      },
      maxWidth: {
        reading: "65ch",
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
    },
  },
  plugins: [],
};

export default config;
