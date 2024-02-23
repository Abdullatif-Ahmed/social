/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        logo: ["Leckerli One", "cursive"],
      },
      colors: {
        primary: {
          DEFAULT: "#3d70b2",
          effect: "#1756a9",
        },
        light: {
          bg: {
            DEFAULT: "#f0f2f5",
            secondary: "#fff",
          },
          textColor: {
            DEFAULT: "#20201f",
            secondary: "#6a6868",
          },
          borderColor: "#c7c7c7",
        },
        dark: {
          bg: {
            DEFAULT: "#0f1014",
            secondary: "#15171c",
          },

          textColor: {
            DEFAULT: "#fff",
            secondary: "#7F828C",
          },
          borderColor: "#1e1e1e",
        },
      },
      borderRadius: {
        mobileNav: "16px",
      },
      spacing: {
        headerH: "64px",
        navH: "calc(100vh - 64px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in .2s ease-in-out",
      },
    },
  },
  plugins: [],
};
