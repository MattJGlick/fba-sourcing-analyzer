/**
 * Created by glickm on 6/19/15.
 */
exports.evaluator = require('./lib/services/evaluator');
exports.keepaFacade = require('./lib/facades/keepa-facade');
exports.cccFacade = require('./lib/facades/ccc-facade');
exports.twitterMonitor = require('./lib/services/twitter-monitor');
//
//exports.evaluator.evaluate("B00N22CQ32", function (results) {
//  console.log(results);
//});

//exports.twitterMonitor.monitorKeepa();

exports.cccFacade.scrape(function (asinArray) {
  asinArray.forEach(function (asin) {
    exports.evaluator.evaluate(asin, function (result) {
      if(result.determination.buy === 'true') {
        console.log(result);
      }
    })
  })
});