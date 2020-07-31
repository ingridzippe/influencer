"use strict";

// require express and create the express app
var express = require('express');
var app = express();
var path = require('path');

// Set up handlebar templates
var exphbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
// app.engine('.hbs', exphbs({defaultLayout: 'main'}));
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
// exphbs.registerPartial('header', '{{header}}');

// require mongoose for interacting with database
// var mongoose = require('mongoose');

// require body-parser and setup so you can look at body of post requests
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

// create mongodb_uri environment
// if (! process.env.MONGODB_URI) {
//   throw new Error('MONGODB_URI is not in the environment. Try running source env.sh');
// }

// // set up mongoose to talk to mongodb database
// mongoose.connection.on('connected', function() {
//   console.log('Success: connected to MongoDb!');
// });
// mongoose.connection.on('error', function(error) {
//   console.log('Error connecting to MongoDb: ' + error);
//   process.exit(1);
// });
// // establish mongoose connection to the mongodb on mlab
// mongoose.connect(process.env.MONGODB_URI);

// GET and POST request go below
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
  res.render('index')
});

// TOPICS
app.get('/video', function(req, res) {
	res.render('index', {
		vidVal: 'block',
		techVal: 'none',
		picsVal: 'none',
		funVal: 'none',
	    designVal: 'none',
		paintVal: 'none'
	})
})

app.get('/tech', function(req, res) {
	res.render('tech')})

app.get('/pics', function(req, res) {
	res.render('index', {
		picsVal: 'block',
		techVal: 'none',
		vidVal: 'none',
		funVal: 'none',
		designVal: 'none',
		paintVal: 'none'
	})
})

app.get('/design', function(req, res) {
	res.render('index', {
		picsVal: 'none',
		techVal: 'none',
		vidVal: 'none',
		funVal: 'none',
		designVal: 'block',
		paintVal: 'none'
	})
})

app.get('/paint', function(req, res) {
	res.render('paint')
})


app.get('/bio', function(req, res) {
	res.render('bio')})


// THEMED
app.get('/weallwant', function(req, res) {
	res.render('topics', {
		vidurl: 'https://www.youtube.com/embed/a5BD99GR930'
	})
})
app.get('/hitmewithurlove', function(req, res) {
	res.render('topics', {
		vidurl: 'https://www.youtube.com/embed/PScGI6tmLK8'
	})
})





app.listen(3000, function() {
  console.log('Facebook backend listening on post 3000.');
});
