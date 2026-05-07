/**
 * Entry point for the Web App
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Hebrew Anniversaries Sync')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Expose HTML content for inclusion
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Setup triggers to run the sync every fortnight.
 * Can be run manually or triggered via UI.
 */
function setupTriggers() {
  // Delete existing triggers to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'syncHebrewDates') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create a new trigger to run every 14 days
  ScriptApp.newTrigger('syncHebrewDates')
    .timeBased()
    .everyDays(14)
    .create();
}

/**
 * Get current entries to display in UI
 */
function getEntries() {
  return Storage.getEntries();
}

/**
 * Add a new entry from UI and optionally trigger sync
 */
function addEntry(entry) {
  Storage.addEntry(entry);
  // Also perform a sync since a new entry was added
  syncHebrewDates();
}

/**
 * Main function to sync the Hebrew dates to Google Calendar
 */
function syncHebrewDates() {
  Sync.runSync();
}

/**
 * Updates the sync horizon setting
 */
function updateSyncHorizon(years) {
  Storage.setSyncHorizon(years);
  syncHebrewDates();
}

/**
 * Gets the current sync horizon setting
 */
function getSyncHorizon() {
  return Storage.getSyncHorizon();
}
