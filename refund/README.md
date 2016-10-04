Paysafecard Refund API Node Package & Examples
=======

## Usage

#### Install package
**Note:** Package is not available via npm (package not published yet), please install manually.

```bash
npm install paysafecard-refund --save
```

#### Require package and create refund instance
```js
// require refund package
var paysafecardRefund = require('paysafecard-refund');

// set api key
var key = 'psc_XXXXXXXX-XXXXXXX-XXXXXXXXXXXXXX';

// set environment: 'TEST' | 'PRODUCTION'
var environment = 'TEST';

// create refund instance
var refund = paysafecardRefund(key, environment);
```


#### Get payment detail
```js
// set payment id to get detail
var payment_id = 'pay_0000000000_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_XXX';

// get payment detail
refund.getPaymentDetail(payment_id, function() {

  // check if request was successful
  if (refund.requestIsOk()) {
    // output response
    console.log(refund.getResponse());
  } else {
    // output error
    console.log(refund.getError());
  }

});
```

#### Validate refund
```js
var payment_id = 'pay_0000000000_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_XXX';

// set validate refund options
var options = {
  amount: 10.00,                                   // set refund amount
  currency: 'EUR',                                 // set refund currency
  customer_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // set customer id (merchant client id)
  customer_email: 'customers@email.com',           // set customer email to payout to
  customer_ip: '127.0.0.1'                         // set customer ip (not your server ip)
};

// validate refund
refund.validateRefund(payment_id, options, function() {

  // check if request was successful
  if (refund.requestIsOk()) {
    // output response
    console.log(refund.getResponse());
  } else {
    // output error
    console.log(refund.getError());
  }

});
```

#### Execute validated refund
```js
// set payment id to execute refund
var payment_id = 'pay_0000000000_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_XXX';

// set refund id to execute refund (must match getResponse().id of validateRefund())
var refund_id = 'ref_0000000000_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_XXX';

// set execute refund options
var options = {
  amount: 10.00,                                   // set refund amount
  currency: 'EUR',                                 // set refund currency
  customer_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // set customer id (merchant client id)
  customer_email: 'customers@email.com',           // set customer email to payout to
  customer_ip: '127.0.0.1'                         // set customer ip (not your server ip)
};

// execute refund
refund.executeRefund(payment_id, refund_id, options, function() {

  // check if request was successful
  if (refund.requestIsOk()) {
    // output response
    console.log(refund.getResponse());
  } else {
    // output error
    console.log(refund.getError());
  }

});
```

#### Direct refund
```js
// set payment id to execute refund
var payment_id = 'pay_0000000000_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_XXX';

// set direct refund options
var options = {
  amount: 10.00,                                   // set refund amount
  currency: 'EUR',                                 // set refund currency
  customer_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // set customer id (merchant client id)
  customer_email: 'customers@email.com',           // set customer email to payout to
  customer_ip: '127.0.0.1'                         // set customer ip (not your server ip)
};

// direct refund
refund.directRefund(payment_id, options, function() {

  // check if request was successful
  if (refund.requestIsOk()) {
    // output response
    console.log(refund.getResponse());
  } else {
    // output error
    console.log(refund.getError());
  }

});
```

#### Advanced Usage
See [/examples/advanced-example.js](/examples/advanced-example.js) for a more advanced example.


## Run Test (Refund Advanced Example)

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
