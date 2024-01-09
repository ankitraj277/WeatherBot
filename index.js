const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = "6686111806:AAGI12lbTY8fIva8FUj2q44Z6NdC2uIrzlw";

const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text;

    try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=22a89b08fe7031d21ab40242f9da32d2`
        );
        const data = response.data;
        const weather = data.weather[0].description;
        const temperature = data.main.temp - 273.15;
        const city = data.name;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const windSpeed = data.wind.speed;
        const message = `  ${city} : \n Weather is ${weather}.\n Temperature is ${temperature.toFixed(2)}°C.\n Humidity is ${humidity}%.\n Pressure is ${pressure}hPa.\n Wind speed is ${windSpeed}m/s.`;
    
        bot.sendMessage(chatId, message);
      } catch (error) {
        bot.sendMessage(chatId, "Write correct city");
      }
  });