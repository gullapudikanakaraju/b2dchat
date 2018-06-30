var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connec = require('../config/db.js');

var buyer_schema = new Schema({
    user_name :{
        type: String,
        required: true,
        trim: true
    },
    email :{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password :{
        type: String,
        required: true,
        trim: true
    },
    mobile :{
        type: String,
        required: false,
        trim: true
    },
    is_email_verified :{
        type: Boolean,
        default: false
    },
    is_mobile_verified :{
        type: Boolean,
        default: false
    },
    created_at :{
        type: Date,
        default: Date.now
    },
    updated_at :{
        type: Date,
        default: Date.now
    }
}); 

var buyer_model = connec.model('buyer', buyer_schema);
module.exports = buyer_model;