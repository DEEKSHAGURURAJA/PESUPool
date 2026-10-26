/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pesu: {
          blue: "#0A2540",
          navy: "#0d1b2a",
          gold: "#D4AF37",
          accent: "#2563EB",
          light: "#F0F4F8",
          card: "#1b2a47"
        }
      }
    },
  },
  plugins: [],
};
