/**
 * Created by glickm on 10/15/15.
 */
var async =  require('async');
var evaluator = require('./services/evaluator');

var THREAD_NUMBER = 2;
var WAIT_TIME = 1000; // 1 second

var pg = require('pg');

var conString = process.env.POSTGRES_STRING;
module.exports = function Queue () {
  return async.queue(function (asin, callback) {
    evaluateAndWait(asin, function (results) {
      callback(results);
    });
  }, THREAD_NUMBER);

  function evaluateAndWait (asin, callback) {
    // TODO check if in the the DB already
    setTimeout(
      evaluator.evaluate(asin, function (results) {
        console.log(JSON.stringify(results, null, 2));
        var buy_price = results.money ? results.money.purchase : null;

        checkInDatabase(asin, buy_price, function (inDB) {
          insertIntoDB(results, function () {
            // TODO insert into the table
            if(inDB) {
              callback(false);
            } else {
              callback(results);
            }
          });
        })
      })
      , WAIT_TIME);
  }
};

function insertIntoDB (results, callback) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.log("error fetching client from pool");
    }

    var asin = results.determination.asin;
    var buy_price = results.money ? results.money.purchase : null;
    var sell_price = results.money ? results.money.sell : null;

    client.query('INSERT INTO asins (asin, buy_price, sell_price, date_added, determination) VALUES ($1, $2, $3, $4, $5)',
      [asin, buy_price, sell_price, new Date(), results.determination.buy], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          console.log("Error running query")
        }

        if(result.rowCount != 1) {
          console.log("Error Inserting the" + results.determination.asin + " into the DB");
        }

        callback();
      });
  });
}

function checkInDatabase(asin, buy_price, callback) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.log("error fetching client from pool");
    }

    // TODO add dates to this
    client.query('SELECT FROM asins WHERE asin = $1 AND buy_price = $2 AND determination = true', [asin, buy_price], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          console.log("Error running query")
        }

        if(result.rowCount == 0) {
          callback(false);
        } else {
          callback(true);
        }
      });
  });
}