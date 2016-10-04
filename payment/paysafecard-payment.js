'use strict';

var PaysafecardPayment = function PaysafecardPayment(_key, _environment) {
  // auto instantiate
  if (!(this instanceof PaysafecardPayment)) {
    return new PaysafecardPayment(_key, _environment);
  }

  var self = this;

  // Construct payment class.
  self.key = _key; // define psc key
  self.error = {};
  self.environment = _environment; // set environment

  setEnvironment(self); // set url based on environment
};

PaysafecardPayment.prototype.requestIsOk = function() {
  // check if request was successful
  var self = this;

  if (self.request.statusCode < 300) {
    return true;
  } else {
    return false;
  }
};

PaysafecardPayment.prototype.getResponse = function() {
  // get the response
  var self = this;

  if (!self.request.body){
    return {};
  } else {
    return self.request.body;
  }
};

PaysafecardPayment.prototype.getRequestPrameter = function() {
  // get request parameter
  var self = this;

  return self.requestParameter;
};

PaysafecardPayment.prototype.getRequestInfo = function() {
  // get request information
  var self = this;

  return self.requestinfo;
};

PaysafecardPayment.prototype.retrievePayment = function(payment_id, success) {
  // retrieve payment informations
  var self = this;

  self.url = self.url + payment_id;

  doRequest(self, null, 'GET', null, function() {
    // return false if request failed
    if (self.requestIsOk) {
      success(self.getResponse());
    } else {
      success(false);
    }
  });
};

PaysafecardPayment.prototype.capturePayment = function(payment_id, success) {
  // capture a payment
  var self = this;

  self.url = self.url + payment_id + '/capture';

  var parameter = {
    'id': payment_id
  };

  doRequest(self, parameter, 'POST', null, function() {
    // return false if request failed
    if (self.requestIsOk) {
      success(self.getResponse());
    } else {
      success(false);
    }
  });
};

PaysafecardPayment.prototype.createPayment = function(options, success) {
  // create a payment
  /*
  necessary variables:
  options.amount = 10.00 # payments amount
  options.currency = 'EUR' # payment currency, USD, EUR, SEK..
  options.customer_id = 'customer_id_123' # your psc customer id, merchant client id
  options.customer_ip = '123.123.123.123' # the customers IP
  options.success_url = 'http://www.yoururl.com/success.php?payment_id={payment_id}' # URL to redirect the customer to after a successful payment
  foptions.ailure_url = 'http://www.yoururl.com/failure.php?payment_id={payment_id}' # URL to redirect the customer to after a failed payment
  options.notification_url = 'http://www.yoururl.com/notification.php?payment_id={payment_id}' # URL to call by the psc API to notify your scripts of the payment

  optional variables:
  options.correlation_id = uuid.v4() # Define a unique identifier for referencing (optional) default is None
  options.country_restriction = 'DE' # restrict to certain country
  options.kyc_restriction = 'FULL' # only allow customers with a certain kyc level
  options.min_age = 18 # set the minimum age of the customer
  options.shop_id = 1 # chose the shop id to use for this payment
  options.submerchant_id = 1 # Reporting criteria
  */
  var self = this;

  var headers = {};

  var customer = {
    'id': options.customer_id,
    'ip': options.customer_ip
  };

  if (options.country_restriction) {
    customer.country_restriction = options.country_restriction;
  }

  if (options.kyc_restriction) {
    customer.kyc_level = options.kyc_restriction;
  }

  if (options.min_age) {
    customer.min_age = options.min_age;
  }

  var parameter = {
    'currency': options.currency,
    'amount': options.amount,
    'customer': customer,
    'redirect': {
      "success_url": options.success_url,
      "failure_url": options.failure_url
    },
    'type': 'PAYSAFECARD',
    'notification_url': options.notification_url,
    'shop_id': options.shop_id
  };

  if (options.submerchant_id) {
    parameter.submerchant_id = options.submerchant_id;
  }

  if (options.correlation_id) {
    headers['Correlation-ID'] = options.correlation_id;
  }

  doRequest(self, parameter, 'POST', null, function() {
    // return false if request failed
    if (self.requestIsOk) {
      success(self.getResponse());
    } else {
      success(false);
    }
  });
};

PaysafecardPayment.prototype.getError = function() {
  // get Errors request errors and returned errors

  var self = this;

  if(!self.getResponse().number) {
    switch(self.request.statusCode) {
      case 400:
        self.error.number = 'HTTP:400';
        self.error.message = 'Logical error. The requested URL cannot be found. Check your request data';
        break;
      case 403:
        self.error.number = 'HTTP:403';
        self.error.message = 'Transaction could not be initiated due to connection problems. The servers IP address is probably not whitelisted!';
        break;
      case 500:
        self.error.number = 'HTTP:500';
        self.error.message = 'Server error.';
        break;
    }

    if (self.error) {
      return self.error;
    }
  }

  switch(self.getResponse()) {
    case 4003:
      self.error.number = self.getResponse().number;
      self.error.message = 'The amount for this transaction exceeds the maximum amount. The maximum amount is 1000 EURO (equivalent in other currencies)';
      break;
    case 3001:
      self.error.number = self.getResponse().number;
      self.error.message = 'Transaction could not be initiated because the account is inactive.';
      break;
    case 2002:
      self.error.number = self.getResponse().number;
      self.error.message = 'payment id is unknown.';
      break;
    case 2010:
      self.error.number = self.getResponse().number;
      self.error.message = 'Currency is not supported.';
      break;
    case 2029:
      self.error.number = self.getResponse().number;
      self.error.message = 'Amount is not valid. Valid amount has to be above 0.';
      break;
    default:
      self.error.number = self.getResponse().number;
      self.error.message = self.getResponse().message;
      // self.error.message = 'Transaction could not be initiated due to connection problems. If the problem persists, please contact our support. ';
      break;
  }

  return self.error;
};

// Prepare and start request
function doRequest(self, parameter, method, headers, success) {
  /*
  Make an API request and return all needed information
  */

  // require request package
  var request = require('request');

  // set general request options
  var options = {};
  options.port = 443;
  options.timeout = 60 * 1000; // timeout in ms: 60.000ms = 60s
  options.strictSSL = false;
  options.json = true;
  options.uri = self.url;

  // define default headers
  if (!headers) {
    headers = {};
  }
  headers['Authorization'] = 'Basic ' + new Buffer(self.key).toString('base64');
  options.headers = headers;

  self.requestParameter = parameter;

  // method handling
  if (method == 'POST') {
    options.method = 'POST';
    options.body = parameter;
  } else if (method == 'GET') {
    options.method = 'GET';
    if (parameter) {
      options.uri = self.url + parameter;
    }
  }

  // start request with options
  request(options, function (error, response, body) {
    // when request is complete
    // asign requested data

    self.request = response;
    self.requestinfo = {
      'request_error': error,
      'request_headers': response.request.headers,
      'response': response,
      'response_headers': response.headers,
      'status_code': response.statusCode,
      'status_message': response.statusMessage
    };

    // reset url
    setEnvironment(self);

    // call success callback
    if(success){
      success();
    }

  });
}

function setEnvironment(self) {
  // set the environment and URLs
  if (self.environment == 'TEST') {
    self.url = 'https://apitest.paysafecard.com/v1/payments/';
  } else if (self.environment == 'PRODUCTION') {
    self.url = 'https://api.paysafecard.com/v1/payments/';
  } else {
    console.log('#### environment not supported');
  }
}

module.exports = PaysafecardPayment;
