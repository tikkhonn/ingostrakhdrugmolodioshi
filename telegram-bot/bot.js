import 'dotenv/config';
import { createSupportBot } from './createBot.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
const operatorChatId = process.env.SUPPORT_OPERATOR_CHAT_ID;

if (!token) {
  throw new Error('Missing TELEGRAM_BOT_TOKEN in telegram-bot/.env');
}

const bot = createSupportBot(token, operatorChatId);

async function startBot() {
  try {
    const before = await bot.telegram.getWebhookInfo();
    console.log(`[telegram-bot] webhook before delete: ${before.url || '(none)'}`);

    await bot.telegram.deleteWebhook({ drop_pending_updates: true });

    const after = await bot.telegram.getWebhookInfo();
    console.log(`[telegram-bot] webhook after delete: ${after.url || '(none)'}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown deleteWebhook error';
    console.warn(`[telegram-bot] deleteWebhook warning: ${message}`);
  }

  try {
    console.log('[telegram-bot] connecting (long polling, first request may take a while)...');
    await bot.launch({ dropPendingUpdates: true });
    const me = await bot.telegram.getMe();
    console.log(`[telegram-bot] polling started. Bot: @${me.username}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown launch error';
    console.error(`[telegram-bot] failed to start: ${message}`);
    process.exit(1);
  }
}

void startBot();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
