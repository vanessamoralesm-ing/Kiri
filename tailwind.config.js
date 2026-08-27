/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'nunito-medium': ['Nunito-Medium'],
        'nunito-semibold': ['Nunito-SemiBold'],
        'nunito-bold': ['Nunito-Bold'],
      },
    },
  },
  plugins: [],
};
