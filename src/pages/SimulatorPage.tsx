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
  Info,
} from 'lucide-react';
import { MotionButton } from '../components/MotionButton';
import { motionTransition } from '../theme/theme';
import { AutumnEffect, SnowEffect, SpringEffect } from '../components/season-effects';
import { seasonCasePools, type SeasonKey } from '../data/simulatorSeasonCases';

const ROUNDS_PER_SEASON = 5;

interface GameState {
  walletBalance: number;
  currentPhase: 'welcome' | 'season' | 'scenario' | 'outcome' | 'cycle_summary' | 'game_over';
  selectedSeason: string | null;
  insuranceBought: boolean;
  scenario: ScenarioData | null;
  outcome: OutcomeData | null;
  roundsPlayed: number;
  totalSaved: number;
  roundInCurrentCycle: number;
  cycleRounds: RoundRecord[];
  /** В текущем цикле: какие сценарии (caseTitle) уже сыграны по каждому сезону — повтор до конца цикла не показываем. */
  usedCasesBySeason: Record<SeasonKey, string[]>;
  scenarioNonce: number;
}

interface ScenarioData {
  season: string;
  caseTitle: string;
  situation: string;
  possibleOutcome: string;
  ifInsured: string;
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
  winter: <Snowflake className="h-14 w-14 md:h-16 md:w-16" strokeWidth={1.75} />,
  spring: <Cloud className="h-14 w-14 md:h-16 md:w-16" strokeWidth={1.75} />,
  summer: <Sun className="h-14 w-14 md:h-16 md:w-16" strokeWidth={1.75} />,
  autumn: <Leaf className="h-14 w-14 md:h-16 md:w-16" strokeWidth={1.75} />,
};

/** Тематика сезона: карточка выбора и цвета на экране сценария (без отдельного блока «палитра»). */
const seasonThemes: Record<
  SeasonKey,
  {
    tagline: string;
    card: string;
    iconWrap: string;
    iconTint: string;
    title: string;
    decor: string;
    scenario: {
      storyCard: string;
      storyText: string;
      headingEmphasis: string;
      questionHeading: string;
      insureBtn: string;
      riskBtn: string;
    };
  }
> = {
  winter: {
    tagline: 'Снег · мороз · лёд и горы',
    card:
      'border-sky-300/70 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-200/90 text-slate-900 shadow-sky-200/50 dark:border-sky-500/35 dark:from-slate-950 dark:via-sky-950/80 dark:to-blue-950 dark:text-sky-50 dark:shadow-sky-900/40',
    iconWrap:
      'bg-sky-100/90 ring-sky-300/60 dark:bg-sky-900/50 dark:ring-sky-500/40',
    iconTint: 'text-sky-600 dark:text-sky-300',
    title: 'text-slate-900 dark:text-white',
    decor: 'bg-sky-400/25 blur-2xl dark:bg-sky-400/15',
    scenario: {
      storyCard:
        'border-sky-400/70 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100/90 dark:border-sky-500/40 dark:from-slate-950 dark:via-sky-950/90 dark:to-blue-950/80',
      storyText: 'text-slate-900 dark:text-sky-50',
      headingEmphasis: 'text-sky-700 dark:text-sky-200',
      questionHeading: 'text-sky-800 dark:text-sky-200',
      insureBtn:
        'bg-sky-600 text-white shadow-md hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400',
      riskBtn:
        'border-2 border-sky-400 bg-sky-50 text-sky-900 dark:border-sky-500 dark:bg-sky-950/60 dark:text-sky-100',
    },
  },
  spring: {
    tagline: 'Дождь · зелень · первое солнце',
    card:
      'border-emerald-300/60 bg-gradient-to-br from-emerald-50 via-green-50 to-pink-100/85 text-emerald-950 shadow-emerald-200/40 dark:border-emerald-500/30 dark:from-emerald-950/70 dark:via-green-950/60 dark:to-pink-950/35 dark:text-emerald-50 dark:shadow-emerald-900/30',
    iconWrap:
      'bg-emerald-100/90 ring-emerald-300/50 dark:bg-emerald-900/45 dark:ring-emerald-500/35',
    iconTint: 'text-emerald-600 dark:text-emerald-300',
    title: 'text-emerald-950 dark:text-white',
    decor: 'bg-pink-300/30 blur-2xl dark:bg-pink-500/15',
    scenario: {
      storyCard:
        'border-emerald-400/65 bg-gradient-to-br from-emerald-50 via-green-50 to-pink-50/90 dark:border-emerald-500/35 dark:from-emerald-950/85 dark:via-green-950/75 dark:to-pink-950/40',
      storyText: 'text-emerald-950 dark:text-emerald-50',
      headingEmphasis: 'text-emerald-800 dark:text-emerald-200',
      questionHeading: 'text-emerald-800 dark:text-emerald-200',
      insureBtn:
        'bg-emerald-600 text-white shadow-md hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400',
      riskBtn:
        'border-2 border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-100',
    },
  },
  summer: {
    tagline: 'Солнце · море · песок и жара',
    card:
      'border-amber-400/70 bg-gradient-to-br from-amber-100 via-yellow-50 to-cyan-200/80 text-amber-950 shadow-amber-300/50 dark:border-amber-500/40 dark:from-amber-950/70 dark:via-yellow-950/55 dark:to-cyan-950/60 dark:text-amber-50 dark:shadow-amber-900/35',
    iconWrap:
      'bg-amber-200/90 ring-amber-400/70 dark:bg-amber-900/50 dark:ring-amber-500/45',
    iconTint: 'text-amber-600 dark:text-amber-300',
    title: 'text-amber-950 dark:text-white',
    decor: 'bg-cyan-300/35 blur-2xl dark:bg-cyan-500/20',
    scenario: {
      storyCard:
        'border-amber-400/75 bg-gradient-to-br from-amber-50 via-yellow-50 to-cyan-100/90 dark:border-amber-500/45 dark:from-amber-950/80 dark:via-yellow-950/65 dark:to-cyan-950/70',
      storyText: 'text-amber-950 dark:text-amber-50',
      headingEmphasis: 'text-amber-800 dark:text-amber-200',
      questionHeading: 'text-amber-900 dark:text-amber-200',
      insureBtn:
        'bg-amber-600 text-white shadow-md hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400',
      riskBtn:
        'border-2 border-amber-500 bg-amber-50 text-amber-950 dark:border-amber-400 dark:bg-amber-950/55 dark:text-amber-100',
    },
  },
  autumn: {
    tagline: 'Листва · дождь · ветер и слякоть',
    card:
      'border-orange-400/65 bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100/90 text-orange-950 shadow-orange-200/45 dark:border-orange-500/35 dark:from-orange-950/65 dark:via-amber-950/55 dark:to-rose-950/45 dark:text-orange-50 dark:shadow-orange-900/30',
    iconWrap:
      'bg-orange-100/90 ring-orange-300/60 dark:bg-orange-900/45 dark:ring-orange-500/40',
    iconTint: 'text-orange-600 dark:text-orange-300',
    title: 'text-orange-950 dark:text-white',
    decor: 'bg-amber-400/30 blur-2xl dark:bg-amber-600/20',
    scenario: {
      storyCard:
        'border-orange-400/70 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50/95 dark:border-orange-500/40 dark:from-orange-950/80 dark:via-amber-950/70 dark:to-rose-950/55',
      storyText: 'text-orange-950 dark:text-orange-50',
      headingEmphasis: 'text-orange-800 dark:text-orange-200',
      questionHeading: 'text-orange-900 dark:text-orange-200',
      insureBtn:
        'bg-orange-600 text-white shadow-md hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400',
      riskBtn:
        'border-2 border-orange-500 bg-orange-50 text-orange-950 dark:border-orange-400 dark:bg-orange-950/55 dark:text-orange-100',
    },
  },
};

function emptyUsedCasesBySeason(): Record<SeasonKey, string[]> {
  return { winter: [], spring: [], summer: [], autumn: [] };
}

function pickRandomScenario(seasonKey: string, excludeCaseTitles: string[]): ScenarioData {
  const key = seasonKey as SeasonKey;
  const pool = seasonCasePools[key];
  const available = pool.filter((t) => !excludeCaseTitles.includes(t.caseTitle));
  const pickFrom = available.length > 0 ? available : pool;
  const template = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  return {
    season: seasonNames[key],
    caseTitle: template.caseTitle,
    situation: template.situation,
    possibleOutcome: template.possibleOutcome,
    ifInsured: template.ifInsured,
    insuranceCost: template.insuranceCost,
    accidentCost: template.accidentCost,
    badLuckChance: template.badLuckChance,
  };
}

const phaseVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
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
        message: '✅ Риск сработал в игре — полис помог по деньгам',
        explanation:
          `В раунде «${scenario.caseTitle}» (${scenario.season.toLowerCase()}) симулятор показал: если бы неприятный исход случился, счёт мог бы вырасти примерно на ${scenario.accidentCost.toLocaleString('ru-RU')}₽ ` +
          `(лечение, ремонт или другие расходы — в жизни суммы другие). Ты заранее «купил» страховку за ${scenario.insuranceCost.toLocaleString('ru-RU')}₽, поэтому в игре тяжёлая часть расходов закрыта полисом. ` +
          `Условно ты сэкономил по сравнению с полной оплатой самому: ${moneySaved.toLocaleString('ru-RU')}₽.`,
        moneySaved,
      };
    }
    return {
      badLuckOccurred: true,
      wasInsured: false,
      message: '❌ В игре сработал риск — без полиса счёт большой',
      explanation:
        `В раунде «${scenario.caseTitle}» (${scenario.season.toLowerCase()}) симулятор показал невезение: если бы всё сложилось плохо, пришлось бы выложить порядка ${scenario.accidentCost.toLocaleString('ru-RU')}₽. ` +
        `Страховки не было — в игре весь этот условный счёт на тебе. В жизни полис как раз и нужен, чтобы не держать в голове такую сумму в один день.`,
      moneyLost: scenario.accidentCost,
    };
  }
  if (buyInsurance) {
    return {
      badLuckOccurred: false,
      wasInsured: true,
      message: '✨ В игре всё обошлось — премия ушла, но ты был под защитой',
      explanation:
        `«${scenario.caseTitle}» (${scenario.season.toLowerCase()}): в этом раунде «плохой» исход не выпал — ты заплатил ${scenario.insuranceCost.toLocaleString('ru-RU')}₽ за полис и не воспользовался им. ` +
        `Так бывает: ты платишь за спокойствие и за то, что если бы риск сработал, не пришлось бы платить всё разом. В одном раунде это похоже на трату, зато лимит удара по кошельку ты заранее срезал.`,
      moneyLost: scenario.insuranceCost,
    };
  }
  return {
    badLuckOccurred: false,
    wasInsured: false,
    message: '🎉 В этом раунде повезло — и без страховки',
    explanation:
      `«${scenario.caseTitle}» (${scenario.season.toLowerCase()}): в игре риск не сработал, ты не платил за полис и не «попал» на большой счёт. ` +
      `Так бывает, но чем чаще играешь без защиты при высоком шансе сюрприза, тем реальнее, что когда-нибудь вылезет крупная сумма — в жизни то же по смыслу.`,
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
    currentPhase: 'welcome',
    selectedSeason: null,
    insuranceBought: false,
    scenario: null,
    outcome: null,
    roundsPlayed: 0,
    totalSaved: 0,
    roundInCurrentCycle: 0,
    cycleRounds: [],
    usedCasesBySeason: emptyUsedCasesBySeason(),
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
    const key = season as SeasonKey;
    const exclude = gameState.usedCasesBySeason[key];
    const scenario = pickRandomScenario(season, exclude);
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
    const seasonKey = gameState.selectedSeason as SeasonKey;
    const usedCasesBySeason = {
      ...gameState.usedCasesBySeason,
      [seasonKey]: [...gameState.usedCasesBySeason[seasonKey], scenario.caseTitle],
    };

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
      usedCasesBySeason,
    });
  };

  const goNextRound = () => {
    if (!gameState.selectedSeason) return;
    const seasonKey = gameState.selectedSeason as SeasonKey;
    const seasonRoundsDone = gameState.roundInCurrentCycle;

    // После 5 раундов по выбранному сезону возвращаем к выбору следующего сезона.
    if (seasonRoundsDone >= ROUNDS_PER_SEASON) {
      setGameState({
        ...gameState,
        currentPhase: 'season',
        selectedSeason: null,
        insuranceBought: false,
        scenario: null,
        outcome: null,
        roundInCurrentCycle: 0,
      });
      return;
    }

    const exclude = gameState.usedCasesBySeason[seasonKey];
    const scenario = pickRandomScenario(seasonKey, exclude);
    setGameState({
      ...gameState,
      insuranceBought: false,
      scenario,
      outcome: null,
      currentPhase: 'scenario',
      scenarioNonce: gameState.scenarioNonce + 1,
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
      usedCasesBySeason: emptyUsedCasesBySeason(),
    });
  };

  const beginFromWelcome = () => {
    setGameState((s) => ({ ...s, currentPhase: 'season' }));
  };

  const resetGame = () => {
    setGameState({
      walletBalance: 10000,
      currentPhase: 'welcome',
      selectedSeason: null,
      insuranceBought: false,
      scenario: null,
      outcome: null,
      roundsPlayed: 0,
      totalSaved: 0,
      roundInCurrentCycle: 0,
      cycleRounds: [],
      usedCasesBySeason: emptyUsedCasesBySeason(),
      scenarioNonce: 0,
    });
  };

  const seasonComplete =
    gameState.roundInCurrentCycle >= ROUNDS_PER_SEASON && gameState.walletBalance > 0;
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
    <div className="relative mx-auto max-w-5xl min-w-0 overflow-x-hidden px-4 py-8 sm:px-6 md:py-12 lg:px-8">
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
            <p className="text-sm text-ingos-text-secondary md:text-base">Раунд сезона</p>
            <p className="text-3xl font-bold tabular-nums text-[#0066CC] dark:text-[#00A3FF] md:text-4xl">
              {Math.min(gameState.roundInCurrentCycle, ROUNDS_PER_SEASON)} / {ROUNDS_PER_SEASON}
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
        {gameState.currentPhase === 'welcome' && (
          <motion.div
            key="welcome"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransition.page}
            className="mx-auto max-w-2xl"
          >
            <div className="relative overflow-hidden rounded-[1.25rem] border-2 border-[#0066CC]/25 bg-gradient-to-br from-[var(--accent-muted)] via-[var(--card-bg)] to-[#00A3FF]/[0.12] p-8 shadow-xl dark:border-[#00A3FF]/30 dark:from-[#003366]/25 dark:via-[var(--card-bg)] dark:to-[#0066CC]/20 md:rounded-[1.5rem] md:p-10">
              <div
                className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-[#0066CC]/15 blur-3xl dark:bg-[#00A3FF]/20"
                aria-hidden
              />
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0066CC]/15 text-[#0066CC] dark:bg-[#00A3FF]/15 dark:text-[#00A3FF]">
                  <Info className="h-9 w-9" strokeWidth={2} aria-hidden />
                </div>
                <h2 className="mb-4 text-2xl font-extrabold text-ingos-text-primary md:text-3xl">
                  Объясняем что и как 
                </h2>
                <p className="mb-4 text-base leading-relaxed text-ingos-text-secondary md:text-lg">
                  Это игра, а не настоящий договор со страховой. Цифры здесь простые, всё быстро — так
                  проще потренироваться. Деньги тоже виртуальные)
                </p>
                <p className="mb-8 text-base leading-relaxed text-ingos-text-primary md:text-lg">
                  По-настоящему всё дольше и запутаннее. Но из игры всё равно можно понять главное: что
                  будет с деньгами, если рискнуть без страховки и если оформить полис.
                </p>
                <MotionButton
                  onClick={beginFromWelcome}
                  className="w-full rounded-btn bg-[#0066CC] py-4 text-base font-bold text-white shadow-lg md:text-lg"
                >
                  Ок, выбрать сезон
                </MotionButton>
              </div>
            </div>
          </motion.div>
        )}

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
              Выбери сезон
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
              {(Object.keys(seasonNames) as SeasonKey[]).map((key, i) => {
                const name = seasonNames[key];
                const theme = seasonThemes[key];
                return (
                  <motion.div
                    key={key}
                    className="flex h-[300px] w-full min-w-0 sm:h-[320px] md:h-[340px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: i * motionTransition.stagger,
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <MotionButton
                      onClick={() => handleSeasonSelect(key)}
                      className={`group relative box-border flex h-full min-h-0 w-full flex-col items-center overflow-hidden rounded-[1.15rem] border-2 p-6 text-center shadow-lg sm:p-8 md:rounded-[1.25rem] md:p-10 ${theme.card}`}
                    >
                      <span
                        className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full ${theme.decor}`}
                        aria-hidden
                      />
                      <span
                        className={`pointer-events-none absolute -bottom-4 -left-8 h-24 w-24 rounded-full opacity-60 ${theme.decor}`}
                        aria-hidden
                      />
                      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center text-center">
                        <div
                          className={`mb-4 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl shadow-inner ring-2 transition-transform duration-200 ease-out group-hover:scale-110 md:h-[5rem] md:w-[5rem] ${theme.iconWrap}`}
                        >
                          <span className={theme.iconTint}>{seasonIcons[key]}</span>
                        </div>
                        <h3
                          className={`mb-2 shrink-0 text-2xl font-extrabold md:text-3xl ${theme.title}`}
                        >
                          {name}
                        </h3>
                        <p className="max-w-[16rem] shrink-0 text-sm font-semibold leading-snug opacity-90 md:text-base">
                          {theme.tagline}
                        </p>
                      </div>
                    </MotionButton>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {gameState.currentPhase === 'scenario' &&
          gameState.scenario &&
          gameState.selectedSeason && (
          <motion.div
            key={`scenario-${gameState.scenarioNonce}`}
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransition.page}
          >
            {(() => {
              const sk = gameState.selectedSeason as SeasonKey;
              const sc = seasonThemes[sk].scenario;
              return (
                <>
                  <div
                    className={`mb-8 space-y-6 rounded-card border-2 p-6 shadow-inner md:p-10 ${sc.storyCard}`}
                  >
                    <div>
                      <h3
                        className={`mb-2 text-sm font-bold uppercase tracking-wide opacity-80 md:text-base ${sc.storyText}`}
                      >
                        Ситуация
                      </h3>
                      <p
                        className={`text-lg leading-relaxed md:text-xl ${sc.storyText}`}
                      >
                        {gameState.scenario.situation}
                      </p>
                    </div>
                    <div>
                      <h3 className={`mb-3 ${sc.storyText}`}>
                        <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-[0.22em] opacity-55 md:text-xs">
                          Возможный
                        </span>
                        <span
                          className={`block text-lg font-black uppercase leading-tight tracking-tight md:text-xl ${sc.headingEmphasis}`}
                        >
                          исход
                        </span>
                      </h3>
                      <p
                        className={`text-lg leading-relaxed md:text-xl ${sc.storyText}`}
                      >
                        {gameState.scenario.possibleOutcome}
                      </p>
                    </div>
                    <div>
                      <h3 className={`mb-3 ${sc.storyText}`}>
                        <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-[0.22em] opacity-55 md:text-xs">
                          Что будет
                        </span>
                        <span
                          className={`block text-lg font-black leading-snug tracking-tight md:text-xl ${sc.headingEmphasis}`}
                        >
                          если застраховаться
                        </span>
                        <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.18em] opacity-60 md:text-xs">
                          заранее
                        </span>
                      </h3>
                      <p
                        className={`text-lg leading-relaxed md:text-xl ${sc.storyText}`}
                      >
                        {gameState.scenario.ifInsured}
                      </p>
                    </div>
                  </div>

                  <h2
                    className={`mb-8 text-center text-xl font-bold md:text-2xl lg:text-3xl ${sc.questionHeading}`}
                  >
                    Застраховать себя в этой ситуации?
                  </h2>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                    <div className="flex h-[220px] md:h-[240px]">
                      <MotionButton
                        onClick={() => handleInsuranceDecision(true)}
                        className={`flex h-full w-full flex-col items-center justify-center rounded-card p-8 shadow-md md:p-10 ${sc.insureBtn}`}
                      >
                        <Shield className="mb-4 h-14 w-14 md:h-16 md:w-16" strokeWidth={2} />
                        <h3 className="mb-3 text-xl font-bold md:text-2xl">Купить страховку</h3>
                        <p className="mb-4 text-base opacity-95 md:text-lg">
                          Стоимость: {gameState.scenario.insuranceCost}₽
                        </p>
                        <p className="text-center text-sm opacity-90 md:text-base">
                          Защита от больших расходов
                        </p>
                      </MotionButton>
                    </div>
                    <div className="flex h-[220px] md:h-[240px]">
                      <MotionButton
                        onClick={() => handleInsuranceDecision(false)}
                        className={`flex h-full w-full flex-col items-center justify-center rounded-card p-8 shadow-md md:p-10 ${sc.riskBtn}`}
                      >
                        <AlertTriangle className="mb-4 h-14 w-14 md:h-16 md:w-16" strokeWidth={2} />
                        <h3 className="mb-3 text-xl font-bold md:text-2xl">Рискнуть</h3>
                        <p className="mb-4 text-base opacity-90 md:text-lg">Стоимость: 0₽</p>
                        <p className="text-center text-sm opacity-85 md:text-base">
                          Но если что-то случится…
                        </p>
                      </MotionButton>
                    </div>
                  </div>
                </>
              );
            })()}
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
              <MotionButton
                onClick={goNextRound}
                className="rounded-btn bg-[#0066CC] py-4 text-base font-bold text-white shadow-md md:text-lg"
              >
                {seasonComplete ? 'Выбрать другой сезон' : 'Следующий раунд'}
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

            <div className="mb-8 w-full max-w-full overflow-x-auto rounded-card border border-ingos-border bg-ingos-card [-webkit-overflow-scrolling:touch]">
              <table className="w-full min-w-[min(100%,720px)] text-left text-sm md:min-w-[720px] md:text-base">
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
