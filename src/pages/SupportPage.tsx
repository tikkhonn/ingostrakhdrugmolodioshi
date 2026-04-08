import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Check, Copy, LifeBuoy, MessageCircle, Send, Sparkles } from 'lucide-react';
import { motionTransition } from '../theme/theme';

const defaultTelegramBotUrl = 'https://t.me/Ingshelp_bot';

const supportTopics = [
  {
    title: 'Предложение по сайту',
    text: 'Хочу предложить улучшение в интерфейсе/контенте/механике курса.',
  },
  {
    title: 'Личный страховой кейс',
    text: 'Хочу обсудить мой случай персонально с представителем службы страхования.',
  },
];

const supportMessageTemplates = [
  {
    id: 'site-feedback',
    title: 'Шаблон: предложение по сайту',
    text:
      'Привет! Хочу предложить улучшение на сайте.\n\n' +
      'Раздел: ...\n' +
      'Что сейчас неудобно: ...\n' +
      'Как предлагаю изменить: ...\n' +
      'Почему это поможет пользователям: ...',
  },
  {
    id: 'personal-case',
    title: 'Шаблон: личный страховой случай',
    text:
      'Здравствуйте! Хочу обсудить личный страховой случай.\n\n' +
      'Что произошло: ...\n' +
      'Когда и где: ...\n' +
      'Есть ли действующий полис: да/нет\n' +
      'Что уже сделал(а): ...\n' +
      'Нужна консультация сотрудника страховой компании.',
  },
];

const botReplyExamples = {
  greeting:
    'Привет! Я бот поддержки курса по страхованию. Напиши, пожалуйста, что тебе нужно: 1) предложение по улучшению сайта или 2) разбор личного страхового случая.',
  complexCase:
    'Спасибо за подробности! Вижу, что случай непростой. Я передам информацию сотруднику страховой компании. После консультации с профессионалом вернемся к тебе с ответом в этом чате Telegram.',
};

function SupportPage() {
  const reduceMotion = useReducedMotion();
  const botUrl = import.meta.env.VITE_SUPPORT_TELEGRAM_BOT_URL || defaultTelegramBotUrl;
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  const copyTemplate = async (templateId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTemplateId(templateId);
      setTimeout(() => setCopiedTemplateId(null), 1800);
    } catch {
      setCopiedTemplateId(null);
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

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0066CC]/25 bg-white/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0066CC] shadow-sm backdrop-blur-md dark:border-[#00A3FF]/35 dark:bg-[#1a1a1a]/72 dark:text-[#00A3FF] md:text-sm">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
            поддержка
          </div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-br from-[#0066CC] via-[#0088ee] to-[#00A3FF] bg-clip-text text-transparent">
              Техподдержка
            </span>
          </h1>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ingos-text-secondary md:text-base">
            Напиши в Telegram-бота создателям курса: предложи изменения по сайту или запроси персональное
            обсуждение страхового случая с сотрудником службы страхования.
          </p>

          <a
            href={botUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-btn bg-[#0066CC] px-5 py-3 text-sm font-bold text-white shadow-md md:text-base"
          >
            <Send className="h-4 w-4" />
            Перейти в Telegram-бот
          </a>
          <p className="mt-2 text-xs text-ingos-text-secondary">
            Если ссылка не настроена, укажи `VITE_SUPPORT_TELEGRAM_BOT_URL` в `.env.local`.
          </p>
        </div>
      </motion.section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {supportTopics.map((topic) => (
          <div
            key={topic.title}
            className="rounded-card border border-ingos-border bg-ingos-card p-5 shadow-sm md:p-6"
          >
            <div className="mb-3 flex items-center gap-2 text-[#0066CC] dark:text-[#00A3FF]">
              <MessageCircle className="h-5 w-5" />
              <h2 className="text-lg font-bold text-ingos-text-primary">{topic.title}</h2>
            </div>
            <p className="text-sm leading-relaxed text-ingos-text-secondary md:text-base">{topic.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-card border border-ingos-border bg-ingos-card p-5 md:p-6">
        <h3 className="mb-3 text-lg font-bold text-ingos-text-primary">Шаблоны сообщений в поддержку</h3>
        <div className="space-y-3">
          {supportMessageTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-btn border border-ingos-border bg-ingos-page p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-semibold text-ingos-text-primary">{template.title}</p>
                <button
                  type="button"
                  onClick={() => copyTemplate(template.id, template.text)}
                  className="inline-flex items-center gap-2 rounded-btn bg-ingos-secondary px-3 py-1.5 text-xs font-semibold text-[#0066CC] dark:bg-[#003366] dark:text-[#00A3FF]"
                >
                  {copiedTemplateId === template.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Скопировано
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Копировать
                    </>
                  )}
                </button>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ingos-text-secondary">
                {template.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-card border border-ingos-border bg-ingos-card p-5 md:p-6">
        <h3 className="mb-3 text-lg font-bold text-ingos-text-primary">Готовые автоответы для Telegram-бота</h3>
        <div className="space-y-3">
          <div className="rounded-btn border border-ingos-border bg-ingos-page p-4">
            <p className="mb-1 text-sm font-semibold text-ingos-text-primary">Ответ на приветствие</p>
            <p className="text-sm leading-relaxed text-ingos-text-secondary">{botReplyExamples.greeting}</p>
          </div>
          <div className="rounded-btn border border-ingos-border bg-ingos-page p-4">
            <p className="mb-1 text-sm font-semibold text-ingos-text-primary">
              Ответ на сложный случай (эскалация)
            </p>
            <p className="text-sm leading-relaxed text-ingos-text-secondary">{botReplyExamples.complexCase}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-card border border-ingos-border bg-ingos-card p-5 md:p-6">
        <div className="mb-2 flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-[#0066CC] dark:text-[#00A3FF]" />
          <h3 className="text-lg font-bold text-ingos-text-primary">Как написать, чтобы помогли быстрее</h3>
        </div>
        <ul className="list-inside list-disc space-y-2 text-sm text-ingos-text-secondary md:text-base">
          <li>Опиши ситуацию коротко: что случилось, когда, какие последствия.</li>
          <li>Если есть полис, укажи его тип и что уже пытались сделать.</li>
          <li>Добавь, что именно нужно: совет по сайту или личная консультация.</li>
        </ul>
      </div>
    </div>
  );
}

export default SupportPage;
