import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ortaq: {
          navy: "#14213D",
          action: "#2D5BFF",
          accent: "#6E8BFF",
          bg: "#F4F6FA",
          surface: "#FFFFFF",
          "surface-alt": "#EEF1F6",
          line: "#DDE2EB",
          "line-strong": "#C8CFDB",
          "text-main": "#0F172A",
          "text-secondary": "#334155",
          "text-muted": "#64748B",
          success: "#1E9E6A",
          warning: "#C98A2B",
          danger: "#C74A4A",
          "dark-bg": "var(--ortaq-dark-bg)",
          "dark-surface": "var(--ortaq-dark-surface)",
          "dark-elevated": "var(--ortaq-dark-elevated)",
          "dark-border": "var(--ortaq-dark-border)",
          "dark-text": "var(--ortaq-dark-text)",
          "dark-text-secondary": "var(--ortaq-dark-text-secondary)",
          "dark-text-muted": "var(--ortaq-dark-text-muted)",
          "dark-text-subtle": "var(--ortaq-dark-text-subtle)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      maxWidth: {
        container: "72rem",
      },
      boxShadow: {
        "ortaq-sm": "var(--ortaq-shadow-sm)",
        "ortaq-md": "var(--ortaq-shadow-md)",
        "ortaq-lg": "var(--ortaq-shadow-lg)",
        "ortaq-card": "var(--ortaq-shadow-card)",
        "ortaq-dark": "var(--ortaq-shadow-dark)",
      },
    },
  },
  plugins: [],
};

export default config;
