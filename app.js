"use strict";

var express = require('express');
var app = express();
var path = require('path');
const https = require('https');
const http = require('http');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
var passport = require('passport');
const profileRoutes = require('./routes/profile-routes');
const models = require('./models/user-model');


setInterval(function() {
    http.request('http://secret-fjord-13510.herokuapp.com/', console.log("here")).end();
    console.log('set interval aAAAAAA')
    console.log('server poked');
}, 300000); // every 5 minutes (300000)


var exphbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'hbs');
app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000,
	keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
	console.log('connected to mongodb')
})

app.use('/profile', profileRoutes);
app.get('/', function(req, res) {
  res.render('index', { user: req.user });
});
app.get('/login'), (req, res) => {
	res.render('login', { user: req.user });
}
app.get('/logout'), (req, res) => {
	req.logout();
	res.redirect('/');
}

var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
	callbackURL: "https://secret-fjord-13510.herokuapp.com/auth/facebook/callback",
	profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
	console.log("facebook callback")
	console.log(profile);
	// check if user already exists in database 
	models.User.findOne({facebookId: profile.id}).then((currentUser) => {
		if (currentUser) {
			// already have user
			console.log("user is", currentUser);
			done(null, currentUser);
		} else {
			// if not, create new user
			new models.User({
				username: profile.displayName, 
				facebookId: profile.id,
				email: profile._json.email
			}).save().then((newUser) => {
				console.log('new user created');
				console.log(newUser);
				done(null, newUser);
			})
		}
	})
  }
));
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', 
	passport.authenticate('facebook', { scope: ['email', 'user_friends'] }));
// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile',
									  failureRedirect: '/login' }));
									  

app.get('/auth/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));
app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
	/// res.send(req.user);
	res.redirect('/profile')
});

var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
passport.use(new LinkedInStrategy({
	clientID: keys.linkedin.clientID,
	clientSecret: keys.linkedin.clientSecret,
	callbackURL: "https://secret-fjord-13510.herokuapp.com/auth/linkedin/callback",
	scope: ['r_emailaddress', 'r_liteprofile'],
	state: true
  }, function(accessToken, refreshToken, profile, done) {
	// asynchronous verification, for effect...
	console.log('linkedin authenication');
	console.log(profile);
	models.User.findOne({linkedinId: profile.id}).then((currentUser) => {
		if (currentUser) {
			// already have user
			console.log("user is", currentUser);
			done(null, currentUser);
		} else {
			// if not, create new user
			new models.User({
				username: profile.displayName, 
				linkedinId: profile.id, 
				email: profile.emails[0].value,
				photo: profile.photos[0].value
			}).save().then((newUser) => {
				console.log('new user created');
				console.log(newUser);
				done(null, newUser);
			})
		}
	})
  }));
app.get('/auth/linkedin',
  	passport.authenticate('linkedin'),
  	function(req, res){
    	// The request will be redirected to LinkedIn for authentication, so this
    	// function will not be called.
});
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
	successRedirect: '/profile',
	failureRedirect: '/login'
}));

app.post('/saveprofile', function(req, res) {
	console.log('save profile');
	console.log('req.body');
	console.log(req.body);
	var userid = req.body.userid;
	console.log(typeof userid);
	console.log(userid);
	var raceArray = [];
	var languageArray = [];
	var expertiseArray = [];
	var menteeArray = [];
	var mentoringArray = [];
	if (typeof req.body.race != Array) {
		raceArray.push(req.body.race);
	} else { // it is an array, set equal to raceArray
		raceArray = req.body.array;
	}
	if (typeof req.body.language != Array) {
		languageArray.push(req.body.language);
	} else { // it is an array, set equal to raceArray
		languageArray = req.body.language;
	}
	if (typeof req.body.expertise != Array) {
		expertiseArray.push(req.body.expertise);
	} else { // it is an array, set equal to raceArray
		expertiseArray = req.body.expertise;
	}
	if (typeof req.body.menteeage != Array) {
		menteeArray.push(req.body.menteeage);
	} else { // it is an array, set equal to raceArray
		menteeArray = req.body.menteeage;
	}
	if (typeof req.body.mentoringtype != Array) {
		mentoringArray.push(req.body.mentoringtype);
	} else { // it is an array, set equal to raceArray
		mentoringArray = req.body.mentoringtype;
	}
	models.User.update({_id: userid}, {
		zipcode: req.body.zipcode,
		city: req.body.city,
		state: req.body.state,
		birthday: req.body.birthday,
		gender: req.body.gender,
		lgbtq: req.body.lgbtq,
		race: raceArray,
		language: languageArray, 
		expertise: expertiseArray,
		other: req.body.other,
		education: req.body.education,
		menteeage: menteeArray,
		mentoringtype: mentoringArray,
		jobtitle: req.body.jobtitle,
		company: req.body.company, 
		hours: req.body.hours,
		time: req.body.time
	}, function(err, numberAffected, rawResponse) {
	   //handle it
	   console.log("hello")
	   console.log(numberAffected);
	   console.log(rawResponse);
	   res.render('thankyou');
	})
	// models.User.findOne({_id: userid}).then((currentUser) => {
	// 	if (currentUser) {
	// 		// already have user
	// 		console.log("user is", currentUser);
	// 		done(null, currentUser);
	// 	} else {
	// 		// if not, create new user
	// 		console.log("hard liquor")
	// 	}
	// })

	// models.User.findByIdAndUpdate({userid},
	// 	{
	// 		"gender": req.body.gender
	// 	}, function(err, result) {
    //     	if (err) {
    //         	res.send(err)
    //     	} else {
    //         	res.send(result)
    //     	}
	// 	})
});

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Express started. Listening on port %s', port);
