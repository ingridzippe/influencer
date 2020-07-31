const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');
var models = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    models.User.findById(id).then((user) => {
        done(null, user);
    })
});

passport.use(
    new GoogleStrategy({
        // options for strategy
        callbackURL: "/auth/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log("passport callback function fired")
        console.log(profile);
        // new models.User({
        //     username: profile.displayName,
        //     googleId: profile.id
        // }).save().then((newUser) => {
        //     console.log('new user created' + newUser);
        // })
        // check if user already exists in database 
        models.User.findOne({googleId: profile.id}).then((currentUser) => {
            if (currentUser) {
                // already have user
                console.log("user is", currentUser);
                done(null, currentUser);
            } else {
                // if not, create new user
                new models.User({
                    username: profile.displayName, 
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    photo: profile._json.picture
                }).save().then((newUser) => {
                    console.log('new user created');
                    console.log(newUser);
                    done(null, newUser);
                })
            }
        })
    })
)