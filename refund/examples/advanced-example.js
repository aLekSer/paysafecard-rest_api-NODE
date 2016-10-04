// require the refund class
var paysafecardRefund = require('../');

// require necessary modules
var prompt = require('readline-sync').question; // for prompt (testing) only
var uuid = require('node-uuid'); // for UUID (testing) only

// debug
var debug = false;

// your psc key
var key = 'psc_xl0EwfLX-96bEkjy-mXYD7SFviyvaqA';

// set environment (TEST / PRODUCTION)
var environment = 'TEST';

// create refund instance
var refund = paysafecardRefund(key, environment);

// payment id to refund
var payment_id = 'pay_1000005843_testCorrID_5780325650790_EUR';


// get payment Detail
refund.getPaymentDetail(payment_id, function() {

  // check if the request was successful
  if (refund.requestIsOk()) {
    console.log('Get Payment Details Request succeeded:');

    if (refund.getResponse().status == 'SUCCESS') {
      console.log('Get Payment Details was successful. Details:');
      console.log(refund.getResponse());
    } else {
      console.log('Get Payment Details. Response:');
      console.log(refund.getResponse());
    }

    if (debug) {
      // for debugging / more information show response:
      console.log('Request Parameter:');
      console.log(refund.getRequestPrameter());
      console.log('Request Info:');
      console.log(refund.getRequestInfo());
      console.log('Request Limit Response:');
      console.log(refund.getResponse());
    }
  } else {
    // limit request failed, handle errors
    var error = refund.getError();
    console.log('#### Error ####');
    console.log('Get Payment Details Request failed with Error: ' + error.number + ' - ' + error.message);
    if(debug){
      console.log('Debug Response:');
      console.log(refund.getResponse());
      console.log('###############');
    }
  }


  // validate Refund
  console.log('###############');
  prompt('Press Enter to continue to validate Refund...');

  // variables

  // set payment id
  var payment_id = refund.getResponse().id;

  // create options object
  var options = {};

  // amount of this payment, i.e. 10.00
  options.amount = 0.10;

  // currency of this payment, i.e. 'EUR'
  options.currency = refund.getResponse().currency;

  // customer ID (merchant client ID)
  options.customer_id = refund.getResponse().customer.id;

  // customer mail to payout to (psc)
  options.customer_email = 'psc.mypins+matwal_blFxgFUJfbNS@gmail.com';

  // the customers IP (not your server IP)
  options.customer_ip = '123.123.123.123';

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
  //refund.validateRefund(payment_id, options, callback)
  //


  // validate a refund
  refund.validateRefund(payment_id, options, function() {

    // check if the request was successful
    if (refund.requestIsOk()) {
      console.log('Validate request succeeded:');

      if (debug) {
        // for debugging / more information show response:
        console.log('Validate Request Parameter:');
        console.log(refund.getRequestPrameter());
        console.log('Validate request Info:');
        console.log(refund.getRequestInfo());
        console.log('Validate Refund Response:');
        console.log(refund.getResponse());
      }

      if (refund.getResponse().status == 'VALIDATION_SUCCESSFUL') {
        console.log('Validation was successful.');

        // validation successful -> execute Refund
        console.log('###############');
        prompt('Press Enter to continue to execute refund...');

        // For usage information have a look at validate Refund above
        // only add refund ID from the prior validation

        // Variables

        // set refund id
        var refund_id = refund.getResponse().id;

        // Create options Object
        var options = {};

        // amount of this payment, i.e. 10.00
        options.amount = refund.getResponse().amount;

        // currency of this payment, i.e. 'EUR'
        options.currency = refund.getResponse().currency;

        // customer ID (merchant client ID)
        options.customer_id = refund.getResponse().customer.id;

        // customer mail to payout to (psc)
        options.customer_email = refund.getResponse().customer.email;

        // the customers IP (not your server IP)
        options.customer_ip = '123.123.123.123';

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
        //refund.executeRefund(payment_id, refund_id, options, callback)
        //

        refund.executeRefund(payment_id, refund_id, options, function() {
          // check if the request was successful
          if (refund.requestIsOk()) {
            console.log('Execute Request succeeded:');
            if( refund.getResponse().status == 'SUCCESS') {
              console.log('Refund was successfully executed. Customer has received his refund.');
            } else {
              console.log('Refund was not successful. Response:');
              console.log(refund.getResponse());
            }

            if (debug) {
              // for debugging / more information show response:
              console.log('Execute Request Parameter:');
              console.log(refund.getRequestPrameter());
              console.log('Execute request Info:');
              console.log(refund.getRequestInfo());
              console.log('Execute Refund Response:');
              console.log(refund.getResponse());
            }
          } else {
            // Refund failed, handle errors
            var error = refund.getError();
            console.log('#### Error ####');
            console.log('Request failed with Error: ' + error.number + ' - ' + error.message);
            if(debug){
              console.log('Debug Response:');
              console.log(refund.getResponse());
              console.log('###############');
            }
          }

          // direct Refund
          console.log('###############');
          prompt('Press Enter to continue to direct refund...');

          // For usage information have a look above

          // Variables

          // payment id to refund
          var payment_id = 'pay_1000005843_testCorrID_5780325650790_EUR';

          // Create options Object
          var options = {};

          // amount of this payment, i.e. 10.00
          options.amount = 0.10;

          // currency of this payment, i.e. 'EUR'
          options.currency = refund.getResponse().currency;

          // customer ID (merchant client ID)
          options.customer_id = refund.getResponse().customer.id;

          // customer mail to payout to (psc)
          options.customer_email = 'psc.mypins+matwal_blFxgFUJfbNS@gmail.com';

          // the customers IP (not your server IP)
          options.customer_ip = '123.123.123.123';

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
          //refund.directRefund(payment_id, options, callback)
          //

          refund.directRefund(payment_id, options, function() {
            // check if the request was successful
            if (refund.requestIsOk()) {
              console.log('Direct refund Request succeeded.');
              if( refund.getResponse().status == 'SUCCESS') {
                console.log('Direct Refund was successfully executed. Customer has received his refund.');
              } else {
                console.log('Direct Refund was not successful. Response:');
                console.log(refund.getResponse());
              }

              if (debug) {
                // for debugging / more information show response:
                console.log('Request Parameter:');
                console.log(refund.getRequestPrameter());
                console.log('Request Info:');
                console.log(refund.getRequestInfo());
                console.log('directly Refund Response:');
                console.log(refund.getResponse());
              }
            } else {
              // Refund failed, handle errors
              var error = refund.getError();
              console.log('#### Error ####');
              console.log('Request failed with Error: ' + error.number + ' - ' + error.message);
              if(debug){
                console.log('Debug Response:');
                console.log(refund.getResponse());
                console.log('###############');
              }
            }

            console.log('######## Test finished #######');
          });

        });
      } else {
        // validation not successful
        console.log('Validatation not successful. Reponse:');
        console.log(refund.getResponse());
      }
    } else {
      // Refund failed, handle errors
      var error = refund.getError();
      console.log('#### Error ####');
      console.log('Request failed with Error: ' + error.number + ' - ' + error.message);
      if(debug){
        console.log('Debug Response:');
        console.log(refund.getResponse());
        console.log('###############');
      }
    }
  });
});
