const express = require('express');
const router = express.Router({mergeParams: true});
const client = require('../config/redisClient');


// Get all data
router.get('/', async (req, res) => {
  client.keys(`user-preferences:*`, function (err, data) {
    return res.send(data)
  })
});


// Get an element by KEY
router.get('/:key', async (req, res) => {
  const key = req.params.key;
  client.get(`user-preferences:${key}`).then(function (result) {
    return res.send(result)
  });
});


// Add a new element (key and value)
router.post('/', async (req, res) => {
  const body = {...req.body};
  const key = body.key
  const value = body.value;
  const time = body.time;
  if (time) {
    client.set(`user-preferences:${key}`, value, 'EX', time, function (err, data) {
      return res.send(data)
    })
  }
  else {
    client.set(`user-preferences:${key}`, value, function (err, data) {
      return res.send(data)
    });
  }
});


// Update an element by KEY
router.put('/:key', async (req, res) => {
  const key = req.params.key;
  const value = req.body.value;
  const time = req.body.time;
  if (time) {
    client.set(`user-preferences:${key}`, value, 'EX', time, 'XX');
    return res.send({
      updatedPreference: key
  });
  }
  else {
    client.set(`user-preferences:${key}`, value, 'XX');
    return res.send({
      updatedPreference: key
  });
  }
});


// Delete an element by KEY
router.delete('/:key', async (req, res) => {
  const key = req.params.key;
  client.del(`user-preferences:${key}`);
  return res.send({
    deletedPreference: key
  });
});



module.exports = router;
