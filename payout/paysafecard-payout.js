'use strict';

var PaysafecardPayout = function PaysafecardPayout(_key, _environment) {
  // auto instantiate
  if (!(this instanceof PaysafecardPayout)) {
    return new PaysafecardPayout(_key, _environment);
  }

  var self = this;

  // Construct payment class.
  this.key = _key; // define psc key
  this.error = {};
  this.environment = _environment; // set environment

  setEnvironment(self); // set url based on environment
};

PaysafecardPayout.prototype.requestIsOk = function() {
  // check if request was successful
  var self = this;

  if (self.request.statusCode < 300) {
    return true;
  } else {
    return false;
  }
};

PaysafecardPayout.prototype.getResponse = function() {
  // get the response
  var self = this;

  if (!self.request.body){
    return {};
  } else {
    return self.request.body;
  }
};

PaysafecardPayout.prototype.getRequestPrameter = function() {
  // get request parameter
  var self = this;

  return self.requestParameter;
};

PaysafecardPayout.prototype.getRequestInfo = function() {
  // get request information
  var self = this;

  return self.requestinfo;
};

PaysafecardPayout.prototype.getLimits = function(currency, success) {
  // get Limits
  var self = this;

  self.url = self.url + 'limits/' + currency;

  doRequest(self, null, 'GET', null, function() {
    // return false if request failed
    if (self.requestIsOk) {
      success(self.getResponse());
    } else {
      success(false);
    }
  });
};

PaysafecardPayout.prototype.validatePayout = function(options, success) {
  // validate a payout
  /*
  necessary variables:
  options.amount = 10.00 # payout amount
  options.currency = 'EUR' # payout currency, USD, EUR, SEK..
  options.customer_id = 'customer_id_123' # your psc customer id, merchant client id
  options.customer_email = 'ABCEXAMPLEABC@ABCEXAMPLEABC.ABC'
  options.customer_ip = '123.123.123.123' # the customers IP
  options.first_name = 'John' #  first name
  options.last_name = 'Doe' #  last name
  options.birthday = '1986-06-16' # day of birth

  optional variables:
  options.correlation_id = uuid.v4() # Define a unique identifier for referencing (optional) default is None
  options.submerchant_id = 1 # Reporting criteria
  */

  var self = this;

  var headers = {};

  var customer = {
    'id': options.customer_id,
    'email': options.customer_email,
    'first_name': options.first_name,
    'last_name': options.last_name,
    'date_of_birth': options.birthday,
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

  doRequest(self, parameter, 'POST', headers, function() {
    // return false if request failed
    if (self.requestIsOk) {
      success(self.getResponse());
    } else {
      success(false);
    }
  });
};

PaysafecardPayout.prototype.executePayout = function(options, success) {
  // execute a payout
  /*
  necessary variables:
  options.amount = 10.00 # payout amount
  options.currency = 'EUR' # payout currency, USD, EUR, SEK..
  options.customer_id = 'customer_id_123' # your psc customer id, merchant client id
  options.customer_email = 'ABCEXAMPLEABC@ABCEXAMPLEABC.ABC'
  options.customer_ip = '123.123.123.123' # the customers IP
  options.first_name = 'John' #  first name
  options.last_name = 'Doe' #  last name
  options.birthday = '1986-06-16' # day of birth

  optional variables:
  options.correlation_id = uuid.v4() # Define a unique identifier for referencing (optional) default is None
  options.submerchant_id = 1 # Reporting criteria
  */

  var self = this;

  var headers = {};

  var customer = {
    'id': options.customer_id,
    'email': options.customer_email,
    'first_name': options.first_name,
    'last_name': options.last_name,
    'date_of_birth': options.birthday,
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

  doRequest(self, parameter, 'POST', headers, function() {
    // return false if request failed
    if (self.requestIsOk) {
      success(self.getResponse());
    } else {
      success(false);
    }
  });
};

PaysafecardPayout.prototype.getError = function() {
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
    case 3162:
      self.error.number = self.getResponse().number;
      self.error.message = 'Unfortunately, no my paysafecard account exists under the e-mail address you have entered. Please check the address for a typing error. If you do not have a my paysafecard account, you can register for one online now for free.';
      break;
    case 3195:
      self.error.number = self.getResponse().number;
      self.error.message = 'The personal details associated with your my paysafecard account do not match the details of this account. Please check the first names, surnames and dates of birth entered in both accounts and request the payout again.';
      break;
    case 3234:
      self.error.number = self.getResponse().number;
      self.error.message = 'Unfortunately, the payout could not be completed due to a problem which has arisen with your my paysafecard account. paysafecard has already sent you an e-mail with further information on self. Please follow the instructions found in this e-mail before requesting the payout again.';
      break;
    case 3198:
      self.error.number = self.getResponse().number;
      self.error.message = 'Unfortunately, the payout could not be completed due to a problem which has arisen with your my paysafecard account. Please contact the paysafecard support team. info@paysafecard.com';
      break;
    case 10008:
      self.error.number = self.getResponse().number;
      self.error.message = 'Invalid API Key';
      break;
    default:
      self.error.number = self.getResponse().number;
      self.error.message = self.getResponse().message;
      // self.error.message = 'Unfortunately there has been a technical problem and your payout request could not be executed. If the problem persists, please contact our customer support: support@company.com';
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
    self.url = 'https://apitest.paysafecard.com/v1/payouts/';
  } else if (self.environment == 'PRODUCTION') {
    self.url = 'https://api.paysafecard.com/v1/payouts/';
  } else {
    console.log('#### environment not supported');
  }
}

module.exports = PaysafecardPayout;
