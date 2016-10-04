// Require the payout class
var paysafecardPayout = require('../');

// require necessary modules
var prompt = require('readline-sync').question; // for prompt (testing) only
var uuid = require('node-uuid'); // for UUID (testing) only

// debug
var debug = false;

// your psc key
var key = 'psc_xl0EwfLX-96bEkjy-mXYD7SFviyvaqA';

// set environment (TEST / PRODUCTION)
var environment = 'TEST';

// create payout instance
var payout = paysafecardPayout(key, environment);


// Variables

// Create options Object
var options = {};

// amount of this payment, i.e. 10.00
options.amount = 0.10;

// currency of this payment, i.e. 'EUR'
options.currency = 'EUR';

// customer ID (merchant client ID)
options.customer_id = '434186408713';

// customer mail to payout to (psc)
options.customer_email = 'VrAtTRLRyS@avUVWdRVeH.NYE';

// the customers IP (not your server IP)
options.customer_ip = '123.123.123.123';

// first_name
options.first_name = 'Test';

// Last Name
options.last_name = 'BubxNFGHwdGCElzbmjxsycWdYX';

// Date of Birth
options.birthday = '1986-06-16';

//// optional features for advanced usage
//
//// Define a unique identifier for referencing (optional) default is None
// default: None
// max length: 41
//options.correlation_id = uuid.v4();
//options.correlation_id = 'uniq_id_123'
//
// Reporting Criteria
// default: None
//options.submerchant_id = 1
//
// Usage:
//payout.validatePayout(options, callback);
//

// get limits

// for limit information
console.log('###############');
prompt('Press Enter to request limit informations...');

payout.getLimits('EUR', function() {

  // check if the request was successful
  if (payout.requestIsOk()) {
    console.log(payout.getResponse());
    console.log('Limits Request successful.');

    if (debug) {
      // for debugging / more information show response:
      console.log('Request Parameter:');
      console.log(payout.getRequestPrameter());
      console.log('Request Info:');
      console.log(payout.getRequestInfo());
      console.log('Request Limit Response:');
      console.log(payout.getResponse());
    }
  } else {
    // Limit request failed, handle errors
    var error = payout.getError();
    console.log('#### Error ####');
    console.log('Limit Request failed with Error: ' + error.number + ' - ' + error.message);
    if(debug){
      console.log('Debug Response:');
      console.log(payout.getResponse());
      console.log('###############');
    }
  }

  // print limits
  console.log('Limits:');
  console.log(payout.getResponse());

  // validate Payout info
  console.log('###############');
  prompt('Press Enter to continue to validate payout...');

  //validate a payout
  payout.validatePayout(options, function() {

    // check if the request was successful
    if (payout.requestIsOk()) {
      console.log('Validate Request successful.');

      if (payout.getResponse().status == 'VALIDATION_SUCCESSFUL') {
        console.log('Validation was successful.');
      } else {
        console.log(payout.getResponse());
      }

      if (debug) {
        // for debugging / more information show response:
        console.log('Request Parameter:');
        console.log(payout.getRequestPrameter());
        console.log('Request Info:');
        console.log(payout.getRequestInfo());
        console.log('Request Limit Response:');
        console.log(payout.getResponse());
      }
    } else {
      // validate payout failed, handle errors
      var error = payout.getError();
      console.log('#### Error ####');
      console.log('Request failed with Error: ' + error.number + ' - ' + error.message);
      if(debug){
        console.log('Debug Response:');
        console.log(payout.getResponse());
        console.log('###############');
      }
    }

    // execute a Payout
    console.log('###############');
    prompt('Press Enter to continue to execute payout...');

    // For usage information: have a look at validatePayout above, since they both use the same variables
    payout.executePayout(options, function() {

      // check if the request was successful
      if (payout.requestIsOk()) {
        console.log('execute Request succeeded:');

        if (payout.getResponse().status == 'SUCCESS') {
          // execution of payout was successful
          console.log('Execution was successful. Payout successful');
        } else {
          console.log(payout.getRequestPrameter());
        }

        if (debug) {
          // for debugging / more information show response:
          console.log('Request Parameter:');
          console.log(payout.getRequestPrameter());
          console.log('Request Info:');
          console.log(payout.getRequestInfo());
          console.log('Request Limit Response:');
          console.log(payout.getResponse());
        }
      } else {
        // validate payout failed, handle errors
        var error = payout.getError();
        console.log('#### Error ####');
        console.log('Request failed with Error: ' + error.number + ' - ' + error.message);
        if(debug){
          console.log('Debug Response:');
          console.log(payout.getResponse());
          console.log('###############');
        }
      }

      console.log('######## Test finished #######');
    });

  });

});
