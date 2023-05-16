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

  try {
    // Make a POST request to ChatGPT API
    const response = await axios.post(apiEndpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
    });

    // Retrieve the reply from the API response
    const reply = response.data.choices[0].message.content;

    // Send the reply back to the user
    bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Oops! Something went wrong.');
  }
});

// Start the bot
bot.startPolling();
