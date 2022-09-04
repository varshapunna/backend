const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Enter your username'],
        unique: [true, "Opps! Username has already taken"],
        trim: true,
        lowercase: true,

    },
    firstname: {
        type: String,
        required: [true, 'Enter your firstname'],
        trim: true,
        lowercase: true,
    },
    lastname: {
        type: String,
        required: [true, 'Enter your lastname'],
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: [true, 'Password is Not Valid. Min lenght 6'],
        minlength: 6,
        lowercase: true,
        uppercase: true,
        number: true,
        nonalpha: true

    },

    email: {
        type: String,
        required: [true, 'Enter your email'],
        unique: [true, "Email already exist"],
        trim: true,
        validate: function (value) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(value);
        }
    },

    type: {
        type: String,
    },

    token: {
        type: String
    }

});

const User = mongoose.model("User", UserSchema);
module.exports = User;


