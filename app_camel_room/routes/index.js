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