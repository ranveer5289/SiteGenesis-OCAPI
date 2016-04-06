var category_url = "http://dev01.latam.loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/categories/%s?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&format=json"
var product_search_url = "http://dev01.latam.loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/product_search?refine=cgid=%s&expand=prices,images&client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&format=json"
var product_url = "http://dev01-latam-loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/products/%s?format=json&expand=images&client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
var request = require("request");
var util = require('util');
var Promise = require('bluebird');


exports.getOnlineCategories = function(cgid) {

    var searchShowUrl = util.format(category_url, cgid);
    console.log('searchShowUrl ' + searchShowUrl);

    return new Promise(function(resolve, reject){
        request(searchShowUrl, function(error, response, body) {
                if (body) {
                    var responseBody = JSON.parse(body);
                    var categories = [];

                    for (index in responseBody.categories){
                        var category = {};
                        category['id'] = responseBody['categories'][index].id;
                        category['name'] = responseBody['categories'][index].name;
                        categories.push(category)
                    }

                    resolve(categories);
                } else {
                    reject("Error getting categories");
                }
            });
    });
};

exports.getCategoryObject = function(cgid) {

    var searchShowUrl = util.format(category_url, cgid);

    return new Promise(function(resolve, reject){
        request(searchShowUrl, function(error, response, body) {
            if (body) {
                var responseBody = JSON.parse(body);
                var category = {};
                category['id'] = responseBody.id;
                category['name'] = responseBody.name;
                category['parentCategoryId'] = responseBody.parent_category_id;
                if ('image' in responseBody) {
                    category['catBannerImageSrc'] = responseBody.image;
                } else {
                    category['catBannerImageSrc'] = responseBody.c_slotBannerImage;
                }
                resolve(category);
            } else {
                reject('Error getting category object');
            }
        });
    });

};

exports.getProductsAssignedToCategory = function(cgid) {

    var searchShowUrl = util.format(product_search_url, cgid);
    console.log(searchShowUrl);

    return new Promise(function(resolve, reject){
        request(searchShowUrl, function(error, response, body) {
            if (body) {
                var responseBody = JSON.parse(body);
                var productHits = [];
                for (index in responseBody.hits){
                    var productHitObj  = responseBody['hits'][index];
                    product = {};
                    product['link'] = productHitObj.link;
                    product['id'] = productHitObj.product_id;
                    product['price'] = productHitObj.price;
                    product['name'] = productHitObj.product_name;
                    product['currency'] = productHitObj.currency;
                    if ('link' in productHitObj.image)  {
                        product['imageSrc'] = productHitObj.image.link;
                    }
                    productHits.push(product);
                }
                if ('next' in responseBody) {
                    productHits.push({'nextPageUrl' : responseBody.next})
                }
                resolve(productHits);
            } else {
                reject("Error getting products assigned to a category");
            }
        });
    });
};

