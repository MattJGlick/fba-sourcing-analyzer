/**
 * Created by glickm on 9/10/15.
 */
/**
 * Created by glickm on 6/22/15.
 */
var needle = require('needle');
var _ = require('underscore');
var logger = require('../loggers/logging');

// takes an ASIN and returns valued information about it
exports.searcher = function searcher(asin, callback) {

  var request = require('request');

  request('https://thetracktor.com/detail/B005KTVG86', function (error, response, body) {
    callback(request)
  })
};