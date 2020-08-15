var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser: true,useCreateIndex:true});

var conn = mongoose.connection;
var user_schema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
});

var user_model = mongoose.model('user_details',user_schema);
module.exports = user_model;