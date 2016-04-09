var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');
var session = require('express-session');


app.use(express.static('public'));
//app.use('/scripts', express.static(__dirname + '/node_modules/swig/dist/'));
app.use(session({
    secret:'somesecrettokenhere',
    resave: true,
    saveUninitialized: true
}));


app.use(bodyParser.json());

require('./router/main')(app);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views',__dirname + '/views');
swig.setDefaults({ cache: false });

//Skip SSL certificate match
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var server = app.listen(3000, function(){
	console.log("Server started at port 3000");
});
