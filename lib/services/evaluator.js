/**
 * Created by glickm on 6/19/15.
 */
var ASINSearcher = require('ASINSearcher');
var mwsFacade = require('../facades/mws-facade');
var feeCalculator = require('../services/fee-calculator');
var mws = require('mws-js');

exports.evaluator = function evaluator(asin, callback) {
  //var searchResults = { name: 'Southland Paper Food Tray, 2.5-Pound, 50-Pack',
  //  asin: 'B00TZRQOCC',
  //  amazonCurrent: 5.5,
  //  newCurrent: 5.49,
  //  amazon:
  //  { average: 5.9075000000000015,
  //    highest: 6.53,
  //    lowest: 5.45,
  //    count: 36 },
  //  new: { average: 5.49, highest: 5.49, lowest: 1.49, count: 1 },
  //  rank:
  //  { average: 6788.568047337278,
  //    highest: 30892,
  //    lowest: 1575,
  //    count: 169 }
  //};


  ASINSearcher.searcher(asin, function (keepaData) {
    mwsFacade.getSalesRank(asin, function (mwsData) {
      var lowestPurchasingPrice;

      if((keepaData.amazonCurrent < keepaData.newCurrent && keepaData.amazonCurrent > 0) || keepaData.newCurrent < 0) {
        lowestPurchasingPrice = keepaData.amazonCurrent;
      } else {
        lowestPurchasingPrice = keepaData.newCurrent;
      }

      //console.log(keepaData);
      //
      //console.log(lowestPurchasingPrice);
      //
      //console.log(mwsData);

      feeCalculator.calculateFee(keepaData.new.average, mwsData.weight, mwsData.dimensions, function (afterFee) {
        return callback({purchase: lowestPurchasingPrice,
          sell: keepaData.new.average,
          profit: afterFee - lowestPurchasingPrice,
          currentRanking: mwsData.rank,
          averageRanking: keepaData.rank.average,
          category: mwsData.category
        });
      })
    });
  });



  //mwsFacade.getServiceStatus(function (results) {
  //feeCalculator.calculateFee(25,.3, [6, 2.5, 1.2], function (results) {


  // things i factor in
  // ROI 6 points
  // 6 points = 200%
  // 5 points = 100%
  // 4 points = 80%
  // 3 points = 65%
  // 2 points = 50%
  // 1 points = 40%
  // rank 4 points
  // 4 points = top 500
  // 3 points = top 1%
  // 2 points = top 3%
  // 1 points = top 5%
};