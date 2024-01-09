const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const schedule = require('node-schedule');

const token = "6686111806:AAGI12lbTY8fIva8FUj2q44Z6NdC2uIrzlw";
const weatherAPIKey = "22a89b08fe7031d21ab40242f9da32d2";

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text;

    try {
        if (userInput === '/start') {
            sendWelcomeMessage(chatId);
        } else {
            await sendWeatherUpdate(chatId, userInput);
        }
    } catch (error) {
        bot.sendMessage(chatId, "Error processing your request. Please try again later.");
    }
});

const job = schedule.scheduleJob({ hour: 16, minute: 8, tz: 'Asia/Kolkata' }, async () => {
    const chatId = '1263028888'; 
    const userInput = 'Patna'; 

    try {
        await sendWeatherUpdate(chatId, userInput);
    } catch (error) {
        console.error("Error sending automatic weather update:", error);
    }
});

async function sendWeatherUpdate(chatId, userInput) {
    const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${weatherAPIKey}`
    );
    const data = response.data;
    const weather = data.weather[0].description;
    const temperature = data.main.temp - 273.15;
    const city = data.name;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const message = `${city}:\nWeather is ${weather}.\nTemperature is ${temperature.toFixed(2)}°C.\nHumidity is ${humidity}%.\nPressure is ${pressure}hPa.\nWind speed is ${windSpeed}m/s.`;

    bot.sendMessage(chatId, message);
}

function sendWelcomeMessage(chatId) {
    const welcomeMessage = "Welcome! Type the name of a city to get the current weather information.";
    bot.sendMessage(chatId, welcomeMessage);
}
