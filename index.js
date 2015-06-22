/**
 * Created by glickm on 6/19/15.
 */
module.exports = run = require('./lib/services/evaluator');
_ = require('underscore');

run.evaluator("B00IUD7I5O", function (results) {
  console.log(results);
});

