"use strict";
var create_basket_url = "https://dev01.latam.loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/baskets?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&format=json";
var get_basket_url = "https://dev01.latam.loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/baskets/%s?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&format=json";
var add_product_to_cart_url = "https://dev01.latam.loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/baskets/%s/items?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&format=json";
var request = require('request');
var utils = require('./utils');
var product = require('./product');
var util = require('util');
var Promise = require('bluebird');

exports.createBasket = function(req) {

    return new Promise(function(resolve, reject) {
        console.log("hello");
        //If basket_id not present in session, create new basket
        if (!req.session.basket_id) {

            //If jwtToken not present in session, get new token
            if (!req.session.token) {
                utils.getJWTToken().then(function(jwtToken) {
                    exports.createBasketHelper(jwtToken, req).then(function() {
                        resolve("Basket Created Successfuly");
                    });

                }).catch(function(error) {
                    console.log(error);
                    reject(error);
                });
            } else {
                exports.createBasketHelper(req.session.token, req).then(function() {
                    resolve("Basket Created Successfuly");
                });
            }
        } else {
            exports.getBasket(req).then(function() {
                resolve("Basket already created");
            });
        }
    });

};

exports.createBasketHelper = function(jwtToken, req) {

    return new Promise(function(resolve, reject) {
        request({

            url: create_basket_url,
            headers: {
                "Authorization": jwtToken
            },
            method: 'POST'
        }, function(error, response, body) {

            if (error) {
                reject(error);
            }

            resolve("Call made Successfuly to create basket");
            //save jwtToken in session
            req.session.token = jwtToken;
            //save etag in session
            console.log("etag " + response.headers.etag);
            req.session.basket_etag = response.headers.etag;
            //save basket_id in session
            req.session.basket_id = JSON.parse(body).basket_id;

            //manually save session
            req.session.save();
        });
    });

};

exports.getBasket = function(req) {

    return new Promise(function(resolve, reject) {
        var basketId = req.session.basket_id;
        var getBasketUrl = util.format(get_basket_url, basketId);

        request({

            url: getBasketUrl,
            headers: {
                "Authorization": req.session.token,
                "If-Match": req.session.basket_etag,
                "Content-Type": "application/json"
            },
            method: 'GET',
        }, function(error, response, body) {
            if (error) {
                reject("Error Fetching Basket " + error);
            }
            if (body) {
                req.session.basket_etag = response.headers.etag;
                //manually save session
                req.session.save();
                resolve(body);
            } else {
                reject("Error Fetching Basket");
            }

        });
    });
};

exports.addProductToBasket = function(productObj, req) {

    return new Promise(function(resolve, reject) {

        var basketId = req.session.basket_id;
        var addProductToCartUrl = util.format(add_product_to_cart_url, basketId);

        request({

            url: addProductToCartUrl,
            headers: {
                "Authorization": req.session.token,
                "If-Match": req.session.basket_etag,
                "Content-Type": "application/json"
            },
            method: 'POST',
            json: productObj
        }, function(error, response, body) {

            if (error) {
                reject("Error adding product to basket " + error);
            }
            if (body) {
                resolve("Successfuly Added product to cart");
            } else {
                reject("Error adding product to basket");
            }



        });
    });

};

exports.getBasketObject = function(basket) {

    var basketObj = {};

    var productLineItems;

    if (!basket) {
        throw new Error("Please give valid basket");
    }
    productLineItems = basket.product_items;

    if ('order_total' in basket && basket.order_total) {
        basketObj.total = basket.order_total;
    } else if ('product_total' in basket && basket.product_total) {
        basketObj.total = basket.product_total;
    }
    if ('tax_total' in basket && basket.tax_total) {
        basketObj.tax = basket.tax_total;
    } else {
        basketObj.tax = "N/A";
    }

    if ('shipping_total' in basket && basket.shipping_total) {
        basketObj.shipping = basket.shipping_total;
    } else {
        basketObj.shipping = "N/A";
    }

    basketObj.products = {};

    var promises = [];

    Object.keys(productLineItems).forEach(function(key) {
        var productItem = productLineItems[key];
        var productId = productItem.product_id;
        basketObj.products[productId] = {};
        basketObj.products[productId].productQuantity = productItem.quantity;
        basketObj.products[productId].productName = productItem.item_text;
        basketObj.products[productId].productPrice = productItem.base_price;


        promises.push(
            product.getProductObject(productId).then(function(productObj) {
                //If promise resolved, get images
                var imageObject = product.getProductImages(productObj[0]);
                var smallImage = imageObject.small;
                basketObj.products[productId].productImageSrc = smallImage[0];
            })
        );
    });

    return Promise.all(promises).then(function() {
        return basketObj;
    });
};
