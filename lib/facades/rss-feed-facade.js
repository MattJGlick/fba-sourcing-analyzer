/**
 * Created by glickm on 10/16/15.
 */
var FeedParser = require('feedparser');
var request = require('request');
var _ = require('underscore');
var moment = require('moment');

var logger = require('../loggers/logging');

var RSS_CHECK_TIME = 1200000; // 20 minutes

exports.jungleFeed  = function (mailQueue, queue) {
  setInterval(function () {
    logger.log("Checking the Jungle Feeed...");

    var req = request('http://feeds.feedblitz.com/jungledealsblog');
    var feedparser = new FeedParser();

    req.on('error', function (error) {
      // handle any request errors
    });
    req.on('response', function (res) {
      var stream = this;

      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

      stream.pipe(feedparser);
    });

    feedparser.on('error', function (error) {
      // always handle errors
    });
    feedparser.on('readable', function () {
      // This is where the action is!
      var stream = this;
      var item;

      while (item = stream.read()) {
        if((moment() - moment(item.date)) < RSS_CHECK_TIME) {
          request(item.origlink, function (error, response, body) {
            if (!error && response.statusCode == 200) {

              var myArray;
              var asinArray = [];
              var myRe = /dp\/(\w*)/g;
              while ((myArray = myRe.exec(body)) !== null) {
                asinArray.push(myArray[1]);
              }
              queue.push(_.uniq(asinArray), function (results) {
                mailQueue.push({source: "Jungle Deals RSS Feed", details: results}, function (results) {
                  logger.log(results);
                });
              });
            }
          });
        }
      }
    });
  }, RSS_CHECK_TIME);
};

