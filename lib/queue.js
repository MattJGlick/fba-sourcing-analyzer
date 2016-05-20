/**
 * Created by glickm on 10/15/15.
 */
var async =  require('async');
var evaluator = require('./services/evaluator');

var THREAD_NUMBER = 2;
var WAIT_TIME = 3000; // 1 second

var pg = require('pg');

var conString = process.env.POSTGRES_STRING;
module.exports = function Queue () {
  return async.queue(function (task, callback) {
    evaluateAndWait(task.asin, task.buyPrice, function (results) {
     callback(results);
    });
  }, THREAD_NUMBER);

  function evaluateAndWait (asin, buyPrice, callback) {
    setTimeout(
      evaluator.evaluate(asin, buyPrice, function (results) {
        callback(results);
      })
      , WAIT_TIME);
  }
};

