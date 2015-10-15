/**
 * Created by glickm on 10/15/15.
 */
var async =  require('async');
var evaluator = require('./services/evaluator');

var THREAD_NUMBER = 2;
var WAIT_TIME = 1000;

module.exports = function Queue () {
  return async.queue(function (asin, callback) {
    evaluateAndWait(asin, function (results) {
      callback(results);
    });
  }, THREAD_NUMBER);

  function evaluateAndWait (asin, callback) {
    setTimeout(
      evaluator.evaluate(asin, function (results) {
        callback(results);
      })
      , WAIT_TIME);
  }
};