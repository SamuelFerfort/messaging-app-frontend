/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "whatsapp-green": "#25D366",
        "whatsapp-teal": "#128C7E",
      },
    },
  },
  plugins: [],
};
