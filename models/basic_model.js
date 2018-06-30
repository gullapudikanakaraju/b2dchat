module.exports = function(){
	return {
		login_check : function(request, response){
			var data= request.body;
			console.log('in basic_model.js login_check()');
			var member_model;
			if(data.member == 'dealer')
			{
				member_model= require('../schemas/dealer_schema.js');
			}
			if(data.member == 'buyer')
			{
				member_model= require('../schemas/buyer_schema.js');
			}

			var member= data.member;
			delete data.member;
			member_model.findOne({email : data.email}, function(error, result){
				if(error)
				{
					console.log('some error occurred while retrieving the email from the db ', error);
					response.status(500);
					response.send('Some internal error occurred...\nPlease go back and try again later.');
				}
				else
				{
					if(result == null)
					{
						console.log('No such User');
						// response.json({
						// 	success: false,
						// 	message: 'No such User !'
						// });
						response.render('../views/login', {message : 'No such User !'});
					}
					else
					{
						var hashed_password = result.password;
						var bcrypt = require('bcryptjs');
						bcrypt.compare(data.password, hashed_password, function(err, x){
							if(x == true)
							{
								console.log('login successful ');
								request.session.user_name = result.user_name;
								request.session.email= result.email;
								request.session._id= result._id;
								request.session.member= member;
								console.log('session data is ', request.session);

								var city_model= require('../schemas/property_schema.js');
								city_model.distinct('city', function(e, r){
									if(e)
									{
										console.log('some internal error occurred ', e);
										response.status(500);
										response.json({
											success: false,
											message: 'some internal error occurred !'
										});
									}
									else
									{
										console.log('cities are ', r);
										// response.json({
										// 	success: true,
										// 	cities: r
										// });
<<<<<<< HEAD
										response.render('../views/buyer_search_location', {r:r});
=======
										response.render('../views/buyer_search_location', {r: r});
>>>>>>> 1c2810360a106ea29a1c171c1c8440531be074b9
									}
								});
								// response.redirect('/home');
								// response.json({
								// 	success: true
								// });
							}
							else
							{
								console.log('Invalid password');
								// response.json({
								// 	success: false
								// });
								response.render('../views/login', {message : 'Invalid Password !'});
							}
						});
					}
				}
			});
		},

		register : function(request, response){
			var data= request.body;
			console.log('in basic_model.js register()');
			console.log('data in model is ', data);
			var member_model;
			if(data.member == 'dealer')
			{
				member_model= require('../schemas/dealer_schema.js');
			}
			if(data.member == 'buyer')
			{
				member_model= require('../schemas/buyer_schema.js');
			}
			var member= data.member;
			delete data.member;
			member_model.findOne({email : data.email}, function(error, result){
				if(error)
				{
					console.log('error occurred while checking for the existence of email ', error);
					response.status(500);
					response.json({
						success: false,
						message: 'some internal error  occurred !'
					});
					// response.render('../views/register', {message : 'Some Internal error occurred !'});
				}
				else
				{
					if(result == null)
					{
						var bcrypt = require('bcryptjs');
						bcrypt.hash(data.password, 10, function(err, hash){
							if(err)
							{
								console.log('some error occurred while generating the hash ', err);
								response.status(500);
								response.json({
									success: false,
									message: 'some internal error  occurred !'
								});
								// response.render('../views/register', {message : 'Some Internal error occurred !'});
							}
							else
							{
								data.password = hash;
								member_model.create(data, function(e, r){
									if(e)
									{
										console.log('some error occurred while inserting the document ', error);
										response.status(500);
										response.json({
											success: false
										});
										// response.render('../views/register', {message : 'Some Internal error occurred !'});
									}
									else
									{
										console.log('registration successful');
										request.session.email= data.email;
										request.session.user_name = data.user_name;
										request.session._id= r._id;
										request.session.member= member;
										console.log('session data is ', request.session);
										response.status(200);
										response.json({
											success: true
										});
										// response.redirect('/home');
									}
								});
							}
						});
					}
					else
					{
						console.log('Username already exists !');
						response.status(200);
						response.json({
							success: false,
							message: 'Username already exists !'
						});
						// response.render('../views/register', {message : 'Username already exists !'});
					}
				}
			});	
		},

		logout : function(request, response){
			var socket_data_model = require('../schemas/socket_data_schema.js');
			socket_data_model.findOneAndRemove({email : request.session.email}, function(error, result){
				if(error)
				{
					console.log('some error occurred while logging out ', error);
					response.status(500);
					response.send('Some internal error occurred...');
				}
				else
				{
					if(result == null)
					{
						console.log('invalid email');
						request.session.destroy();
            			response.status(200);
            			response.json({
            				success: false,
            				message: 'invalid email !'
            			});
					}
					else
					{
						console.log('logout successfull ', result);
						request.session.destroy();
						response.status(200);
						response.json({
							success: true,
							message: 'logout successfull !'
						});
						// response.redirect('/');
					}		
				}
			});
		}
	};
};