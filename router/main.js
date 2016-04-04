var swig  = require('swig');
var category = require("./../helpers/category.js");

module.exports = function(app)
{
     app.get('/',function(req,res){
     	category.getOnlineCategories('root', function(categories){
     		//console.log(categories);
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
        category.getOnlineCategories(cgid, function(categories){
            category.getCategoryObject(cgid, function(categoryObject){

                category.getProductsAssignedToCategory(cgid, function(productHits){
                    if (categories.length > 0) {
                        var categoriesFound =  categories;
                        req.session.categories = categoriesFound;
                    } else { //Handle case when end of category level is reached
                        var categoriesFound =  req.session.categories;
                    }

                    res.render('index', {
                        'categories': categoriesFound,
                        'products' : productHits,
                        'selectedCategory': cgid,
                        'selectedCategoryName' : categoryObject['name'],
                        'parentCategoryId' : categoryObject['parentCategoryId'],
                        'catBannerImageSrc' : categoryObject['catBannerImageSrc']
                    });

                });
            })
        });
    });
}
