const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Post = require('../models/Post');

// Get all users
router.get('/', async (req, res) => {
    const all = await User.find();
    return res.send(all);
});


// Add a new user
router.post('/', async (req, res) => {
  const user = new User({...req.body});
  const postUser = await user.save();
  return res.send(postUser);

});


// Get a user by ID (with posts)
router.get('/:idUser', async (req, res) => {
  const id = req.params.idUser;
  const idUser = await User.findById(id).populate('posts', {text: 1, responses: 1});
  return res.send(idUser);

});


// Update a user by ID (with PUT)
router.put('/:idUser', async (req, res) => {
  const id = req.params.idUser;
  const putUser = await User.replaceOne(id, req.body, (err, result) => {
    if (err) return res.status(500).send(err)
    return res.send(result);
  })

});


// Delete a user by ID
router.delete('/:idUser', async (req, res) => {
  const id = req.params.idUser;
  const delUser = await User.findByIdAndDelete(id);
  const delPosts = await Post.deleteMany({"author": id});
  return res.send(delUser);

});


// Update user by ID (with PATCH)
router.patch('/:idUser', async (req, res) => {
  const id = req.params.idUser;
  const user = await User.findById(id);

  user.login = req.body.login;
  const update = await user.save();
  return res.send(update);
});


//exercise 2

// Count users by registration date (from the selected date)
router.post('/registration-raport', async (req, res) => {
  const data = req.query.date;
  const numbers = data.split('-');
  const all = await User.aggregate([
    {$match: {registrationDate: {$gt: new Date(data)}}},
    {$group: {_id: '$registrationDate', count: {$sum: 1}}}  
  ])
  return res.send(all);
});


// Summary posts by author's email
router.post('/summary', async (req, res) => {
  const all = await Post.aggregate()
    .lookup({from: 'users', localField: 'author', foreignField: '_id', as: 'authors'})
    .unwind('$authors')
    .group({_id: '$authors.email', posts: {$sum: 1}});
  return res.send(all);
});

module.exports = router;
