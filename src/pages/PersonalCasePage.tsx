import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bot, Check, Copy, Sparkles, Shield } from 'lucide-react';
import { MotionButton } from '../components/MotionButton';
import { motionTransition } from '../theme/theme';

interface PersonalTemplate {
  id: string;
  title: string;
  text: string;
}

interface PersonalAnalysisResult {
  riskPercent: number;
  teenExplanation: string;
  caseBreakdown: string;
  source?: 'llm' | 'fallback';
  fallbackReason?: string;
}

interface PersonalAnalysisHistoryItem {
  id: string;
  createdAt: string;
  caseText: string;
  result: PersonalAnalysisResult;
}

const personalCaseTemplates: PersonalTemplate[] = [
  {
    id: 'bike-theft',
    title: 'Кража велосипеда у ТЦ',
    text: 'Оставил велосипед у входа в торговый центр на 20 минут с обычным тросовым замком.',
  },
  {
    id: 'phone-water',
    title: 'Телефон упал в воду',
    text: 'На отдыхе у воды выскользнул телефон, перестал включаться и внутри важные данные.',
  },
  {
    id: 'scooter-fall',
    title: 'Падение с электросамоката',
    text: 'Ехал без шлема по мокрой дороге, резко затормозил и упал, появились боль и ушибы.',
  },
  {
    id: 'sports-injury',
    title: 'Травма на тренировке',
    text: 'Во время тренировки подвернул ногу, нужен осмотр врача и, возможно, снимок/МРТ.',
  },
  {
    id: 'travel-accident',
    title: 'Неприятность в поездке',
    text: 'В поездке по России/за границей стало плохо, нужна срочная медицинская помощь.',
  },
  {
    id: 'my-case',
    title: 'Мой случай',
    text: 'Опишите ниже свой страховой случай',
  },
];

const HISTORY_STORAGE_KEY = 'personal-risk-analysis-history';

const caseTags = [
  'Путешествие',
  'Спорт',
  'Гаджет',
  'Транспорт',
  'Кража',
  'Здоровье',
  'Школа/учеба',
];

function parseRiskPercent(rawText: string): number {
  const patterns = [
    /(?:Риск|Risk)\s*[:：]?\s*(\d{1,3})\s*%/i,
    /(\d{1,3})\s*%/,
  ];
  for (const re of patterns) {
    const match = rawText.match(re);
    if (match) {
      const value = Number(match[1]);
      if (Number.isFinite(value)) return Math.min(100, Math.max(0, value));
    }
  }
  return 50;
}

function stripMarkdownNoise(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
}

function parsePersonalAnalysis(rawText: string): PersonalAnalysisResult {
  const plain = stripMarkdownNoise(rawText);
  const riskPercent = parseRiskPercent(plain);

  let teenExplanation = '';
  let caseBreakdown = '';

  const teenBlock = plain.match(
    /(?:Понятно подростку|Для подростка|Простыми словами)\s*[:：]?\s*([\s\S]*?)(?=\n\s*(?:Разбор случая|Анализ кейса|Case analysis|###|\*\*Разбор)|$)/i,
  );
  const caseBlock = plain.match(
    /(?:Разбор случая|Анализ кейса|Case analysis)\s*[:：]?\s*([\s\S]*)$/i,
  );

  if (teenBlock?.[1]?.trim()) teenExplanation = teenBlock[1].trim();
  if (caseBlock?.[1]?.trim()) caseBreakdown = caseBlock[1].trim();

  if (!teenExplanation || !caseBreakdown) {
    const withoutRisk = plain.replace(/^(?:\*\*)?(?:Риск|Risk)\s*[:：]?\s*\d{1,3}\s*%?(?:\*\*)?\s*\n?/im, '').trim();
    const blocks = withoutRisk.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
    if (blocks.length >= 2) {
      if (!teenExplanation) teenExplanation = blocks[0];
      if (!caseBreakdown) caseBreakdown = blocks.slice(1).join('\n\n');
    } else if (blocks.length === 1 && withoutRisk.length > 0) {
      const one = blocks[0];
      const mid = Math.min(one.length, Math.max(80, Math.floor(one.length * 0.45)));
      if (!teenExplanation) teenExplanation = one.slice(0, mid).trim();
      if (!caseBreakdown) caseBreakdown = one.slice(mid).trim() || one;
    }
  }

  if (!teenExplanation && !caseBreakdown && plain.length > 0) {
    teenExplanation = plain;
  } else if (!teenExplanation && caseBreakdown) {
    const cut = caseBreakdown.indexOf('. ');
    teenExplanation =
      cut > 0 && cut < 400 ? caseBreakdown.slice(0, cut + 1).trim() : caseBreakdown.slice(0, 280).trim();
  } else if (!caseBreakdown && teenExplanation) {
    caseBreakdown = teenExplanation;
  }

  return {
    riskPercent,
    teenExplanation:
      teenExplanation ||
      'Ситуация может привести к неожиданным расходам. Страховка снижает финансовый удар, но условия покрытия нужно читать заранее.',
    caseBreakdown:
      caseBreakdown ||
      'Проверьте: что именно произошло, какие расходы вероятны, что уже покрыто по текущим полисам, какие документы потребуются для обращения.',
  };
}

function riskLevelLabel(riskPercent: number): 'Низкий' | 'Средний' | 'Высокий' {
  if (riskPercent >= 70) return 'Высокий';
  if (riskPercent >= 40) return 'Средний';
  return 'Низкий';
}

function riskLevelColor(riskPercent: number): string {
  if (riskPercent >= 70) return 'text-red-600 dark:text-red-300';
  if (riskPercent >= 40) return 'text-amber-600 dark:text-amber-300';
  return 'text-emerald-600 dark:text-emerald-300';
}

function historyCasePreview(text: string): string {
  if (text.length <= 90) return text;
  return `${text.slice(0, 90)}...`;
}

function buildLocalFallback(userCase: string): PersonalAnalysisResult {
  const normalized = userCase.toLowerCase();
  let riskPercent = 45;
  if (
    normalized.includes('краж') ||
    normalized.includes('дтп') ||
    normalized.includes('травм') ||
    normalized.includes('самокат') ||
    normalized.includes('велосипед')
  ) {
    riskPercent = 72;
  } else if (normalized.includes('телефон') || normalized.includes('ноутбук')) {
    riskPercent = 58;
  }

  const shortCase =
    userCase.length > 160 ? `${userCase.slice(0, 160).trim()}…` : userCase.trim();

  return {
    riskPercent,
    teenExplanation:
      `По твоему описанию: ${shortCase || 'ситуация не указана'}. ` +
      'В жизни такие вещи иногда бьют по кошельку неожиданно. Страховка как раз про то, чтобы заранее ограничить размер такого удара.',
    caseBreakdown:
      `Твой кейс: ${userCase}\n\nЧто важно проверить:\n1) Какие расходы могут появиться сразу (врач, ремонт, замена вещи).\n2) Есть ли уже действующий полис у тебя или у родителей.\n3) Какие документы понадобятся (чеки, фото, справки).\n4) Что точно не покрывается, чтобы не завысить ожидания.`,
  };
}

function getPersonalCaseApiBase(): string {
  return import.meta.env.VITE_PERSONAL_CASE_API_BASE?.trim() ?? '';
}

async function requestPersonalAnalysis(userCase: string): Promise<PersonalAnalysisResult> {
  const base = getPersonalCaseApiBase();
  const url = `${base}/api/personal-case/analyze`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseText: userCase }),
    });

    const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };

    if (!res.ok) {
      const fallback = buildLocalFallback(userCase);
      let fallbackReason =
        'Сервис разбора сейчас недоступен. Ниже — упрощённый учебный разбор.';
      if (res.status === 429) {
        fallbackReason =
          'Сейчас слишком много запросов или достигнут лимит. Попробуй позже. Ниже — упрощённый разбор.';
      } else if (res.status === 503) {
        fallbackReason =
          'Разбор временно недоступен. Ниже — упрощённый учебный разбор.';
      }
      return {
        ...fallback,
        source: 'fallback',
        fallbackReason,
      };
    }

    if (typeof data.text === 'string' && data.text.trim()) {
      return { ...parsePersonalAnalysis(data.text), source: 'llm' };
    }

    const fallback = buildLocalFallback(userCase);
    return {
      ...fallback,
      source: 'fallback',
      fallbackReason: 'Не удалось получить ответ сервиса. Ниже — упрощённый разбор.',
    };
  } catch {
    const fallback = buildLocalFallback(userCase);
    return {
      ...fallback,
      source: 'fallback',
      fallbackReason:
        'Не удалось связаться с сервисом. Проверь подключение к сети. Ниже — упрощённый разбор.',
    };
  }
}

function PersonalCasePage() {
  const reduceMotion = useReducedMotion();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(personalCaseTemplates[0].id);
  const [customCaseInput, setCustomCaseInput] = useState('');
  const [isAnalyzingPersonalCase, setIsAnalyzingPersonalCase] = useState(false);
  const [personalAnalysisError, setPersonalAnalysisError] = useState<string | null>(null);
  const [personalAnalysis, setPersonalAnalysis] = useState<PersonalAnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PersonalAnalysisHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

  const selectedTemplate = useMemo(
    () => personalCaseTemplates.find((t) => t.id === selectedTemplateId) ?? personalCaseTemplates[0],
    [selectedTemplateId],
  );

  const preparedCaseText = customCaseInput.trim() || selectedTemplate.text;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersonalAnalysisHistoryItem[];
      if (Array.isArray(parsed)) setAnalysisHistory(parsed.slice(0, 5));
    } catch {
      // ignore storage parse errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(analysisHistory.slice(0, 5)));
    } catch {
      // ignore storage write errors
    }
  }, [analysisHistory]);

  const handleAnalyzePersonalCase = async () => {
    setIsAnalyzingPersonalCase(true);
    setPersonalAnalysisError(null);
    try {
      const result = await requestPersonalAnalysis(preparedCaseText);
      setPersonalAnalysis(result);
      const item: PersonalAnalysisHistoryItem = {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        caseText: preparedCaseText,
        result,
      };
      setAnalysisHistory((prev) => [item, ...prev].slice(0, 5));
    } catch {
      setPersonalAnalysisError(
        'Не получилось разобрать кейс сейчас. Попробуй еще раз или немного уточни описание ситуации.',
      );
    } finally {
      setIsAnalyzingPersonalCase(false);
    }
  };

  const applyTag = (tag: string) => {
    setCustomCaseInput((prev) => {
      if (!prev.trim()) return `Категория: ${tag}. `;
      if (prev.includes(tag)) return prev;
      return `${prev.trim()} Категория: ${tag}. `;
    });
  };

  const copyResult = async () => {
    if (!personalAnalysis) return;
    const text = [
      `Риск: ${personalAnalysis.riskPercent}%`,
      `Понятно подростку: ${personalAnalysis.teenExplanation}`,
      `Разбор случая: ${personalAnalysis.caseBreakdown}`,
    ].join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-5xl min-w-0 overflow-x-hidden px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={motionTransition.page}
        className="relative overflow-hidden rounded-[1.5rem] border border-[#0066CC]/20 bg-gradient-to-br from-[#0066CC]/[0.12] via-[var(--card-bg)] to-[#00A3FF]/[0.1] p-6 shadow-[0_24px_80px_-22px_rgba(0,102,204,0.35)] dark:border-[#00A3FF]/25 dark:from-[#003366]/50 dark:via-[var(--card-bg)] dark:to-[#0066CC]/30 md:rounded-[2rem] md:p-10"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
          <motion.div
            className="absolute -left-1/4 top-0 h-[280px] w-[280px] rounded-full bg-[#0066CC] blur-[90px]"
            animate={reduceMotion ? undefined : { x: [0, 26, 0], y: [0, 18, 0], scale: [1, 1.06, 1] }}
            transition={reduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-1/4 bottom-0 h-[260px] w-[260px] rounded-full bg-[#00A3FF] blur-[85px]"
            animate={
              reduceMotion ? undefined : { x: [0, -24, 0], y: [0, -16, 0], scale: [1, 1.08, 1] }
            }
            transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative mb-8 md:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0066CC]/25 bg-white/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0066CC] shadow-sm backdrop-blur-md dark:border-[#00A3FF]/35 dark:bg-[#1a1a1a]/72 dark:text-[#00A3FF] md:text-sm">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
            Личный кейс
          </div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-br from-[#0066CC] via-[#0088ee] to-[#00A3FF] bg-clip-text text-transparent">
              Личный разбор
            </span>{' '}
            <span className="text-ingos-text-primary">случая</span>
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-ingos-text-secondary md:text-base">
            Выбери популярный страховой кейс как шаблон или опиши свою ситуацию. В ответ получишь: %
            риска, объяснение простым языком и короткий разбор твоего случая.
          </p>
        </div>

        <div className="relative mb-5 rounded-card border border-ingos-border bg-ingos-card/80 p-4 shadow-sm backdrop-blur-sm md:p-5">
          <label htmlFor="template-select" className="mb-2 block text-sm font-semibold text-ingos-text-primary">
            Шаблон популярного кейса
          </label>
          <select
            id="template-select"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full rounded-btn border border-ingos-border bg-ingos-page px-3 py-2.5 text-sm text-ingos-text-primary outline-none ring-[#0066CC]/40 focus:ring-2 md:text-base"
          >
            {personalCaseTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.title}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-ingos-text-secondary">{selectedTemplate.text}</p>
        </div>

        <div className="relative mb-6 rounded-card border border-ingos-border bg-ingos-card/80 p-4 shadow-sm backdrop-blur-sm md:p-5">
          <label htmlFor="custom-case" className="mb-2 block text-sm font-semibold text-ingos-text-primary">
            Или введи свой страховой случай
          </label>
          <textarea
            id="custom-case"
            value={customCaseInput}
            onChange={(e) => setCustomCaseInput(e.target.value)}
            placeholder="Например: Я ехал на самокате по мокрой дороге, упал и разбил телефон..."
            rows={4}
            className="w-full resize-y rounded-btn border border-ingos-border bg-ingos-page px-3 py-2.5 text-sm text-ingos-text-primary outline-none ring-[#0066CC]/40 focus:ring-2 md:text-base"
          />
          <p className="mt-2 text-xs text-ingos-text-secondary md:text-sm">
            Если поле пустое, используется выбранный шаблон.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {caseTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => applyTag(tag)}
                className="rounded-full border border-[#0066CC]/20 bg-white/70 px-3 py-1 text-xs font-semibold text-[#0066CC] transition hover:bg-[#0066CC]/10 dark:bg-[#003366]/35 dark:text-[#00A3FF]"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        <MotionButton
          onClick={handleAnalyzePersonalCase}
          disabled={isAnalyzingPersonalCase}
          className="w-full rounded-btn bg-[#0066CC] py-3 text-sm font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-70 md:w-auto md:px-6 md:text-base"
        >
          {isAnalyzingPersonalCase ? 'Разбираю кейс...' : 'Получить личный разбор'}
        </MotionButton>

        {personalAnalysisError ? (
          <p className="mt-4 rounded-btn border border-red-400/50 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
            {personalAnalysisError}
          </p>
        ) : null}

        {personalAnalysis ? (
          <div className="mt-6 space-y-4 rounded-card border border-ingos-border bg-[var(--accent-muted)] p-5 md:p-6">
            {personalAnalysis.source === 'fallback' && personalAnalysis.fallbackReason ? (
              <div className="rounded-btn border border-amber-400/50 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-200">
                {personalAnalysis.fallbackReason}
              </div>
            ) : null}
            <div className="rounded-btn border border-[#0066CC]/25 bg-white/70 px-4 py-3 dark:bg-[#003366]/35">
              <p className="text-xs font-semibold uppercase tracking-wide text-ingos-text-secondary">Риск</p>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-3xl font-extrabold text-[#0066CC] dark:text-[#00A3FF]">
                  {personalAnalysis.riskPercent}%
                </p>
                <Shield className="h-6 w-6 text-[#0066CC] dark:text-[#00A3FF]" />
                <span className={`text-sm font-bold ${riskLevelColor(personalAnalysis.riskPercent)}`}>
                  {riskLevelLabel(personalAnalysis.riskPercent)}
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ingos-secondary/70 dark:bg-[#003366]/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                  style={{ width: `${personalAnalysis.riskPercent}%` }}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-ingos-text-primary md:text-base">
                Понятно подростку
              </h3>
              <p className="text-sm leading-relaxed text-ingos-text-primary md:text-base">
                {personalAnalysis.teenExplanation}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-ingos-text-primary md:text-base">
                Разбор случая
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ingos-text-primary md:text-base">
                {personalAnalysis.caseBreakdown}
              </p>
            </div>
            <div className="flex justify-end">
              <MotionButton
                onClick={copyResult}
                className="inline-flex items-center gap-2 rounded-btn bg-ingos-secondary px-4 py-2 text-sm font-semibold text-[#0066CC] dark:bg-[#003366] dark:text-[#00A3FF]"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Скопировано' : 'Скопировать ответ'}
              </MotionButton>
            </div>
          </div>
        ) : null}

        {analysisHistory.length > 0 ? (
          <div className="mt-6 rounded-card border border-ingos-border bg-ingos-card/80 p-4 md:p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ingos-text-primary md:text-base">
              Последние разборы
            </h3>
            <div className="space-y-2">
              {analysisHistory.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCustomCaseInput(item.caseText);
                    setPersonalAnalysis(item.result);
                    setPersonalAnalysisError(null);
                  }}
                  className="w-full rounded-btn border border-ingos-border bg-ingos-page px-3 py-2 text-left text-sm transition hover:border-[#0066CC]/40"
                >
                  <p className="font-semibold text-ingos-text-primary">
                    Риск: {item.result.riskPercent}% ({riskLevelLabel(item.result.riskPercent)})
                  </p>
                  <p className="text-ingos-text-secondary">{historyCasePreview(item.caseText)}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <p className="mt-6 text-xs leading-relaxed text-ingos-text-secondary md:text-sm">
          Инструмент учебный и не заменяет консультацию страховой или юриста.
        </p>
        <div className="pointer-events-none absolute right-5 top-5 hidden rounded-2xl bg-white/60 p-2 text-[#0066CC] shadow-sm backdrop-blur-sm dark:bg-[#1a1a1a]/70 dark:text-[#00A3FF] md:block">
          <Bot className="h-6 w-6" />
        </div>
      </motion.section>
    </div>
  );
}

export default PersonalCasePage;
