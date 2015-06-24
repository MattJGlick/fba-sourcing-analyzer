/**
 * Created by glickm on 6/19/15.
 */
var keepaFacade = require('../facades/keepa-facade');
var mwsFacade = require('../facades/mws-facade');
var feeCalculator = require('../services/fee-calculator');
var categoryCounts = require('../constants/category-count');
var logger = require('../loggers/logging');

var mws = require('mws-js');
var config = require('config');

exports.evaluate = function evaluate(asin, callback) {
  var sellPrice = 0;

  logger.log("--- EVALUATE ---")
  logger.log("Evaluating ASIN: " + asin);

  keepaFacade.searcher(asin, function (keepaData) {
    if(keepaData.amazon) {
      // figure out if amazon represents the true market value or if they are very overpriced
      if(keepaData.amazon.average - keepaData.new.average < config.get("amazonPriceDifference")) {
        sellPrice = keepaData.amazon.average;
        logger.log("Picked the amazon average as the sales price");
      } else {
        sellPrice = keepaData.new.average;
        logger.log("Picked the keepa average as the sales price");
      }

      mwsFacade.getSalesRank(asin, function (mwsData) {
        feeCalculator.calculateFee(sellPrice, mwsData.category, mwsData.weight, mwsData.dimensions, function (afterFee) {
          logger.log("Net after the fees: " + afterFee);

          evaluateProduct(mwsData, keepaData, afterFee);
        });
      });
    } else {
      return callback(keepaData);
    }

  });

  function evaluateProduct(mwsData, keepaData, afterFee) {
    var lowestPurchasingPrice, roi, profit, categoryAmount, categoryPercentage, roiPoints, rankPoints;
    var buyResponse = "true";

    logger.log("--- EVALUATING ---");

    if((keepaData.amazonCurrent < keepaData.newCurrent && keepaData.amazonCurrent > 0) || keepaData.newCurrent < 0) {
      lowestPurchasingPrice = keepaData.amazonCurrent;
      logger.log("amazon is the lowest purchasing price");
    } else {
      lowestPurchasingPrice = keepaData.newCurrent;
      logger.log("new market is the lowest purchasing price");
    }

    // determine the profit
    profit = (afterFee - lowestPurchasingPrice).toFixed(2);
    logger.log("final profit: " + profit);

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
    roiPoints = 0;
    roi = (profit / lowestPurchasingPrice).toFixed(2);

    var roiMarkers = config.get('roiMarkers');

    roiMarkers.forEach(function (marker, index) {
      if(roi >= roiMarkers[index]) {
        roiPoints = index + 1;
      }
    });

    logger.log("roi: " + roi);

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
        if(categoryPercentage <= rankMarkers[index] / 100 ) {
          rankPoints = index + 1;
        }
      });

      logger.log("category percentage: " + categoryPercentage);
    }

    // determine based on points if this one is a good buy
    if(mwsData.category && rankPoints + roiPoints < config.get('buyPointThreshold')) {
      buyResponse = "false";
    } else if(!mwsData.category) {
      buyResponse = "unknown"
    }

    return callback({
      determination: {
        asin: asin,
        buy: buyResponse,
        rankPoints: rankPoints,
        roiPoints: roiPoints,
        points: rankPoints + roiPoints
      },
      money: {
        purchase: lowestPurchasingPrice,
        sell: sellPrice,
        profit: profit,
        ROI: roi * 100 + "%"
      },
      ranking: {
        current: mwsData.rank,
        average: keepaData.rank.average,
        categoryPercentage: (categoryPercentage * 100).toFixed(2) + "%",
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