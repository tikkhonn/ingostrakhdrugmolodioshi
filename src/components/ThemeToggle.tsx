import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{
        scale: 1.05,
        boxShadow: isDark
          ? '0 8px 24px rgba(0, 163, 255, 0.2)'
          : '0 8px 24px rgba(0, 102, 204, 0.15)',
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
      }}
      whileTap={{ scale: 0.97 }}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-ingos-secondary text-[#0066CC] shadow-md transition-[box-shadow,background-color,color] duration-[300ms] ease-in-out dark:bg-[#003366] dark:text-[#00A3FF]"
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      aria-pressed={isDark}
    >
      {isDark ? <Sun className="h-5 w-5" strokeWidth={2} /> : <Moon className="h-5 w-5" strokeWidth={2} />}
    </motion.button>
  );
}
