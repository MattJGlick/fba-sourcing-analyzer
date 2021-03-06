/**
 * Created by glickm on 6/22/15.
 */
var Twitter = require('twitter');
var config = require('config');
var urlExpander=require('expand-url');
var logger = require('../loggers/logging');

exports.monitorKeepa = function (mailQueue, queue) {
  var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });

  logger.log("--- KEEPA MONITOR ---");

  client.stream('user', {replies: 'all'}, function(stream) {
    stream.on('data', function(tweet) {
      if(tweet.text) {
        logger.debug(tweet.text);

        getASIN(tweet.text, function (asin) {
          if(asin) {
            queue.push(asin, function (results) {
              if(results.determination.buy) {
                mailQueue.push({source: "KeepaTwitter", details: results}, function (results) {
                  logger.log(results);
                });
              }
            });
          }
        });
      }
    });

    stream.on('error', function(error) {
      throw error;
    });
  });
};

function getASIN(tweet, callback) {
  var keepaUrl;
  var asin;

  logger.debug("Getting ASIN from tweets");

  // check to make sure the URL contains keepa.com AND has a dollar sign so that we filter out all the foreign stuff
  if(/https:\/\/t.co\/\w*/.test(tweet)) {
    // pull out the keepa url
    keepaUrl = tweet.substring(tweet.indexOf("https://t."), tweet.length);
    logger.debug("Keepa URL: " + keepaUrl);

    // expand the url to find the amazon asin
    urlExpander.expand(keepaUrl, function(err, amazonUrl){
      logger.debug("Expanded URL: " + amazonUrl);

      if(amazonUrl && amazonUrl.indexOf(".com") > 0) {
        asin = amazonUrl.substring("http://www.amazon.com/dp/".length, amazonUrl.length);
        logger.debug("asin: " + asin);
        callback(asin);
      } else if(amazonUrl) {
        logger.log("Not US ASIN");
        callback(false);
      } else {
        callback(false);
      }
    });
  } else {
    logger.log("Couldn't find the url");
    callback(false);
  }
}