/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            keyframes: {
                "scale-up-center": {
                    "0%": { transform: "scale(0.5)" },
                    "100%": { transform: "scale(1)" },
                },
            },
            animation: {
                "scale-up-center": "scale-up-center 150ms cubic-bezier(0.390, 0.575, 0.565, 1.000)",
            },
        },
    },
    plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
}
