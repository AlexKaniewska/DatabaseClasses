const express = require('express');
const router = express.Router({mergeParams: true});

const Post = require('../models/Post');
const User = require('../models/User');

// Get all user's posts
router.get('/', async (req, res) => {
  const all = await Post.find({"author": req.params.idUser});
  return res.send(all);
});


// Get a post by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const idPost = await Post.findById(id);
  return res.send(idPost);
});


// Add a new post
router.post('/:userId', async (req, res) => {
  const toPost = new Post({...req.body, author: req.params.idUser});
  const addPost= await toPost.save();

  await User.findByIdAndUpdate(req.params.idUser,
    {'$push': {'posts': addPost._id}},
    {'new': true});
    return res.send(addPost);

});


// Delete a post by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const delPost = await Post.findByIdAndDelete(id);

  await User.findByIdAndUpdate(req.params.idUser,
    {'$pull': {'posts': id}})

  return res.send(delPost);

});


//exercise 2

//Summary of posts
router.post('/posts/summary', async (req, res) => {
  const all = await Post.aggregate([
    { $group: { _id: null, average: {$avg: '$responses'}, sum: { $sum: "$responses" }, min: { $min: "$responses"}, max: {$max: '$responses'}} }
  ]);

  return res.send(all);
})



module.exports = router;
