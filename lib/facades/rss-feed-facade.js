/**
 * Created by glickm on 10/16/15.
 */
var FeedParser = require('feedparser');
var request = require('request');
var _ = require('underscore');
var mailer = require('../services/mailer');

exports.jungleFeed  = function (queue) {
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
      request(item.origlink, function (error, response, body) {
        if (!error && response.statusCode == 200) {

          var myArray;
          var asinArray = [];
          var myRe = /dp\/(\w*)/g;
          while ((myArray = myRe.exec(body)) !== null) {
            asinArray.push(myArray[1]);
          }

          queue.push(_.uniq(asinArray), function (result) {
            mailer.mail("Jungle Deals", result);
          });
        }
      });
    }
  });
};