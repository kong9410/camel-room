var fs = require('fs');  //file load
var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/estate_db',{useNewUrlParser : true});


router.get('/', function(req, res){
		var cursor = db.collection("estates").find({}).toArray(function(err,result){			
			if(err)throw err;
			if(req.session.email){
				res.render('view_estate.ejs',{check_ses: req.session.email, estate_list: result} );
			}
			else{
				res.render('view_estate.ejs', {check_ses: 0, estate_list: result});		
			}		
		});
});
router.use('/lookaround/:id', express.static('uploads'));
router.get('/lookaround/:id', function(req, res){
	var estate_id = req.params.id;
	var cursor = db.collection("estates").findOne({estate_id:estate_id}).then(function(result){
		estate_info = {
			title:result.title,
			orgFileName : result.orgFileName,
			saveFileName : result.saveFileName,
			houseType: result.houseType,
			contractTag: result.contractTag,
			price: result.price,
			deposit: result.deposit,
			roadAddress: result.roadAddress,
			detailAddress: result.detailAddress,
			roomSize: result.roomSize,
			rooms: result.romms,
			toilet: result.toilet,
			floors: result.floors,
			years: result.years,
			writer: result.writer,
			latitude : result.latitude,
			longitude : result.longitude,
			estate_id : result.estate_id
		};
		if(req.session.email){
			res.render('lookaround.ejs', {estate : estate_info, check_ses: req.session.email});
		}else{
			res.render('lookaround.ejs', {estate : estate_info, check_ses: 0});
		}
	});
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