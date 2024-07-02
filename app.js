const express = require('express');
const geoip = require('geoip-lite');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000 || process.env.PORT;

const openWeatherMapApiKey = process.env.WEATHER_SECRET;
const openWeatherMapApiUrl = `http://api.openweathermap.org/data/2.5/weather`;

app.get('/', (req, res) => {
  res.json({ message: `Welcome to my API. Please go to /api/hello?visitor_name=your_name` });
})

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name;
  let clientIp;

  try {

    const resp = await axios.get('https://api.ipify.org?format=json');
    clientIp = resp.data.ip;

    const geo = geoip.lookup(clientIp);
    const location = geo? geo.city : 'Unknown';

    const response = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
        params: {
            q: location,
            units: 'metric', // Corrected 'units' parameter
            appid: openWeatherMapApiKey // valid API key
        }
    });

    console.log(`API Request: ${openWeatherMapApiUrl}?q=${location}&units=metric&appid=${openWeatherMapApiKey}`);

    const temperature = response.data.main.temp;
    const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celcius in ${location}`;

    res.json({
      client_ip: clientIp,
      location,
      greeting,
    });
} catch (error) {
    if (error.response) {
        console.error('Error Response:', error.response.data);
    } else {
        console.error('Error Message:', error.message);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})