# ASINEvaluator
Evaluates an Amazon Product based on current selling point compared to previous selling points

## Currently Done

### Keepa:
- Hits Keepa
- returns all of the data.
- calculates the averages, mins, maxes and totals for amazon, new and ranks

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

## Things to Add

### Not Specific

### Keepa:
None

### Amazon MarketPlace:
- determine if an item is media/size for fees
- figure out a way to check to make sure the keepa price isn't $5 cheaper due to shipping.

### Evaluator:
- more size evaluation, use dimensions (HxWxD)
- somehow link into current inventory to determine long tail vs short tail buys?
- Fees
  - check size of small size vs large size in the fees
  - order handling for media, determine if media