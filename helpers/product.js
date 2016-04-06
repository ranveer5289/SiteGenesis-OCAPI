var product_url = "http://dev01-latam-loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/products/%s?format=json&expand=images,prices,variations&client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
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
                product['currency'] = responseBody.currency;
                var variants = responseBody.variants;

                resolve([product, variants]);
            } else {
                reject("Error Getting products");
            }
        });
    });

};

exports.getVariantValues = function(variantObject) {

    var colorVariantValues = [];
    var sizeVariantValues = [];
    var variantValues = [];
    var varian

    for(index in variantObject) {
        var variantValue = {},
            variationValues = variantObject[index].variation_values,
            variantId = variantObject[index].product_id;

        variantValue[variantId] = {};

        if (variationValues.hasOwnProperty('color')) {
            variantValue[variantId]['color'] = variationValues['color'];
            if (colorVariantValues.indexOf(variationValues['color']) < 0) {
                colorVariantValues.push(variationValues['color']);
            }

        }
        if (variationValues.hasOwnProperty('size')) {
            variantValue[variantId]['size'] = variationValues['size'];
            if (sizeVariantValues.indexOf(variationValues['size']) < 0) {
                sizeVariantValues.push(variationValues['size']);
            }
        }
        variantValues.push(variantValue);
    }

    return [variantValues, sizeVariantValues, colorVariantValues];
};

