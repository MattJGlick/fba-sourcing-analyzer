/**
 * Created by glickm on 6/22/15.
 */
var Twitter = require('twitter');
var config = require('config');
var urlExpander=require('expand-url');
var evaluator = require('./evaluator');

exports.monitorKeepa = function () {
  var client = new Twitter(config.get('twitterLoginInfo'));

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
  var asin

  console.log("Checking URL ", tweet)

  // check to make sure the URL contains keepa.com AND has a dollar sign so that we filter out all the foreign stuff
  if(/https:\/\/keepa.com\/r\/\w*/.test(tweet) && /Now:\s\$/.test(tweet)) {
    // pull out the keepa url
    keepaUrl = /https:\/\/keepa.com\/r\/\w*/.exec(tweet);
    console.log("Keepa URL ", keepaUrl)

    // expand the url to find the amazon asin
      urlExpander.expand(keepaUrl[0].trim(), function(err, amazonUrl){
        asin = amazonUrl.substr(/http:\/\/www.amazon.com\/dp\//.exec(amazonUrl)[0].length, amazonUrl.length);
        console.log("asin ", asin)
        evaluator.evaluate(asin, function (results) {
          console.log(results);
        })
      });
  }



}