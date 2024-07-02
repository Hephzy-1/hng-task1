const express = require('express');
const geoip = require('geoip-lite');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const openWeatherMapApiKey = process.env.WEATHER_SECRET;
console.log(openWeatherMapApiKey)
const openWeatherMapApiUrl = 'http://api.openweathermap.org/data/2.5/weather'

app.get('/', (req, res) => {
  res.send('Welcome to my API. Please go to /api/hello?visitor_name=your_name');
});

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name;
  let clientIp;

  if (!visitorName) {
    return res.status(400).json({ error: 'Visitor name is required' });
  }

  try {
    // Get the client's IP address
    const resp = await axios.get('https://api.ipify.org?format=json');
    clientIp = resp.data.ip;

    // Get the client's geolocation data
    const geo = geoip.lookup(clientIp);
    const location = geo ? geo.city : 'Unknown';

    // Get the weather data
    const response = await axios.get(openWeatherMapApiUrl, {
      params: {
        q: location,
        units: 'metric',
        appid: openWeatherMapApiKey
      }
    });

    console.log(`API Request: ${openWeatherMapApiUrl}?q=${location}&units=metric&appid=${openWeatherMapApiKey}`);

    const temperature = response.data.main.temp;
    const greeting = `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`;

    res.json({
      client_ip: clientIp,
      location,
      greeting,
    });
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Error Message:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;