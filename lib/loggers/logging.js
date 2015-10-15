/**
 * Created by glickm on 6/23/15.
 */
var config = require('config');

exports.log = function (message) {
  if(config.get('logging')) {
    console.log("LOG:    " + message);

  }
};

exports.debug = function (message) {
  if(config.get('debug')) {
    console.log("DEBUG:  " + message);
  }
};