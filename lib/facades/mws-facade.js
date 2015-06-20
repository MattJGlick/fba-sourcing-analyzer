/**
 * Created by glickm on 6/19/15.
 */
var mws = require('mws-js');
var config = require('config');
var categoryConversion = require('../constants/category-conversion');
var _ = require('underscore');

var client = new mws.products.Client(config.get("loginInfo"));

// returns the status of the service
exports.getServiceStatus = function (callback) {
  // Get the service status of Sellers API endpoint and print it
  client.getServiceStatus(function (results) {
    return callback(results);
  });
};

// returns the category and sales rank of a product based on the ASIN
exports.getSalesRank = function (asin, callback) {
  client.getMatchingProductForId('ASIN', asin, function(res){
    if (res.error) {
      console.error(res.error);
    } else if (res.result) {
      if(res.result.Products.Product.SalesRankings.SalesRank) {
        res.result.Products.Product.SalesRankings.SalesRank.forEach(function (category) {
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
          }
        });
      } else {
        return callback({
          category: null,
          rank: null,
          dimensions: [
            res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Height']['#'],
            res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Length']['#'],
            res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Width']['#']
          ],
          weight: res.result.Products.Product.AttributeSets['ns2:ItemAttributes']['ns2:PackageDimensions']['ns2:Weight']['#']});
      }
    }
  });
};

//exports.getCategory = function (asin, callback) {
//  client.getProductCategoriesForASIN(asin, function(res){
//    if (res.error) {
//      console.error(res.error);
//    } else if (res.result) {
//      return callback(res.result);
//    }
//  });
//};

//var listOrders = new mws.orders.requests.ListOrders();
//listOrders.set('MarketplaceId', 'marketplaceId')
//  .set('CreatedAfter', new Date(2,14,2012));
//client.invoke(listOrders, function(result) {
//  console.log(result);
//  // Do something fun with the results...
//});
