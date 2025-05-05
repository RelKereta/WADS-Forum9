/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",        // Ensure it scans your main HTML file
      "./src/**/*.{js,ts,jsx,tsx}", // Include any JS/TS/React files
    ],
    theme: {
      extend: {},  // You can customize styles here
    },
    plugins: [], // You can add plugins later if needed
  };
  