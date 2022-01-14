module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      sans: ["inter"],
      serif: ["inter"],
      display: ["inter"],
      body: ["inter"],
    },
    fontFeatureSettings: {
      numeric: ["tnum", "salt", "ss02"],
    },
    extend: {
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "64px",
      },
      colors: {
        transparent: "transparent",
        primary: "#7041EE",
        secondary: "#EA7979",
        black: "#000000",
        white: "#FFFFFF",
        neutral: {
          50: "#F4F4F4",
          100: "#E5E5E5",
          150: "#D8D8D8",
          300: "#BFBFBF",
          700: "#535353",
          800: "#1A1A1A",
        },
        error: {
          50: "#FFA3A3",
          150: "#FF7A7A",
          300: "#FF3D3D",
          500: "#EA0000",
          600: "#BC0000",
        },
      },
    },
  },
  plugins: [require("tailwindcss-font-inter")],
};
