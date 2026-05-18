/**
 * Core synchronization logic.
 */
var Sync = (function() {

  function runSync() {
    var entries = Storage.getEntries();
    var horizon = Storage.getSyncHorizon();
    var result = createResult();
    var horizonValidation = validateHorizon(horizon);

    if (horizonValidation.errors.length > 0) {
      result.errors = result.errors.concat(horizonValidation.errors);
      return result;
    }

    entries.forEach(function(entry) {
      var entryValidation = validateEntry(entry);
      var title = entry.name + "'s " + entry.type;
      result.entriesProcessed++;

      if (entryValidation.errors.length > 0) {
        result.errors = result.errors.concat(entryValidation.errors);
        return;
      }

      var gregorianResult = Hebcal.getGregorianDates(entry.month, entry.day, horizon);
      result.errors = result.errors.concat(gregorianResult.errors.map(function(error) {
        return title + ': ' + error;
      }));

      gregorianResult.dates.forEach(function(gDate) {
        try {
          var eventResult = CalendarService.addAllDayEvent(title, gDate);
          if (eventResult.status === 'created') {
            result.eventsCreated++;
          } else if (eventResult.status === 'skipped') {
            result.eventsSkipped++;
          }
          result.calendarName = eventResult.calendarName || result.calendarName;
        } catch (e) {
          result.errors.push(title + ': calendar sync failed for ' + _formatDate(gDate) + ': ' + _errorMessage(e));
        }
      });
    });

    return result;
  }

  function createResult() {
    return {
      entriesProcessed: 0,
      eventsCreated: 0,
      eventsSkipped: 0,
      calendarName: CalendarService.getCalendarName(),
      errors: []
    };
  }

  function validateEntry(entry) {
    var errors = [];
    var day = parseInt(entry && entry.day, 10);

    if (!entry || !entry.name || !entry.name.toString().trim()) {
      errors.push('Name is required.');
    }

    if (!entry || !entry.type || !entry.type.toString().trim()) {
      errors.push('Type is required.');
    }

    if (!entry || !entry.month || !entry.month.toString().trim()) {
      errors.push('Hebrew month is required.');
    }

    if (isNaN(day) || day < 1 || day > 30) {
      errors.push('Hebrew day must be a number from 1 to 30.');
    }

    if (entry && entry.gregorianDate) {
      var parts = entry.gregorianDate.split('-');
      if (parts.length !== 3 || isNaN(parseInt(parts[0], 10)) || isNaN(parseInt(parts[1], 10)) || isNaN(parseInt(parts[2], 10))) {
        errors.push('Gregorian date must be in YYYY-MM-DD format.');
      }
    }

    return {
      day: day,
      errors: errors
    };
  }

  function validateHorizon(years) {
    var errors = [];
    var parsedYears = parseInt(years, 10);

    if (isNaN(parsedYears) || parsedYears < 1 || parsedYears > 10) {
      errors.push('Sync horizon must be a number from 1 to 10.');
    }

    return {
      years: parsedYears,
      errors: errors
    };
  }

  function _formatDate(dateObj) {
    return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  function _errorMessage(e) {
    return e && e.message ? e.message : String(e);
  }

  return {
    runSync: runSync,
    createResult: createResult,
    validateEntry: validateEntry,
    validateHorizon: validateHorizon
  };
})();
