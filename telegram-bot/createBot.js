import { Markup, Telegraf } from 'telegraf';

export function createSupportBot(token, operatorChatId) {
  if (!token) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN');
  }

  const debug = process.env.SUPPORT_BOT_DEBUG === '1';
  const userMode = new Map();

  function setMode(userId, mode) {
    if (mode == null) userMode.delete(userId);
    else userMode.set(userId, mode);
  }

  function getMode(userId) {
    return userMode.get(userId) ?? null;
  }

  const bot = new Telegraf(token);

  const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.callback('Предложение по сайту', 'm:site')],
    [Markup.button.callback('Личный страховой случай', 'm:case')],
    [Markup.button.callback('Связаться с оператором', 'm:op')],
  ]);

  const greeting =
    'Привет! Я бот поддержки курса по страхованию.\n\n' +
    'Нажми кнопку ниже.';

  async function stripReplyKeyboardAndShowMenu(ctx) {
    const uid = ctx.from?.id;
    if (uid != null) setMode(uid, null);

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
    }

    await ctx.reply(greeting, {
      reply_markup: { remove_keyboard: true },
    });
    await ctx.reply('Выбери действие:', inlineMenu);
  }

  if (debug) {
    bot.use((ctx, next) => {
      const u = ctx.updateType;
      const t =
        ctx.message?.text ??
        ctx.callbackQuery?.data ??
        `(${u})`;
      console.log(`[telegram-bot] ${u}: ${t}`);
      return next();
    });
  }

  bot.start(async (ctx) => {
    await stripReplyKeyboardAndShowMenu(ctx);
  });

  bot.command('menu', async (ctx) => {
    await stripReplyKeyboardAndShowMenu(ctx);
  });

  bot.action('m:site', async (ctx) => {
    await ctx.answerCbQuery();
    const uid = ctx.from?.id;
    if (uid != null) setMode(uid, 'site');
    await ctx.reply(
      'Напиши предложение одним сообщением.\n\n' +
        'Шаблон:\n' +
        '1) Раздел сайта\n' +
        '2) Что неудобно\n' +
        '3) Как улучшить\n' +
        '4) Почему это полезно',
    );
  });

  bot.action('m:case', async (ctx) => {
    await ctx.answerCbQuery();
    const uid = ctx.from?.id;
    if (uid != null) setMode(uid, 'case');
    await ctx.reply(
      'Опиши ситуацию одним сообщением.\n\n' +
        'Шаблон:\n' +
        '1) Что произошло\n' +
        '2) Когда и где\n' +
        '3) Есть ли полис\n' +
        '4) Что уже сделали\n' +
        '5) Какую помощь ожидаешь',
    );
  });

  bot.action('m:op', async (ctx) => {
    await ctx.answerCbQuery();
    const uid = ctx.from?.id;
    if (uid != null) setMode(uid, 'op');
    await ctx.reply(
      'Напиши сообщение для оператора — мы передадим его сотруднику и ответим в этом чате.',
    );
  });

  bot.on('text', async (ctx) => {
    const text = ctx.message.text?.trim();
    if (!text) return;

    if (text.startsWith('/')) return;

    const uid = ctx.from?.id;
    if (uid == null) return;

    const mode = getMode(uid);
    if (!mode) {
      await ctx.reply('Сначала отправь /start и выбери кнопку под сообщением.', inlineMenu);
      return;
    }

    const userInfo =
      `User: @${ctx.from.username || 'no_username'} | ${ctx.from.first_name || ''} ${
        ctx.from.last_name || ''
      }\n` + `Telegram ID: ${uid}`;

    if (mode === 'site') {
      if (operatorChatId) {
        await bot.telegram.sendMessage(
          operatorChatId,
          `🛠 Предложение по сайту\n\n${userInfo}\n\n${text}`,
        );
      }
      await ctx.reply(
        'Спасибо! Предложение передано команде курса.',
        inlineMenu,
      );
      setMode(uid, null);
      return;
    }

    if (mode === 'case' || mode === 'op') {
      if (operatorChatId) {
        await bot.telegram.sendMessage(
          operatorChatId,
          `⚠️ Обращение от пользователя\n\n${userInfo}\n\n${text}`,
        );
      }
      await ctx.reply(
        'Спасибо! Подробности переданы. Мы ответим в этом чате.',
        inlineMenu,
      );
      setMode(uid, null);
    }
  });

  return bot;
}
