const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Your Telegram bot token
const token = process.env.botToken;
const iniPath = process.env.iniPath;

// Check if the token and iniPath are available
if (!token) {
    console.error('Telegram Bot Token not provided!');
    process.exit(1);
}

if (!iniPath) {
    console.error('Gammu INI path not provided!');
    process.exit(1);
}
// Create a bot that uses polling to fetch new updates
const bot = new TelegramBot(token, { polling: true });  // Use the token here

bot.on('polling_error', (error) => console.log(error));  // Logs polling errors to the console

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Define a persistent custom keyboard with the Balance button
    const options = {
        reply_markup: {
            keyboard: [
                [{ text: 'Balance' }]  // Button to show Balance
            ],
            resize_keyboard: true,    // Resize keyboard to fit
            one_time_keyboard: false, // Keep the keyboard visible after clicking
        }
    };

    bot.sendMessage(chatId, 'Bot is started! You can check your balance anytime.', options);
});

// Handle the 'Balance' button click
bot.on('message', (msg) => {
    if (msg.text === 'Balance') {
        const chatId = msg.chat.id;

        exec(`gammu --config gammu.ini getussd *222# 2>&1`, (error, stdout, stderr) => {
            if (error && stderr) {
                console.log(error);
                console.log(stderr);
                bot.sendMessage(chatId, `Error executing USSD: ${stderr}`);
            } else {
                bot.sendMessage(chatId, `Balance: ${stdout}`);
            }
        });
    }
});

// Handle errors
bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code}`);
});
