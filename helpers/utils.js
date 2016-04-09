var customer_auth_url = "https://dev01.latam.loreal.demandware.net/s/SiteGenesis/dw/shop/v16_3/customers/auth?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&format=json";
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


