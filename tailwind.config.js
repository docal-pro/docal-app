/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ocr: ["OCR-A-Std", "monospace"],
        ibm: ["IBM Plex Mono", "monospace"],
        sfmono: ["SF-Mono", "monospace"],
        mono: ["SF-Mono", "monospace"],
      },
      letterSpacing: {
        tight: "-0.1em",
        word: "-0.12em",
        truncate: "-0.25em",
      },
      colors: {
        dark: "#080808",
        "dark-card": "rgba(20, 20, 20, 1)",
        "accent-primary": "#D13800",
        "accent-secondary": "#00CC8E",
        "accent-orange": "#FF4D00",
        "accent-steel": "rgb(123, 191, 255)",
        "accent-cement": "rgb(58, 182, 193)",
        scrollbar: "rgb(159, 159, 159)",
      },
    },
  },
  plugins: [],
};
