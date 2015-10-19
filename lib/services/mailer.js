/**
 * Created by glickm on 6/24/15.
 */
var config = require('config');
var async = require('async');
var nodemailer = require('nodemailer');

var THREAD_NUMBER = 1;

module.exports = function() {
  return async.queue(function (mailDetails, callback) {
    mail(mailDetails.source, mailDetails.details, mailDetails.test, function (results) {
      callback(results);
    });
  }, THREAD_NUMBER);
};

function mail(source, details, test, callback) {
  var subject;
  var text;

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  if(!test) {
    if (details.money) {
      subject = source + " - ROI: " + details.money.ROI + " Rank: " + details.ranking.categoryPercentage;
      text = "http://www.amazon.com/dp/" + details.determination.asin + "\n" +
      "ROI: " + details.money.ROI + " Category Rank: " + details.ranking.categoryPercentage + "\n" +
      "Buy: " + details.money.purchase + " Sell: " + details.money.sell + "\n" +
      "https://keepa.com/#!product/1-" + details.determination.asin + "\n" +
      "http://camelcamelcamel.com/product/" + details.determination.asin + "\n";
    } else {
      subject = source + " - Bad Category, FIX ME";
      text = "http://www.amazon.com/dp/" + details.determination.asin + "\n" +
      "https://keepa.com/#!product/1-" + details.determination.asin + "\n" +
      "http://camelcamelcamel.com/product/" + details.determination.asin + "\n";
    }
  } else {
    subject = "TEST";
    text = "TEST";
  }

  var mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.RECEIVING_EMAIL,
    subject: subject,
    text: text
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      callback(error);
    }else{
      callback('Message sent: ' + info.response);
    }
  });
}