/**
 * Created by glickm on 6/19/15.
 */
module.exports = run = require('./lib/services/evaluator');
_ = require('underscore');

run.evaluator("B00FCW88WI", function (results) {
  console.log(results);
});

