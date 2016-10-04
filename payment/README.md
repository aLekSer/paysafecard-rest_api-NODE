Paysafecard Payment API Node Package & Examples
=======

## Usage

#### Install package
**Note:** Package is not available via npm (package not published yet), please install manually.

```bash
npm install paysafecard-payment --save
```

#### Require package and create payment instance
```js
// require payment package
var paysafecardPayment = require('paysafecard-payment');

// set api key
var key = 'psc_XXXXXXXX-XXXXXXX-XXXXXXXXXXXXXX';

// set environment: 'TEST' | 'PRODUCTION'
var environment = 'TEST';

// create payment instance
var payment = paysafecardPayment(key, environment);
```


#### Create payment
```js
// set validate payment options
var options = {
  amount: 10.00,                                                                       // set payment amount
  currency: 'EUR',                                                                     // set payment currency
  customer_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',                                     // set customer id (merchant client id)
  customer_ip: '127.0.0.1',                                                            // set customer ip (not your server ip)
  success_url: 'http://www.yoururl.com/success.php?payment_id={payment_id}',           // set customer first name
  failure_url: 'http://www.yoururl.com/failure.php?payment_id={payment_id}',           // set customer last name
  notification_url: 'http://www.yoururl.com/notification.php?payment_id={payment_id}'  // set customer birthday
};

// validate payment
payment.createPayment(options, function() {

  // check if request was successful
  if (payment.requestIsOk()) {
    // output response
    console.log(payment.getResponse());
  } else {
    // output error
    console.log(payment.getError());
  }

});
```

#### Retrieve payment
```js
// set payment id to retrieve
var payment_id = 'pay_0000000000_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_XXX';

// retrieve payment
payout.retrievePayment(payment_id, function() {

  // check if request was successful
  if (payout.requestIsOk()) {
    // output response
    console.log(payout.getResponse());
  } else {
    // output error
    console.log(payout.getError());
  }

});
```

#### Capture payment
```js
// set payment id to capture
var payment_id = 'pay_0000000000_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_XXX';

// capture payment
payout.capturePayment(payment_id, function() {

  // check if request was successful
  if (payout.requestIsOk()) {
    // output response
    console.log(payout.getResponse());
  } else {
    // output error
    console.log(payout.getError());
  }

});
```

#### Advanced Usage
See [/examples/advanced-example.js](/examples/advanced-example.js) for a more advanced example.


## Run Test (Payment Advanced Example)

#### Install dependencies
```bash
npm install
```

#### Run example task
```bash
npm test
```

## Dependencies
Package | Version | Dev
--- |:---:|:---:
[request](https://www.npmjs.com/package/request) | 2.72.0 | ✖
[node-uuid](https://www.npmjs.com/package/node-uuid) | 1.4.7 | ✔
[readline-sync](https://www.npmjs.com/package/readline-sync) | 1.4.4 | ✔
