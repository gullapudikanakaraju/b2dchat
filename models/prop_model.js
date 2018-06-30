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
			response.status(200);
			response.json({
				success: true,
				message: 'prop created successfully !'
			});
		}
	});
};