/**
 * Created by glickm on 6/19/15.
 */

var http = require('http');
var express = require('express');

var Queue = require('./lib/queue');

var scheduler = require('./lib/services/scheduler');
var feedFacade = require('./lib/facades/rss-feed-facade');
var twitterMonitor = require('./lib/services/twitter-monitor');
var testing = require('./lib/test');

var server = express();

var queue = new Queue();

server.set('views', './lib/views');
server.set('view engine', 'jade');

server.get('/', function(req, res) {
  if(req.query.asin) {
    queue.push(req.query.asin, function (result) {
      res.render('home', {
        title: 'FBA Sourcing Analyzer',
        asin: req.query.asin,
        searchResults: result
      });
    });
  } else {
    res.render('home', {
      title: 'FBA Sourcing Analyzer'
    });
  }
});

server.listen(process.env.PORT || 5000);

console.log("FBA Sourcing Analyzer: Running on Port: " + (process.env.PORT || "5000"));

//twitterMonitor.monitorKeepa(queue);
//scheduler.startCCCScheduler(queue, 4);
//scheduler.startTracktorScheduler(queue, 6);
feedFacade.jungleFeed(queue);
//testing.test(queue);