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

// linkedin http requirements
const https = require('https');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

app.get('/linkedin', function(req, res) {
	console.log("linkedin");
	res.redirect("https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78w1f2pk5r3x2y&redirect_uri=https://secret-fjord-13510.herokuapp.com/auth/linkedin/callback&state=fooobar&scope=r_liteprofile%20r_emailaddress%20w_member_social");
});

app.get('/auth/linkedin/callback', function(req, res) {
	console.log("callback");

	const accessCode = req.query.code;
	var clientId = "78w1f2pk5r3x2y";
	var clientSecret = "7XrmOoEUZC27RAUN";
	var accessToken = null;

	const Http = new XMLHttpRequest();
	const url='https://www.linkedin.com/oauth/v2/accessToken?client_id='+clientId+'&client_secret='+clientSecret+'&grant_type=authorization_code&redirect_uri=https://secret-fjord-13510.herokuapp.com/auth/linkedin/callback&code='+accessCode;
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange = (e) => {
		console.log("type of HttpResonseText");
		console.log(typeof Http.responseText);
		accessToken = Http.responseText.slice(17, Http.responseText.length-23);
		console.log(accessToken);

		// This sample code will make a request to LinkedIn's API to retrieve and print out some
		// basic profile information for the user whose access token you provide.
		// Replace with access token for the r_liteprofile permission
		if (accessToken != null) {

		// printing info
		const options = {
			host: 'api.linkedin.com',
			path: '/v2/me',
			method: 'GET',
			headers: {
			'Authorization': `Bearer ${accessToken}`,
			'cache-control': 'no-cache',
			'X-Restli-Protocol-Version': '2.0.0'
			}
		};
		const profileRequest = https.request(options, function(res) {
			let data = '';
			res.on('data', (chunk) => {
			data += chunk;
			});
			res.on('end', () => {
			console.log('gets in here?')
			const profileData = JSON.parse(data);
			console.log(profileData);
			console.log(JSON.stringify(profileData, 0, 2));
			// console.log("profileData.firstName.en_US");
			// console.log("LAST NAME");
			// console.log(profileData.lastName.localized.en_US);
			// console.log("profileData.lastName.en_US");
			// console.log(profileData.lastName.en_US);
			});
		});
		profileRequest.end();

		// print image photo
		// GET https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams))
		// const options2 = {
		//   host: 'api.linkedin.com',
		//   path: '/v2/me?projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams))',
		//   method: 'GET',
		//   headers: {
		//     'Authorization': `Bearer ${accessToken}`,
		//     'cache-control': 'no-cache',
		//     'X-Restli-Protocol-Version': '2.0.0'
		//   }
		// };
		// const profileRequest2 = https.request(options2, function(res) {
		//   let data = '';
		//   res.on('data', (chunk) => {
		//     data += chunk;
		//   });
		//   res.on('end', () => {
		//     console.log('prints email?')
		//     const profileData = JSON.parse(data);

		//     console.log("profileData");
		//     console.log(profileData);

		//     console.log("JSON.stringify(profileData, 0, 2)");
		//     console.log(JSON.stringify(profileData, 0, 2));
			
		//     console.log("profileData.elements");
		//     console.log(profileData.elements);

		//     var profileString = JSON.stringify(profileData.elements);
		//     console.log(profileString);
			// var profileArray = profileString.split(`"`);
			// console.log(profileArray);
		//   });
		// });
		// profileRequest2.end();


		// printing email
		const options2 = {
			host: 'api.linkedin.com',
			path: '/v2/emailAddress?q=members&projection=(elements*(handle~))',
			method: 'GET',
			headers: {
			'Authorization': `Bearer ${accessToken}`,
			'cache-control': 'no-cache',
			'X-Restli-Protocol-Version': '2.0.0'
			}
		};
		const profileRequest2 = https.request(options2, function(res) {
			let data = '';
			res.on('data', (chunk) => {
			data += chunk;
			});
			res.on('end', () => {
			console.log('prints email?')
			const profileData = JSON.parse(data);
		
			console.log("profileData");
			console.log(profileData);
		
			console.log("JSON.stringify(profileData, 0, 2)");
			console.log(JSON.stringify(profileData, 0, 2));
		
			console.log("profileData.elements");
			console.log(profileData.elements);
		
			// var profileString = JSON.stringify(profileData.elements);
			// console.log(profileString);
			// var profileArray = profileString.split(`"`);
			// console.log(profileArray);
			});
		});
		profileRequest2.end();


		}

	}

	res.render('login')
});





app.listen(3000, function() {
  console.log('Facebook backend listening on post 3000.');
});
