/***************************************************
* Budget script 
* Version 2.0
* Created By: Vegard R. Garder
*
* Last updated 06.09.2018
* Max 50 accounts per run. 
****************************************************/

//Insert your own spreadsheet URL and the name of your spreadsheet. Make sure SHEET_NAME is correct. 
// Make a copy of: https://docs.google.com/spreadsheets/d/1e0ayTNBbqht-AyduN-ItVGkhc4wKKfM-JgyTf7r1ft4/edit#gid=16
var SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1VOSnIUfYaVRbxxjhnfLk9WEcEFRPoWA9S-yvGJ2mTBU/edit?usp=sharing";
var SHEET_NAME = "Google Ads Budsjett";

//Change account label to your own
var ACCOUNT_LABEL = "PPC NAME";

//Set to true to create a new sheet with account name, cost for the last 7 days, and cost for this month. 
//Set to false to only write cost directly to your spreadsheet. Make sure you have the correct SHEET_NAME. 
var writeAccountsToSheet = false;

//Check to see if there is a mismatch between number of accounts in Google Ads and sheet. 
var checkNumberOfAccounts = false;

//Insert column/row for cost last 7 days starts. Column "A" equals 1, column "B" equals 2 and so on. 
var column = "4";
var row = "5";

//Insert column/row where your account names. Column "A" equals 1, column "B" equals 2 and so on. 
var columnAccountName = "1";
var rowAccountName = "5";

//Insert column/row where we can write today's date to. 
var ColumnTimer = "5";
var rowTimer = "2";


//Insert your email to get notified when script does not run properly 
var email = "";



//do not change anything below this line



function main() {
  try {
    MccApp.accounts().withCondition("LabelNames CONTAINS '" + ACCOUNT_LABEL + "'").withLimit(50).executeInParallel('processAccountJSON', 'writeToSheet');
  
  } catch (e) {
    sendEmail(e);
  }
}

//, 'writeToSheet'
function processAccountJSON(){
    var scriptName = "Budget_script_gas.txt";
    var scriptText = retrieveScript(scriptName);

    if (scriptText) {
        eval(scriptText);
        var script = eval('new '+remoteScript+'();');
        var results = script.processAccountJSON();
        return results;
}
}

function writeToSheet(results) {
    var scriptName = "Budget_script_gas.txt";
    var scriptText = retrieveScript(scriptName);

    if (scriptText) {
        eval(scriptText);
        var script = eval('new '+remoteScript+'();');
        script.writeToSheet(results,SPREADSHEET_URL, SHEET_NAME, writeAccountsToSheet, checkNumberOfAccounts, column, row, columnAccountName,  ColumnTimer,  rowTimer);
        script.GA();
    }
}




function retrieveScript(scriptName) {
    var fileIter = DriveApp.getFilesByName(scriptName);
    if (fileIter.hasNext()) {
        var file = fileIter.next();
        if (fileIter.hasNext()) {
            Logger.log("Error: Duplicate file with name '%s' detected",scriptName);
        }
        return file.getBlob().getDataAsString();
    }
    else {
        Logger.log("No script with name '%s' found",scriptName);
        return;
    }
}

//Unreachable function that simply makes sure the loader script is authorized to do things the loaded script might need to do.
function getAuthorization() {
    var spreadsheet = SpreadsheetApp.openByUrl();
    MailApp.sendEmail();
    UrlFetchApp.fetch();
}






function sendEmail(e) {
  var footerStyle = 'color: #aaaaaa; font-style: italic;';
  var subject = 'Budget script failed to run - ' + e;

  var htmlBody = '<html><body>' +
    '<p>Hi,</p>' +
    '<p>There was a problem with the script: ' +
    e + '</p>' +
    '<p> If you are unsure about how to fix this. Contact Vegard at vegard.garder@synlighet.no</p>' +
    '</body></html>';
  var body = 'Please enable HTML to view this report.';
  var options = {
    htmlBody: htmlBody
  };
  MailApp.sendEmail(email, subject, body, options);
}

