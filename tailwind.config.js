/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1C685D", // rich-teal — CTAs, active states, icons
          light:   "#2C9182", // lighter teal for hover states
          muted:   "#E8F3F1", // pale teal — badge backgrounds
        },
        accent: {
          DEFAULT: "#08383C", // deep-pine — headers, tab bar
          100:     "#F5F8F6", // sage-white — app background
          200:     "#0D4849", // overlay-teal — dark inputs
          300:     "#9CA3AF", // muted gray — secondary text
        },
        dark: "#0F1712",   // near-black for primary text
        card: "#FFFFFF",   // card surface
      },
    },
  },
  plugins: [],
};
