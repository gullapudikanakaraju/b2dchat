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

var io = socket();
io.listen(5555);
io.use(sharedSession(session1));

require('./controllers/basic_controller.js')(app);

require('./controllers/locality_controller.js')(app);

require('./controllers/prop_controller.js')(app);

// var io= require('./config/socket.js');

io.on('connection', function(socket){
	console.log('one connection established ', socket.id);
	socket.handshake.session.socket_id = socket.id;
	socket.handshake.session.save();
	// var rooms = socket.handshake.session.my_groups;
	// console.log('rooms are ', rooms);
	// for(var i=0; i<rooms.length; i++)
	// {
	// 	socket.join(rooms[i]);
	// 	console.log(socket.id, ' joined the room ', rooms[i]);
	// } 
	var socket_data_model = require('./schemas/socket_data_schema.js');
	var data = {};
	data.email = socket.handshake.session.email;
	data.socket_id = socket.id;

	socket_data_model.findOne({email : data.email}, function(error, result){
		if(error)
			throw error;
		else
		{
			if(result == null)
			{
				socket_data_model.create(data, function(e1, r1){
					if(e1)
					{
						console.log('some internal error occurred ', e1);
						throw error;
					}
					else
						console.log('successfully inserted email and socket_id in the db ', r1);
				});
			}
			else
			{
				socket_data_model.update({email : data.email}, {socket_id : data.socket_id}, function(e2, r2){
					if(e2)
					{
						console.log('some internal error occurred ', e2);
						throw err;
					}
					else
						console.log('successfully updated socket_id in the database ', res);
				});
			}
		}
	});

	socket.on('getMyRooms', function(){
		var dealer_model = require('./schemas/dealer_schema.js');

		dealer_model.findOne({email: socket.handshake.session.email},{groups: 1}, function(error, result){
			if(error)
			{
				console.log('some internal error occurred ', error);
				socket.emit('getMyRooms_reply', {
					success: false,
					message: 'some internal error occurred !'
				});
			}
			else
			{
				console.log('my groups are ', result);
				socket.emit('getMyRooms_reply', {
					success: true,
					data: result
				});
			}
		});
	});
});