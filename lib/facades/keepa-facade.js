/**
 * Created by glickm on 6/22/15.
 */
var needle = require('needle');
var _ = require('underscore');

// takes an ASIN and returns valued information about it
exports.searcher = function searcher(asin, callback) {
  var url = 'http://dyn.keepa.com/product/?user=2cd568c5421dac05fc7e6c30561b9e4ce76392578e0dc77dada642c9962008cb&domain=1&type=full&source=0&asin='

  //hit the keepa url with ASIN attached
  needle.get(url + asin, function(error, response) {
    if (!error && response.statusCode == 200) {
      var details = response.body.product;

      var results = {
        name: details.TITLE,
        asin: details.ASIN,
        amazonCurrent: details.AMAZON_LAST / 100,
        newCurrent: details.MARKET_NEW_LAST / 100
      };

      getDetails(details.AMAZON, "PRICE", 90, function (amazonResults) {
        // get the amazon details
        results.amazon = amazonResults;

        //getDetails([0, 4000, 39000, 3000, 39100, 2000], "PRICE", 90, function (newResults) {
        getDetails(details.MARKET_NEW, "PRICE", 90, function (newResults) {
          // get the new details
          results.new = newResults;

          getDetails(details.SALESRANK, "RANK", 90, function (rankResults) {
            // get the rank details
            results.rank = rankResults;

            callback(results);
          });
        });
      });
    }
  });
};

// convert the keepa hours into the timestamp
function getDateFromKeepaHours(keepaHours) {
  var offset = 1293840000000 + (new Date().getTimezoneOffset() * 60000);

  return new Date(offset + (keepaHours * 3600000));
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
          prevElement = element;
          prevDate = date;

          // if we're at the end
          if (counter == 1 && prevElement > 0) {
            timeWidth = now - prevDate;
            timeWidth = Math.ceil(timeWidth / checkHowOften);

            totalValues += prevElement * timeWidth;
            dayCount += timeWidth;
          }
        } else {
          // not inside the range, need to get the last point
          prevElement = element;
        }
      }

      if (--counter == 0) {
        if (daysBack == 90 && count == 0) {
          getDetails(data, type, 365, callback);
        } else {
          return callback({
            length: daysBack,
            average: totalValues / dayCount,
            highest: max,
            lowest: min,
            count: count
          });
        }
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