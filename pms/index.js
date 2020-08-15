const express = require("express");
const app = express();
var user_model = require("./users");
var pms_model = require("./pms_details");
var jwt = require("jsonwebtoken");
app.use(express.static('../public'));
const bodyParser = require('body-parser');
const { body, validationResult, check } = require('express-validator');
//const {matchedData, sanitizeBody } = require('express-validator/filter');

app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// parse application/json
app.use(bodyParser.json());

var jsonParser = bodyParser.json();

app.set('view engine', 'twig');
app.set('views','./views');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
  
function check_username(req,res,next){
    var uname = req.body.username;
    var user_exist = user_model.findOne({username:uname});

    user_exist.exec((err,data)=>{
        if(err) throw err;
        if(data)
        return res.render("sign_up",{Title:"Password Management System",msg:"Username "+uname+" already Exists"});

        next();
    });

}

app.get("/",(req,res)=>{
    res.render('login',{Title:"Password management System",msg:''});
});

app.post("/",(req,res,next)=>{
    let username = req.body.username;
    let password = req.body.password;

    var validate = user_model.findOne({username:username});
    
    validate.exec((err,data)=>{
        if(err) throw err;
        else if(data)
        {
            if(data.password==password)
            res.redirect("/pms/"+data.username);
            else
            res.render("login",{Title:"Password management System",msg:"Invalid username or password"});
        }
        
        else
        res.render("login",{Title:"Password management System",msg:"Invalid username or password"});
    });
});

app.get("/signup",(req,res)=>{
    res.render("sign_up",{Title:"Password management System",msg:''});
});

app.post("/signup",check_username,(req,res,next)=>{

    var name = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confpassword = req.body.confpasword;

    if(password!=confpassword)
    {
        res.render("sign_up",{Title:"Password Management System",msg:"Password didn't match"});
    }
    else if(password.length<3)
    {
        res.render("sign_up",{Title:"Password Management System",msg:"Password length must be atleast 3 characters"});
    }
    else
    {
        var user_details = new user_model({
            username:name,
            email:email,
            password:password,
        });

        user_details.save((err,doc)=>{
            if(err) throw err;
            res.render("login",{Title:"Password Management System",msg:"Sign Up Succesfull"});
        });
    }

});
app.get("/pms/:name?",(req,res,next)=>{
    var pms_info = pms_model.find({username:req.params.name});

    pms_info.exec((err,data)=>{
        if(err) throw err;
        res.render("passwords",{Title:"Welcome to password management system",records:data});
    });
});

app.post("/pms/:name?",(req,res,next)=>{

    var p_details = new pms_model({
        username:req.body.username,
        email:req.body.email,
        website:req.body.site,
        password:req.body.password
    });

    p_details.save((err,dos)=>{
        if(err) throw err;
       res.redirect("/pms/"+req.body.username);
    });

});
app.get("/delete/:id",(req,res)=>{
    var id = req.params.id;
    pms_model.findByIdAndDelete(id,function(err,data){
        if(err) throw err;
        res.redirect("/pms/");
    });
    //res.render('employee_details',{Title:"Employee_details"});
});
app.get("/edit/:id",(req,res)=>{
    var id = req.params.id;

    pms_model.findById(id,function(err,data){
        if(err) throw err;
        res.render('edit_details',{Title:"Edit Password details",records:data});
    });
    //res.render('employee_details',{Title:"Employee_details"});
});
app.post('/update/',(req,res)=>{
    var id = req.body.id;
   var update =  pms_model.findByIdAndUpdate(id,{
        username: req.body.newname,
        email: req.body.newemail,
        website:req.body.newwebsite,
        password: req.body.newpassword,
    });
    update.exec(function(err,data){
        if(err) throw err;
        res.redirect("/pms/"+req.body.newname);
    });
    //res.render('employee_details',{Title:"Employee_details"});
});
app.listen(3000,()=>console.log("Running..."));