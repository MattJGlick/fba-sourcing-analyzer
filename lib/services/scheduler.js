/**
 * Created by glickm on 10/15/15.
 */
var schedule = require('node-schedule');
var cccFacade = require('../facades/ccc-facade');
var mailer = require('./mailer');
var logger = require('../loggers/logging');

module.exports.startScheduler = function (queue, hours) {
  schedule.scheduleJob('0 */'+ hours + ' * * *', function(){
    console.log(JSON.stringify("Starting Cron Section", null, 2));

    scrapeCCC(queue);
  });
};

function scrapeCCC(queue) {
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
}