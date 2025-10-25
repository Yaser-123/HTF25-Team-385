/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: '#177BE4',
          hover: '#1267c4',
        },
        success: {
          DEFAULT: '#56AD01',
          hover: '#489301',
        },
        'text-secondary': '#9A999C',
        'border-color': '#9A999C',
      },
    },
  },
  plugins: [],
};
