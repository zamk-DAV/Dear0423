import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dear23 테마 변수 매핑
        primary: 'var(--primary-color)',
        secondary: 'var(--text-secondary)',
        accent: 'var(--accent-color)',
        background: 'var(--bg-color)',
        surface: 'var(--bg-secondary)',
        border: 'var(--border-color)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
