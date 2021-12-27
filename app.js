const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bootcamp');
const db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})
  
const app=express()
  
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
  
app.post('/sign_up', function(req,res){
    var fullname = req.body.fullname;
    var email =req.body.email;
    var pass = req.body.password;
    var Confirmer =req.body.Confirmer;
  
    var data = {
        "fullname": fullname,
        "email":email,
        "password":pass,
        "Confirmer":Confirmer
    }
db.collection('inscrire').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
    return res.redirect('Signup_Success.html');
})
  
  
app.get('/',function(req,res){
res.set({
    'Access-control-Allow-Origin': '*'
    });
return res.redirect('index.html');
}).listen(3000)
  
  
console.log("server listening at port 3000");