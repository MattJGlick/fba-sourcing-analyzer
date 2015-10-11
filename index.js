/**
 * Created by glickm on 6/19/15.
 */
exports.evaluator = evaluator = require('./lib/services/evaluator');
exports.keepaFacade = keepaFacade = require('./lib/facades/keepa-facade');
exports.cccFacade = cccFacade = require('./lib/facades/ccc-facade');
exports.tracktorFacade = cccFacade = require('./lib/facades/tracktor-facade');
exports.twitterMonitor = twitterMonitor = require('./lib/services/twitter-monitor');
exports.mailer = mailer = require('./lib/services/mailer');
exports.mwsFacade =  require('./lib/facades/mws-facade');

//exports.mwsFacade.test("B009C98PR0");

//mailer.mail("TEST");

//exports.mwsFacade.GetLowestOfferListingsForASIN("B00008J7NZ", "New", function (results) {
//  console.log(JSON.stringify(results, null, 2));
//});
//
//exports.mwsFacade.GetLowestPricedOffersForASIN("B00008J7NZ", "New", function (results) {
//  console.log(JSON.stringify(results, null, 2));
//});






//exports.mwsFacade.getServiceStatus(function (results) {
//  console.log(results);
//})
//
exports.evaluator.evaluate("B000CINVA6", function (results) {
  console.log(results);
  //mailer.mail(results);
});

//exports.tracktorFacade.searcher("B009C98PR0", function (results) {
//  console.log(results);
//})

//exports.twitterMonitor.monitorKeepa();

//exports.cccFacade.scrape(function (asinArray) {
//  var index = 0;
//
//  setInterval(function () {
//    exports.evaluator.evaluate((asinArray[index]), function (result) {
//      console.log(result);
//    });
//
//    index++;
//    console.log("next");
//  }, 5000);
//});
