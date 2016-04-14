var config = require("../ocapiconfig");
var customer_auth_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/customers/auth?client_id=" + config.clientid;
var request = require('request');

exports.getJWTToken = function() {

    return new Promise(function(resolve, reject) {


        request({

            url: customer_auth_url,
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            json: {
                "type": "guest"
            }
        }, function(error, response, body) {
            if (error || !body || !response) {
                reject("Errer getting JWT Token");
            }
            resolve(response.headers['authorization']);
        });
    });
};

exports.getAddress = function(req) {

    var address = {};
    address.first_name = req.body.q3_fullName3.first;
    address.last_name = req.body.q3_fullName3.last;
    address.city = req.body.q5_address5.city;
    address.country_code = req.body.q5_address5.country;
    address.address1 = req.body.q5_address5.addr_line1;
    address.address2 = req.body.q5_address5.addr_line2;
    address.postal_code = req.body.q5_address5.postal;
    address.phone = req.body.q6_phoneNumber6.phone;

    return address;
};
