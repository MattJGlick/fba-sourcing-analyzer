/**
 * Created by glickm on 6/22/15.
 */
var Twitter = require('twitter');
var config = require('config');
var urlExpander=require('expand-url');
var evaluator = require('./evaluator');
var logger = require('../loggers/logging');
var mailer = require('../services/mailer');

exports.monitorKeepa = function (q) {
  var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });

  logger.log("--- KEEPA MONITOR ---")

  //client.stream('user', {track: 'Keepa_Notifier', replies: 'all'}, function(stream) {
  client.stream('user', {track: 'AnS_CTF', replies: 'all'}, function(stream) {
    stream.on('data', function(tweet) {
      if(tweet.text) {
        logger.log(tweet.text);

        getASIN(tweet.text, function (asin) {
          q.push(asin, function (results) {
            //if(results.determination.buy) {
              mailer.mail(results);
            //}
          });
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

  logger.log("Getting ASIN from tweets");

  // check to make sure the URL contains keepa.com AND has a dollar sign so that we filter out all the foreign stuff
  if(/https:\/\/t.co\/\w*/.test(tweet)) {
    // pull out the keepa url
    keepaUrl = tweet.substring(tweet.indexOf("https://t."), tweet.indexOf("https://t.") + 23);
    //keepaUrl = /https:\/\/t.co\/\w*/.exec(tweet);
    logger.log("Keepa URL: " + keepaUrl);

    // expand the url to find the amazon asin
    urlExpander.expand(keepaUrl, function(err, amazonUrl){
      logger.log("Expanded URL: " + amazonUrl);

      if(amazonUrl && amazonUrl.indexOf(".com") > 0) {
        asin = amazonUrl.substring("http://www.amazon.com/dp/".length, amazonUrl.length);
        logger.log("asin: " + asin);
        callback(asin);
      }
    });
  }
}