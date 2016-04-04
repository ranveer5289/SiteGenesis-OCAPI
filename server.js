var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser')


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./router/main')(app);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views',__dirname + '/views');
swig.setDefaults({ cache: false });


var server = app.listen(3000, function(){
	console.log("Server started at port 3000");
});
