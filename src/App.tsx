import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import TheoryPage from './pages/TheoryPage';
import SimulatorPage from './pages/SimulatorPage';
import PersonalCasePage from './pages/PersonalCasePage';
import SupportPage from './pages/SupportPage';
import { IngosLogo } from './components/IngosLogo';
import { ThemeToggle } from './components/ThemeToggle';
import { MotionNavButton } from './components/MotionButton';
import { motionTransition } from './theme/theme';

export type PageId = 'home' | 'theory' | 'simulator' | 'personal' | 'support';

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  return (
    <div className="relative min-h-screen min-h-dvh w-full max-w-[100%] overflow-x-hidden bg-ingos-page text-ingos-text-primary transition-[background-color,color] duration-300 ease-in-out">
      <header className="sticky top-0 z-50 border-b border-[var(--header-border)] bg-[var(--header-bg)] pt-[env(safe-area-inset-top,0px)] backdrop-blur-md transition-[background-color,border-color] duration-300 ease-in-out">
        <div className="mx-auto flex min-w-0 max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
          <div className="min-w-0 shrink">
            <IngosLogo onClick={() => setCurrentPage('home')} />
          </div>
          <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-4">
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
              <MotionNavButton
                onClick={() => setCurrentPage('personal')}
                className={`rounded-btn px-3 py-2 text-sm font-semibold sm:px-4 sm:text-base ${
                  currentPage === 'personal'
                    ? 'bg-[#0066CC] text-white shadow-md'
                    : 'text-ingos-text-primary hover:bg-ingos-secondary hover:text-[#0066CC] dark:hover:bg-[#003366] dark:hover:text-[#00A3FF]'
                }`}
              >
                Личный разбор
              </MotionNavButton>
              <MotionNavButton
                onClick={() => setCurrentPage('support')}
                className={`rounded-btn px-3 py-2 text-sm font-semibold sm:px-4 sm:text-base ${
                  currentPage === 'support'
                    ? 'bg-[#0066CC] text-white shadow-md'
                    : 'text-ingos-text-primary hover:bg-ingos-secondary hover:text-[#0066CC] dark:hover:bg-[#003366] dark:hover:text-[#00A3FF]'
                }`}
              >
                Техподдержка
              </MotionNavButton>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative min-w-0 overflow-x-hidden pb-[env(safe-area-inset-bottom,0px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            role="region"
            aria-label={
              currentPage === 'home'
                ? 'Главная страница'
                : currentPage === 'theory'
                  ? 'Теория'
                  : currentPage === 'simulator'
                    ? 'Симулятор'
                    : currentPage === 'personal'
                      ? 'Личный разбор'
                      : 'Техподдержка'
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionTransition.page}
            className="will-change-[opacity]"
          >
            {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
            {currentPage === 'theory' && <TheoryPage />}
            {currentPage === 'simulator' && <SimulatorPage />}
            {currentPage === 'personal' && <PersonalCasePage />}
            {currentPage === 'support' && <SupportPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
