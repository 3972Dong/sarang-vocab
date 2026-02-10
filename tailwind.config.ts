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
                brand: {
                    primary: '#111827', // Gray 900
                    secondary: '#6b7280', // Gray 500
                    accent: '#4f46e5', // Indigo 600
                    accentHover: '#4338ca', // Indigo 700
                    background: '#f9fafb', // Gray 50
                    surface: '#ffffff',
                    border: '#e5e7eb', // Gray 200
                }
            }
        },
    },
    plugins: [],
};
export default config;
