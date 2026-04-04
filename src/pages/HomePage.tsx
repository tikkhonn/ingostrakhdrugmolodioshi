import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Gamepad2,
  Shield,
  BookOpen,
  Zap,
  HeartHandshake,
} from 'lucide-react';
import { MotionButton } from '../components/MotionButton';
import type { PageId } from '../App';
import { motionTransition } from '../theme/theme';

interface HomePageProps {
  setCurrentPage: (page: PageId) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: motionTransition.stagger,
      delayChildren: 0.08,
    },
  },
};

const rise = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.405, 1] as const },
  },
};

function HomePage({ setCurrentPage }: HomePageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto max-w-7xl min-w-0 overflow-x-hidden px-4 pb-16 pt-6 sm:px-6 md:pb-24 md:pt-8 lg:px-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex flex-col gap-12 md:gap-16 lg:gap-20"
      >
        {/* —— Hero —— */}
        <motion.section
          variants={rise}
          className="relative overflow-hidden rounded-[1.5rem] border border-[#0066CC]/15 bg-gradient-to-br from-[#0066CC]/[0.12] via-[var(--card-bg)] to-[#00A3FF]/[0.08] shadow-[0_24px_80px_-20px_rgba(0,102,204,0.35)] dark:border-[#00A3FF]/20 dark:from-[#0066CC]/20 dark:via-[var(--card-bg)] dark:to-[#003366]/40 dark:shadow-[0_28px_90px_-24px_rgba(0,163,255,0.25)] md:rounded-[2rem]"
        >
          {/* Mesh / glow blobs */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.65] dark:opacity-50"
            aria-hidden
          >
            <motion.div
              className="absolute -left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-[#0066CC] blur-[100px] dark:bg-[#0066CC]"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: [0, 40, 0],
                      y: [0, 24, 0],
                      scale: [1, 1.08, 1],
                    }
              }
              transition={
                reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: 'easeInOut' }
              }
            />
            <motion.div
              className="absolute -right-1/4 bottom-0 h-[380px] w-[380px] rounded-full bg-[#00A3FF] blur-[90px] opacity-80 dark:opacity-70"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: [0, -36, 0],
                      y: [0, -28, 0],
                      scale: [1, 1.12, 1],
                    }
              }
              transition={
                reduceMotion ? undefined : { duration: 16, repeat: Infinity, ease: 'easeInOut' }
              }
            />
            <motion.div
              className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[80px] dark:bg-[#00A3FF]/30"
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0.2, 0.45, 0.2], scale: [0.95, 1.05, 0.95] }
              }
              transition={
                reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }
              }
            />
          </div>

          {/* Fine grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,102,204,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,102,204,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)] dark:bg-[linear-gradient(rgba(0,163,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,163,255,0.06)_1px,transparent_1px)]"
            aria-hidden
          />

          {/* Floating icon orbits (decorative) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
            <motion.div
              className="absolute right-[8%] top-[14%] text-[#0066CC]/25 dark:text-[#00A3FF]/30"
              animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 6, 0] }}
              transition={
                reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <Shield className="h-16 w-16 md:h-20 md:w-20" strokeWidth={1.25} />
            </motion.div>
            <motion.div
              className="absolute bottom-[18%] left-[6%] text-[#00A3FF]/20 dark:text-[#00A3FF]/25"
              animate={reduceMotion ? undefined : { y: [0, 14, 0], rotate: [0, -8, 0] }}
              transition={
                reduceMotion ? undefined : { duration: 8.5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <Zap className="h-14 w-14 md:h-16 md:w-16" strokeWidth={1.25} />
            </motion.div>
          </div>

          <div className="relative px-6 py-14 text-center sm:px-10 sm:py-16 md:px-14 md:py-20 lg:py-24">
            {/* Shine sweep (once) */}
            {!reduceMotion ? (
              <motion.div
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                initial={false}
              >
                <motion.div
                  className="absolute -left-1/3 top-0 h-full w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"
                  initial={{ x: '-100%' }}
                  animate={{ x: '400%' }}
                  transition={{ duration: 1.35, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            ) : null}

            <div className="relative mx-auto flex max-w-3xl flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="relative mb-6 inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#0066CC]/25 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066CC] shadow-sm backdrop-blur-md dark:border-[#00A3FF]/35 dark:bg-[#1a1a1a]/75 dark:text-[#00A3FF] md:text-sm"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
                  Обучение
                  <span className="text-ingos-text-secondary/80 dark:text-white/40">·</span>
                  страхование
                </span>
              </motion.div>

              <h1 className="mb-5 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-br from-[#0066CC] via-[#0080e6] to-[#00A3FF] bg-clip-text text-transparent dark:from-[#4d9fff] dark:via-[#00A3FF] dark:to-[#66c2ff]">
                  Страхование
                </span>
                <br />
                <span className="text-ingos-text-primary">для подростков</span>
              </h1>

              <p className="mb-10 max-w-xl text-base leading-relaxed text-ingos-text-secondary md:text-lg md:leading-relaxed">
                Разберись в рисках без занудных лекций: короткая теория и симулятор, где твои решения
                сразу бьются по «кошельку».
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-ingos-border bg-[var(--card-bg)]/90 px-4 py-2 text-sm font-medium text-ingos-text-primary shadow-sm backdrop-blur-sm dark:bg-[#1a1a1a]/80">
                  <BookOpen className="h-4 w-4 text-[#0066CC] dark:text-[#00A3FF]" aria-hidden />
                  Теория + практика
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-ingos-border bg-[var(--card-bg)]/90 px-4 py-2 text-sm font-medium text-ingos-text-primary shadow-sm backdrop-blur-sm dark:bg-[#1a1a1a]/80">
                  <Gamepad2 className="h-4 w-4 text-[#0066CC] dark:text-[#00A3FF]" aria-hidden />
                  Живой симулятор
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* —— Why (hero-style) —— */}
        <motion.section
          variants={rise}
          className="relative -mt-4 overflow-hidden rounded-[1.5rem] border border-[#00A3FF]/15 bg-gradient-to-br from-[#00A3FF]/[0.08] via-[var(--card-bg)] to-[#0066CC]/[0.1] shadow-[0_20px_70px_-24px_rgba(0,163,255,0.28)] dark:border-[#0066CC]/25 dark:from-[#003366]/50 dark:via-[var(--card-bg)] dark:to-[#0066CC]/25 dark:shadow-[0_24px_80px_-28px_rgba(0,102,204,0.35)] md:-mt-6 md:rounded-[2rem]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.55] dark:opacity-45"
            aria-hidden
          >
            <motion.div
              className="absolute -right-1/4 top-0 h-[360px] w-[360px] rounded-full bg-[#00A3FF] blur-[96px] dark:bg-[#00A3FF]"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: [0, -32, 0],
                      y: [0, 20, 0],
                      scale: [1, 1.06, 1],
                    }
              }
              transition={
                reduceMotion ? undefined : { duration: 15, repeat: Infinity, ease: 'easeInOut' }
              }
            />
            <motion.div
              className="absolute -left-1/4 bottom-0 h-[320px] w-[320px] rounded-full bg-[#0066CC] blur-[88px] opacity-70 dark:opacity-60"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: [0, 28, 0],
                      y: [0, -22, 0],
                      scale: [1, 1.1, 1],
                    }
              }
              transition={
                reduceMotion ? undefined : { duration: 17, repeat: Infinity, ease: 'easeInOut' }
              }
            />
            <motion.div
              className="absolute left-[42%] top-[35%] h-[200px] w-[200px] -translate-x-1/2 rounded-full bg-white blur-[72px] dark:bg-[#0066CC]/25"
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0.15, 0.38, 0.15], scale: [0.92, 1.04, 0.92] }
              }
              transition={
                reduceMotion ? undefined : { duration: 11, repeat: Infinity, ease: 'easeInOut' }
              }
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,163,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(0,163,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,black,transparent)] dark:bg-[linear-gradient(rgba(0,102,204,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(0,102,204,0.07)_1px,transparent_1px)]"
            aria-hidden
          />

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
            <motion.div
              className="absolute right-[10%] top-[22%] text-[#0066CC]/20 dark:text-[#00A3FF]/28"
              animate={reduceMotion ? undefined : { y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={
                reduceMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <HeartHandshake className="h-14 w-14 md:h-[4.5rem] md:w-[4.5rem]" strokeWidth={1.2} />
            </motion.div>
            <motion.div
              className="absolute bottom-[20%] left-[8%] text-[#00A3FF]/18 dark:text-[#00A3FF]/22"
              animate={reduceMotion ? undefined : { y: [0, -11, 0], rotate: [0, 7, 0] }}
              transition={
                reduceMotion ? undefined : { duration: 7.5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <Shield className="h-12 w-12 md:h-16 md:w-16" strokeWidth={1.2} />
            </motion.div>
          </div>

          <div className="relative px-6 py-12 text-center sm:px-10 sm:py-14 md:px-14 md:py-16 lg:py-20">
            {!reduceMotion ? (
              <motion.div
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                initial={false}
              >
                <motion.div
                  className="absolute -left-1/3 top-0 h-full w-1/3 skew-x-[-16deg] bg-gradient-to-r from-transparent via-white/18 to-transparent dark:via-white/8"
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '420%' }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            ) : null}

            <div className="relative mx-auto max-w-3xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00A3FF]/25 bg-white/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0066CC] shadow-sm backdrop-blur-md dark:border-[#00A3FF]/35 dark:bg-[#1a1a1a]/72 dark:text-[#00A3FF] md:text-sm"
              >
                <HeartHandshake className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
                Семья
                <span className="text-ingos-text-secondary/70 dark:text-white/35">·</span>
                бюджет
                <span className="text-ingos-text-secondary/70 dark:text-white/35">·</span>
                спокойствие
              </motion.div>

              <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-br from-[#0066CC] via-[#0090f0] to-[#00A3FF] bg-clip-text text-transparent dark:from-[#66b3ff] dark:via-[#00A3FF] dark:to-[#80ccff]">
                  Почему
                </span>{' '}
                <span className="text-ingos-text-primary">это важно?</span>
              </h2>

              <p className="mx-auto max-w-2xl text-base leading-relaxed text-ingos-text-secondary md:text-lg md:leading-relaxed">
                Страхование защищает тебя и близких от непредвиденных расходов. Разобраться в этом сейчас —
                значит увереннее принимать взрослые решения: что покрывает полис, когда он окупается и
                когда разумнее не рисковать.
              </p>
            </div>
          </div>
        </motion.section>

        {/* —— Bento CTAs —— */}
        <motion.div variants={rise} className="grid gap-5 md:grid-cols-12 md:gap-6 lg:gap-8">
          <div className="group relative md:col-span-5">
            <div
              className="absolute -inset-px rounded-card bg-gradient-to-br from-[#0066CC]/40 via-transparent to-[#00A3FF]/30 opacity-60 blur-sm transition duration-500 group-hover:opacity-90 dark:from-[#00A3FF]/30 dark:to-[#0066CC]/25"
              aria-hidden
            />
            <MotionButton
              onClick={() => setCurrentPage('theory')}
              className="relative flex h-full w-full flex-col rounded-card border border-ingos-border bg-ingos-card p-8 text-left shadow-md transition-shadow duration-300 hover:shadow-xl dark:border-[#2e2e32] dark:bg-[#141414] md:p-10"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-muted)] to-transparent text-[#0066CC] ring-1 ring-[#0066CC]/15 dark:text-[#00A3FF] dark:ring-[#00A3FF]/20">
                <Sparkles className="h-9 w-9" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-ingos-text-primary md:text-3xl">Теория</h3>
              <p className="mb-8 flex-1 text-base leading-relaxed text-ingos-text-secondary md:text-lg">
                Основные понятия на простом языке: полис, франшиза, страховой случай и не только.
              </p>
              <div className="flex items-center font-semibold text-[#0066CC] dark:text-[#00A3FF]">
                <span>Начать учиться</span>
                <ArrowRight
                  className="ml-2 h-5 w-5 transition-transform duration-150 ease-out group-hover:translate-x-1.5"
                  aria-hidden
                />
              </div>
            </MotionButton>
          </div>

          <div className="group relative md:col-span-7">
            <div
              className="absolute -inset-0.5 rounded-[14px] bg-gradient-to-br from-[#0066CC] via-[#0088ee] to-[#00A3FF] opacity-90 shadow-lg shadow-[#0066CC]/25 dark:shadow-[#00A3FF]/20"
              aria-hidden
            />
            <MotionButton
              onClick={() => setCurrentPage('simulator')}
              className="relative flex h-full min-h-[280px] w-full flex-col rounded-card bg-gradient-to-br from-[#0066CC] to-[#004a99] p-8 text-left text-white shadow-inner dark:from-[#0070d9] dark:to-[#003366] md:min-h-[320px] md:p-10"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                <Gamepad2 className="h-9 w-9 text-white" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-2xl font-bold md:text-3xl lg:text-4xl">Симулятор рисков</h3>
              <p className="mb-8 max-w-lg flex-1 text-base leading-relaxed text-white/90 md:text-lg">
                Интерактивная игра: решай, страховаться или рискнуть, и смотри, что из этого выйдет — с
                разными сезонами и случайными ситуациями.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center font-semibold text-white">
                  Играть
                  <ArrowRight
                    className="ml-2 h-5 w-5 transition-transform duration-150 ease-out group-hover:translate-x-1.5"
                    aria-hidden
                  />
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20">
                  Случайные сценарии
                </span>
              </div>
            </MotionButton>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HomePage;
