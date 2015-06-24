# fba-sourcing-analyzer
Evaluates an Amazon Product based on current selling point compared to previous selling points

## Currently Done

### Everything...
- Add verbose statements for debugging purposes across EVERYTHING
- pull down the main deals for the day on
  - ccc
- send an email when one of the monitors catches something
  - https://www.npmjs.com/package/nodemailer

### Keepa:
- Hits Keepa
- returns all of the data.
- calculates the averages, mins, maxes and totals for amazon, new and ranks

### Twitter
- Hit KeepaNotifierTwitter for other peoples updates

### Amazon MarketPlace:
- hits marketplace
- checks service status
- gets current sales ranking, category, and dimensions

### Evaluator:
- calculates the ROI based off the fees
- calculates the rank percentage
- evaluates the rank on a scale of 0-4 based on the the config
- evaluates the roi on a scale of 0-6 based on the the config
- checks for size overloads
- checks for point totals to determine if should be bought

- Fees
  - calculates the fees
  - referral fees are different per category



## Things to Add

### Not Specific
- check feeds on dealbloodhound/godfatherdeals and have those monitored as well.
- add a delay so I dont get throttled by keepa/aws
- pull only one category, need to decide which one ot pull. probably will pull only the first one
- pull down the main deals for the day on
  - keepa
  - tracktor
- find a way to get large quantities of ASINs
  - https://github.com/leijianbin/Amazon_Best_Seller
  - https://github.com/xat/node-asin-queue

### Keepa:
None

### Amazon MarketPlace:
- determine if an item is media/size for fees
- figure out a way to check to make sure the keepa price isn't $5 cheaper due to shipping.
  - this might be handled by adding a check to see if az price and new price are within ~7? dollars of each other. if they are then maybe just use the az price. otherwise use the new price

### Evaluator:
- somehow link into current inventory to determine long tail vs short tail buys?
- Fees - http://www.amazon.com/gp/help/customer/display.html?nodeId=201119390
  - check size of small size vs large size in the fees
  - order handling for media, determine if media

