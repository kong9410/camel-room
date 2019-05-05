var mongoose    = require('mongoose');
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var session     = require('express-session');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/estate_db',{useNewUrlParser : true});


module.exports = function(app, User){
    // CREATE user
	
    app.post('/api/User', function(req, res){
        console.error("Post to User");
        console.log(req.body);
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
                res.redirect('/');
                return;
            }
        });
        res.redirect('/');
    });
	
	
	// LOGIN USER
	app.post('/api/signin', function(req, res){
		var get_email = req.body.email;
		var get_password = req.body.password;
		var cursor = db.collection("users").find({email : get_email, password: get_password}).toArray(function(err,result){
			if(err)throw err;
			
			if(result == false){
				res.redirect('/error_alert');
			}
			else{
				req.session.email = result[0].email;
				req.session.save(() => {
					res.redirect('/');
				});
			}
		});
    });
	
	//LOGOUT USER
	app.get('/logout', function(req, res){
		req.session.destroy();
		res.clearCookie('sid');
		res.redirect('/');
	});
}

