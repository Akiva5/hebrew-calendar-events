/**
 * Storage module for handling Google Sheets database.
 * Currently uses a Google Sheet created in the user's Drive.
 */
var Storage = (function() {
  var FILE_NAME = "Hebrew_Anniversaries_DB";
  var HORIZON_PROPERTY = "SYNC_HORIZON_YEARS";
  var DEFAULT_HORIZON = 3;

  function _getDbFile() {
    var files = DriveApp.searchFiles("title = '" + FILE_NAME + "' and mimeType = '" + MimeType.GOOGLE_SHEETS + "' and trashed = false");
    if (files.hasNext()) {
      return SpreadsheetApp.open(files.next());
    } else {
      // Create new sheet
      var ss = SpreadsheetApp.create(FILE_NAME);
      var sheet = ss.getActiveSheet();
      sheet.appendRow(["Name", "Type", "Hebrew Month", "Hebrew Day"]);
      return ss;
    }
  }

  function getEntries() {
    var ss = _getDbFile();
    var sheet = ss.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var entries = [];

    // Skip header row
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) { // Check if name is present
        entries.push({
          id: i + 1, // 1-indexed row number
          name: data[i][0],
          type: data[i][1], // 'Birthday' or 'Yahrzeit'
          month: data[i][2],
          day: data[i][3]
        });
      }
    }
    return entries;
  }

  function addEntry(entry) {
    var ss = _getDbFile();
    var sheet = ss.getActiveSheet();
    sheet.appendRow([entry.name, entry.type, entry.month, entry.day]);
  }

  function updateEntry(id, entry) {
    var ss = _getDbFile();
    var sheet = ss.getActiveSheet();
    var lastRow = sheet.getLastRow();

    if (id <= 1 || id > lastRow) {
      throw new Error("Entry not found.");
    }

    var range = sheet.getRange(id, 1, 1, 4);
    range.setValues([[entry.name, entry.type, entry.month, entry.day]]);
  }

  function getSyncHorizon() {
    var props = PropertiesService.getUserProperties();
    var val = props.getProperty(HORIZON_PROPERTY);
    return val ? parseInt(val, 10) : DEFAULT_HORIZON;
  }

  function setSyncHorizon(years) {
    var props = PropertiesService.getUserProperties();
    props.setProperty(HORIZON_PROPERTY, years.toString());
  }

  return {
    getEntries: getEntries,
    addEntry: addEntry,
    updateEntry: updateEntry,
    getSyncHorizon: getSyncHorizon,
    setSyncHorizon: setSyncHorizon
  };
})();
