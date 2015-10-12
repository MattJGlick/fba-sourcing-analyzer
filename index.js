/**
 * Created by glickm on 6/19/15.
 */

var http = require('http');

exports.evaluator = evaluator = require('./lib/services/evaluator');
exports.keepaFacade = keepaFacade = require('./lib/facades/keepa-facade');
exports.cccFacade = cccFacade = require('./lib/facades/ccc-facade');
exports.tracktorFacade = cccFacade = require('./lib/facades/tracktor-facade');
exports.twitterMonitor = twitterMonitor = require('./lib/services/twitter-monitor');
exports.mailer = mailer = require('./lib/services/mailer');
exports.mwsFacade =  require('./lib/facades/mws-facade');
exports.logger = logger = require('./lib/loggers/logging');
var async =  require('async');

var q = async.queue(function (asin, callback) {
  evaluateAndWait(asin, function (results) {
    callback(results);
  });
}, 2);

function evaluateAndWait (asin, callback) {
  setTimeout(
    exports.evaluator.evaluate(asin, function (results) {
      callback(results);
    })
  , 1000);
}

exports.twitterMonitor.monitorKeepa(q);

//exports.mwsFacade.GetLowestOfferListingsForASIN("B00008J7NZ", "New", function (results) {
//  console.log(JSON.stringify(results, null, 2));
//});


server = http.createServer(function (req, res) {
  var data = "Monitoring twitter...";
  res.end(data);
});

server.listen(5000);

//q.push(["B009C98PR0"], function (result) {
//  console.log(JSON.stringify(result.determination.buy, null, 2));
//});

//mailer.mail("TEST");

//exports.evaluator.evaluate("B00K5TI4UY", function (results) {
//  console.log(results);
//});


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