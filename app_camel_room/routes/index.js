var fs = require('fs');  //file load

var express     = require('express');
var app         = express();

module.exports = function(app, User)
{	
    // CREATE user
    app.post('/api/User', function(req, res){
        var user = new User();
        user.email = req.body.email;
        user.password = req.body.password;
		user.realname = req.body.realname;
		user.tel = req.body.tel;
		user.dob = req.body.dob;
		user.address = req.body.address;
		
        user.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result: 1});
        });
		res.redirect('/');
    });
	
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
	app.use(express.static('public'));
}



