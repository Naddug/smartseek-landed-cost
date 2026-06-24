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
        /* Action = ORTAQ cobalt. Remaps Tailwind blue-* across the app so every
           CTA, link and partner-emphasis cue speaks one brand language. */
        blue: {
          50: "#EEF3FF",
          100: "#DCE6FF",
          200: "#BFD0FF",
          300: "#93AEFF",
          400: "#5B87FF",
          500: "#4072FF",
          600: "#356DFF",
          700: "#2A57D6",
          800: "#1E3FA0",
          900: "#17376B",
          950: "#0D2247",
        },
        /* Varlık (asset / real ground) = ORTAQ emerald. */
        emerald: {
          50: "#E3F6EE",
          100: "#C4ECDC",
          200: "#97DEC1",
          300: "#5FCBA1",
          400: "#2FBA85",
          500: "#18B57A",
          600: "#14A06B",
          700: "#0F7E55",
          800: "#0C5E42",
          900: "#093F2E",
        },
        /* Eksik / spotlight (open gap, attention) = premium ORTAQ amber, not orange. */
        amber: {
          50: "#FBF1DA",
          100: "#F8E4B8",
          200: "#F2D08A",
          300: "#ECBC5C",
          400: "#F0B24A",
          500: "#E3A22F",
          600: "#D9961E",
          700: "#B0760F",
          800: "#8A5C0C",
          900: "#5E3E08",
        },
        ortaq: {
          navy: "var(--ortaq-navy)",
          "navy-800": "var(--ortaq-navy-800)",
          "navy-900": "var(--ortaq-navy-900)",
          action: "var(--ortaq-action)",
          "action-strong": "var(--ortaq-action-strong)",
          accent: "var(--ortaq-accent)",
          asset: "var(--ortaq-asset)",
          "asset-soft": "var(--ortaq-asset-soft)",
          gap: "var(--ortaq-gap)",
          "gap-bright": "var(--ortaq-gap-bright)",
          "gap-soft": "var(--ortaq-gap-soft)",
          bg: "var(--ortaq-bg)",
          surface: "var(--ortaq-surface)",
          "surface-alt": "var(--ortaq-surface-alt)",
          line: "var(--ortaq-line)",
          "line-strong": "var(--ortaq-line-strong)",
          "text-main": "var(--ortaq-text-main)",
          "text-secondary": "var(--ortaq-text-secondary)",
          "text-muted": "var(--ortaq-text-muted)",
          success: "var(--ortaq-success)",
          warning: "var(--ortaq-warning)",
          danger: "var(--ortaq-danger)",
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
