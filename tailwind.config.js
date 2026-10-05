/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",

        background: "var(--background)",
        surface: "var(--surface)",
        "surface-secondary": "var(--surface-secondary)",
        card: "var(--card)",

        text: "var(--text)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-on-primary": "var(--text-on-primary)",

        border: "var(--border)",
        divider: "var(--divider)",

        input: "var(--input-background)",
        "input-border": "var(--input-border)",
        placeholder: "var(--placeholder)",

        icon: "var(--icon)",

        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",

        disabled: "var(--disabled)",

        "primary-soft": "var(--primary-soft)",
        "secondary-soft": "var(--secondary-soft)",
        "accent-soft": "var(--accent-soft)",

        overlay: "var(--overlay)",
      },

      fontFamily: {
        "nunito-medium": ["Nunito-Medium"],
        "nunito-semibold": ["Nunito-SemiBold"],
        "nunito-bold": ["Nunito-Bold"],
      },
    },
  },

  plugins: [],
};