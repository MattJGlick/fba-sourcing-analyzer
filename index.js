/**
 * Created by glickm on 6/19/15.
 */
exports.evaluator = require('./lib/services/evaluator');
exports.keepaFacade = require('./lib/facades/keepa-facade');

exports.evaluator.evaluate("B00J3LXMOS", function (results) {
  console.log(results);
});

