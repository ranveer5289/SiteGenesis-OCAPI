var swig  = require('swig');
var category = require("./../helpers/category.js");

module.exports = function(app)
{
     app.get('/',function(req,res){
     	category.getOnlineCategories(function(categories){
     		console.log(categories);
            req.session.categories = categories;
			res.render('index', {
	    		'categories': categories
			});
     	})
     });
     app.get('/about',function(req,res){
        res.render('about.html');
    });

    app.get('/SearchShow', function(req, res){


        var cgid =  req.query.cgid;
        console.log("cgid: " + cgid);
        category.getProductsAssignedToCategory(cgid, function(productHits){
            var categories = (req.session.categories.toString()).split(',');
            res.render('index', {
                'categories': categories,
                'products' : productHits
            });

        });
    });
}
