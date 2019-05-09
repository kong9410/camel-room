var fs = require('fs');  //file load
var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/estate_db',{useNewUrlParser : true});


router.get('/', function(req, res){
		var cursor = db.collection("estates").find({}).toArray(function(err,result){			
			if(err)throw err;
			var cur_page;
			console.log(req.query.curpage);


			if(req.query.curpage==null){
				cur_page=1;
			}
			else{
				cur_page = req.query.curpage;
			}
			var list = new Array();
			var page_length;
			if(result.length%15==0)
				page_length = parseInt(result.length/15);
			else
				page_length = parseInt(result.length/15) +1;
			console.log(result.length);
			var curindex = (cur_page-1)*15;
			var lastcnt;
			if(result.length%15==0)
				lastcnt = 15;
			else
				lastcnt = result.length % 15;

			console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
			console.log(page_length);
			console.log(cur_page);
			if(cur_page < page_length ){
				console.log('normal');
				for(var i=curindex; i<curindex + 15;i++){
					list.push(result[i]);
				}
			}
			else if(cur_page == page_length){
				console.log('last');
				for(var i=curindex; i<curindex + lastcnt;i++){
					list.push(result[i]);
				}
			}
			console.log(list);
			console.log(lastcnt);
			console.log(list.length);
			if(req.session.email){	
				res.render('view_estate.ejs',{check_ses: req.session.email, estate_list: list, page_cnt : page_length} );
			}
			else{
				res.render('view_estate.ejs', {check_ses: 0, estate_list: list, page_cnt : page_length});		
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