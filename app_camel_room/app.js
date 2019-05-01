var express = require('express');   //web server
var fs = require('fs');  //file load

var app = express();
var port = 3000;

app.listen(port, function(){
    console.log('Server Start, Port : ' + port);
});
app.use(express.static('public'));
app.get('/', function(req, res){
    fs.readFile('view_estate.html', function(error, data){
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});
app.get('/theme', function(req, res){
    fs.readFile('theme.html', function(error, data){
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});
app.get('/estate', function(req, res){
    fs.readFile('enroll_estate.html', function(error, data){
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});
app.get('/register', function(req, res){
    fs.readFile('register.html', function(error, data){
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    })
})