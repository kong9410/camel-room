// [REQUIREMENTS]
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// [MONGO CONNECT]
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/estate_db', { useNewUrlParser: true });

// [SEARCH POST]
router.post('/', function (req, res) {
	var search = {};
	search.address = req.body.address;
	search.contractType = req.body.contractType;
	search.houseType = req.body.houseType;
	search.floors = req.body.floors;
	search.years = req.body.years;
	search.bedrooms = req.body.bedrooms;
	search.bathrooms = req.body.bathrooms;
	search.min_size = req.body.min_size;
	search.max_size = req.body.max_size;
	var cursor = db.collection("estates").find({
		'address': search.address, 'contractType': search.contractType,
		'houseType': search.houseType, 'floors': search.floors,
		'years': req.body.years
	}).toArray(function (err, result) {
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
			res.render('property', { check_ses: req.session.email, estate_list: list, page_cnt: page_length });
		}
		else {
			res.render('property', { check_ses: 0, estate_list: list, page_cnt: page_length });
		}
	});
});

module.exports = router;