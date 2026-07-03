import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-dark-200 bg-white/80 text-dark-600 shadow-sm shadow-dark-200/10 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-600 hover:shadow-primary-200/20 focus:outline-none focus:ring-2 focus:ring-primary-300/40 ${className}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};

export default ThemeToggle;
