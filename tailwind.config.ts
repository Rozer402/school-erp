import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Premium Semantic Colors
        success: {
          DEFAULT: "#10b981", // Emerald-500
          light: "#ecfdf5", // Emerald-50
          dark: "#059669", // Emerald-600
        },
        warning: {
          DEFAULT: "#f59e0b", // Amber-500
          light: "#fffbeb", // Amber-50
          dark: "#d97706", // Amber-600
        },
        danger: {
          DEFAULT: "#f43f5e", // Rose-500
          light: "#fff1f2", // Rose-50
          dark: "#e11d48", // Rose-600
        },
        info: {
          DEFAULT: "#2563eb",
          light: "#dbeafe",
          dark: "#1e40af",
        },
        amber: {
          DEFAULT: "#f59e0b",
          light: "#fef9c3",
          dark: "#b45309",
        },
        emerald: {
          DEFAULT: "#16a34a",
          light: "#dcfce7",
          dark: "#166534",
        },
        rose: {
          DEFAULT: "#f43f5e",
          light: "#fee2e2",
          dark: "#b91c1c",
        },
        indigo: {
          DEFAULT: "#6366f1",
          light: "#eef2ff",
          dark: "#312e81",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
    boxShadow: {
      soft: "0 2px 8px 0 rgba(30, 41, 59, 0.04)",
      medium: "0 4px 24px 0 rgba(30, 41, 59, 0.08)",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
