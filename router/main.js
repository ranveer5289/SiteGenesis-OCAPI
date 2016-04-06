var swig  = require('swig');
var category = require("./../helpers/category.js");
var product = require("./../helpers/product.js");
var Promise = require('bluebird');

module.exports = function(app)
{
     app.get('/',function(req,res){
        category.getOnlineCategories("root").then(function(categories){
            req.session.categories = categories;
            res.render('index', {
                'categories': categories
            });
        }).catch(function(error){
            console.log(error);
        });
     });

    app.get('/SearchShow', function(req, res){

        var cgid =  req.query.cgid;
        console.log("cgid: " + cgid);

        Promise.all([category.getOnlineCategories(cgid), category.getCategoryObject(cgid), category.getProductsAssignedToCategory(cgid)])
            .spread(function(categories, categoryObject, productHits){
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
        }).catch(function(error){
            console.log(error);
        });
    });



     app.get('/ProductShow',function(req,res){

        var pid =  req.query.pid;
        console.log("pid " + pid);

        Promise.all([category.getOnlineCategories('root'), product.getProductObject(pid)])
            .spread(function(categories, productObject){

                var variantsArray = product.getVariantValues(productObject[1]);

                res.render('single', {
                    'product' : productObject[0],
                    'colorVariants' : variantsArray[2],
                    'sizeVariants' : variantsArray[1],
                    'categories' : categories
                });
            }).catch(function(error){
                    console.log(error);
        });
     });
}
