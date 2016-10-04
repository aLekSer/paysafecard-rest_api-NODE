// Require the payment class
var paysafecardPayment = require('../');

// require necessary modules
var prompt = require('readline-sync').question; // for prompt (testing) only
var uuid = require('node-uuid'); // for UUID (testing) only

// debug
var debug = false;

// your psc key
var key = 'psc_xl0EwfLX-96bEkjy-mXYD7SFviyvaqA';

// set environment (TEST / PRODUCTION)
var environment = 'TEST';

// create payment instance
var payment = new paysafecardPayment(key, environment);


// Variables

// Create options Object
var options = {};

// amount of this payment, i.e. 10.00
options.amount = 0.10;

// currency of this payment, i.e. 'EUR'
options.currency = 'EUR';

// customer ID (merchant client ID)
options.customer_id = 'md5_hash';

// the customers IP (not your server IP)
options.customer_ip = '123.123.123.123';

// URL to redirect the customer to after a successful payment
options.success_url = 'http://www.yoururl.com/success.php?payment_id={payment_id}';

// URL to redirect the customer to after a failed payment
options.failure_url = 'http://www.yoururl.com/failure.php?payment_id={payment_id}';

// URL to call by the psc API to notify your scripts of the payment
options.notification_url = 'http://www.yoururl.com/notification.php?payment_id={payment_id}';


//// optional features for advanced usage
//
//// Define a unique identifier for referencing (optional) default is None
// default: None
// max length: 41
//options.correlation_id = uuid.v4();
//options.correlation_id = 'uniq_id_123'
//
//// restrict to certain country
// default: None
//options.country_restriction = 'DE'
//
//// only allow customers with a certain kyc level
// default: None
// options.kyc_restriction = 'FULL'
//
//// set the minimum age of the customer
// default: None
// options.min_age = 18
//
// choose the shop id to use for this payment
// default: None
//options.shop_id = 1
//
// Reporting Criteria
// default: None
//options.submerchant_id = 1
//
// Usage:
//payment.createPayment(options, callback);
//
// create a payment
payment.createPayment(options, function() {

  if (payment.requestIsOk()) {
    // check if the createpayment request was successful

    console.log('Request succeeded:');
    console.log('###############');
    console.log('Redirect to (for testing open in browser): ' + payment.getResponse().redirect.auth_url);
    if (debug) {
      // for debugging / more information show response:
      console.log('Request Parameter:');
      console.log(payment.getRequestPrameter());
      console.log('Request Info:');
      console.log(payment.getRequestInfo());
      console.log('Request Response:');
      console.log(payment.getResponse());
    }

    //// Retrieve Payment information
    var in_payment_id = prompt('Please enter Payment ID from URL: ');
    // retieve all information
    console.log('###############');
    console.log('Retrieve Payment:');
    payment.retrievePayment(in_payment_id, function() {

      if (payment.requestIsOk()) {
        // check if last request was successfull

        console.log('retrive payment successful.');
        if(debug) {
          console.log(payment.getResponse());
        }

        // Test for capturing a payment (use in notification script, use in success script as fallback if notification fails. Use when status is AUTHORIZED)
        if (payment.getResponse().status == 'AUTHORIZED') {
          // payment was not captured properly by notification URL
          // Run test if everything works:
          console.log('Payment was not captured by notification URL');
          prompt('Press Enter to continue to capture payment...');
          console.log('Captured Payment:');

          payment.capturePayment(in_payment_id, function() {
            // check if capture request was successfull
            if (payment.requestIsOk()) {
              // capture was successfull
              console.log('Capture request was successful. Checking response:');
              if(debug) {
                console.log(payment.getResponse());
              }
              if (payment.getResponse().status == 'SUCCESS') {
                console.log('capture successful, process your payment actions');
                /*
                 *                Payment OK
                 *        Here you can save the Payment
                 * process your actions here (i.e. send confirmation email etc.)
                 *  This is a fallback to notification
                 *
                */
              } else {
                console.log('capture not successful, check response:');
                console.log(payment.getResponse());
              }
            } else {
              // capture failed
              var error = payment.getError();
              console.log('#### Error ####');
              console.log('Request failed with Error: ' + error.number + ' - ' + error.message);
              if(debug){
                console.log('Debug information:');
                console.log(payment.getResponse());
                console.log('###############');
              }
            }
          });
        } else if (payment.getResponse().status == 'SUCCESS') {
          // retrieved payment has success status
          // print a positive response to the customer
          console.log('payment status success - Thank you for your purchase!');
          if (debug) {
            console.log('Retrieve Reponse');
            console.log(payment.getResponse());
          }
        } else if (payment.getResponse().status == 'INITIATED') {
          // payment is iniated but not yet payed / failed
          console.log('payment is not yet processed, please visit / redirect to auth_url your received on payment creation');
          console.log('exit.');
        }
      } else {
        // retrive payment failed, handle errors
        var error = payment.getError();
        console.log('#### Error ####');
        console.log('Request failed with Error: ' + error.number + ' - ' + error.message);
        if(debug){
          console.log('Debug information:');
          console.log(payment.getResponse());
          console.log('###############');
        }
      }
    });

  } else {
    // create payment failed, handle errors
    var error = payment.getError();
    console.log('#### Error ####');
    console.log('Request failed with Error: ' + error.number + ' - ' + error.message);
    if(debug){
      console.log('Debug information:');
      console.log(payment.getResponse());
      console.log('###############');
    }
  }
});
