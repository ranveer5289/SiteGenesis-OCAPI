var swig  = require('swig');
var category = require("./../helpers/category.js");

module.exports = function(app)
{
     app.get('/',function(req,res){
     	category.getOnlineCategories(function(categories){
     		console.log(categories);
			res.render('index', {
	    		'categories': categories
			});
     	})
     });
     app.get('/about',function(req,res){
        res.render('about.html');
    });

    app.get('/SearchShow', function(req, res){
        console.log(req.query);
    });
}
