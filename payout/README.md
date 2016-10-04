Paysafecard Payout API Node Package & Examples
=======

## Usage

#### Install package
**Note:** Package is not available via npm (package not published yet), please install manually.

```bash
npm install paysafecard-payout --save
```

#### Require package and create payout instance
```js
// require payout package
var paysafecardPayout = require('paysafecard-payout');

// set api key
var key = 'psc_XXXXXXXX-XXXXXXX-XXXXXXXXXXXXXX';

// set environment: 'TEST' | 'PRODUCTION'
var environment = 'TEST';

// create payout instance
var payout = paysafecardPayout(key, environment);
```


#### Get currency limits
```js
// set currency to get limits
var currency = 'EUR';

// get limits
payout.getLimits(currency, function() {

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

#### Validate payout
```js
// set validate payout options
var options = {
  amount: 10.00,                                   // set payout amount
  currency: 'EUR',                                 // set payout currency
  customer_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // set customer id (merchant client id)
  customer_email: 'customers@email.com',           // set customer email to payout to
  customer_ip: '127.0.0.1',                        // set customer ip (not your server ip)
  first_name: 'John',                              // set customer first name
  last_name: 'Doe',                                // set customer last name
  birthday: '1970-01-01'                           // set customer birthday
};

// validate payout
payout.validatePayout(options, function() {

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

#### Execute validated payout
```js
// set execute payout options
var options = {
  amount: 10.00,                                   // set payout amount
  currency: 'EUR',                                 // set payout currency
  customer_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // set customer id (merchant client id)
  customer_email: 'customers@email.com',           // set customer email to payout to
  customer_ip: '127.0.0.1',                        // set customer ip (not your server ip)
  first_name: 'John',                              // set customer first name
  last_name: 'Doe',                                // set customer last name
  birthday: '1970-01-01'                           // set customer birthday
};

// execute payout
payout.executePayout(options, function() {

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


## Run Test (Payout Advanced Example)

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
