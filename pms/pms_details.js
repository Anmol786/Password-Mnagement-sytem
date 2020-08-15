var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser: true,useCreateIndex:true});

var conn = mongoose.connection;
var pms_schema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    website:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
});

var pms_model = mongoose.model('pms_details',pms_schema);
module.exports = pms_model;