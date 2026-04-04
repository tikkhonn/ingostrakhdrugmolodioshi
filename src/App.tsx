import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import TheoryPage from './pages/TheoryPage';
import SimulatorPage from './pages/SimulatorPage';
import { IngosLogo } from './components/IngosLogo';
import { ThemeToggle } from './components/ThemeToggle';
import { MotionNavButton } from './components/MotionButton';
import { motionTransition } from './theme/theme';

export type PageId = 'home' | 'theory' | 'simulator';

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  return (
    <div className="min-h-screen bg-ingos-page text-ingos-text-primary transition-[background-color,color] duration-300 ease-in-out">
      <header className="sticky top-0 z-50 border-b border-[var(--header-border)] bg-[var(--header-bg)] backdrop-blur-md transition-[background-color,border-color] duration-300 ease-in-out">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <IngosLogo onClick={() => setCurrentPage('home')} />
          <div className="flex items-center gap-2 sm:gap-4">
            <nav
              className="flex items-center gap-1 sm:gap-2"
              aria-label="Основная навигация"
            >
              <MotionNavButton
                onClick={() => setCurrentPage('theory')}
                className={`rounded-btn px-3 py-2 text-sm font-semibold sm:px-4 sm:text-base ${
                  currentPage === 'theory'
                    ? 'bg-[#0066CC] text-white shadow-md'
                    : 'text-ingos-text-primary hover:bg-ingos-secondary hover:text-[#0066CC] dark:hover:bg-[#003366] dark:hover:text-[#00A3FF]'
                }`}
              >
                Теория
              </MotionNavButton>
              <MotionNavButton
                onClick={() => setCurrentPage('simulator')}
                className={`rounded-btn px-3 py-2 text-sm font-semibold sm:px-4 sm:text-base ${
                  currentPage === 'simulator'
                    ? 'bg-[#0066CC] text-white shadow-md'
                    : 'text-ingos-text-primary hover:bg-ingos-secondary hover:text-[#0066CC] dark:hover:bg-[#003366] dark:hover:text-[#00A3FF]'
                }`}
              >
                Симулятор
              </MotionNavButton>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            role="region"
            aria-label={
              currentPage === 'home'
                ? 'Главная страница'
                : currentPage === 'theory'
                  ? 'Теория'
                  : 'Симулятор'
            }
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={motionTransition.page}
            className="will-change-transform"
          >
            {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
            {currentPage === 'theory' && <TheoryPage />}
            {currentPage === 'simulator' && <SimulatorPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
