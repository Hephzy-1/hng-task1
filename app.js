const express = require('express');
const geoip = require('geoip-lite');
const axios = require('axios');

const app = express();
const PORT = 3000 || process.env.PORT;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name;
  let clientIp;

  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    clientIp = response.data.ip;
  } catch (error) {
    console.error(error);
    clientIp = req.ip;
  }

  const geo = geoip.lookup(clientIp);
  console.log(geo);

  const location = geo ? geo.city : 'Unknown';
  const temperature = 31; // General temperature
  const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celcius in ${location}`;

  res.json({
    client_ip: clientIp,
    location,
    greeting,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})