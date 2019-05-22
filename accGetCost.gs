/** 
Name: budgetCheck
Function: Check all accounts + campaign budgets
(c): Stian Wiik Instebø - 2019
**/

/** GLOBAL VARS **/
var now = new Date();
var timeZone = AdsApp.currentAccount().getTimeZone();

var startDate = Utilities.formatDate(new Date(), timeZone, 'yyyyMMdd');
var endDate = Utilities.formatDate(new Date(now.setDate(now.getDate()-30)), timeZone, 'yyyyMMdd');


function main() {
  Logger.log("--- PRECHECK");
  Logger.log("--- CURRENT DATE: " + now);
  Logger.log("--- CREATED BY: " + "STIAN W. INSTEBØ");
  budgetCheck();
}

function budgetCheck() {
  var budgetCheck = MccApp.accounts()
  .get();

  while(budgetCheck.hasNext()) {
    
  	var theAccount = budgetCheck.next();
  	MccApp.select(theAccount);
  	//processAccount(theAccount.getName());
    //Logger.log(theAccount.getStatsFor(startDate, endDate).getCost());
    Logger.log(theAccount.getName() + " | Cost: " + theAccount.getStatsFor(endDate, startDate).getCost() + theAccount.getCurrencyCode() + " | (" + endDate + ") - (" + startDate + ")");
  }
}
