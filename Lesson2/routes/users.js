const express = require('express');
const router = express.Router();

const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    return res.send(users);
});


// Add a new user
router.post('/', async (req, res) => {
    const user = new User({...req.body});
    const add = await user.save();
    return res.send(add);
});


// Get a user by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id, (result, err) => {
    if (err) {
      return res.status(500).send(err);
    }
    else {
      return res.send(result);
    }
  })
});


// Update a user by ID (with PUT)
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const putuser = await User.replaceOne({_id: id}, req.body, (err, result) => {
      if (err){
        return res.status(500).send(err);
      }
      else {
        return res.send(result);
      }
    })
});


// Delete a user by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const deluser = await User.findByIdAndDelete(id, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    else {
      return res.send(result);
    }
  })
});


// Update a user by ID (with PATCH)
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const patchuser = await User.findById(id);

    patchuser.name = req.body.name;
    const patch = await patchuser.save();

    return res.send(patch);
});

module.exports = router;
