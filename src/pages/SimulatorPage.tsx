import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Snowflake,
  Sun,
  Leaf,
  Cloud,
  Wallet,
  Shield,
  AlertTriangle,
  RotateCcw,
  BarChart3,
} from 'lucide-react';
import { MotionButton } from '../components/MotionButton';
import { motionTransition } from '../theme/theme';
import { AutumnEffect, SnowEffect, SpringEffect } from '../components/season-effects';
import { seasonCasePools, type SeasonKey } from '../data/simulatorSeasonCases';

const ROUNDS_PER_CYCLE = 12;

interface GameState {
  walletBalance: number;
  currentPhase: 'season' | 'scenario' | 'outcome' | 'cycle_summary' | 'game_over';
  selectedSeason: string | null;
  insuranceBought: boolean;
  scenario: ScenarioData | null;
  outcome: OutcomeData | null;
  roundsPlayed: number;
  totalSaved: number;
  roundInCurrentCycle: number;
  cycleRounds: RoundRecord[];
  scenarioNonce: number;
}

interface ScenarioData {
  season: string;
  caseTitle: string;
  text: string;
  insuranceCost: number;
  accidentCost: number;
  badLuckChance: number;
}

interface OutcomeData {
  badLuckOccurred: boolean;
  wasInsured: boolean;
  message: string;
  explanation: string;
  moneySaved?: number;
  moneyLost?: number;
}

interface RoundRecord {
  roundInCycle: number;
  seasonKey: string;
  seasonName: string;
  caseTitle: string;
  insured: boolean;
  badLuckOccurred: boolean;
  balanceBefore: number;
  balanceAfter: number;
  premiumPaid: number;
  accidentCost: number;
  insuranceCost: number;
}

const seasonNames: Record<SeasonKey, string> = {
  winter: 'Зима',
  spring: 'Весна',
  summer: 'Лето',
  autumn: 'Осень',
};

const seasonIcons = {
  winter: <Snowflake className="h-16 w-16" strokeWidth={1.75} />,
  spring: <Cloud className="h-16 w-16" strokeWidth={1.75} />,
  summer: <Sun className="h-16 w-16" strokeWidth={1.75} />,
  autumn: <Leaf className="h-16 w-16" strokeWidth={1.75} />,
};

function pickRandomScenario(seasonKey: string): ScenarioData {
  const key = seasonKey as SeasonKey;
  const pool = seasonCasePools[key];
  const template = pool[Math.floor(Math.random() * pool.length)];
  return {
    season: seasonNames[key],
    caseTitle: template.caseTitle,
    text: template.text,
    insuranceCost: template.insuranceCost,
    accidentCost: template.accidentCost,
    badLuckChance: template.badLuckChance,
  };
}

const phaseVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
};

function buildOutcome(
  scenario: ScenarioData,
  badLuckOccurred: boolean,
  buyInsurance: boolean,
): OutcomeData {
  if (badLuckOccurred) {
    if (buyInsurance) {
      const moneySaved = scenario.accidentCost - scenario.insuranceCost;
      return {
        badLuckOccurred: true,
        wasInsured: true,
        message: '✅ Инцидент случился — но полис сработал',
        explanation:
          `Ситуация «${scenario.caseTitle}» (${scenario.season.toLowerCase()}): срочная помощь, ремонт или лечение в сумме обошлись бы в ${scenario.accidentCost.toLocaleString('ru-RU')}₽. ` +
          `Вы заранее оформили страховку за ${scenario.insuranceCost.toLocaleString('ru-RU')}₽, поэтому критичные расходы были покрыты полисом. ` +
          `По сравнению с полной оплатой из кармана вы выиграли ${moneySaved.toLocaleString('ru-RU')}₽.`,
        moneySaved,
      };
    }
    return {
      badLuckOccurred: true,
      wasInsured: false,
      message: '❌ Инцидент без страховки — полный счёт на вас',
      explanation:
        `«${scenario.caseTitle}» (${scenario.season.toLowerCase()}): ущерб и расходы составили ${scenario.accidentCost.toLocaleString('ru-RU')}₽. ` +
        `Страховки не было — всю сумму пришлось бы нести самостоятельно. ` +
        `Именно здесь полис обычно и окупается: небольшая премия заранее подменяет один крупный непредвиденный платёж.`,
      moneyLost: scenario.accidentCost,
    };
  }
  if (buyInsurance) {
    return {
      badLuckOccurred: false,
      wasInsured: true,
      message: '✨ Обошлось без инцидента — премия «просто так»?',
      explanation:
        `«${scenario.caseTitle}» (${scenario.season.toLowerCase()}): всё обошлось, страховой случай не наступил. ` +
        `Вы заплатили ${scenario.insuranceCost.toLocaleString('ru-RU')}₽ за полис, но воспользоваться им не пришлось — так и бывает: премия это плата за снижение риска, а не «вклад с возвратом». ` +
        `В одном раунде это выглядит как трата, в долгую же вы ограничили возможный ущерб заранее.`,
      moneyLost: scenario.insuranceCost,
    };
  }
  return {
    badLuckOccurred: false,
    wasInsured: false,
    message: '🎉 В этот раз повезло — и без полиса',
    explanation:
      `«${scenario.caseTitle}» (${scenario.season.toLowerCase()}): вы обошлись без страховки и без инцидента — бюджет цел, премию не платили. ` +
      `При высоком риске в похожих ситуациях такой исход — скорее удача, чем правило: если повторять отказ от защиты снова и снова, рано или поздно неприятности накапливаются в один дорогой счёт.`,
  };
}

function summarizeCycleInsights(rounds: RoundRecord[]): string[] {
  const tips: string[] = [];
  if (rounds.length === 0) return tips;

  const uninsuredWithBadLuck = rounds.filter((r) => r.badLuckOccurred && !r.insured);
  if (uninsuredWithBadLuck.length > 0) {
    const nums = uninsuredWithBadLuck.map((r) => r.roundInCycle).join(', ');
    tips.push(
      `В раундах ${nums} случился инцидент без страховки — там покупка полиса могла бы перекрыть основные расходы и сохранить баланс.`,
    );
  }

  const insuredNoIncident = rounds.filter((r) => r.insured && !r.badLuckOccurred);
  if (insuredNoIncident.length >= 6) {
    tips.push(
      `Вы купили страховку ${insuredNoIncident.length} раз без инцидента — это цена спокойствия. Имеет смысл осмысленно выбирать ситуации с самым высоким для вас риском, а не страховаться всегда подряд «на всякий случай» без приоритетов.`,
    );
  }

  const insuredWithIncident = rounds.filter((r) => r.insured && r.badLuckOccurred);
  if (insuredWithIncident.length > 0) {
    tips.push(
      `В ${insuredWithIncident.length} раунде(ах) полис окупился: при инциденте страховка сработала так, как задумано — это хороший аргумент не пренебрегать защитой в опасных сценариях.`,
    );
  }

  const neverInsured = rounds.every((r) => !r.insured);
  if (neverInsured && rounds.some((r) => r.badLuckOccurred)) {
    tips.push(
      'Вы ни разу не брали страховку и хотя бы раз попали в инцидент — в реальной жизни смешение «всегда рисковать» и «иногда страховаться» обычно выгоднее крайностей.',
    );
  }

  const alwaysInsured = rounds.every((r) => r.insured);
  if (alwaysInsured && rounds.some((r) => !r.badLuckOccurred)) {
    tips.push(
      'Вы страховались в каждом раунде — максимальная защита, но суммарные премии заметны. Подумайте, в каких ситуациях риск для вас приемлем без полиса, чтобы сбалансировать траты.',
    );
  }

  if (tips.length === 0) {
    tips.push(
      'Сравните раунды с полисом и без: там, где был инцидент, страховка резко меняет итог по деньгам и нервам — это ядро идеи страхования от непредвиденных расходов.',
    );
  }
  return tips;
}

function SimulatorPage() {
  const [gameState, setGameState] = useState<GameState>({
    walletBalance: 10000,
    currentPhase: 'season',
    selectedSeason: null,
    insuranceBought: false,
    scenario: null,
    outcome: null,
    roundsPlayed: 0,
    totalSaved: 0,
    roundInCurrentCycle: 0,
    cycleRounds: [],
    scenarioNonce: 0,
  });

  const effectsStorageKey = 'ingosstrakh-effects-enabled';
  const [prefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [effectsEnabled, setEffectsEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = localStorage.getItem(effectsStorageKey);
      if (saved === 'false') return false;
      if (saved === 'true') return true;
      return true;
    } catch {
      return true;
    }
  });

  const effectsIntensity = prefersReducedMotion ? 0.85 : 1;

  useEffect(() => {
    try {
      localStorage.setItem(effectsStorageKey, String(effectsEnabled));
    } catch {
      // ignore
    }
  }, [effectsEnabled]);

  const handleSeasonSelect = (season: string) => {
    const scenario = pickRandomScenario(season);
    setGameState({
      ...gameState,
      selectedSeason: season,
      scenario,
      currentPhase: 'scenario',
      scenarioNonce: gameState.scenarioNonce + 1,
    });
  };

  const handleInsuranceDecision = (buyInsurance: boolean) => {
    const scenario = gameState.scenario;
    if (!scenario) return;

    const balanceBefore = gameState.walletBalance;
    let newBalance = gameState.walletBalance;
    if (buyInsurance) {
      newBalance -= scenario.insuranceCost;
    }

    const badLuckOccurred = Math.random() * 100 < scenario.badLuckChance;
    const outcome = buildOutcome(scenario, badLuckOccurred, buyInsurance);

    if (badLuckOccurred) {
      if (buyInsurance) {
        newBalance += scenario.accidentCost;
      } else {
        newBalance -= scenario.accidentCost;
      }
    }

    newBalance = Math.max(0, newBalance);
    const premiumPaid = buyInsurance ? scenario.insuranceCost : 0;

    const roundInCycle = gameState.roundInCurrentCycle + 1;
    const record: RoundRecord = {
      roundInCycle,
      seasonKey: gameState.selectedSeason ?? '',
      seasonName: scenario.season,
      caseTitle: scenario.caseTitle,
      insured: buyInsurance,
      badLuckOccurred,
      balanceBefore,
      balanceAfter: newBalance,
      premiumPaid,
      accidentCost: scenario.accidentCost,
      insuranceCost: scenario.insuranceCost,
    };

    const cycleRounds = [...gameState.cycleRounds, record];
    const bankrupt = newBalance === 0;

    setGameState({
      ...gameState,
      walletBalance: newBalance,
      insuranceBought: buyInsurance,
      outcome,
      currentPhase: bankrupt ? 'game_over' : 'outcome',
      roundsPlayed: gameState.roundsPlayed + 1,
      totalSaved: gameState.totalSaved + (outcome.moneySaved || 0),
      roundInCurrentCycle: roundInCycle,
      cycleRounds,
    });
  };

  const goNextRound = () => {
    setGameState({
      ...gameState,
      currentPhase: 'season',
      selectedSeason: null,
      insuranceBought: false,
      scenario: null,
      outcome: null,
    });
  };

  const goToCycleSummary = () => {
    setGameState({
      ...gameState,
      currentPhase: 'cycle_summary',
      selectedSeason: null,
      insuranceBought: false,
      scenario: null,
      outcome: null,
    });
  };

  const startNewCycleAfterSummary = () => {
    setGameState({
      ...gameState,
      currentPhase: 'season',
      selectedSeason: null,
      insuranceBought: false,
      scenario: null,
      outcome: null,
      roundInCurrentCycle: 0,
      cycleRounds: [],
    });
  };

  const resetGame = () => {
    setGameState({
      walletBalance: 10000,
      currentPhase: 'season',
      selectedSeason: null,
      insuranceBought: false,
      scenario: null,
      outcome: null,
      roundsPlayed: 0,
      totalSaved: 0,
      roundInCurrentCycle: 0,
      cycleRounds: [],
      scenarioNonce: 0,
    });
  };

  const cycleComplete =
    gameState.roundInCurrentCycle >= ROUNDS_PER_CYCLE && gameState.walletBalance > 0;
  const insights = summarizeCycleInsights(gameState.cycleRounds);

  const totalPremiums = gameState.cycleRounds.reduce((s, r) => s + r.premiumPaid, 0);
  const incidents = gameState.cycleRounds.filter((r) => r.badLuckOccurred).length;
  const uninsuredLoss = gameState.cycleRounds
    .filter((r) => r.badLuckOccurred && !r.insured)
    .reduce((s, r) => s + r.accidentCost, 0);
  const savedByInsurance = gameState.cycleRounds
    .filter((r) => r.badLuckOccurred && r.insured)
    .reduce((s, r) => s + (r.accidentCost - r.insuranceCost), 0);

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <AnimatePresence>
        {effectsEnabled && gameState.currentPhase === 'scenario' && gameState.selectedSeason && (
          <motion.div
            key={gameState.selectedSeason}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {gameState.selectedSeason === 'winter' && (
              <SnowEffect intensity={effectsIntensity} />
            )}
            {gameState.selectedSeason === 'spring' && (
              <SpringEffect intensity={effectsIntensity} />
            )}
            {gameState.selectedSeason === 'autumn' && (
              <AutumnEffect intensity={effectsIntensity} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition.page}
        className="mb-10 flex flex-col items-stretch justify-between gap-4 md:mb-12 md:flex-row md:items-center"
      >
        <h1 className="text-3xl font-extrabold text-ingos-text-primary md:text-4xl lg:text-5xl">
          Симулятор рисков
        </h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <MotionButton
            onClick={resetGame}
            className="inline-flex items-center justify-center gap-2 rounded-btn bg-ingos-secondary px-5 py-2.5 text-sm font-semibold text-[#0066CC] shadow-md dark:bg-[#003366] dark:text-[#00A3FF] md:px-6 md:text-base"
          >
            <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
            <span>Начать заново</span>
          </MotionButton>

          <MotionButton
            onClick={() => setEffectsEnabled((v) => !v)}
            className="inline-flex items-center justify-center rounded-btn bg-[#E0E0E0] px-4 py-2.5 text-sm font-semibold text-[#0066CC] shadow-md transition-colors duration-300 ease-in-out hover:bg-[#d9d9df] dark:bg-[#003366] dark:text-[#00A3FF] dark:hover:bg-[#002a5f] md:px-5 md:text-base"
            aria-pressed={effectsEnabled}
          >
            <span>{effectsEnabled ? 'Отключить эффекты' : 'Включить эффекты'}</span>
          </MotionButton>
        </div>
      </motion.div>

      <div className="mb-8 rounded-card border border-ingos-border bg-ingos-card p-6 shadow-md transition-colors duration-300 ease-in-out md:p-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 shrink-0 text-[#0066CC] dark:text-[#00A3FF]" strokeWidth={2} />
            <div>
              <p className="text-sm text-ingos-text-secondary md:text-base">Баланс</p>
              <p className="text-3xl font-bold tabular-nums text-ingos-text-primary md:text-4xl">
                {gameState.walletBalance.toLocaleString('ru-RU')}₽
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-ingos-text-secondary md:text-base">Раунд игры</p>
            <p className="text-3xl font-bold tabular-nums text-[#0066CC] dark:text-[#00A3FF] md:text-4xl">
              {Math.min(gameState.roundInCurrentCycle, ROUNDS_PER_CYCLE)} / {ROUNDS_PER_CYCLE}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-ingos-text-secondary md:text-base">Всего раундов</p>
            <p className="text-3xl font-bold tabular-nums text-ingos-text-primary md:text-4xl">
              {gameState.roundsPlayed}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Shield
              className="h-8 w-8 shrink-0 text-[#0066CC] dark:text-[#00A3FF]"
              strokeWidth={2}
            />
            <div>
              <p className="text-sm text-ingos-text-secondary md:text-base">Сэкономлено</p>
              <p className="text-3xl font-bold tabular-nums text-ingos-text-primary md:text-4xl">
                {gameState.totalSaved.toLocaleString('ru-RU')}₽
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState.currentPhase === 'season' && (
          <motion.div
            key="season"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransition.page}
          >
            <h2 className="mb-8 text-center text-xl font-bold text-ingos-text-primary md:text-2xl lg:text-3xl">
              Выбери сезон и сценарий
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
              {Object.entries(seasonNames).map(([key, name], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * motionTransition.stagger,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <MotionButton
                    onClick={() => handleSeasonSelect(key)}
                    className="group flex w-full flex-col items-center rounded-card border border-ingos-border bg-ingos-card p-8 text-center shadow-sm md:p-10"
                  >
                    <div className="mb-4 text-[#0066CC] transition-transform duration-300 ease-in-out group-hover:scale-110 dark:text-[#00A3FF]">
                      {seasonIcons[key as keyof typeof seasonIcons]}
                    </div>
                    <h3 className="text-2xl font-bold text-ingos-text-primary md:text-3xl">{name}</h3>
                  </MotionButton>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {gameState.currentPhase === 'scenario' && gameState.scenario && (
          <motion.div
            key={`scenario-${gameState.scenarioNonce}`}
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransition.page}
          >
            <div className="mb-8 rounded-card border-2 border-[var(--accent-border)] bg-[var(--accent-muted)] p-6 md:p-10">
              <p className="text-lg leading-relaxed text-ingos-text-primary md:text-xl">
                {gameState.scenario.text}
              </p>
            </div>

            <h2 className="mb-8 text-center text-xl font-bold text-ingos-text-primary md:text-2xl lg:text-3xl">
              Застраховать себя в этой ситуации?
            </h2>

            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <MotionButton
                onClick={() => handleInsuranceDecision(true)}
                className="flex w-full flex-col items-center rounded-card bg-[#0066CC] p-8 text-white shadow-md md:p-10"
              >
                <Shield className="mb-4 h-14 w-14 md:h-16 md:w-16" strokeWidth={2} />
                <h3 className="mb-3 text-xl font-bold md:text-2xl">Купить страховку</h3>
                <p className="mb-4 text-base text-white/90 md:text-lg">
                  Стоимость: {gameState.scenario.insuranceCost}₽
                </p>
                <p className="text-center text-sm text-white/85 md:text-base">
                  Защита от больших расходов
                </p>
              </MotionButton>

              <MotionButton
                onClick={() => handleInsuranceDecision(false)}
                className="flex w-full flex-col items-center rounded-card border-2 border-[var(--accent-border)] bg-ingos-secondary p-8 text-[#0066CC] shadow-md md:p-10 dark:bg-[#003366] dark:text-[#00A3FF]"
              >
                <AlertTriangle className="mb-4 h-14 w-14 md:h-16 md:w-16" strokeWidth={2} />
                <h3 className="mb-3 text-xl font-bold md:text-2xl">Рискнуть</h3>
                <p className="mb-4 text-base opacity-90 md:text-lg">Стоимость: 0₽</p>
                <p className="text-center text-sm opacity-85 md:text-base">
                  Но если что-то случится…
                </p>
              </MotionButton>
            </div>
          </motion.div>
        )}

        {gameState.currentPhase === 'game_over' && gameState.outcome && (
          <motion.div
            key="game_over"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransition.page}
          >
            <div className="mb-8 rounded-card border-2 border-red-600/60 bg-red-50 p-6 dark:border-red-500/50 dark:bg-red-950/50 md:p-10">
              <h2 className="mb-4 text-2xl font-bold text-red-800 dark:text-red-200 md:text-4xl">
                Игра окончена
              </h2>
              <p className="mb-4 text-lg font-semibold text-red-900 dark:text-red-100">
                Средства на счёте закончились (баланс 0₽).
              </p>
              <p className="text-base leading-relaxed text-ingos-text-primary md:text-lg">
                {gameState.outcome.explanation}
              </p>
            </div>

            <div className="mb-8 rounded-card border border-ingos-border bg-ingos-card p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-ingos-text-primary">
                <BarChart3 className="h-5 w-5 text-[#0066CC] dark:text-[#00A3FF]" />
                Кратко по текущей игре
              </h3>
              <ul className="list-inside list-disc space-y-2 text-ingos-text-secondary">
                <li>Раундов сыграно до банкротства: {gameState.cycleRounds.length}</li>
                <li>Инцидентов: {gameState.cycleRounds.filter((r) => r.badLuckOccurred).length}</li>
                <li>
                  Покупок страховки: {gameState.cycleRounds.filter((r) => r.insured).length}
                </li>
              </ul>
            </div>

            <MotionButton
              onClick={resetGame}
              className="w-full rounded-btn bg-[#0066CC] py-4 text-base font-bold text-white shadow-md md:text-lg"
            >
              Новая игра с нуля
            </MotionButton>
          </motion.div>
        )}

        {gameState.currentPhase === 'outcome' && gameState.outcome && (
          <motion.div
            key="outcome"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransition.page}
          >
            <div
              className={`mb-8 rounded-card border-2 p-6 md:p-10 ${
                gameState.outcome.badLuckOccurred && !gameState.outcome.wasInsured
                  ? 'border-red-600/50 bg-red-50 dark:border-red-500/40 dark:bg-red-950/45'
                  : 'border-emerald-600/40 bg-emerald-50 dark:border-emerald-500/35 dark:bg-emerald-950/40'
              }`}
            >
              <h2
                className={`mb-4 text-2xl font-bold md:text-3xl lg:text-4xl ${
                  gameState.outcome.badLuckOccurred && !gameState.outcome.wasInsured
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-emerald-800 dark:text-emerald-200'
                }`}
              >
                {gameState.outcome.message}
              </h2>
              <p className="text-base leading-relaxed text-ingos-text-primary md:text-lg">
                {gameState.outcome.explanation}
              </p>
            </div>

            {gameState.outcome.moneySaved ? (
              <div className="mb-8 rounded-card border-l-4 border-emerald-600 bg-emerald-100/90 p-6 dark:border-emerald-400 dark:bg-emerald-950/55">
                <p className="text-base font-semibold text-emerald-900 dark:text-emerald-100 md:text-lg">
                  Вы сэкономили {gameState.outcome.moneySaved.toLocaleString('ru-RU')}₽ благодаря
                  страховке!
                </p>
              </div>
            ) : null}

            {gameState.outcome.moneyLost && gameState.outcome.wasInsured ? (
              <div className="mb-8 rounded-card border-l-4 border-[#0066CC] bg-[var(--accent-muted)] p-6">
                <p className="text-base font-semibold text-ingos-text-primary md:text-lg">
                  Страховка стоила вам {gameState.outcome.moneyLost.toLocaleString('ru-RU')}₽, но это
                  плата за спокойствие.
                </p>
              </div>
            ) : null}

            {gameState.outcome.moneyLost &&
            !gameState.outcome.wasInsured &&
            gameState.outcome.badLuckOccurred ? (
              <div className="mb-8 rounded-card border-l-4 border-red-600 bg-red-100/90 p-6 dark:border-red-400 dark:bg-red-950/55">
                <p className="text-base font-semibold text-red-900 dark:text-red-100 md:text-lg">
                  Без страховки вы потеряли {gameState.outcome.moneyLost.toLocaleString('ru-RU')}₽!
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {cycleComplete ? (
                <MotionButton
                  onClick={goToCycleSummary}
                  className="rounded-btn bg-[#0066CC] py-4 text-base font-bold text-white shadow-md md:text-lg"
                >
                  Итоги игры
                </MotionButton>
              ) : (
                <MotionButton
                  onClick={goNextRound}
                  className="rounded-btn bg-[#0066CC] py-4 text-base font-bold text-white shadow-md md:text-lg"
                >
                  Следующий раунд
                </MotionButton>
              )}
              <MotionButton
                onClick={resetGame}
                className="rounded-btn bg-ingos-secondary py-4 text-base font-bold text-[#0066CC] shadow-md dark:bg-[#003366] dark:text-[#00A3FF] md:text-lg"
              >
                Новая игра с нуля
              </MotionButton>
            </div>
          </motion.div>
        )}

        {gameState.currentPhase === 'cycle_summary' && (
          <motion.div
            key="cycle_summary"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransition.page}
          >
            <div className="mb-8 rounded-card border-2 border-[var(--accent-border)] bg-[var(--accent-muted)] p-6 md:p-10">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-ingos-text-primary md:text-4xl">
                <BarChart3 className="h-8 w-8 shrink-0 text-[#0066CC] dark:text-[#00A3FF]" />
                Игра завершена
              </h2>
              <p className="text-base leading-relaxed text-ingos-text-primary md:text-lg">
                Ниже — что вы делали по шагам, к чему это привело по деньгам и где можно было поступить
                лучше с точки зрения баланса риска и страхования.
              </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-card border border-ingos-border bg-ingos-card p-4">
                <p className="text-sm text-ingos-text-secondary">Баланс сейчас</p>
                <p className="text-xl font-bold tabular-nums text-ingos-text-primary">
                  {gameState.walletBalance.toLocaleString('ru-RU')}₽
                </p>
              </div>
              <div className="rounded-card border border-ingos-border bg-ingos-card p-4">
                <p className="text-sm text-ingos-text-secondary">Премии всего</p>
                <p className="text-xl font-bold tabular-nums text-ingos-text-primary">
                  {totalPremiums.toLocaleString('ru-RU')}₽
                </p>
              </div>
              <div className="rounded-card border border-ingos-border bg-ingos-card p-4">
                <p className="text-sm text-ingos-text-secondary">Инцидентов</p>
                <p className="text-xl font-bold tabular-nums text-[#0066CC] dark:text-[#00A3FF]">
                  {incidents}
                </p>
              </div>
              <div className="rounded-card border border-ingos-border bg-ingos-card p-4">
                <p className="text-sm text-ingos-text-secondary">Убыток без полиса (если были)</p>
                <p className="text-xl font-bold tabular-nums text-red-700 dark:text-red-300">
                  {uninsuredLoss.toLocaleString('ru-RU')}₽
                </p>
              </div>
            </div>

            {savedByInsurance > 0 ? (
              <div className="mb-8 rounded-card border-l-4 border-emerald-600 bg-emerald-50 p-6 dark:border-emerald-400 dark:bg-emerald-950/40">
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                  С полисом при инцидентах вы избежали расходов примерно на{' '}
                  {savedByInsurance.toLocaleString('ru-RU')}₽ (разница между счётом за лечение и
                  уплаченной премией в этих раундах).
                </p>
              </div>
            ) : null}

            <div className="mb-8 overflow-x-auto rounded-card border border-ingos-border bg-ingos-card">
              <table className="w-full min-w-[720px] text-left text-sm md:text-base">
                <thead className="border-b border-ingos-border bg-ingos-secondary/40 dark:bg-[#003366]/30">
                  <tr>
                    <th className="p-3 font-semibold text-ingos-text-primary">№</th>
                    <th className="p-3 font-semibold text-ingos-text-primary">Сезон</th>
                    <th className="p-3 font-semibold text-ingos-text-primary">Ситуация</th>
                    <th className="p-3 font-semibold text-ingos-text-primary">Страховка</th>
                    <th className="p-3 font-semibold text-ingos-text-primary">Инцидент</th>
                    <th className="p-3 font-semibold text-ingos-text-primary">Баланс после</th>
                  </tr>
                </thead>
                <tbody>
                  {gameState.cycleRounds.map((r) => (
                    <tr
                      key={r.roundInCycle}
                      className="border-b border-ingos-border/80 last:border-0"
                    >
                      <td className="p-3 tabular-nums text-ingos-text-secondary">{r.roundInCycle}</td>
                      <td className="p-3 text-ingos-text-primary">{r.seasonName}</td>
                      <td className="max-w-[220px] p-3 text-ingos-text-primary">{r.caseTitle}</td>
                      <td className="p-3">{r.insured ? `Да (−${r.premiumPaid}₽)` : 'Нет'}</td>
                      <td className="p-3">{r.badLuckOccurred ? 'Да' : 'Нет'}</td>
                      <td className="p-3 tabular-nums font-medium text-ingos-text-primary">
                        {r.balanceAfter.toLocaleString('ru-RU')}₽
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-8 rounded-card border border-ingos-border bg-ingos-card p-6 md:p-8">
              <h3 className="mb-4 text-xl font-bold text-ingos-text-primary">
                Где можно было сделать лучше
              </h3>
              <ul className="list-inside list-disc space-y-3 text-ingos-text-primary md:text-lg">
                {insights.map((t, i) => (
                  <li key={i} className="leading-relaxed">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <MotionButton
                onClick={startNewCycleAfterSummary}
                className="rounded-btn bg-[#0066CC] py-4 text-base font-bold text-white shadow-md md:text-lg"
              >
                Играть дальше (баланс сохраняется)
              </MotionButton>
              <MotionButton
                onClick={resetGame}
                className="rounded-btn bg-ingos-secondary py-4 text-base font-bold text-[#0066CC] shadow-md dark:bg-[#003366] dark:text-[#00A3FF] md:text-lg"
              >
                Новая игра с нуля
              </MotionButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SimulatorPage;
