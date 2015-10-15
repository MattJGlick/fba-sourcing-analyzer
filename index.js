/**
 * Created by glickm on 6/19/15.
 */

var http = require('http');
var schedule = require('node-schedule');
var express = require('express');

var Queue = require('./lib/queue');

exports.evaluator = evaluator = require('./lib/services/evaluator');
exports.cccFacade = cccFacade = require('./lib/facades/ccc-facade');
exports.twitterMonitor = twitterMonitor = require('./lib/services/twitter-monitor');
exports.mailer = mailer = require('./lib/services/mailer');
exports.mwsFacade =  require('./lib/facades/mws-facade');
exports.logger = logger = require('./lib/loggers/logging');




server = http.createServer(function (req, res) {
  var data = "Monitoring twitter...";
  res.end(data);
});

server.listen(process.env.PORT || 5000);

logger.log("Running on Port: " + (process.env.PORT || "5000"));


var q = new Queue();

exports.twitterMonitor.monitorKeepa(q);

// run the CCC stuff every 4 hours. I think I want to move this out of here?
schedule.scheduleJob('0 */4 * * *', function(){
  console.log(JSON.stringify("Starting Cron Section", null, 2));
  cccFacade.scrape(function (asins) {
    logger.log("------------");
    logger.log("FULL SCREEN INCOMING. GRABBING CCC");
    logger.log("------------");
    q.push(asins, function (result) {
      console.log(JSON.stringify(result.determination.asin + " " + result.determination.buy, null, 2));

      if(result.determination.buy) {
        mailer.mail("CCC", result);
      }
    });
  });
});





// -------- TESTING STUFFF --------------
//q.push(["B009C98PR0"], function (result) {
//  console.log(JSON.stringify(result.determination.buy, null, 2));
//});

//mailer.mail("TEST", "TEST");

//exports.evaluator.evaluate("B00K5TI4UY", function (results) {
//  console.log(results);
//});

//exports.mwsFacade.GetLowestOfferListingsForASIN("B00008J7NZ", "New", function (results) {
//  console.log(JSON.stringify(results, null, 2));
//});