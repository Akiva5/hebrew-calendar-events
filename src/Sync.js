/**
 * Core synchronization logic.
 */
var Sync = (function() {

  function runSync() {
    var entries = Storage.getEntries();
    var horizon = Storage.getSyncHorizon();

    entries.forEach(function(entry) {
      var gregorianDates = Hebcal.getGregorianDates(entry.month, entry.day, horizon);

      gregorianDates.forEach(function(gDate) {
        var title = entry.name + "'s " + entry.type;
        CalendarService.addAllDayEvent(title, gDate);
      });
    });
  }

  return {
    runSync: runSync
  };
})();
