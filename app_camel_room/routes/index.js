var fs = require('fs');  //file load
var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	fs.readFile('view_estate.html', function (error, data) {
		console.error("connected to view_estate.html <Error> : " + error);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(data);
	});
});
router.get('/theme', function (req, res) {
	fs.readFile('theme.html', function (error, data) {
		console.error("connected to theme.html <Error> : " + error);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(data);
	});
});
router.get('/estate', function (req, res) {
	fs.readFile('enroll_estate.html', function (error, data) {
		console.error("connected to enroll_estate.html <Error> : " + error);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(data);
	});
});

router.get('/register', function (req, res) {
	fs.readFile('register.html', function (error, data) {
		console.error("connected to register.html <Error> : " + error);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(data);
	})
})
router.use(express.static('public'));

module.exports = router;