/**
 * Created by glickm on 6/19/15.
 */
exports.evaluator = evaluator = require('./lib/services/evaluator');
exports.keepaFacade = keepaFacade = require('./lib/facades/keepa-facade');
exports.cccFacade = cccFacade = require('./lib/facades/ccc-facade');
exports.twitterMonitor = twitterMonitor = require('./lib/services/twitter-monitor');
exports.mailer = mailer = require('./lib/services/mailer');

//mailer.mail("TEST");

exports.evaluator.evaluate("B005LTNLDS", function (results) {
  console.log(results);
  //mailer.mail(results);
});

//exports.twitterMonitor.monitorKeepa();

//exports.cccFacade.scrape(function (asinArray) {
//  asinArray.forEach(function (asin) {
//    console.log(asin);
//    exports.evaluator.evaluate(asin, function (result) {
//      //if(result.determination.buy === 'true') {
//        console.log(result);
//      //}
//    })
//  })
//});