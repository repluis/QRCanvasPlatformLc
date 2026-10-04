/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0f172a',
        'bg-alt': '#1e293b',
        surface: '#1e293b',
        'surface-alt': '#334155',
        primary: '#3b82f6',
        'primary-hover': '#2563eb',
        'primary-light': '#60a5fa',
        accent: '#818cf8',
        'accent-hover': '#6366f1',
        text: '#f8fafc',
        'text-muted': '#94a3b8',
        'text-dim': '#64748b',
        border: '#334155',
        'border-light': '#475569',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#06b6d4',
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
}