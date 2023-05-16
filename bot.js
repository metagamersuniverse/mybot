require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Telegram Bot Token
const telegramToken = process.env.TELEGRAM_TOKEN;
// ChatGPT Plus API Token
const gptAPIKey = process.env.GPT_API_KEY;

// Create a Telegram bot instance
const bot = new TelegramBot(telegramToken, { polling: true });

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  try {
// Send message to ChatGPT API
const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
  prompt: 'You are a helpful assistant.\nUser: ' + message,
  max_tokens: 50,
  temperature: 0.6,
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${gptAPIKey}`,
  },
});

// Retrieve the generated response from ChatGPT
const generatedText = response.data.choices[0].text;
    // Send the response back to the user
    bot.sendMessage(chatId, generatedText);
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, 'Oops! Something went wrong.');
  }
});

// Start the bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = 'Hello! I am your friendly ChatGPT bot. Feel free to chat with me!';
  bot.sendMessage(chatId, welcomeMessage);
});