// [REQUIREMENTS]
var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');
var http = require('http');
// [Recommend function]

function setDefault(obj, prop, deflt) { 
	return obj.hasOwnProperty(prop) ? obj[prop] : (obj[prop] = deflt); 
}

function pearson(data,name1, name2){ //피어슨 상관계수 구하는 함수.
	var x=0;
	var y=0;
	var pow_x = 0;
	var pow_y = 0;
	var xy = 0;
	var cnt =0;
	var result = 0;
	for (i in data[name1]){
		if (i in data[name2]){
			x+=data[name1][i];
			y+=data[name2][i];
			pow_x+=Math.pow(data[name1][i],2);
			pow_y+=Math.pow(data[name2][i],2);
			xy+=data[name1][i]*data[name2][i];
			cnt+=1;
		}
	}
	if(cnt==0)
		return 0.1;
	var sqrtvalue = Math.sqrt( (pow_x - (Math.pow(x,2) / cnt)) * (pow_y - (Math.pow(y,2)/cnt)));
	if(sqrtvalue==0)
		sqrtvalue =1;
	result = ( xy- ((x*y)/cnt) )/ sqrtvalue;
	return result;
}

function Rank_user(data, name, index){
	var list = new Array();
	for (var i in data){
		if ( name != i){
			list.push([pearson(data,name,i),i]);
		}
	}
	list.sort();
	list.reverse();
	var result = new Array();
	for(var i=0; i<index ; i++){
		result.push(list[i]);
	}
	return result;
}

function Recommendation (data, person){
	var data_length =0;
	
	for (var i in data){
		data_length++;
	}
	var result = new Array();
	result = Rank_user(data, person, data_length-1);
	var score  = 0;
	var list = new Array();
	var score_dic = new Object();
	var similar_dic = new Object();
	
	for (var i = 0 ; i<result.length; i++){
	
		if(result[i][0] < 0){
			continue;
		}
	
		for (estate in data[result[i][1]]){
			
			if(!(estate in data[person])){
				
				score += result[i][0]*data[result[i][1]][estate];
				setDefault(score_dic,estate,0);
				score_dic[estate]+=score;
				setDefault(similar_dic,estate,0);
				similar_dic[estate]+= result[i][0];
			}
			score=0;
		}
		
	}
	
	for (key in score_dic){
		score_dic[key]=score_dic[key]/similar_dic[key];
		list.push([score_dic[key],key]);
	}
	list.sort();
	list.reverse();
	return list;
}

// [MONGO CONNECT]
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/estate_db',{useNewUrlParser : true});


// [HOME]
router.get('/', function (req, res) {
	db.collection('estates').find({}).sort({'views':-1}).limit(6).toArray(function(err, result){

		var estate = result;
		if(req.session.email){
			res.render('index.ejs',{check_ses: req.session.email, estate_list:estate} );
		}
		else
			res.render('index.ejs', {check_ses: 0, estate_list:estate});
	})
	
});

// [PROPERTY]
router.get('/property', function (req, res) {
	var cursor = db.collection("estates").find({}).toArray(function (err, result) {
		
		//에러처리
		if (err) throw err;
		var list = new Array();
		var page_length=0;

		list = result;
		
		// [Recommend]
		var cursor2 = db.collection("users").find({},{projection:{"_id":0,"star":1,"email":1}}).toArray(function (err, result) {
			if (err) throw err;
			

			if((req.session.email != null)){
				var user_dic = new Object();
				
				for (var i=0; i< result.length; i++ ){
					if(result[i].star != null){
						var user_email = result[i].email;
						var score_dic = new Object();
						
						for(var k=0; k<result[i].star.length;k++){
							score_dic[result[i].star[k].estate_id]= result[i].star[k].score;
							user_dic[user_email] = score_dic;
						}
					}
				}
				

				var rec_list = new Array();
				var Inlist = new Array();
				
				
				rec_list = Recommendation(user_dic,req.session.email);
				if(rec_list.length>12){
					for(var k=0; k<12;k++){
					   Inlist.push(rec_list[k][1]);
					}
				 }
				 else{
					for(var k=0; k<rec_list.length;k++){
					   Inlist.push(rec_list[k][1]);
					}
				 }
				console.log("Inlist : ", Inlist);
				var myquery = {'estate_id':{$in:Inlist}};
				var cursor = db.collection("estates").find(myquery).toArray(function(err,result){
					if(err){console.log(err); throw err;}
					
					if (req.session.email) {
						res.render('property.ejs', { check_ses: req.session.email, estate_list: list,page_cnt: page_length, recommend_list:result, search:0});
					}
				});
			}
			else{
				res.render('property.ejs', {check_ses: 0, estate_list: list, page_cnt : page_length, search:0});		
			}
		});	

	});
});

router.post('/score/:id', function(req, res){
	console.log("post value is ",req.body.star);
	var cursor = db.collection("users").updateOne({email:req.session.email}, {
		$push:{
			"star":{
				estate_id:req.params.id,
				score:req.body.star
			}
		}
	});
})

router.post('/take/:id', function(req, res){
	var estate_id = req.params.id;
	console.log("take value is ",req.body.star);
	var cursor = db.collection("estates").findOne({estate_id:estate_id});
	console.log(cursor);
});

// [SINGLE PROPERTY]
router.use('/single-property/:id', express.static('public'))
router.get('/single-property/:id', function (req, res) {
	var estate_id = req.params.id;
	var popular_value;
	console.log(estate_id)

	db.collection('estates').findOne({ estate_id: estate_id }).then(function (result) {
		console.log("views : ", result.views);
		views = result.views;
		if (views > 30000) {
			popular_value = 6;
		}
		else if (views > 10000 && views <= 30000) {
			popular_value = 5;
		}
		else if (views > 5000 && views <= 10000) {
			popular_value = 4;
		}
		else if (views > 3000 && views <= 5000) {
			popular_value = 3;
		}
		else if (views > 1000 && views <= 3000) {
			popular_value = 2;
		}
		else if (views <= 1000) {
			popular_value = 1;
		}
		db.collection('estates').updateOne({ estate_id: estate_id }, { $set: { popular_value: popular_value }, $inc: { views: 1 } }).then(function (result) {
			var cursor = db.collection("estates").findOne({ estate_id: estate_id }).then(function (result) {
				estate_info = {
					title: result.title,
					orgFileName: result.orgFileName,
					saveFileName: result.saveFileName,
					houseType: result.houseType,
					contractTag: result.contractTag,
					price: result.price,
					deposit: result.deposit,
					roadAddress: result.roadAddress,
					detailAddress: result.detailAddress,
					roomSize: result.roomSize,
					rooms: result.rooms,
					toilet: result.toilet,
					floors: result.floors,
					years: result.years,
					content: result.content,
					writer: result.writer,
					latitude: result.latitude,
					longitude: result.longitude,
					estate_id: result.estate_id,
					safe_value: result.safe_value,
					popular_value: result.popular_value,
					traffic_value: result.traffic_value,
					education_value: result.education_value,
					healthy_value: result.healthy_value,
					convenience_value: result.convenience_value,
					theme:result.theme
				};
				console.log("cursors : ", estate_info.popular_value);
				// [ 매물에 대한 평균스코어를 구하는 쿼리문]
				var cursor = db.collection("users").aggregate([
					{ $unwind: "$star" },
					{ $match: { "star.estate_id": estate_id } },
					{
						$group: {
							_id: "",
							avgScore: { $avg: "$star.score" }
						}
					}]).toArray(function (err, result) {
						if (err) throw err;

						if (result.length != 0)
							var avgScore_data = result[0].avgScore;
						else
							var avgScore_data = 0;
						// [예상스코어 계산]
						var cursor = db.collection("users").find({}, { projection: { "_id": 0, "star": 1, "email": 1 } }).toArray(function (err, result) {
							if (err) throw err;

							if ((req.session.email != null)) {
								var user_dic = new Object();

								for (var i = 0; i < result.length; i++) {
									if (result[i].star != null) {
										var user_email = result[i].email;
										var score_dic = new Object();

										for (var k = 0; k < result[i].star.length; k++) {

											score_dic[result[i].star[k].estate_id] = result[i].star[k].score;
											user_dic[user_email] = score_dic;
										}
									}
								}

								var rec_list = new Array();
								var expect_score = -1;
								rec_list = Recommendation(user_dic, req.session.email);

								for (var k = 0; k < rec_list.length; k++) {

									if (rec_list[k][1] == req.params.id) {
										console.log(rec_list[k][0]);
										expect_score = rec_list[k][0];
									}
								}

								if (rec_list.length == 0) {
									console.log("예상점수 불가능");
									res.render('single-property.ejs', { estate: estate_info, check_ses: req.session.email, avgScore: avgScore_data, expectScore: 0 });
								}
								else if (expect_score == -1) { // 이미 평가 한 매물 일 경우 예상 스코어는 평가스코어로 준다.

									var cursor = db.collection("users").aggregate([
										{ $unwind: "$star" },
										{ $match: { "star.estate_id": estate_id } },
										{ $project: { "star.score": 1, "_id": 0 } }
									]).toArray(function (err, result) {
										var expect_score = result[0].star.score;

										res.render('single-property.ejs', { estate: estate_info, check_ses: req.session.email, avgScore: avgScore_data, expectScore: expect_score });
									});
								}
								else {

									console.log("예상점수");
									res.render('single-property.ejs', { estate: estate_info, check_ses: req.session.email, avgScore: avgScore_data, expectScore: expect_score });
								}
							}
							else {
								console.log("로그인안됐을때 예상점수는 0 점으로 리턴 ");
								res.render('single-property.ejs', { estate: estate_info, check_ses: req.session.email, avgScore: avgScore_data, expectScore: 0 });
							}
						});
					});
			});
		});
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
	var cursor = db.collection("estates").find({}).toArray(function (err, result) {
		//에러처리
		if (err) throw err;
		var estatecnt = result.length;

		var cursor = db.collection("users").find({}).toArray(function (err, result) {
			if (err) throw err;
			var usercnt = result.length;

			if(req.session.email){
				res.render('about-us.ejs',{check_ses: req.session.email, estate_cnt : estatecnt, user_cnt : usercnt} );
			}
			else
				res.render('about-us.ejs', {check_ses: 0, estate_cnt : estatecnt, user_cnt : usercnt});
		});
	});
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
});


// [SEARCH POST]
router.post('/search', function (req, res) {
	var cursor = db.collection("estates").find({}).toArray(function (err, result) {

		//에러처리
		if (err) throw err;
		var list = new Array();
		var page_length = 0;

		list = result;

		var search = {};


		///////////// 검색 QUERY문/////////////////////
		if (req.body.title != '') {

			search.title = req.body.title;
		}
		if (req.body.address != null) {
			search.roadAddress = { $regex: req.body.address };
		}
		if (req.body.contractTag != "계약 유형") {
			search.contractTag = req.body.contractTag;
		}
		if (req.body.catagories != "주거 형태") {
			search.houseType = req.body.catagories;
		}
		if (req.body.floors != "층수") {
			if (req.body.floors == '7이상') {
				var $gte = 7;
				search.floors = { $gte};
			}
			else {
				search.floors = Number(req.body.floors);
			}
			search.floors = Number(req.body.floors);
		}
		if (req.body.floors != "건물연식") {
			if (req.body.floors == '5이하') {
				var $lte = 5;
				search.floors = { $lte };
			}
			else if (req.body.floors == '10이하'){
				var $lte = 10;
				search.floors = { $lte };
			}
			else{
				var $lte = 15;
				search.floors = { $lte };
			}
		}
		if (req.body.bedrooms != "방") {
			if (req.body.bedrooms == '5이상') {
				var $gte = 5;
				search.rooms = { $gte};
			}
			else {
				search.rooms = Number(req.body.bedrooms);
			}
		}

		if (req.body.bathrooms != "화장실") {
			if (req.body.bathrooms == '5이상') {
				var $gte = 5;
				search.toilet = { $gte };
			}
			else {
				search.toilet = Number(req.body.bathrooms);
			}
		}
		if (req.body.min_size != 0 && req.body.max_size == 0 ) {
			var $gte = Number(req.body.min_size);
			search.roomSize = { $gte };

		}
		if (req.body.min_size == 0 && req.body.max_size != 0 ) {
			var $lte = Number(req.body.max_size);
			search.roomSize = { $lte };
		}
		if (req.body.min_size != 0 && req.body.max_size != 0 ) {
			var $gte = Number(req.body.min_size);
			var $lte = Number(req.body.max_size);
			search.roomSize = { $lte, $gte };
		}
		////////////////////////////////
		console.log(search);
		var cursor = db.collection("estates").find(search).toArray(function(err,result){
			if (err) throw err;
			console.log(result);
			if (req.session.email) {
				res.render('property.ejs', { check_ses: req.session.email, estate_list: list,page_cnt: page_length, recommend_list:result, search:1});
			}
			else{
				res.render('property.ejs', { check_ses: 0, estate_list: list,page_cnt: page_length, recommend_list:result, search:1});
			}
		});
	});
});

router.post('/get_data2', function(req, res){
	var search_num = req.body.search_num;
	var searchAddress = req.body.searchAddress;
	console.log(search_num, searchAddress);
	var cursor;
	//치안
	if(search_num == 2){
		cursor = db.collection("estates").find({'roadAddress':{$regex:searchAddress}}).sort({popular_value:-1}).limit(12).toArray(function (err, result) {	
			var estate_list = result;
			console.log(estate_list);
			res.render('property.ejs', {check_ses: req.session.email, estate_list: estate_list ,recommend_list:estate_list, search:1});
		});
	}
	//교통
	else if(search_num == 3){
		cursor = db.collection("estates").find({'roadAddress':{$regex:searchAddress}}).sort({traffic_value:-1}).limit(12).toArray(function (err, result) {	
			var estate_list = result;
			console.log(estate_list);
			res.render('property.ejs', {check_ses: req.session.email, estate_list: estate_list ,recommend_list:estate_list, search:1});
		});
	}
	//편의
	else if(search_num == 4){
		cursor = db.collection("estates").find({'roadAddress':{$regex:searchAddress}}).sort({convenience_value:-1}).limit(12).toArray(function (err, result) {	
			var estate_list = result;
			console.log(estate_list);
			res.render('property.ejs', {check_ses: req.session.email, estate_list: estate_list ,recommend_list:estate_list, search:1});
		});
	}
	//건강
	else if(search_num == 5){
		cursor = db.collection("estates").find({'roadAddress':{$regex:searchAddress}}).sort({healthy_value:-1}).limit(12).toArray(function (err, result) {	
			var estate_list = result;
			console.log(estate_list);
			res.render('property.ejs', {check_ses: req.session.email, estate_list: estate_list ,recommend_list:estate_list, search:1});
		});
	}
	//교육
	else if(search_num == 6){
		cursor = db.collection("estates").find({'roadAddress':{$regex:searchAddress}}).sort({education_value:-1}).limit(12).toArray(function (err, result) {	
			var estate_list = result;
			console.log(estate_list);
			res.render('property.ejs', {check_ses: req.session.email, estate_list: estate_list ,recommend_list:estate_list, search:1});
		});
	}
	//모던
	else if(search_num == 7){
		cursor = db.collection("estates").find({'roadAddress':{$regex:searchAddress}, 'theme':{$in:['modern']}}).limit(12).toArray(function (err, result) {	
			var estate_list = result;
			console.log("modern : ",estate_list);
			res.render('property.ejs', {check_ses: req.session.email, estate_list: estate_list ,recommend_list:estate_list, search:1});
		});
	}
	//클래식
	else if(search_num == 8){
		cursor = db.collection("estates").find({'roadAddress':{$regex:searchAddress}, 'theme':{$in:['classic']}}).limit(12).toArray(function (err, result) {	
			var estate_list = result;
			console.log(estate_list);
			res.render('property.ejs', {check_ses: req.session.email, estate_list: estate_list ,recommend_list:estate_list, search:1});
		});
	}
	//네츄럴
	else if(search_num == 9){
		cursor = db.collection("estates").find({'roadAddress':{$regex:searchAddress}, 'theme':{$in:['natural']}}).limit(12).toArray(function (err, result) {	
			var estate_list = result;
			console.log(estate_list);
			res.render('property.ejs', {check_ses: req.session.email, estate_list: estate_list ,recommend_list:estate_list, search:1});
		});
	}
	//유럽
	else if(search_num == 10){
		cursor = db.collection("estates").find({'roadAddress':{$regex:searchAddress}, 'theme':{$in:['europe']}}).limit(12).toArray(function (err, result) {	
			var estate_list = result;
			console.log(estate_list);
			
			res.render('property.ejs', {check_ses: req.session.email, estate_list: estate_list ,recommend_list:estate_list, search:1});
			
		});
	}
})



	// [IMAGE ANALYSIS POST]
	router.post('/add-property/analysis', function (req, response) {
		//var url = "http://ec2-15-164-57-59.ap-northeast-2.compute.amazonaws.com:5000/fileUpload";
		var data = req.files;
		console.log("file data : ", data);
		var options = {
			host: "ec2-15-164-57-59.ap-northeast-2.compute.amazonaws.com",
			port: "5000",
			path: "/fileUpload",
			method: "POST"
		}

		var httpreq = http.request(options, function (response) {
			response.setEncoding('utf-8');
			//response.on('data', function(chunk){
			//	console.log("body: " + chunk);
			//});
			response.on('end', function () {
				res.send("ok");
			})
		});
		//httpreq.write(data);
		httpreq.end();
	});





module.exports = router;
