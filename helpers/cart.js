"use strict";
var config = require("../ocapiconfig");
var create_basket_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/baskets?client_id=" + config.clientid + "&format=json";
var update_basket_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/baskets/%s/customer?client_id=" + config.clientid + "&format=json";
var get_basket_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/baskets/%s?client_id=" + config.clientid + "&format=json";
var add_product_to_cart_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/baskets/%s/items?client_id=" + config.clientid + "&format=json";
var remove_product_from_cart = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/baskets/%s/items/%s?client_id=" + config.clientid + "&format=json";
var create_shipment_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/baskets/%s/shipments?client_id=" + config.clientid + "&format=json";
var update_default_shipment_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/baskets/%s/shipments/me?client_id=" + config.clientid + "&format=json";
var create_billing_address_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/baskets/%s/billing_address?client_id=" + config.clientid + "&format=json";
var create_payment_instrument_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/baskets/%s/payment_instruments?client_id=" + config.clientid + "&format=json";
var create_order_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/orders?client_id=" + config.clientid + "&format=json";


var request = require('request');
var utils = require('./utils');
var product = require('./product');
var util = require('util');
var Promise = require('bluebird');

exports.createBasket = function(req) {

    //If basket_id not present in session, create new basket
    if (!req.session.basket_id) {

        //If jwtToken not present in session, get new token
        if (!req.session.token) {
            return utils.getJWTToken().then(function(jwtToken) {
                return Promise.all([jwtToken, exports.createBasketHelper(jwtToken, req)]);
            });
        } else {
            //Directly return promise
            return exports.createBasketHelper(req.session.token, req);
        }
    } else {
        //Directly return promise
        return exports.getBasket(req);
    }
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

    if ('order_total' in basket && basket.order_total > 0) {
        basketObj.total = basket.order_total;
    }
    if ('product_total' in basket && basket.product_total > 0) {
        basketObj.subtotal = basket.product_total;
    }
    if ('tax_total' in basket && basket.tax_total > 0) {
        basketObj.tax = basket.tax_total;
    } else {
        basketObj.tax = "N/A";
    }

    if ('shipping_total' in basket && basket.shipping_total > 0) {
        basketObj.shipping = basket.shipping_total;
    } else {
        basketObj.shipping = "N/A";
    }

    basketObj.products = {};

    var promises = [];
    if (typeof productLineItems !== "undefined") {

        Object.keys(productLineItems).forEach(function(key) {
            var productItem = productLineItems[key];
            var productId = productItem.product_id;
            basketObj.products[productId] = {};
            basketObj.products[productId].productQuantity = productItem.quantity;
            basketObj.products[productId].productItemId = productItem.item_id;
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
    }

    return Promise.all(promises).then(function() {
        return basketObj;
    });
};


exports.removeProductFromBasket = function(req) {

    return new Promise(function(resolve, reject) {

        var basketId = req.session.basket_id;
        var pid = req.query.pid;
        var itemId = req.query.itemId;
        var removeProductFromCartUrl = util.format(remove_product_from_cart, basketId, itemId);

        var productObj = {};
        productObj.product_id = pid;
        productObj.quantity = 0;

        request({

            url: removeProductFromCartUrl,
            headers: {
                "Authorization": req.session.token,
                "If-Match": req.session.basket_etag,
                "Content-Type": "application/json"
            },
            method: 'PATCH',
            json: productObj
        }, function(error, response, body) {

            if (error) {
                reject("Error adding product to basket " + error);
            }
            if (body) {
                resolve(body);
            } else {
                reject("Error adding product to basket");
            }

        });
    });
};

exports.createShipment = function(req) {

    return new Promise(function(resolve, reject) {

        var basketId = req.session.basket_id;
        var createShipmentUrl = util.format(create_shipment_url, basketId);

        var shippingObject = {};
        shippingObject.shipment_id = "StandardShippingMethod";
        shippingObject.shipping_method = {
            "id": "001"
        };

        shippingObject.shipping_address = {};
        shippingObject.shipping_address.first_name = req.body.q3_fullName3.first;
        shippingObject.shipping_address.last_name = req.body.q3_fullName3.last;
        shippingObject.shipping_address.city = req.body.q5_address5.city;
        shippingObject.shipping_address.country_code = req.body.q5_address5.country;
        shippingObject.shipping_address.address1 = req.body.q5_address5.addr_line1;
        shippingObject.shipping_address.address2 = req.body.q5_address5.addr_line2;
        shippingObject.shipping_address.postal_code = req.body.q5_address5.postal;
        shippingObject.shipping_address.phone = req.body.q6_phoneNumber6.phone;
        request({

            url: createShipmentUrl,
            headers: {
                "Authorization": req.session.token,
                "If-Match": req.session.basket_etag,
                "Content-Type": "application/json"
            },
            method: 'POST',
            json: shippingObject
        }, function(error, response, body) {

            if (error) {
                reject("Error adding product to basket " + error);
            }
            if (body) {
                resolve(body);
            } else {
                reject("Error adding product to basket");
            }

        });
    });

};

exports.updateDefaultShipment = function(req) {

    return new Promise(function(resolve, reject) {

        var basketId = req.session.basket_id;
        var updateDefaultShipmentUrl = util.format(update_default_shipment_url, basketId);

        var shippingObject = {};
        shippingObject.shipment_id = "me";
        shippingObject.shipping_method = {
            "id": "001"
        };

        shippingObject.shipping_address = utils.getAddress(req);

        request({

            url: updateDefaultShipmentUrl,
            headers: {
                "Authorization": req.session.token,
                "If-Match": req.session.basket_etag,
                "Content-Type": "application/json"
            },
            method: 'PATCH',
            json: shippingObject
        }, function(error, response, body) {

            if (error) {
                reject("Error adding product to basket " + error);
            }
            if (body) {
                resolve(body);
            } else {
                reject("Error adding product to basket");
            }

        });
    });

};

exports.createBillingAddress = function(req) {

    return new Promise(function(resolve, reject) {

        var basketId = req.session.basket_id;
        var createBillingAddressUrl = util.format(create_billing_address_url, basketId);

        var shippingObject = utils.getAddress(req);

        request({

            url: createBillingAddressUrl,
            headers: {
                "Authorization": req.session.token,
                "If-Match": req.session.basket_etag,
                "Content-Type": "application/json"
            },
            method: 'PUT',
            json: shippingObject
        }, function(error, response, body) {

            if (error) {
                reject("Error adding product to basket " + error);
            }
            if (body) {
                req.session.order_total = body.order_total;
                req.session.save();
                resolve(body);
            } else {
                reject("Error adding product to basket");
            }

        });
    });

};

exports.updateBasket = function(req) {
    return new Promise(function(resolve, reject) {

        var basketId = req.session.basket_id;
        var updateBasketUrl = util.format(update_basket_url, basketId);

        var modifiedBasketObj = {};

        //Set customer email in basket
        var customerEmail = req.body.q4_email4;
        modifiedBasketObj.email = customerEmail;

        request({

            url: updateBasketUrl,
            headers: {
                "Authorization": req.session.token,
                "If-Match": req.session.basket_etag,
                "Content-Type": "application/json"
            },
            method: 'PUT',
            json: modifiedBasketObj
        }, function(error, response, body) {

            if (error) {
                reject("Error adding product to basket " + error);
            }

            if (body) {
                req.session.basket_etag = response.headers.etag;
                //manually save session
                req.session.save();
                resolve(body);
            } else {
                reject("Error adding product to basket");
            }

        });
    });
};

exports.createBasketPaymentInstrument = function(req, basket) {

    console.log(req.session.order_total);
    return new Promise(function(resolve, reject) {

        var basketId = req.session.basket_id;
        var createPaymentInstrumentUrl = util.format(create_payment_instrument_url, basketId);
        var paymentObj = {};
        paymentObj.amount = req.session.order_total; //saved in session as for unknown reasons basket.order_total is undefined
        paymentObj.payment_method_id = config.paymentmethodid;

        paymentObj.payment_card = {};
        paymentObj.payment_card.number = req.body['payment-card-number'];
        paymentObj.payment_card.security_code = req.body['payment-cvv'];
        paymentObj.payment_card.holder = req.body['payment-name'];
        paymentObj.payment_card.card_type = req.body['payment-card-type'];
        paymentObj.payment_card.expiration_month = parseInt(req.body['payment-month']);
        paymentObj.payment_card.expiration_year = parseInt(req.body['payment-year']);

        request({

            url: createPaymentInstrumentUrl,
            headers: {
                "Authorization": req.session.token,
                "If-Match": req.session.basket_etag,
                "Content-Type": "application/json"
            },
            method: 'POST',
            json: paymentObj
        }, function(error, response, body) {

            if (error) {
                reject("Error adding product to basket " + error);
            }
            if (body) {
                req.session.basket_etag = response.headers.etag;
                //manually save session
                req.session.save();
                resolve(body);
            } else {
                reject("Error adding product to basket");
            }

        });
    });
};

exports.placeOrder = function(req) {


    return new Promise(function(resolve, reject) {

        var basketId = req.session.basket_id;

        var orderObj = {};
        orderObj.basket_id = basketId;

        request({

            url: create_order_url,
            headers: {
                "Authorization": req.session.token,
                "If-Match": req.session.basket_etag,
                "Content-Type": "application/json"
            },
            method: 'POST',
            json: orderObj
        }, function(error, response, body) {

            if (error) {
                reject("Error adding product to basket " + error);
            }
            if (body) {
                resolve(body);
            } else {
                reject("Error adding product to basket");
            }

        });
    });
};
