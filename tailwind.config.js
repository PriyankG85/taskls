/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        dark: {
          "primary-100": "#0F3460",
          "primary-200": "#435d8e",
          "primary-300": "#a3baf1",
          "accent-100": "#3A506B",
          "accent-200": "#c7ddfd",
          "text-100": "#FFFFFF",
          "text-200": "#e0e0e0",
          "bg-100": "#1A1A2E",
          "bg-200": "#29293e",
          "bg-300": "#424057",
        },
        light: {
          "primary-100": "#66B3FF",
          "primary-200": "#4196e0",
          "primary-300": "#00589a",
          "accent-100": "#3399FF",
          "accent-200": "#00429a",
          "text-100": "#333333",
          "text-200": "#5c5c5c",
          "bg-100": "#E6F2FF",
          "bg-200": "#dce8f5",
          "bg-300": "#b4bfcc",
        },
      },
      fontFamily: {
        spaceMono: ["SpaceMono", "monospace"],
        spaceMonoBold: ["SpaceMonoBold", "monospace"],
        Karma: ["Karma", "sans-serif"],
        Montserrat: ["MontserratAlternates", "sans-serif"],
      },
    },
  },
  plugins: [],
};
