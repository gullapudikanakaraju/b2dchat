module.exports= function(request, response){
	console.log('in prop_model.js');
	var prop_model= require('../schemas/property_schema.js');
	var data= request.body;
	data.posted_by= request.session._id;
	prop_model.create(data, function(error, result){
		if(error)
		{
			console.log('some internal error occurred while creating a prop ', error);
			response.status(500);
			response.json({
				success: false,
				message: 'some internal error occurred !'
			});
		}
		else
		{
			console.log('prop created successfully !', result);
			var groups_model= require('../schemas/groups_schema.js');

			groups_model.findOne({city: result.city, locality: result.locality}, function(e1, r1){
				if(e1)
				{
					console.log('error occurred ', e1);
					response.json({
						success: false,
						message: 'some internal error occurred !'
					});
				}
				else
				{
					if(r1 != null)
					{
						console.log('adding to the chat room !');
						var x= {};
						x.member_name= request.session.user_name;
						x.member_id= request.session._id;
						groups_model.findOneAndUpdate({_id: r1._id}, {$push: {"members": x}}, function(e2, r2){
							if(e2)
							{
								console.log('error occurred ', e2);
								response.json({
									success: false,
									message: 'some internal error occurred !'
								});
							}
							else
							{
								console.log('added successfully to the chat room ');
								response.status(200);
								response.json({
									success: true,
									message: 'prop created and added to room successfully'
								});
							}
						});
					}
					else
					{
						console.log('no chat room found, creating one !');
						var y= {};
						var members= [];
						members.push({
							member_id: request.session._id,
							member_name: request.session.user_name
						});
						
						console.log('members are ', members);
						y.group_name= Date.now().toString();
						y.city= result.city;
						y.locality= result.locality;
						y.members= members;
						y.created_by= request.session._id;
						groups_model.create(y, function(e3, r3){
							if(e3)
							{
								console.log('error occurred ', e3);
								response.json({
									success: false,
									message: 'some internal error occurred !'
								});
							}
							else
							{
								console.log('prop added and room created successfully !');
								response.status(200);
								response.json({
									success: true,
									message: 'prop created and room created successfully !'
								});
							}
						});
					}
				}
			});
		}
	});
};