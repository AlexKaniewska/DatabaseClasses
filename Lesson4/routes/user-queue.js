const express = require('express');
const router = express.Router();
const client = require('../config/redisClient');


// Get all data
router.get('/', async (req, res) => {
  client.lrange('user-queue', 0, -1, function (err, data) {
    return res.send(data)
  });
});


// Add a new value
router.post('/', async (req, res) => {
  const value = req.body.value;
  client.rpush('user-queue', value);
  return res.send(value);
});


// Get elements from range
router.get('/:range', async (req, res) => {
  const range = req.params.range;
  client.lrange('user-queue', 0, range, function (err, data) {
    return res.send(data)
  })
});


// Delete a value
router.delete('/', async (req, res) => {
  client.lpop('user-queue', function(err, data) {
    return res.send(data)
  })
});

module.exports = router;
