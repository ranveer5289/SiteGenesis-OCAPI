"use strict"
var product_url = "http://dev01-latam-loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/products/%s?format=json&expand=images,prices,variations&client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
var request = require("request");
var util = require('util');
var Promise = require('bluebird');
var category = require('./category');

exports.getProductObject = function(pid) {
    var productShowUrl = util.format(product_url, pid);
    return new Promise(function(resolve, reject){
        request(productShowUrl, function(error, response, body) {
            if (error) {
                reject("Error Getting products");
            }
            if (body) {
                var product = {};
                var responseBody = JSON.parse(body);
                product['name'] = responseBody.name;
                product['price'] = responseBody.price;
                product['shortDescription'] = responseBody.short_description;
                product['longDescription'] = responseBody.long_description;
                product['currency'] = responseBody.currency;
                product['images'] = responseBody.image_groups;
                product['primaryCategoryId'] = responseBody.primary_category_id;
                var variants = responseBody.variants;

                category.getCategoryObject(responseBody.primary_category_id).then(function(categoryObject){
                    product['primaryCategoryName'] = categoryObject.name;
                    resolve([product, variants]);
                });
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

exports.getProductImages = function(productObject) {

    var productImages = {};
    if(productObject) {
        var images = productObject.images;
        for(let index in images) {
            var image = images[index];
            if (image.view_type === 'large') {
                productImages['large'] = this.getImages(image);
            } else if(image.view_type === 'small') {
                productImages['small'] = this.getImages(image);
            }
        }
    }
    return productImages;
};

exports.getImages = function(imageObject) {
    var imageArray = [];
    var images = imageObject.images;
    for(let index in images) {
        let image = images[index];
        imageArray.push(image.link);
    }
    return imageArray;
};

