/**
 * Created by glickm on 10/15/15.
 */

/**
 * Created by glickm on 6/23/15.
 */
var request = require('request');
var _ = require('underscore');
var logger = require('../loggers/logging');


exports.scrape = function (callback) {
  logger.log("--- Tracktor Facade ---");
  logger.log("Scraping Tracktor");

  var options = {
    url: "http://thetracktor.com/movers/?condition=&change=&change=price_change_percent&category=All&go=",
    headers: {
      Host: "www.thetracktor.com",
      'User-Agent': "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.13 (KHTML, like Gecko) Chrome/0.2.149.29 Safari/525.13s"
    }
  };

  var myArray;
  var myRe = /\/detail\/(\w*)\//g;
  var asinArray = [];

  request(options, function (error, response, body) {
    console.log(JSON.stringify(error, null, 2));
    if (!error && response.statusCode == 200) {
      logger.log("good response from Tracktor");

      //asinArray.push(1);
      while ((myArray = myRe.exec(body)) !== null) {
        asinArray.push(myArray[1]);
      }

      scrapePage2();
    }
  });

  function scrapePage2() {
    options.url = "http://thetracktor.com/movers/?page=2&category=All&go=&change=price_change_percent&condition=Amazon&";
    request(options, function (error, response, body) {
      logger.debug("Second page of tracktor ");
      if (!error && response.statusCode == 200) {

        while ((myArray = myRe.exec(body)) !== null) {
          asinArray.push(myArray[1]);
        }

        scrapePage3();
      }
    });
  }

  function scrapePage3() {
    options.url = "http://thetracktor.com/movers/?page=3&category=All&go=&change=price_change_percent&condition=Amazon&";
    request(options, function (error, response, body) {
      logger.debug("Third page of tracktor ");
      if (!error && response.statusCode == 200) {

        while ((myArray = myRe.exec(body)) !== null) {
          asinArray.push(myArray[1]);
        }

        scrapePage4();
      }
    });
  }

  function scrapePage4() {
    options.url = "http://thetracktor.com/movers/?page=4&category=All&go=&change=price_change_percent&condition=Amazon&";
    request(options, function (error, response, body) {
      logger.debug("Fourth page of tracktor ");
      if (!error && response.statusCode == 200) {

        while ((myArray = myRe.exec(body)) !== null) {
          asinArray.push(myArray[1]);
        }

        scrapePage5();
      }
    });
  }

  function scrapePage5() {
    options.url = "http://thetracktor.com/movers/?page=5&category=All&go=&change=price_change_percent&condition=Amazon&";
    request(options, function (error, response, body) {
      logger.debug("Fifth page of tracktor ");
      if (!error && response.statusCode == 200) {

        while ((myArray = myRe.exec(body)) !== null) {
          asinArray.push(myArray[1]);
        }

        return callback((_.uniq(asinArray)));
      }
    });
  }
};

