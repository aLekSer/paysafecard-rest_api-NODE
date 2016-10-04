'use strict';

var PaysafecardRefund = function PaysafecardRefund(_key, _environment) {
  // auto instantiate
  if (!(this instanceof PaysafecardRefund)) {
    return new PaysafecardRefund(_key, _environment);
  }

  var self = this;

  // Construct payment class.
  this.key = _key; // define psc key
  this.error = {};
  this.environment = _environment; // set environment

  setEnvironment(self); // set url based on environment
};

PaysafecardRefund.prototype.requestIsOk = function() {
  // check if request was successful
  var self = this;

  if (self.request.statusCode < 300) {
    return true;
  } else {
    return false;
  }
};

PaysafecardRefund.prototype.getResponse = function() {
  // get the response
  var self = this;

  if (!self.request.body){
    return {};
  } else {
    return self.request.body;
  }
};

PaysafecardRefund.prototype.getRequestPrameter = function() {
  // get request parameter
  var self = this;

  return self.requestParameter;
};

PaysafecardRefund.prototype.getRequestInfo = function() {
  // get request information
  var self = this;

  return self.requestinfo;
};

PaysafecardRefund.prototype.getPaymentDetail = function(payment_id, success) {
  // get Payment Details including the (requested) refunds
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

PaysafecardRefund.prototype.validateRefund = function(payment_id, options, success) {
  // validate a Refund
  /*
  necessary variables:
  payment_id = 'pay_1000005843_U38vg4sGgcVnl2GTWuCp3eumn3j3nHkn_EUR' # the refund's payment ID
  options.amount = 10.00 # payout amount
  options.currency = 'EUR' # payout currency, USD, EUR, SEK..
  options.customer_id = 'customer_id_123' # your psc customer id, merchant client id
  options.customer_email = 'ABCEXAMPLEABC@ABCEXAMPLEABC.ABC'
  options.customer_ip = '123.123.123.123' # the customers IP

  optional variables:
  options.correlation_id = uuid.v4() # Define a unique identifier for referencing (optional) default is None
  options.submerchant_id = 1 # Reporting criteria
  */

  var self = this;

  var headers = {};

  var customer = {
    'id': options.customer_id,
    'email': options.customer_email,
    'first_name': 'Test',
    'last_name': 'Test',
    'date_of_birth': '1990-01-09',
    'ip': options.customer_ip
  };

  var parameter = {
    'amount': options.amount,
    'currency': options.currency,
    'type': 'PAYSAFECARD',
    'customer': customer,
    'capture': false
  };

  if (options.submerchant_id) {
    parameter.submerchant_id = options.submerchant_id;
  }

  if (options.correlation_id) {
    headers['Correlation-ID'] = options.correlation_id;
  }

  self.url = self.url + payment_id + '/refunds';
  doRequest(self, parameter, 'POST', headers, function() {
    // return false if request failed
    if (self.requestIsOk) {
      success(self.getResponse());
    } else {
      success(false);
    }
  });
};

PaysafecardRefund.prototype.executeRefund = function(payment_id, refund_id, options, success) {
  // execute a validated Refund
  /*
  necessary variables:
  payment_id = 'pay_1000005843_U38vg4sGgcVnl2GTWuCp3eumn3j3nHkn_EUR' # the refund's payment ID
  refund_id = 'ref_1000005843_8j6BBuHXOhvWBMKn20uhEEGrRMngwD7g_EUR' # the refund's id (from a prior validation)
  options.amount = 10.00 # payout amount
  options.currency = 'EUR' # payout currency, USD, EUR, SEK..
  options.customer_id = 'customer_id_123' # your psc customer id, merchant client id
  options.customer_email = 'ABCEXAMPLEABC@ABCEXAMPLEABC.ABC'
  options.customer_ip = '123.123.123.123' # the customers IP

  optional variables:
  options.correlation_id = uuid.v4() # Define a unique identifier for referencing (optional) default is None
  options.submerchant_id = 1 # Reporting criteria
  */

  var self = this;

  var headers = {};

  var customer = {
    'id': options.customer_id,
    'email': options.customer_email,
    'first_name': 'Test',
    'last_name': 'Test',
    'date_of_birth': '1990-01-09',
    'ip': options.customer_ip
  };

  var parameter = {
    'amount': options.amount,
    'currency': options.currency,
    'type': 'PAYSAFECARD',
    'customer': customer,
    'capture': true
  };

  if (options.submerchant_id) {
    parameter.submerchant_id = options.submerchant_id;
  }

  if (options.correlation_id) {
    headers['Correlation-ID'] = options.correlation_id;
  }

  self.url = self.url + payment_id + '/refunds/' + refund_id + '/capture';
  doRequest(self, parameter, 'POST', headers, function() {
    // return false if request failed
    if (self.requestIsOk) {
      success(self.getResponse());
    } else {
      success(false);
    }
  });
};

PaysafecardRefund.prototype.directRefund = function(payment_id, options, success) {
  // directly refund
  /*
  necessary variables:
  payment_id = 'pay_1000005843_U38vg4sGgcVnl2GTWuCp3eumn3j3nHkn_EUR' # the refund's payment ID
  options.amount = 10.00 # payout amount
  options.currency = 'EUR' # payout currency, USD, EUR, SEK..
  options.customer_id = 'customer_id_123' # your psc customer id, merchant client id
  options.customer_email = 'ABCEXAMPLEABC@ABCEXAMPLEABC.ABC'
  options.customer_ip = '123.123.123.123' # the customers IP

  optional variables:
  options.correlation_id = uuid.v4() # Define a unique identifier for referencing (optional) default is None
  options.submerchant_id = 1 # Reporting criteria
  */

  var self = this;

  var headers = {};

  var customer = {
    'id': options.customer_id,
    'email': options.customer_email,
    'first_name': 'Test',
    'last_name': 'Test',
    'date_of_birth': '1990-01-09',
    'ip': options.customer_ip
  };

  var parameter = {
    'amount': options.amount,
    'currency': options.currency,
    'type': 'PAYSAFECARD',
    'customer': customer,
    'capture': true
  };

  if (options.submerchant_id) {
    parameter.submerchant_id = options.submerchant_id;
  }

  if (options.correlation_id) {
    headers['Correlation-ID'] = options.correlation_id;
  }

  self.url = self.url + payment_id + '/refunds';
  doRequest(self, parameter, 'POST', headers, function() {
    // return false if request failed
    if (self.requestIsOk) {
      success(self.getResponse());
    } else {
      success(false);
    }
  });
};

PaysafecardRefund.prototype.getError = function() {
  // get Errors request errors and returned errors

  var self = this;

  if(!self.getResponse().number) {
    switch(this.request.statusCode) {
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
    case 3160:
      self.error.number = self.getResponse().number;
      self.error.message = 'Invalid customer details. Please forward the customer to contact our support';
      break;
    case 3162:
      self.error.number = self.getResponse().number;
      self.error.message = 'E-mail address is not registered with mypaysafecard';
      break;
    case 3165:
      self.error.number = self.getResponse().number;
      self.error.message = 'The amount is invalid. Maximum refund amount cannot exceed the original payment amount';
      break;
    case 3167:
      self.error.number = self.getResponse().number;
      self.error.message = 'Customer limit exceeded. Please forward the customer to contact our support';
      break;
    case 3179:
      self.error.number = self.getResponse().number;
      self.error.message = 'The amount is invalid. Maximum refund amount cannot exceed the original payment amount';
      break;
    case 3180:
      self.error.number = self.getResponse().number;
      self.error.message = 'Original Transaction is in an invalid state';
      break;
    case 3181:
      self.error.number = self.getResponse().number;
      self.error.message = 'Merchantclient-ID is not matching with original transaction';
      break;
    case 3182:
      self.error.number = self.getResponse().number;
      self.error.message = 'Merchantclient-ID is a mandatory parameter';
      break;
    case 3184:
      self.error.number = self.getResponse().number;
      self.error.message = 'Original payment transaction does not exist';
      break;
    case 10028:
      self.error.number = self.getResponse().number;
      self.error.message = 'One or more neccessary parameters are empty';
      break;
    default:
      self.error.number = self.getResponse().number;
      self.error.message = self.getResponse().message;
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

module.exports = PaysafecardRefund;
