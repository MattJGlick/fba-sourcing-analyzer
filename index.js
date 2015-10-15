/**
 * Created by glickm on 6/19/15.
 */

var http = require('http');
var express = require('express');

var Queue = require('./lib/queue');

var scheduler = require('./lib/services/scheduler');
var twitterMonitor = require('./lib/services/twitter-monitor');
var testing = require('./lib/test');




server = http.createServer(function (req, res) {
  var data = "Monitoring twitter...";
  res.end(data);
});

server.listen(process.env.PORT || 5000);

console.log("Running on Port: " + (process.env.PORT || "5000"));

var queue = new Queue();

twitterMonitor.monitorKeepa(queue);
scheduler.startScheduler(queue, 4);
