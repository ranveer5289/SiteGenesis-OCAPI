var config = require("./ocapiconfig");
var customer_auth_url = config.httpshost + '/s/' + config.siteid + "/dw/shop/v" + config.ocapiversion + "/customers/auth?client_id=" + config.clientid;
var request = require('request');

exports.getJWTToken = function() {

    return new Promise(function(resolve, reject){


        request({

            url : customer_auth_url,
            method : 'POST',
            headers: {
                    "content-type": "application/json"
            },
            json : {
                "type" : "guest"
            }
        }, function(error, response, body){
            if (error || !body || !response) {
                reject("Errer getting JWT Token");
            }
            resolve(response.headers['authorization']);
        });
    });
};


