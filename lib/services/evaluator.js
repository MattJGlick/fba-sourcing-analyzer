/**
 * Created by glickm on 6/19/15.
 */
var keepaFacade = require('../facades/keepa-facade');
var mwsFacade = require('../facades/mws-facade');
var feeCalculator = require('../services/fee-calculator');
var mws = require('mws-js');
var config = require('config');
var categoryCounts = require('../constants/categoryCount');

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


  keepaFacade.searcher(asin, function (keepaData) {
    mwsFacade.getSalesRank(asin, function (mwsData) {

      //console.log(keepaData);
      //
      //console.log(lowestPurchasingPrice);
      //
      //console.log(mwsData);

      feeCalculator.calculateFee(keepaData.new.average, mwsData.weight, mwsData.dimensions, function (afterFee) {
        evaluateProduct(mwsData, keepaData, afterFee);
      });
    });
  });

  function evaluateProduct(mwsData, keepaData, afterFee) {
    var lowestPurchasingPrice;
    var buyResponse = "true";
    var roi;
    var profit;
    var categoryAmount;
    var categoryPercentage;
    var roiPoints;
    var rankPoints;


    if((keepaData.amazonCurrent < keepaData.newCurrent && keepaData.amazonCurrent > 0) || keepaData.newCurrent < 0) {
      lowestPurchasingPrice = keepaData.amazonCurrent;
    } else {
      lowestPurchasingPrice = keepaData.newCurrent;
    }

    // determine the profit
    profit = afterFee - lowestPurchasingPrice;

    // determine if the size is too big
    if(mwsData.weight > 2) {
      buyResponse = "false";
    }

    // determine the points for the ROI
    // ROI 6 points
    // 6 points = 200%
    // 5 points = 100%
    // 4 points = 80%
    // 3 points = 65%
    // 2 points = 50%
    // 1 points = 40%
    roi = profit / lowestPurchasingPrice;

    var roiMarkers = config.get('roiMarkers');

    roiPoints = 0;
    roiMarkers.forEach(function (marker, index) {
      if(roi >= roiMarkers[index]) {
        roiPoints = index + 1;
      }
    });

    // determine the points for the rank
    // rank 4 points
    // 4 points = top .5%
    // 3 points = top 1%
    // 2 points = top 3%
    // 1 points = top 5%

    rankPoints = 0;
    var rankMarkers = config.get('rankMarkers');

    if(mwsData.category in categoryCounts.rankings) {
      categoryAmount = categoryCounts.rankings[mwsData.category];

      categoryPercentage = keepaData.rank.average / categoryAmount;

      rankMarkers.forEach(function (marker, index) {
        //console.log(rankMarkers[index] / 100)
        if(categoryPercentage <= rankMarkers[index] / 100 ) {
          rankPoints = index + 1;
        }
      });
    }

    // determine based on points if this one is a good buy
    if(mwsData.category && rankPoints + roiPoints < 7) {
      buyResponse = "false";
    } else if(!mwsData.category) {
      buyResponse = "unknown"
    }

    return callback({
      determination: {
        buy: buyResponse,
        rankPoints: rankPoints,
        roiPoints: roiPoints,
        points: rankPoints + roiPoints
      },
      money: {
        purchase: lowestPurchasingPrice,
        sell: keepaData.new.average,
        profit: profit,
        ROI: roi * 100 + "%"
      },
      ranking: {
        current: mwsData.rank,
        average: keepaData.rank.average,
        categoryPercentage: categoryPercentage * 100 + "%",
        numberInCategory: categoryAmount
      },
      itemDetails: {
        category: mwsData.category,
        dimensions: mwsData.dimensions,
        weight: mwsData.weight
      }
    });
  }
};