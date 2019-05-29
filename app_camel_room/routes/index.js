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
	result = ( xy- ((x*y)/cnt) )/ Math.sqrt( (pow_x - (Math.pow(x,2) / cnt)) * (pow_y - (Math.pow(y,2)/cnt)));
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
				for(var k=0; k<rec_list.length%13;k++){
					Inlist.push(rec_list[k][1]);
				}
				console.log("Inlist : ", Inlist);
				var myquery = {'estate_id':{$in:Inlist}};
				var cursor = db.collection("estates").find(myquery).toArray(function(err,result){
					if(err){console.log(err); throw err;}
					console.log("result: ", result);
					if (req.session.email) {
						res.render('property.ejs', { check_ses: req.session.email, estate_list: list,page_cnt: page_length, recommend_list:result });
					}
				});
			}
			else{
				res.render('property.ejs', {check_ses: 0, estate_list: list, page_cnt : page_length});		
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
router.get('/single-property/:id', function(req, res){
	var estate_id = req.params.id;
	console.log(estate_id)
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
			rooms: result.rooms,
			toilet: result.toilet,
			floors: result.floors,
			years: result.years,
			content: result.content,
			writer: result.writer,
			latitude : result.latitude,
			longitude : result.longitude,
			estate_id : result.estate_id,
			safe_value : result.safe_value,
			popular_value : result.popular_value,
			traffic_value : result.traffic_value,
			education_value : result.education_value,
			healthy_value : result.healthy_value,
			convenience_value : result.convenience_value
		};

		// [ 매물에 대한 평균스코어를 구하는 쿼리문]
		var cursor = db.collection("users").aggregate([  
			{$unwind:"$star"},
			{$match : {"star.estate_id" : estate_id}},
			{$group :{
			_id : "",
			avgScore :{$avg:"$star.score"}
		}}]).toArray(function (err, result){
			if (err) throw err;
			console.log(result);
			if(result.length!=0)
				var avgScore_data =  result[0].avgScore;
			else
				var avgScore_data = 0;
			// [예상스코어 계산]
			var cursor = db.collection("users").find({},{projection:{"_id":0,"star":1,"email":1}}).toArray(function (err, result) {
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
					var expect_score = -1;
					rec_list = Recommendation(user_dic,req.session.email);
					for(var k=0; k<rec_list.length;k++){
						
						if(rec_list[k][1]==req.params.id){
							expect_score = rec_list[k][0];
						}
					}
					if(rec_list.length==0){
						console.log("예상점수 불가능");
						res.render('single-property.ejs', {estate : estate_info, check_ses: req.session.email, avgScore:avgScore_data, expectScore: 0 });
					}
					else if(expect_score==-1){ // 이미 평가 한 매물 일 경우 예상 스코어는 평가스코어로 준다.
						var cursor = db.collection("users").aggregate([
								{$unwind:"$star"},
								{$match : {"star.estate_id" : estate_id}},
								{$project : {"star.score" :1, "_id":0}}
							]).toArray(function(err,result){
								console.log("result : ", result);
								var expect_score = result[0].star.score;
								res.render('single-property.ejso', {estate : estate_info, check_ses: req.session.email, avgScore:avgScore_data,  expectScore: expect_score });
							});
					}
					else{
						console.log("예상점수");
						res.render('single-property.ejs', {estate : estate_info, check_ses: req.session.email, avgScore:avgScore_data, expectScore: expect_score });
					}
				}
				else{
					console.log("로그인안됐을때 예상점수는 0 점으로 리턴 ");
					res.render('single-property.ejs', {estate : estate_info, check_ses: req.session.email, avgScore:avgScore_data, expectScore:0 });		
				}
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
});


// [SEARCH POST]
router.post('/search', function (req, res) {
	var search = {};
	search.address = req.body.address;
	search.contractTag = req.body.contractTag;
	search.houseType = req.body.houseType;
	search.floors = Number(req.body.floors);
	search.years = req.body.years;
	search.bedrooms = req.body.bedrooms;
	search.bathrooms = req.body.bathrooms;
	search.min_size = req.body.min_size;
	search.max_size = req.body.max_size;
	var cursor = db.collection("estates").find({
		'roadAddress': {$regex:search.address},
		'contractTag': search.contractTag
	}).toArray(function (err, result) {
		//에러처리
		if (err) throw err;
		console.log(result);
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
			res.redirect('/property');
			res.render('property', { check_ses: req.session.email, estate_list: list, page_cnt: page_length });
		}
		else {
			res.redirect('/property');
			res.render('property', { check_ses: 0, estate_list: list, page_cnt: page_length });
		}
	});
});


// [IMAGE ANALYSIS POST]
router.post('/add-property/analysis', function(req, response){
	//var url = "http://ec2-15-164-57-59.ap-northeast-2.compute.amazonaws.com:5000/fileUpload";
	var data = req.files;
	console.log("file data : ", data);
	var options = {
		host: "ec2-15-164-57-59.ap-northeast-2.compute.amazonaws.com",
		port: "5000",
		path: "/fileUpload",
		method: "POST"
	}

	var httpreq = http.request(options, function(response){
		response.setEncoding('utf-8');
		//response.on('data', function(chunk){
		//	console.log("body: " + chunk);
		//});
		response.on('end', function(){
			res.send("ok");
		})
	});
	//httpreq.write(data);
	httpreq.end();
});

module.exports = router;