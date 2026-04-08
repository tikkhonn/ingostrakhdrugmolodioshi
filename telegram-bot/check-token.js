/**
 * Проверка токена и webhook без запуска polling.
 * Запуск: node check-token.js (из папки telegram-bot, с .env)
 */
import 'dotenv/config';
import { Telegraf } from 'telegraf';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Нет TELEGRAM_BOT_TOKEN в .env');
  process.exit(1);
}

const bot = new Telegraf(token);

try {
  const me = await bot.telegram.getMe();
  const wi = await bot.telegram.getWebhookInfo();
  console.log('OK:');
  console.log(`  id: ${me.id}`);
  console.log(`  username: @${me.username}`);
  console.log(`  webhook URL: ${wi.url || '(пусто — нормально для long polling)'}`);
  console.log(`  pending updates: ${wi.pending_update_count ?? 0}`);
} catch (e) {
  console.error('Ошибка токена или сети:', e instanceof Error ? e.message : e);
  process.exit(1);
}
