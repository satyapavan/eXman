# expense-tracker

Idea is to read the SMS in the mobile and auto add the 'spends' to the tracker so that all non-cash based activities are automatically accounted for.

## TODO
- Read through the past SMS to act as a one time data load (well, this has a disadvantage as not all transactions are getting sms but emails yes)
- Need to make sure the transactions are handled only once (eg: payed Rs.300 to HouseJoy through PayTM by recharging it through a Credit Card, all in a single transaction). These should not be counted as 2 transactions, its only one spend.

## Links
- https://developers.google.com/api-client-library/javascript/samples/samples#authorizing-and-making-authorized-requests
- https://developers.google.com/sheets/api/quickstart/js