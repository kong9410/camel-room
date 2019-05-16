// [LOAD PACKAGES]
var express     = require('express');
var multer		= require('multer');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var session     = require('express-session');




// [MONGODB CONNECTION]
var db = mongoose.connection;
app.use(express.static('public'));
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://localhost/estate_db',{useNewUrlParser : true});

// DEFINE MODEL
var User = require('./models/user');
var Estate = require('./models/estate');


// [APP SET]
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session({
		key : 'sid',
		secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
		resave: false,
		saveUninitialized: true
}));


// [CONFIGURE SERVER PORT]

var port = process.env.PORT || 3000;

// [CONFIGURE ROUTER]
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user_routes')
var estateRouter = require('./routes/estate_routes');
var searchRouter = require('./routes/search_routes');


// [APP USE]
app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/api', userRouter);
app.use('/api/estate', estateRouter);
app.use('/search', searchRouter);

// [RUN SERVER]
var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});


