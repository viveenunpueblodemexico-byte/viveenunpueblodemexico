// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spinReverse: { to: { transform: "rotate(-360deg)" } },
        spinFast: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "spin-reverse": "spinReverse 3s linear infinite",
        "spin-fast": "spinFast 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};
