var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var async = require('async');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var socket = require('socket.io');
var sharedSession = require('express-socket.io-session');

var app = express();

app.set('port', process.env.PORT || 2500);
var server = app.listen(app.get('port'), function(err){
	if(err)
	{
		console.log('some error occurred while listening on port ', app.get('port'));
	}
	else
	{
		console.log('server listening on port ', app.get('port'));
	}
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());

 var session1 = session({
	secret : 'raju',
	resave : false,
	saveUninitialized : false,
	cookie : {
		httpOnly : true,
		maxAge : 1*60*60*1000
	},
	rolling : true,
	store : new MongoStore({
		url : 'mongodb://localhost:27017/b2dchat_db'
	})
});
app.use(session1);

// var io = socket();
// io.listen(5555);
// io.use(sharedSession(session1));

require('./controllers/basic_controller.js')(app);

require('./controllers/prop_controller.js')(app);

// require('./controllers/home_controller.js')(app);