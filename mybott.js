const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Configure the Telegram Bot API token
const token = process.env.TELEGRAM_API_TOKEN;

// Configure your ChatGPT API endpoint and authorization token
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
const apiToken = process.env.CHATGPT_API_TOKEN;

// Create a new Telegram bot instance
const bot = new TelegramBot(token, { polling: true });

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! I am your ChatGPT bot.');
});

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  // Prepare the payload for ChatGPT API
  const payload = {
    messages: [
      { role: 'system', content: 'You are User' },
      { role: 'user', content: message },
    ],
    max_tokens: 100,
  };

  // Make a POST request to ChatGPT API
  try {
    const response = await axios.post(apiEndpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
    });

    const reply = response.data.choices[0].message.content;
    bot.sendMessage(chatId, reply);
  } catch (error) {
    bot.sendMessage(chatId, 'Oops! Something went wrong.');
  }
});

// Start the bot
bot.startPolling();