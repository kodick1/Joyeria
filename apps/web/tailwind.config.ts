import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF7F2",
        ink: "#1C1B19",
        muted: "#6B665C",
        gold: { DEFAULT: "#B8975A", hover: "#A4854B" },
        emerald: "#1F3D36",
        border: "#E8E2D6",
        success: "#2F7D5B",
        error: "#B3412F",
        warning: "#C58B2A"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-cormorant)", "serif"]
      },
      boxShadow: { soft: "0 16px 50px rgba(28, 27, 25, 0.08)" },
      borderRadius: { luxury: "8px" },
      transitionDuration: { 180: "180ms" }
    }
  },
  plugins: []
};
export default config;
