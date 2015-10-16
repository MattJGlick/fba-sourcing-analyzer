/**
 * Created by glickm on 10/15/15.
 */
var schedule = require('node-schedule');
var cccFacade = require('../facades/ccc-facade');
var tracktorFacade = require('../facades/tracktor-facade');
var mailer = require('./mailer');
var logger = require('../loggers/logging');

module.exports.startCCCScheduler = function (queue, hours) {
  schedule.scheduleJob('0 */'+ hours + ' * * *', function(){
    console.log(JSON.stringify("Starting CCC Cron Section", null, 2));

    scrapeCCC(queue);
  });
};

function scrapeCCC(queue) {
  cccFacade.scrape(function (asins) {
    logger.log("------------");
    logger.log("FULL SCREEN INCOMING. GRABBING CCC");
    logger.log("------------");
    queue.push(asins, function (result) {
      console.log(JSON.stringify(result.determination.asin + " " + result.determination.buy, null, 2));

      if(result.determination.buy) {
        mailer.mail("CCC", result);
      }
    });
  });
}

module.exports.startTracktorScheduler = function (queue, hours) {
  schedule.scheduleJob('30 */'+ hours + ' * * *', function(){
    console.log(JSON.stringify("Starting Tracktor Cron Section", null, 2));

    scrapeTracktor(queue);
  });
};

function scrapeTracktor(queue) {
  tracktorFacade.scrape(function (asins) {
    logger.log("------------");
    logger.log("FULL SCREEN INCOMING. GRABBING TRACKTOR");
    logger.log("------------");
    queue.push(asins, function (result) {
      console.log(JSON.stringify(result.determination.asin + " " + result.determination.buy, null, 2));

      if(result.determination.buy) {
        mailer.mail("Tracktor", result);
      }
    });
  });
}