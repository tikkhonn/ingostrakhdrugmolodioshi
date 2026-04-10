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
        <div className="mx-auto flex min-w-0 max-w-7xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
          <div className="min-w-[128px] shrink-0 sm:min-w-0">
            <IngosLogo onClick={() => setCurrentPage('home')} />
          </div>
          <div className="relative min-w-0 flex-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[var(--header-bg)] to-transparent sm:hidden"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[var(--header-bg)] to-transparent sm:hidden"
            />
            <nav
              className="flex min-w-max items-center gap-1 overflow-x-auto whitespace-nowrap px-2 sm:min-w-0 sm:justify-center sm:gap-2 sm:overflow-visible sm:px-0"
              aria-label="Основная навигация"
            >
              <MotionNavButton
                onClick={() => setCurrentPage('theory')}
                className={`shrink-0 rounded-btn px-2.5 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-base ${
                  currentPage === 'theory'
                    ? 'bg-[#0066CC] text-white shadow-md'
                    : 'text-ingos-text-primary hover:bg-ingos-secondary hover:text-[#0066CC] dark:hover:bg-[#003366] dark:hover:text-[#00A3FF]'
                }`}
              >
                Теория
              </MotionNavButton>
              <MotionNavButton
                onClick={() => setCurrentPage('simulator')}
                className={`shrink-0 rounded-btn px-2.5 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-base ${
                  currentPage === 'simulator'
                    ? 'bg-[#0066CC] text-white shadow-md'
                    : 'text-ingos-text-primary hover:bg-ingos-secondary hover:text-[#0066CC] dark:hover:bg-[#003366] dark:hover:text-[#00A3FF]'
                }`}
              >
                Игра
              </MotionNavButton>
              <MotionNavButton
                onClick={() => setCurrentPage('personal')}
                className={`shrink-0 rounded-btn px-2.5 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-base ${
                  currentPage === 'personal'
                    ? 'bg-[#0066CC] text-white shadow-md'
                    : 'text-ingos-text-primary hover:bg-ingos-secondary hover:text-[#0066CC] dark:hover:bg-[#003366] dark:hover:text-[#00A3FF]'
                }`}
              >
                Личный разбор
              </MotionNavButton>
              <MotionNavButton
                onClick={() => setCurrentPage('support')}
                className={`shrink-0 rounded-btn px-2.5 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-base ${
                  currentPage === 'support'
                    ? 'bg-[#0066CC] text-white shadow-md'
                    : 'text-ingos-text-primary hover:bg-ingos-secondary hover:text-[#0066CC] dark:hover:bg-[#003366] dark:hover:text-[#00A3FF]'
                }`}
              >
                Техподдержка
              </MotionNavButton>
            </nav>
          </div>
          <div className="shrink-0">
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
