/**
 * Created by glickm on 6/22/15.
 */
var needle = require('needle');
var _ = require('underscore');
var logger = require('../loggers/logging');
var request = require('request');

// takes an ASIN and returns valued information about it
exports.searcher = function searcher(asin, callback) {
  var url = "https://dyn.keepa.com/v3/api/product/?key=" + process.env.KEEPA_API + "&domain=1&asin=";

  logger.log("--- KEEPA FACADE ---");
  logger.log("Searching ASIN: " + asin);
  //hit the keepa url with ASIN attached
  request({url: url + asin , gzip: true}, function (error, response, body) {
    if(response) {
      var results = {};

      body = JSON.parse(body);

      var details = body.products[0];

      getDetails(details.csv[0], "PRICE", 90, function (amazonResults) {
        logger.log("Got the New averages");

        // get the amazon details
        results.amazon = amazonResults;

        getDetails(details.csv[1], "PRICE", 90, function (newResults) {
          logger.log("Got the new market averages");

          // get the new details
          results.new = newResults;

          getDetails(details.csv[3], "RANK", 90, function (rankResults) {
            logger.log("Got the sales rank averages");

            // get the rank details
            results.rank = rankResults;
            //console.log(JSON.stringify(results, null, 2));
            callback(results);
          });
        });
      });
    } else {
        console.log(error)
      callback(error);
    }
  });


};

// convert the keepa hours into the timestamp
function getDateFromKeepaHours(keepaHours) {
  return new Date((keepaHours + 21564000) * 60000);
}

// take an array of alternating times and values.
// converts the times into actual dates
// if PRICE converts the prices into actual dollar amounts and verifies they are positive values
// stores all the relevant information then returns the average, max, min and count
function getDetails(data, type, daysBack, callback) {
  var date, prevDate, prevElement = 0;
  var timeWidth = 1;
  var firstTimeInZone = true;
  var totalValues = 0, count = 0, dayCount = 0;
  var min, max, counter;

  var now = new Date();
  var earliestTime = new Date();
  var checkHowOften = 86400000;

  if(data) {
    counter = data.length;
    earliestTime.setDate(now.getDate() - daysBack);

    data.forEach(function (element, index) {
      if (index % 2 === 0) {
        date = getDateFromKeepaHours(element);
      } else {
        if (type === "PRICE") {
          element = element / 100;
        }

        // if its inside the time range
        if (date > earliestTime && prevElement > 0) {
          if (firstTimeInZone) {
            // default the very first value outside the box to be the min and max
            min = prevElement;
            max = prevElement;

            // check the date of the current one, find the difference between the starting point
            timeWidth = date - earliestTime;

            // we now have the first point
            firstTimeInZone = false;
          } else {
            // determine the length between the current date and the previous date
            timeWidth = date - prevDate;
          }

          //change the length of time from ms to days
          timeWidth = Math.ceil(timeWidth / checkHowOften);
          //console.log(JSON.stringify(timeWidth, null, 2));

          // min and max
          if (prevElement < min) min = prevElement;
          if (prevElement > max) max = prevElement;

          // count of the items
          count++;

          // get the total number of days
          dayCount += timeWidth;

          // get the total price
          totalValues += prevElement * timeWidth;

          // set the current ones to the next to be checked
          //console.log(JSON.stringify(prevElement, null, 2));
          prevElement = element;
          prevDate = date;

          // if we're at the end
          if (counter == 1 && prevElement > 0) {
            timeWidth = now - prevDate;
            timeWidth = Math.ceil(timeWidth / checkHowOften);

            totalValues += prevElement * timeWidth;
            dayCount += timeWidth;
            //console.log(JSON.stringify(timeWidth, null, 2));
            //console.log(JSON.stringify(prevElement, null, 2));
          }
        } else {
          // not inside the range, need to get the last point
          prevElement = element;
        }
      }

      if (--counter == 0) {
        return callback({
          length: daysBack,
          average: (totalValues / dayCount) ? (totalValues / dayCount).toFixed(2) : null,
          highest: max ? max.toFixed(2) : null,
          lowest: min ? min.toFixed(2) : null,
          count: count
        });
      }
    });
  } else {
    return callback({
      length: null,
      average: null,
      highest: null,
      lowest: null,
      count: null
    });
  }
}
