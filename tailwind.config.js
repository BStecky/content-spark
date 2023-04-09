/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        cspark: {
          primary: "#0072FF",
          secondary: "#FF7F00",
          accent: "#46B2E9",
          accentTwo: "#FFB74D",
          lightGray: "#F3F3F3",
          darkGray: "#333333",
        },
      },
      "light",
      "dark",
      "luxury",
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
