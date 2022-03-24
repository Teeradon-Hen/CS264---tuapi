'use strict';
var express = require('express');
var path = require('path');
var https = require('https');
var bodyParser = require('body-parser');
var http = require('http');
const { response, request } = require('express');
const { compile } = require('ejs');

var PORT  = process.env.PORT || 5000;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use( express.static( "public" ));


var resultFromRequest ; 
var obj;
var status
var username;
var nameTH;
var nameEN;
var email;
var department;
var faculty;
var tu_status
var stuID
var pass

app.get('/', function (req, res) {
    res.render('login', {warnn:""});

});
app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`);
});

app.post('/auth', function (req, respond) {
    stuID = req.body.stuID;
    pass = req.body.pass;
    var options = {
        'method': 'POST',
        'hostname': 'restapi.tu.ac.th',
        'path': '/api/v1/auth/Ad/verify',
        'headers': {
            'Content-Type': 'application/json',
            'Application-Key': ''
        }
    };
  //  console.log(stuID+pass)
    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end",  function (chunk ) {
            resultFromRequest = Buffer.concat(chunks);
            console.log(resultFromRequest.toString());
            obj = JSON.parse(resultFromRequest);
            status = obj.status;
            username = obj.username;
            nameTH = obj.displayname_th;
            nameEN = obj.displayname_en;
            email = obj.email;
            department = obj.department;
            faculty = obj.faculty;
            tu_status = obj.tu_status;

            if(status)
                respond.render('home',{ username ,nameTH, nameEN,  email , department ,  faculty ,tu_status}); 
            else
                respond.render('login', {warnn:"ERROR"});

        });

        res.on("error", function (error,res) {
            console.error(error);
            
        });  

    });
    var postData =  "{\n\t\"UserName\":\""+stuID+"\",\n\t\"PassWord\":\""+pass+"\"\n}";
    req.write(postData);
    req.end();
    
});
