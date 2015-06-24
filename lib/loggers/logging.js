/**
 * Created by glickm on 6/23/15.
 */
var config = require('config');

exports.log = function (message) {
  if(config.get('logging')) {
    console.log("LOG: " + message);
  }
};