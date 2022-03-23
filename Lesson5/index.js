const express = require("express");
const app = express();
const authors = require("./routes/authors");
const gameDeck = require("./routes/game-deck");
require("dotenv").config();

app.use(express.json());
app.use("/game-deck", gameDeck);
app.use("/authors", authors);

const client = require("./config/redisClient");

client.on("error", err => {
  console.error("Error connecting to Redis", error);
});
client.on("connect", () => {
    console.log(`Connected to Redis.`)
    const port = process.env.PORT || 5000
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
});
