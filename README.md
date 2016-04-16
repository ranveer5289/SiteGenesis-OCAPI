# SiteGenesis-OCAPI
Demandware SiteGenesis using OCAPI and ExpressJS framework

This is a very basic implementation of SiteGenesis using OCAPI provided by Demandware. It contains many bugs and project is developed as proof-of-concept that complete checkout can be achieved by OCAPI.

HTML templates present **/views/** folder are used just to render the data and templates are taken from various sites which provide free html/css templates.


In order to change order status of newly placed order to **New, Confirmed, Ready For Export**, please see code present in `dwre-hooks` folder and see hooks implementation in OCAPI DWRE documentation.

**Sample** **Config** **File**

```javascript
//ocapiconfig.js
var config = {};

config.httphost = "http://xxx.yyy.xxx.demandware.net";
config.httpshost = "https://xxx.yyy.xxx.demandware.net";
config.siteid = "SiteGenesis";
config.ocapiversion = "16_3";
config.clientid = "your_client_id";

config.paymentmethodid = "CREDIT_CARD";
config.defaultshippingmethodid = "001";

module.exports = config;
```


**Category** **Landing** **Page**

![alt tag](https://raw.githubusercontent.com/ranveer5289/SiteGenesis-OCAPI/master/repoimages/CLP.png)

**PDP**

![alt tag](https://raw.githubusercontent.com/ranveer5289/SiteGenesis-OCAPI/master/repoimages/PDP.png)

**Cart**

![alt tag](https://raw.githubusercontent.com/ranveer5289/SiteGenesis-OCAPI/master/repoimages/Cart.png)

**Shipping**

![alt tag](https://raw.githubusercontent.com/ranveer5289/SiteGenesis-OCAPI/master/repoimages/Shipping.png)

**Billing**

![alt tag](https://raw.githubusercontent.com/ranveer5289/SiteGenesis-OCAPI/master/repoimages/Billing.png)

**Payment**

![alt tag](https://raw.githubusercontent.com/ranveer5289/SiteGenesis-OCAPI/master/repoimages/Payment.png)

**Confirmation**

![alt tag](https://raw.githubusercontent.com/ranveer5289/SiteGenesis-OCAPI/master/repoimages/Confirmation.png)

**Order** **In** **BM**

![alt tag](https://raw.githubusercontent.com/ranveer5289/SiteGenesis-OCAPI/master/repoimages/OrderInBM.png)

**BM** **Payment**

![alt tag](https://raw.githubusercontent.com/ranveer5289/SiteGenesis-OCAPI/master/repoimages/BMPayment.png)
