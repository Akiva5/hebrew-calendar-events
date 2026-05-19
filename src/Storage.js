/**
 * Storage module for handling Google Sheets database.
 * Currently uses a Google Sheet created in the user's Drive.
 */
var Storage = (function() {
  var FILE_NAME = "Hebrew_Anniversaries_DB";
  var HORIZON_PROPERTY = "SYNC_HORIZON_YEARS";
  var DEFAULT_HORIZON = 3;
  var HEADERS = ["Name", "Type", "Hebrew Month", "Hebrew Day", "Gregorian Date", "After Sunset"];

  function _getDbFile() {
    var files = DriveApp.searchFiles("title = '" + FILE_NAME + "' and mimeType = '" + MimeType.GOOGLE_SHEETS + "' and trashed = false");
    if (files.hasNext()) {
      var existing = SpreadsheetApp.open(files.next());
      _ensureHeaders(existing.getActiveSheet());
      return existing;
    } else {
      // Create new sheet
      var ss = SpreadsheetApp.create(FILE_NAME);
      var sheet = ss.getActiveSheet();
      sheet.appendRow(HEADERS);
      return ss;
    }
  }

  function _ensureHeaders(sheet) {
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    var headers = headerRange.getValues()[0];
    var needsUpdate = false;

    for (var i = 0; i < HEADERS.length; i++) {
      if (!headers[i]) {
        headers[i] = HEADERS[i];
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      headerRange.setValues([headers]);
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
          day: data[i][3],
          gregorianDate: data[i][4] || '',
          afterSunset: data[i][5] === true || data[i][5] === 'TRUE'
        });
      }
    }
    return entries;
  }

  function addEntry(entry) {
    var ss = _getDbFile();
    var sheet = ss.getActiveSheet();
    sheet.appendRow(_entryRow(entry));
  }

  function updateEntry(id, entry) {
    if (typeof id !== 'number' || !Number.isInteger(id)) {
      throw new Error("Invalid ID.");
    }

    var ss = _getDbFile();
    var sheet = ss.getActiveSheet();
    var lastRow = sheet.getLastRow();

    if (id <= 1 || id > lastRow) {
      throw new Error("Entry not found.");
    }

    sheet.getRange(id, 1, 1, HEADERS.length).setValues([_entryRow(entry)]);
  }

  function _entryRow(entry) {
    return [
      entry.name,
      entry.type,
      entry.month,
      entry.day,
      entry.gregorianDate || '',
      entry.afterSunset === true
    ];
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
