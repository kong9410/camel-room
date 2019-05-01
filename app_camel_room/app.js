var express = require('express');   //web server
var fs = require('fs');  //file load

var app = express();
var port = 3000;

app.listen(port, function(){
    console.log('Server Start, Port : ' + port);
});
//app.use(express.static('public'));
app.get('/', function(req, res){
    fs.readFile('user.html', function(error, data){
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
});

