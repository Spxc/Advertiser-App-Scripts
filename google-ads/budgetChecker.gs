/** 
Name: budgetCheck
Function: Budget checker for accounts from MCC
(c): Stian Wiik Instebø - 2019
**/

/** GLOBAL VARS **/

var PPC_SPECIALIST = "Stian";

var now = new Date();
var timeZone = AdsApp.currentAccount().getTimeZone();

var startDate = Utilities.formatDate(new Date(), timeZone, 'yyyyMMdd');
var endDate = Utilities.formatDate(new Date(now.setDate(now.getDate()-30)), timeZone, 'yyyyMMdd');

var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1W0Y6Obs98PSX_DRdJBbMfBNghdn48weyH4uXfRm-_vA/edit?usp=sharing';
var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
//var SHEET_NAME = ;
var sheet = ss.getSheetByName(ss.getSheetName());
var sheetUpdated = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');

var rowInsert = 5;
var daysTotal = getDays().totalDays;
var daysLeft = getDays().daysLeft;
var daysWent = daysTotal-daysLeft;

var columnLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', '0', 'P', 'Q', 'R', 'S'];

function main() {
  Logger.log("--- BUDGET CHECKER");
  Logger.log("--- DATE: " + now);
  Logger.log("--- CREATED BY: " + "STIAN W. INSTEBØ");
  Logger.log("PROCESS: Init..");
  
  sheet.getRange(2,5,1,4)//(start row, start column, number of rows, number of columns
     .setValues([[
                sheetUpdated,
       			daysTotal,
       			daysWent,
       			daysLeft
                ]]);

  for (var columnIndex in columnLetters) {
    //Logger.log("Clearing column: " + columnLetters[columnIndex]);
    sheet.getRange(columnLetters[columnIndex] + '5' + ':' + columnLetters[columnIndex] + '50').clearContent();
  }
  Logger.log("PROCESS: Clearing old values..");
  
  //var scriptName = "budgetCheckerCore.txt";
  var scriptSource = runCore("budgetCheckerCore.txt");

  if (scriptSource) {
    //Logger.log("PROCESS:  '%s'",scriptName);
    eval(scriptSource);
    var script = eval('new '+remoteScript+'();');
    script.main();

  }
  Logger.log("PROCESS: Script finished with no errors..");
}

function runCore(scriptName) {
    var fileIter = DriveApp.getFilesByName(scriptName);
    if (fileIter.hasNext()) {
        var file = fileIter.next();
        if (fileIter.hasNext()) {
            Logger.log("Error: Duplicate file with name '%s' detected",scriptName);
        }
        return file.getBlob().getDataAsString();
    }
    else {
        Logger.log("ERROR: No script with name '%s' found",scriptName);
        return;
    }
}

function getDays() {
  var d = new Date(Utilities.formatDate(new Date(), timeZone, "MMM dd,yyyy HH:mm:ss"));
  var totalDays = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

  var daysSoFar = d.getDate() - 1;
  return {daysLeft:(totalDays - daysSoFar),totalDays:totalDays};
}
