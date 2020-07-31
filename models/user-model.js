const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const keys = require('../config/keys');

// Step 0: Remember to add your MongoDB information in one of the following ways!
console.log(keys.mongodb.dbURI)
var connect = keys.mongodb.dbURI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: false
    }, 
    googleId: {
        type: String, 
        required: false
    },
    facebookId: {
        type: String,
        required: false
    },
    linkedinId: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    photo: {
        type: String,
        required: false
    },
    zipcode: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    birthday: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    lgbtq: {
        type: String,
        required: false
    },
    race: {
        type: Array,
        required: false
    }, 
    language: {
        type: Array, 
        required: false
    }, 
    expertise: {
        type: Array, 
        required: false
    }, 
    other: {
        type: String, 
        required: false
    }, 
    education: {
        type: String,
        required: false
    },
    menteeage: {
        type: Array, 
        required: false
    },
    mentoringtype: {
        type: Array,
        required: false
    },
    jobtitle: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    hours: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: false
    }
});

var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
};