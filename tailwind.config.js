/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx, css, cjs}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'dark-mode': '#1f2937',
                'dark-text': '#f3f4f6',
                'dark-border': '#374151',
            }
        },
    },
    plugins: [],
}
