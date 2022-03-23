const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    login: String,
    email: String,
    registrationDate: Date,
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});

module.exports = model('User', userSchema);