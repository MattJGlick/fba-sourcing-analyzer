/**
 * Created by glickm on 6/19/15.
 */
var mws = require('mws-js');
var config = require('config');
var categoryConversion = require('../constants/category-conversion');
var _ = require('underscore');
var logger = require('../loggers/logging');

var client = new mws.products.Client({
  locale: 'US',
  merchantId: process.env.MERCHANT_ID,
  marketplaceId: process.env.MARKETPLACE_ID,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

// returns the status of the service
exports.getServiceStatus = function (callback) {
  // Get the service status of Sellers API endpoint and print it
  client.getServiceStatus(function (results) {
    return callback(results);
  });
};

exports.ListMatchingProducts = function(asin, callback) {
  client.listMatchingProducts('ASIN', asin, function (results) {
    return callback(results);
  })
}

exports.getMatchingProduct = function(asin, callback) {
  client.getMatchingProduct(asin, function (results) {
    return callback(results);
  })
};

exports.GetLowestOfferListingsForASIN = function(asin, condition, callback) {
  client.getLowestOfferListingsForASIN(asin, condition, function (results) {
    if(results.result['@'].status === "Success") {
      return callback(results.result.Product.LowestOfferListings.LowestOfferListing);
    } else {
      logger.log("Bad ASIN");
      return callback(false);
    }
  })
};

exports.GetCompetitivePricingForASIN = function(asin, callback) {
  client.getCompetitivePricingForASIN(asin, function (results) {
    return callback(results.response.GetCompetitivePricingForASINResponse.GetCompetitivePricingForASINResult);
  })
};

exports.GetLowestPricedOffersForASIN = function(asin, condition, callback) {
  client.getLowestPricedOffersForASIN(asin, condition, function (results) {
    return callback(results);
  })
};

// returns the category and sales rank of a product based on the ASIN
exports.getSalesRank = function (asin, callback) {
  logger.debug("--- MWS FACADE ---");
  logger.debug("Searching AWS for the ASIN: " + asin);

  client.getMatchingProductForId('ASIN', asin, function(res){
    if (res.error) {
      console.error(res.error);
    } else if (res.result['@'].status === "Success") {
      logger.debug("Got a result from AWS Search");

      if(res.result.Products.Product.SalesRankings.SalesRank) {
        if(Array.isArray(res.result.Products.Product.SalesRankings.SalesRank)) {
          var category = res.result.Products.Product.SalesRankings.SalesRank[0];
          // this will only check the first category of all of them. i dont like this. need to figure out a way to check them all.

          logger.debug("Rank Section 1");

          //res.result.Products.Product.SalesRankings.SalesRank.forEach(function (category) {
          if (_.values(categoryConversion.conversions).indexOf(category.ProductCategoryId) > 0) {

            return callback({
              category: _.keys(categoryConversion.conversions)[_.values(categoryConversion.conversions).indexOf(category.ProductCategoryId)],
              rank: category.Rank,
              dimensions: [
                res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Height']['#'],
                res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Length']['#'],
                res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Width']['#']
              ],
              weight: res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Weight']['#']
            });
          } else {
            logger.log("Bad category");
            callback(false);
          //});
          }
        } else {
          logger.debug("Rank Section 2");
          var category = res.result.Products.Product.SalesRankings.SalesRank;

          if (_.values(categoryConversion.conversions).indexOf(category.ProductCategoryId) > 0) {
            return callback({
              category: _.keys(categoryConversion.conversions)[_.values(categoryConversion.conversions).indexOf(category.ProductCategoryId)],
              rank: category.Rank,
              dimensions: [
                res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Height']['#'],
                res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Length']['#'],
                res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Width']['#']
              ],
              weight: res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Weight']['#']
            });
          } else {
            logger.log("Bad category");
            callback(false);
          }
        }
      } else {
        logger.log("Bad category");
        callback(false);
      }
    }
  });
};