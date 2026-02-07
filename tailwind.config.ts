import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                sarang: {
                    pink: '#FFB7B2',
                    lightPink: '#FFDAC1',
                    teal: '#B5EAD7',
                    lavender: '#E2F0CB',
                    cream: '#FFF9C4',
                    text: '#555555'
                }
            }
        },
    },
    plugins: [],
};
export default config;
