import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  Sparkles,
  Trophy,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { MotionButton } from '../components/MotionButton';
import { motionTransition } from '../theme/theme';
import { theoryConcepts, type Concept } from '../data/theoryConcepts';
import { theoryQuizQuestions } from '../data/theoryQuiz';
import { useTheoryProgress } from '../hooks/useTheoryProgress';

type ViewTab = 'learn' | 'quiz';

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: motionTransition.stagger, delayChildren: 0.04 },
  },
};

const cardAppear = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const QUIZ_TOTAL = theoryQuizQuestions.length;

function ProgressRing({
  fraction,
  label,
  detail,
  accentClass,
}: {
  fraction: number;
  label: string;
  detail: string;
  accentClass: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="flex items-center gap-4 rounded-card border border-ingos-border bg-[var(--card-bg)]/80 p-4 shadow-sm backdrop-blur-sm dark:bg-[#141414]/80 md:p-5">
      <div className="relative h-[84px] w-[84px] shrink-0">
        <svg width="84" height="84" className="-rotate-90" aria-hidden>
          <circle
            cx="42"
            cy="42"
            r={r}
            fill="none"
            className="stroke-ingos-border"
            strokeWidth="7"
          />
          <motion.circle
            cx="42"
            cy="42"
            r={r}
            fill="none"
            className={accentClass}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold tabular-nums text-ingos-text-primary">
          {pct}%
        </span>
      </div>
      <div className="min-w-0 text-left">
        <p className="text-sm font-semibold text-ingos-text-primary md:text-base">{label}</p>
        <p className="mt-1 text-xs leading-snug text-ingos-text-secondary md:text-sm">{detail}</p>
      </div>
    </div>
  );
}

function TheoryPage() {
  const reduceMotion = useReducedMotion();
  const progress = useTheoryProgress();
  const [tab, setTab] = useState<ViewTab>('learn');
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

  const [quizPhase, setQuizPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [qIndex, setQIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const quizTallyRef = useRef(0);

  const studiedFraction =
    theoryConcepts.length > 0 ? progress.completedConceptIds.length / theoryConcepts.length : 0;
  const bestQuiz = progress.quizBestFraction ?? 0;

  const startQuiz = useCallback(() => {
    quizTallyRef.current = 0;
    setQuizPhase('running');
    setQIndex(0);
    setQuizScore(0);
    setPicked(null);
  }, []);

  const pickOption = (idx: number) => {
    if (picked !== null || quizPhase !== 'running') return;
    setPicked(idx);
    if (idx === theoryQuizQuestions[qIndex].correctIndex) {
      quizTallyRef.current += 1;
      setQuizScore(quizTallyRef.current);
    }
  };

  const goNextQuestion = () => {
    if (picked === null) return;
    if (qIndex >= QUIZ_TOTAL - 1) {
      progress.recordQuizResult(quizTallyRef.current, QUIZ_TOTAL);
      setQuizPhase('done');
      return;
    }
    setQIndex((i) => i + 1);
    setPicked(null);
  };

  const retryQuiz = () => {
    quizTallyRef.current = 0;
    setQuizPhase('idle');
    setQIndex(0);
    setQuizScore(0);
    setPicked(null);
  };

  const currentQ = theoryQuizQuestions[qIndex];
  const isCorrectPick = picked !== null && picked === currentQ?.correctIndex;
  const quizBarPct = quizPhase === 'running' ? ((qIndex + (picked !== null ? 1 : 0)) / QUIZ_TOTAL) * 100 : 0;

  return (
    <div className="mx-auto max-w-7xl min-w-0 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={motionTransition.page}
        className="relative mb-10 overflow-hidden rounded-[1.5rem] border border-[#0066CC]/15 bg-gradient-to-br from-[#0066CC]/[0.1] via-[var(--card-bg)] to-[#00A3FF]/[0.08] p-8 shadow-[0_20px_60px_-24px_rgba(0,102,204,0.3)] dark:border-[#00A3FF]/20 dark:from-[#0066CC]/18 dark:to-[#003366]/35 md:mb-12 md:rounded-[2rem] md:p-10 lg:p-12"
      >
        {!reduceMotion ? (
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#0066CC]/20 blur-3xl dark:bg-[#00A3FF]/15" />
        ) : null}
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0066CC]/25 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#0066CC] backdrop-blur dark:border-[#00A3FF]/35 dark:bg-[#1a1a1a]/75 dark:text-[#00A3FF]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Мини-курс
            </div>
            <h1 className="mb-3 text-3xl font-extrabold leading-tight text-ingos-text-primary md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-[#0066CC] to-[#00A3FF] bg-clip-text text-transparent dark:from-[#66b3ff] dark:to-[#00A3FF]">
                Теория
              </span>{' '}
              страхования
            </h1>
            <p className="text-base leading-relaxed text-ingos-text-secondary md:text-lg">
              Карточки с терминами, отметки «изучено» и тест из {QUIZ_TOTAL} вопросов — прогресс
              сохраняется в браузере.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-md">
            <ProgressRing
              fraction={studiedFraction}
              label="Карточки"
              detail={`${progress.completedConceptIds.length} из ${theoryConcepts.length} отмечено`}
              accentClass="stroke-[#0066CC] dark:stroke-[#00A3FF]"
            />
            <ProgressRing
              fraction={bestQuiz}
              label="Лучший тест"
              detail={
                progress.quizBestFraction == null
                  ? 'Ещё не проходили'
                  : `${Math.round(progress.quizBestFraction * 100)}% — можно улучшить!`
              }
              accentClass="stroke-emerald-500 dark:stroke-emerald-400"
            />
          </div>
        </div>
      </motion.section>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10">
        <MotionButton
          onClick={() => setTab('learn')}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold md:px-6 md:text-base ${
            tab === 'learn'
              ? 'bg-[#0066CC] text-white shadow-lg dark:bg-[#0066CC]'
              : 'bg-ingos-secondary text-[#0066CC] dark:bg-[#003366] dark:text-[#00A3FF]'
          }`}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 md:h-5 md:w-5" aria-hidden />
            Учебник
          </span>
        </MotionButton>
        <MotionButton
          onClick={() => setTab('quiz')}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold md:px-6 md:text-base ${
            tab === 'quiz'
              ? 'bg-[#0066CC] text-white shadow-lg dark:bg-[#0066CC]'
              : 'bg-ingos-secondary text-[#0066CC] dark:bg-[#003366] dark:text-[#00A3FF]'
          }`}
        >
          <span className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 md:h-5 md:w-5" aria-hidden />
            Проверка знаний
          </span>
        </MotionButton>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'learn' && (
          <motion.div
            key="learn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionTransition.page}
          >
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-ingos-text-primary md:text-3xl">
                Основные понятия
              </h2>
              <p className="text-ingos-text-secondary md:text-lg">
                Открой карточку, прочитай и отметь «изучено» — так курс заполняется до 100%.
              </p>
            </div>

            <motion.div
              variants={gridContainer}
              initial="hidden"
              animate="show"
              className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            >
              {theoryConcepts.map((concept) => {
                const done = progress.completedConceptIds.includes(concept.id);
                return (
                  <motion.div key={concept.id} variants={cardAppear}>
                    <MotionButton
                      onClick={() => setSelectedConcept(concept)}
                      className="group relative h-full w-full overflow-hidden rounded-card border border-ingos-border bg-ingos-card p-6 text-left shadow-sm md:p-7"
                    >
                      {done ? (
                        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-5 w-5" aria-hidden />
                        </span>
                      ) : null}
                      <h3 className="mb-2 pr-10 text-xl font-bold text-ingos-text-primary transition-colors group-hover:text-[#0066CC] dark:group-hover:text-[#00A3FF]">
                        {concept.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-ingos-text-secondary md:text-base">
                        {concept.shortDescription}
                      </p>
                      <div className="mt-4 text-sm font-semibold text-[#0066CC] dark:text-[#00A3FF]">
                        {done ? 'Повторить →' : 'Узнать больше →'}
                      </div>
                    </MotionButton>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {tab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionTransition.page}
            className="mx-auto max-w-3xl min-w-0"
          >
            {quizPhase === 'idle' && (
              <div className="overflow-hidden rounded-[1.25rem] border border-ingos-border bg-gradient-to-br from-[var(--card-bg)] to-[var(--accent-muted)] p-8 shadow-lg dark:from-[#141414] dark:to-[#003366]/25 md:p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0066CC]/15 text-[#0066CC] dark:bg-[#00A3FF]/15 dark:text-[#00A3FF]">
                  <ClipboardCheck className="h-8 w-8" strokeWidth={2} />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-ingos-text-primary md:text-3xl">
                  Тест на закрепление
                </h2>
                <p className="mb-8 text-ingos-text-secondary md:text-lg">
                  {QUIZ_TOTAL} вопросов с разбором ответа после каждого шага. Результат и лучший счёт
                  сохраняются автоматически.
                </p>
                {progress.lastQuizAt ? (
                  <p className="mb-6 rounded-card border border-ingos-border bg-ingos-card/80 px-4 py-3 text-sm text-ingos-text-secondary">
                    Последний раз:{' '}
                    <span className="font-semibold text-ingos-text-primary">
                      {progress.lastQuizCorrect}/{progress.lastQuizTotal}
                    </span>{' '}
                    ·{' '}
                    {new Date(progress.lastQuizAt).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                ) : null}
                <MotionButton
                  onClick={startQuiz}
                  className="w-full rounded-btn bg-[#0066CC] py-4 text-base font-bold text-white shadow-md md:text-lg"
                >
                  Начать тест
                </MotionButton>
              </div>
            )}

            {quizPhase === 'running' && currentQ && (
              <div className="overflow-hidden rounded-[1.25rem] border border-[#0066CC]/20 bg-ingos-card shadow-xl dark:border-[#00A3FF]/25">
                <div className="h-1.5 w-full bg-ingos-border">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#0066CC] to-[#00A3FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${quizBarPct}%` }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <div className="p-6 md:p-10">
                  <p className="mb-2 text-sm font-medium text-ingos-text-secondary">
                    Вопрос {qIndex + 1} из {QUIZ_TOTAL}
                  </p>
                  <h2 className="mb-8 text-xl font-bold leading-snug text-ingos-text-primary md:text-2xl">
                    {currentQ.question}
                  </h2>
                  <ul className="mb-8 flex flex-col gap-3">
                    {currentQ.options.map((opt, idx) => {
                      const selected = picked === idx;
                      const show = picked !== null;
                      const isRight = idx === currentQ.correctIndex;
                      let btnClass =
                        'w-full rounded-card border-2 px-4 py-3.5 text-left text-base font-medium transition-colors md:py-4 md:text-lg ';
                      if (!show) {
                        btnClass +=
                          'border-ingos-border bg-[var(--card-bg)] text-ingos-text-primary hover:border-[#0066CC]/40 dark:hover:border-[#00A3FF]/40';
                      } else if (isRight) {
                        btnClass += 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100';
                      } else if (selected && !isRight) {
                        btnClass += 'border-red-400 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100';
                      } else {
                        btnClass += 'border-ingos-border/60 opacity-60';
                      }
                      return (
                        <li key={idx}>
                          <motion.button
                            type="button"
                            disabled={picked !== null}
                            onClick={() => pickOption(idx)}
                            whileHover={picked === null ? { scale: 1.01 } : undefined}
                            whileTap={picked === null ? { scale: 0.99 } : undefined}
                            className={btnClass}
                          >
                            {opt}
                          </motion.button>
                        </li>
                      );
                    })}
                  </ul>

                  <AnimatePresence>
                    {picked !== null ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0 }}
                        className="mb-8 overflow-hidden rounded-card border border-ingos-border bg-[var(--accent-muted)] p-4 dark:border-[#003366]/50"
                      >
                        <p className="text-sm font-semibold text-ingos-text-primary md:text-base">
                          {isCorrectPick ? '✓ Верно.' : '✗ Неверно.'}{' '}
                          <span className="font-normal text-ingos-text-secondary">
                            {currentQ.explanation}
                          </span>
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <MotionButton
                    onClick={goNextQuestion}
                    disabled={picked === null}
                    className="flex w-full items-center justify-center gap-2 rounded-btn bg-[#0066CC] py-3.5 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {qIndex >= QUIZ_TOTAL - 1 ? 'Увидеть результат' : 'Следующий вопрос'}
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </MotionButton>
                </div>
              </div>
            )}

            {quizPhase === 'done' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden rounded-[1.25rem] border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/90 to-[var(--card-bg)] p-8 text-center shadow-xl dark:from-emerald-950/40 dark:to-[#141414] md:p-12"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Trophy className="h-10 w-10" strokeWidth={2} />
                </div>
                <h2 className="mb-2 text-2xl font-extrabold text-ingos-text-primary md:text-3xl">
                  Готово!
                </h2>
                <p className="mb-2 text-4xl font-black tabular-nums text-[#0066CC] dark:text-[#00A3FF] md:text-5xl">
                  {Math.round((quizScore / QUIZ_TOTAL) * 100)}%
                </p>
                <p className="mb-8 text-ingos-text-secondary md:text-lg">
                  Правильных ответов:{' '}
                  <span className="font-semibold text-ingos-text-primary">
                    {quizScore} из {QUIZ_TOTAL}
                  </span>
                </p>
                {quizScore < QUIZ_TOTAL ? (
                  <p className="mb-8 text-sm text-ingos-text-secondary">
                    Перечитай карточки по темам, где ошибся, и попробуй снова — лучший результат уже в
                    шапке страницы.
                  </p>
                ) : (
                  <p className="mb-8 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Идеально! Ты уверенно разбираешься в базовых понятиях.
                  </p>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <MotionButton
                    onClick={retryQuiz}
                    className="inline-flex items-center justify-center gap-2 rounded-btn bg-[#0066CC] px-6 py-3 font-bold text-white"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden />
                    Пройти ещё раз
                  </MotionButton>
                  <MotionButton
                    onClick={() => {
                      retryQuiz();
                      setTab('learn');
                    }}
                    className="rounded-btn bg-ingos-secondary px-6 py-3 font-bold text-[#0066CC] dark:bg-[#003366] dark:text-[#00A3FF]"
                  >
                    К карточкам
                  </MotionButton>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {selectedConcept && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="concept-dialog-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-backdrop)] p-4 backdrop-blur-[2px]"
            onClick={() => setSelectedConcept(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card border border-ingos-border bg-ingos-card p-6 shadow-2xl md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <h2
                  id="concept-dialog-title"
                  className="text-2xl font-bold text-ingos-text-primary md:text-3xl lg:text-4xl"
                >
                  {selectedConcept.title}
                </h2>
                <MotionButton
                  onClick={() => setSelectedConcept(null)}
                  className="shrink-0 rounded-btn bg-ingos-secondary p-2 text-[#0066CC] dark:bg-[#003366] dark:text-[#00A3FF]"
                  aria-label="Закрыть"
                >
                  <X className="h-6 w-6" />
                </MotionButton>
              </div>

              <label className="mb-8 flex cursor-pointer items-start gap-3 rounded-card border border-ingos-border bg-[var(--accent-muted)] p-4 dark:border-[#003366]/40">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 shrink-0 rounded border-ingos-border text-[#0066CC] focus:ring-[#0066CC]"
                  checked={progress.completedConceptIds.includes(selectedConcept.id)}
                  onChange={() => progress.toggleConceptComplete(selectedConcept.id)}
                />
                <span>
                  <span className="font-semibold text-ingos-text-primary">Изучено</span>
                  <span className="mt-1 block text-sm text-ingos-text-secondary">
                    Отметь, когда прочитал(а) определение и пример — прогресс курса обновится.
                  </span>
                </span>
              </label>

              <div className="mb-8">
                <h3 className="mb-2 text-base font-semibold text-ingos-text-primary">Определение</h3>
                <p className="text-lg leading-relaxed text-ingos-text-secondary">
                  {selectedConcept.fullDescription}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-ingos-text-primary">
                  Пример из жизни
                </h3>
                <div className="rounded-card border-l-4 border-[#0066CC] bg-[var(--accent-muted)] p-4 dark:border-[#00A3FF]">
                  <p className="leading-relaxed text-ingos-text-primary">
                    {selectedConcept.example}
                  </p>
                </div>
              </div>

              <MotionButton
                onClick={() => setSelectedConcept(null)}
                className="mt-8 w-full rounded-btn bg-[#0066CC] py-3 text-base font-semibold text-white shadow-md hover:bg-[#0052a3]"
              >
                Закрыть
              </MotionButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-12 text-center text-xs text-ingos-text-secondary">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Сбросить весь прогресс теории и тестов на этом устройстве?')) {
              progress.resetProgress();
              retryQuiz();
              setTab('learn');
            }
          }}
          className="underline decoration-ingos-border underline-offset-2 hover:text-[#0066CC] dark:hover:text-[#00A3FF]"
        >
          Сбросить прогресс
        </button>
      </p>
    </div>
  );
}

export default TheoryPage;
