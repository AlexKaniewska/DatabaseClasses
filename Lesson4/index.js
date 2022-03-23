const express = require('express');
const app = express();
const userPreferences = require('./routes/user-preferences');
const userQueue = require('./routes/user-queue');
require('dotenv').config();

app.use(express.json());
app.use('/user-preferences', userPreferences);
app.use('/user-queue', userQueue);


const client = require('./config/redisClient');

client.on('error', err => {
  console.error('Error connecting to Redis', error);
});
client.on('connect', () => {
    console.log(`Connected to Redis.`)
    const port = process.env.PORT || 5000
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
});