import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1c2430",
        muted: "#687385",
        line: "#d9e0ea",
        surface: "#f8fafc",
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          500: "#0e7490",
          600: "#0f6070",
          700: "#164e63"
        },
        accent: {
          100: "#dcfce7",
          500: "#16a34a",
          700: "#166534"
        },
        warn: {
          100: "#ffedd5",
          600: "#c2410c"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
