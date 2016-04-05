var product_url = "http://dev01-latam-loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/products/%s?format=json&expand=images,prices&client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
var request = require("request");
var util = require('util');
var Promise = require('bluebird');

exports.getProductObject = function(pid) {
    var productShowUrl = util.format(product_url, pid);
    return new Promise(function(resolve, reject){
        request(productShowUrl, function(error, response, body) {
            if (body) {
                var product = {};
                var responseBody = JSON.parse(body);
                product['name'] = responseBody.name;
                product['price'] = responseBody.price;
                product['shortDescription'] = responseBody.short_description;
                product['longDescription'] = responseBody.long_description;
                resolve(product);
            } else {
                reject("Error Getting products");
            }
        });
    });

}
