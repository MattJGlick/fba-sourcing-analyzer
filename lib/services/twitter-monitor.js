/**
 * Created by glickm on 6/22/15.
 */
var Twitter = require('twitter');
var config = require('config');
var urlExpander=require('expand-url');
var evaluator = require('./evaluator');
var logger = require('../loggers/logging');

exports.monitorKeepa = function () {
  var client = new Twitter(config.get('twitterLoginInfo'));

  logger.log("--- KEEPA MONITOR ---")

  client.stream('user', {track: 'Keepa_Notifier', replies: 'all'}, function(stream) {
    stream.on('data', function(tweet) {
      if(tweet.text) {
        getASIN(tweet.text);
      }
    });

    stream.on('error', function(error) {
      throw error;
    });
  });
}

function getASIN(tweet) {
  var keepaUrl;
  var asin;

  logger.log("Getting ASIN from tweets");

  // check to make sure the URL contains keepa.com AND has a dollar sign so that we filter out all the foreign stuff
  if(/https:\/\/t.co\/\w*/.test(tweet) && /Now:\s\$/.test(tweet)) {
    // pull out the keepa url
    keepaUrl = /https:\/\/t.co\/\w*/.exec(tweet);
    logger.log("Keepa URL: " + keepaUrl);

    // expand the url to find the amazon asin
      urlExpander.expand(keepaUrl[0].trim(), function(err, amazonUrl){
        asin = amazonUrl.substring(/http:\/\/www.amazon.com\/dp\//.exec(amazonUrl)[0].length, /http:\/\/www.amazon.com\/dp\/\w*/.exec(amazonUrl)[0].length);
        logger.log("asin: " + asin);

        evaluator.evaluate(asin, function (results) {
          console.log(results);
        })
      });
  }
}