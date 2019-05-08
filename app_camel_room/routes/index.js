var fs = require('fs');  //file load
var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/estate_db',{useNewUrlParser : true});

router.get('/', function(req, res){
		var cursor = db.collection("estates").find({}).toArray(function(err,result){			
			if(err)throw err;
			console.log(result);
			if(req.session.email){
				
				res.render('view_estate.ejs',{check_ses: req.session.email, estate_list: result} );
			}
			else{
				res.render('view_estate.ejs', {check_ses: 0, estate_list: result});		
			}		
		});
});
	
	
router.get('/theme', function (req, res) {
	res.render('theme.ejs');
});
router.get('/estate', function (req, res) {
	res.render('enroll_estate.ejs');
});

router.get('/register', function (req, res) {
	res.render('register.ejs');
})
router.use(express.static('public'));

module.exports = router;