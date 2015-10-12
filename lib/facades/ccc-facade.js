/**
 * Created by glickm on 6/23/15.
 */
var request = require('request');
var _ = require('underscore');
var logger = require('../loggers/logging');


exports.scrape = function (callback) {
  logger.log("--- CCC Facade ---");
  logger.log("Scraping CCC");

  request('http://camelcamelcamel.com/top_drops?f=&t=relative&i=1&s=absolute&d=0.01', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      logger.log("good response from CCC");

      var myArray;
      var myRe = /\w* - Amazon/g;
      var asinArray = [];
      while ((myArray = myRe.exec(body)) !== null) {
        asinArray.push(myArray[0].substring(0, 10));
      }

      return callback((_.uniq(asinArray)));
    }
  })
};