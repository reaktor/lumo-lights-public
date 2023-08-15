/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "540px",
      // => @media (min-width: 640px) { ... }

      md: "668px",
      // => @media (min-width: 768px) { ... }

      lg: "924px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#9308dd",

          secondary: "#8ca5f7",

          accent: "#f7dbbb",

          neutral: "#21272c",

          "base-100": "#3e385c",

          info: "#7fb0f5",

          success: "#1ec8a9",

          warning: "#f6c523",

          error: "#e96382",
        },
      },
    ],
  },
};
