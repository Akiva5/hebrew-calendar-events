/**
 * Manual smoke tests that can be run from the Apps Script editor.
 * These return structured results instead of throwing at the first failure.
 */
function runManualTests() {
  var results = [];

  results.push(_manualTest('invalid Hebrew day is rejected', function() {
    var result = Sync.validateEntry({
      name: 'Test Person',
      type: 'Birthday',
      month: 'Nisan',
      day: 31
    });
    return result.errors.length === 1 && result.errors[0].indexOf('Hebrew day') !== -1;
  }));

  results.push(_manualTest('invalid sync horizon is rejected', function() {
    var result = Sync.validateHorizon(0);
    return result.errors.length === 1 && result.errors[0].indexOf('Sync horizon') !== -1;
  }));

  results.push(_manualTest('calendar target name is updated', function() {
    return CalendarService.getCalendarName() === 'Hebrew Calendar Events';
  }));

  results.push(_manualTest('sync result has expected shape', function() {
    var result = Sync.createResult();
    return result.entriesProcessed === 0 &&
      result.eventsCreated === 0 &&
      result.eventsSkipped === 0 &&
      result.errors.length === 0;
  }));

  results.push(_manualTest('legacy calendar is renamed when target is missing', function() {
    var names = _manualTestCalendarNames('rename');
    try {
      var legacy = CalendarApp.createCalendar(names.legacy);
      var resolved = CalendarService.getOrCreateCalendar(names.target, names.legacy);
      return resolved.getId() === legacy.getId() &&
        resolved.getName() === names.target &&
        CalendarApp.getCalendarsByName(names.legacy).length === 0;
    } finally {
      _deleteCalendars(names.target);
      _deleteCalendars(names.legacy);
    }
  }));

  results.push(_manualTest('target calendar is used when it already exists', function() {
    var names = _manualTestCalendarNames('target');
    try {
      var target = CalendarApp.createCalendar(names.target);
      CalendarApp.createCalendar(names.legacy);
      var resolved = CalendarService.getOrCreateCalendar(names.target, names.legacy);
      return resolved.getId() === target.getId() &&
        CalendarApp.getCalendarsByName(names.legacy).length === 1;
    } finally {
      _deleteCalendars(names.target);
      _deleteCalendars(names.legacy);
    }
  }));

  results.push(_manualTest('duplicate all-day event is skipped', function() {
    var names = _manualTestCalendarNames('duplicate');
    try {
      var date = new Date(2026, 0, 1);
      var first = CalendarService.addAllDayEvent('Manual Duplicate Test', date, names.target, names.legacy);
      var second = CalendarService.addAllDayEvent('Manual Duplicate Test', date, names.target, names.legacy);
      return first.status === 'created' && second.status === 'skipped';
    } finally {
      _deleteCalendars(names.target);
      _deleteCalendars(names.legacy);
    }
  }));

  console.log(JSON.stringify(results));
  return results;
}

function _manualTest(name, fn) {
  try {
    return {
      name: name,
      passed: fn()
    };
  } catch (e) {
    return {
      name: name,
      passed: false,
      error: e && e.message ? e.message : String(e)
    };
  }
}

function _manualTestCalendarNames(suffix) {
  var stamp = new Date().getTime();
  return {
    target: 'Manual Test Hebrew Calendar Events ' + suffix + ' ' + stamp,
    legacy: 'Manual Test Hebrew Anniversaries ' + suffix + ' ' + stamp
  };
}

function _deleteCalendars(name) {
  var calendars = CalendarApp.getCalendarsByName(name);
  for (var i = 0; i < calendars.length; i++) {
    calendars[i].deleteCalendar();
  }
}
