/**
 * Created by glickm on 6/19/15.
 */
exports.evaluator = require('./lib/services/evaluator');
exports.keepaFacade = require('./lib/facades/keepa-facade');
exports.twitterMonitor = require('./lib/services/twitter-monitor');

//exports.evaluator.evaluate("B00KDZGBGE", function (results) {
//  console.log(results);
//});

exports.twitterMonitor.monitorKeepa();
