var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');
var session = require('express-session');


//Serve static content like CSS/JS
app.use(express.static('public'));
//app.use('/scripts', express.static(__dirname + '/node_modules/swig/dist/'));


app.use(session({
    secret:'somesecrettokenhere',
    resave: true,
    saveUninitialized: true
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


//Call router
require('./router/main')(app);

//Swig Template engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views',__dirname + '/views');
swig.setDefaults({ cache: false });

//Skip SSL certificate match
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var server = app.listen(3000, function(){
	console.log("Server started at port 3000");
});
