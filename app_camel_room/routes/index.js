// [REQUIREMENTS]
var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');

// [MONGO CONNECT]
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/estate_db',{useNewUrlParser : true});


// [HOME]
router.get('/', function (req, res) {
	if(req.session.email){
		res.render('index.ejs',{check_ses: req.session.email} );
	}
	else
		res.render('index.ejs', {check_ses: 0});
});

// [PROPERTY]
router.get('/property', function (req, res) {
	var cursor = db.collection("estates").find({}).toArray(function (err, result) {
		//에러처리
		if (err) throw err;

		//현재 페이지
		var cur_page;
		if (req.query.curpage == null) {
			cur_page = 1;
		}
		else {
			cur_page = req.query.curpage;
		}


		var list = new Array();
		var page_length;
		if (result.length % 15 == 0)
			page_length = parseInt(result.length / 15);
		else
			page_length = parseInt(result.length / 15) + 1;

		
		var curindex = (cur_page - 1) * 15;
		var lastcnt;
		if (result.length % 15 == 0)
			lastcnt = 15;
		else
			lastcnt = result.length % 15;
		if (cur_page < page_length) {
			for (var i = curindex; i < curindex + 15; i++) {
				list.push(result[i]);
			}
		}
		else if (cur_page == page_length) {
			for (var i = curindex; i < curindex + lastcnt; i++) {
				list.push(result[i]);
			}
		}
		if (req.session.email) {
			res.render('property.ejs', { check_ses: req.session.email, estate_list: list, page_cnt: page_length });
		}
		else {
			res.render('property.ejs', { check_ses: 0, estate_list: list, page_cnt: page_length });
		}
	});
});

// [THEME]
router.get('/theme', function (req, res) {
	if(req.session.email){
		res.render('theme.ejs',{check_ses: req.session.email} );
	}
	else
		res.render('theme.ejs', {check_ses: 0});
});

// [ABOUT US]
router.get('/about-us', function (req, res) {
	if(req.session.email){
		res.render('about-us.ejs',{check_ses: req.session.email} );
	}
	else
		res.render('about-us.ejs', {check_ses: 0});
});

// [PROPERTY]=>[ADD PROPERTY]
router.get('/add-property', function (req, res) {
	if(req.session.email){
		res.render('add-property.ejs',{check_ses: req.session.email} );
	}
	else
		res.render('add-property.ejs', {check_ses: 0});
});

// [CONTACT]
router.get('/register', function (req, res) {
	res.render('register.ejs');
})

// [SINGLE-PROPERTY]
router.get('/single-property:id', function(req, res){
	res.render('single-property')
})

module.exports = router;