/**
 * Created by glickm on 6/24/15.
 */
var config = require('config');
var nodemailer = require('nodemailer');

exports.mail = function(details) {
  var subject;
  var text;

  //console.log(config.get('gmailLoginInfo'));
  var transporter = nodemailer.createTransport({
    service: 'Yahoo',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });



  if(details.money) {
    subject = "ROI: " + details.money.ROI + " Rank: " + details.ranking.categoryPercentage;
    text = "http://www.amazon.com/dp/" + details.determination.asin + "\n" +
    "ROI: " + details.money.ROI + " Category Rank: " + details.ranking.categoryPercentage + "\n" +
    "Buy: " + details.money.purchase + " Sell: " + details.money.sell + "\n" +
    "https://keepa.com/#!product/1-" + details.determination.asin + "\n" +
    "http://camelcamelcamel.com/product/" + details.determination.asin + "\n";
  } else {
    subject = "Bad Category, FIX ME";
    text = "http://www.amazon.com/dp/" + details.determination.asin + "\n" +
    "https://keepa.com/#!product/1-" + details.determination.asin + "\n" +
    "http://camelcamelcamel.com/product/" + details.determination.asin + "\n";
  }

  var mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.RECEIVING_EMAIL,
    subject: subject,
    text: text
  };

// send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
    }else{
      console.log('Message sent: ' + info.response);
    }
  });
};