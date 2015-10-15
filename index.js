/**
 * Created by glickm on 6/19/15.
 */

var http = require('http');
var express = require('express');

var Queue = require('./lib/queue');

var scheduler = require('./lib/services/scheduler');
var twitterMonitor = require('./lib/services/twitter-monitor');
var testing = require('./lib/test');

var server = express();

var queue = new Queue();

server.set('views', './lib/views');
server.set('view engine', 'jade');

server.get('/', function(req, res) {
  if(req.query.asin) {
    queue.push(req.query.asin, function (result) {
      console.log(JSON.stringify(result, null, 2));

      res.render('home', {
        title: 'FBA Sourcing Analyzer',
        searchResults: JSON.stringify(result)
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
//scheduler.startScheduler(queue, 4);
