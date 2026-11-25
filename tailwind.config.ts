import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        leaf: {
          700: "var(--leaf-700)",
          500: "var(--leaf-500)",
          100: "var(--leaf-100)",
        },
        wheat: {
          500: "var(--wheat-500)",
          100: "var(--wheat-100)",
        },
        soil: {
          700: "var(--soil-700)",
          100: "var(--soil-100)",
        },
        cream: {
          50: "var(--cream-50)",
        },
        sky: {
          500: "var(--sky-500)",
        },
        alert: {
          500: "var(--alert-500)",
        },
        ink: {
          900: "var(--ink-900)",
        },
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        "muted-ink": "var(--muted-ink)",
        "border-soft": "var(--border-soft)",
      },
      fontFamily: {
        heading: ['"Poppins"', '"Noto Sans"', '"Noto Sans Devanagari"', "sans-serif"],
        sans: [
          '"Noto Sans"',
          '"Noto Sans Devanagari"',
          '"Noto Sans Bengali"',
          '"Noto Sans Tamil"',
          '"Noto Sans Telugu"',
          '"Noto Sans Kannada"',
          '"Noto Sans Malayalam"',
          '"Noto Sans Gujarati"',
          '"Noto Sans Gurmukhi"',
          '"Noto Sans Oriya"',
          '"Noto Sans Ol Chiki"',
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "20px",
        pill: "16px",
      },
      boxShadow: {
        soft: "0 4px 16px -2px rgba(31, 42, 31, 0.08), 0 2px 6px -1px rgba(31, 42, 31, 0.04)",
        lift: "0 10px 24px -4px rgba(46, 125, 50, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
