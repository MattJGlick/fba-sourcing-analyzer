/**
 * Created by glickm on 6/24/15.
 */
var config = require('config');
var nodemailer = require('nodemailer');

exports.mail = function(source, details) {
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

  var mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.RECEIVING_EMAIL,
    subject: subject,
    text: text,
    html: "<img alt='Embedded Image' height='128' width='128' src='https://dyn.keepa.com/pricehistory.png?asin=B001GZ6QEC&domain=com&width=800&height=250&amazon=1&new=1&used=1&salesrank=1&range=31&cBackground=000000&cFont=cdcdcd&cAmazon=ffba63&cNew=8888dd&cUsed=ffffff' />"

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