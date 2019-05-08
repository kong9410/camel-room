var fs = require('fs');  //file load
var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
		if(req.session.email){
			res.render('view_estate.ejs',{check_ses: req.session.email} );
		}
		else
			res.render('view_estate.ejs', {check_ses: 0});
});
	
	
router.get('/theme', function (req, res) {
	if(req.session.email){
		res.render('theme.ejs',{check_ses: req.session.email} );
	}
	else
		res.render('theme.ejs', {check_ses: 0});
});
router.get('/estate', function (req, res) {
	if(req.session.email){
		res.render('enroll_estate.ejs',{check_ses: req.session.email} );
	}
	else
		res.render('enroll_estate.ejs', {check_ses: 0});
});

router.get('/register', function (req, res) {
	res.render('register.ejs');
})


module.exports = router;