const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        requred: [true, "Login is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    registrationDate: Date,
});

module.exports = model('User', userSchema);