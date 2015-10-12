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

  logger.log("--- EVALUATE ---");
  logger.log("Evaluating ASIN: " + asin);

  mwsFacade.GetLowestOfferListingsForASIN(asin, "New", function (listingData) {
    logger.log("Got the Lowest Offer Listings for the ASIN");

    mwsFacade.getSalesRank(asin, function (productData) {
      if(listingData.length > 1) {
        var sellPrice = listingData[1].Price.LandedPrice.Amount;
        var buyPrice = listingData[0].Price.LandedPrice.Amount;

        feeCalculator.calculateFee(sellPrice, productData.category, productData.weight, productData.dimensions, function (afterFee) {
          logger.log("Net after the fees: " + afterFee);
          evaluateProduct(productData, buyPrice, sellPrice, afterFee);
        });
      } else {
        callback({
          determination: {
            buy: false
          }
        })
      }
    });
  });

  function evaluateProduct(productData, buyPrice, sellPrice, afterFee) {
    var roi, profit, categoryAmount, categoryPercentage, roiPoints, rankPoints;
    var buyResponse = "true";

    logger.log("--- EVALUATING ---");

    // determine the profit
    profit = (afterFee - buyPrice).toFixed(2);
    logger.log("final profit: " + profit);

    // determine if the size is too big
    if(productData.weight > config.get('maxWeight') ||
        productData.height > config.get('maxDimension') ||
        productData.width > config.get('maxDimension') ||
        productData.length > config.get('maxDimension')) {
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
    roi = (profit / buyPrice).toFixed(2);

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

    if(productData.category in categoryCounts.rankings) {
      categoryAmount = categoryCounts.rankings[productData.category];

      categoryPercentage = productData.rank / categoryAmount;

      rankMarkers.forEach(function (marker, index) {
        if(categoryPercentage <= rankMarkers[index] / 100 ) {
          rankPoints = index + 1;
        }
      });

      logger.log("category percentage: " + categoryPercentage);
    }

    // determine based on points if this one is a good buy
    if(productData.category && rankPoints + roiPoints < config.get('buyPointThreshold')) {
      buyResponse = "false";
    } else if(!productData.category) {
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
        purchase: buyPrice,
        sell: sellPrice,
        profit: profit,
        ROI: roi * 100 + "%"
      },
      ranking: {
        current: productData.rank,
        categoryPercentage: (categoryPercentage * 100).toFixed(2) + "%",
        numberInCategory: categoryAmount
      },
      itemDetails: {
        category: productData.category,
        dimensions: productData.dimensions,
        weight: productData.weight
      }
    });
  }
};