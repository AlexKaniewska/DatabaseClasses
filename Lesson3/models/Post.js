const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    text: String,
    responses: Number,
    author: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = model('Post', postSchema);