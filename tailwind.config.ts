import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f6f5f0",
        ink: "#1d2925",
        forest: "#24463a",
        rust: "#a84d32",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 35px rgba(29, 41, 37, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
