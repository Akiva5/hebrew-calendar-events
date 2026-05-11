/**
 * Logic to handle Google Calendar events.
 */
var CalendarService = (function() {
  var CALENDAR_NAME = "Hebrew Calendar Events";
  var LEGACY_CALENDAR_NAME = "Hebrew Anniversaries";

  function _getCalendar(calendarName, legacyCalendarName) {
    calendarName = calendarName || CALENDAR_NAME;
    legacyCalendarName = legacyCalendarName || LEGACY_CALENDAR_NAME;

    var calendars = CalendarApp.getCalendarsByName(calendarName);
    if (calendars.length > 0) {
      return calendars[0];
    }

    var legacyCalendars = CalendarApp.getCalendarsByName(legacyCalendarName);
    if (legacyCalendars.length > 0) {
      legacyCalendars[0].setName(calendarName);
      return legacyCalendars[0];
    }

    return CalendarApp.createCalendar(calendarName);
  }

  function addAllDayEvent(title, dateObj, calendarName, legacyCalendarName) {
    var cal = _getCalendar(calendarName, legacyCalendarName);

    // Check if event already exists on this day with the same title
    var events = cal.getEventsForDay(dateObj);
    for (var i = 0; i < events.length; i++) {
      if (events[i].getTitle() === title) {
        return {
          status: 'skipped',
          reason: 'duplicate',
          title: title,
          date: dateObj,
          calendarName: cal.getName()
        };
      }
    }

    var event = cal.createAllDayEvent(title, dateObj);
    return {
      status: 'created',
      eventId: event.getId(),
      title: title,
      date: dateObj,
      calendarName: cal.getName()
    };
  }

  function getCalendarName() {
    return CALENDAR_NAME;
  }

  return {
    addAllDayEvent: addAllDayEvent,
    getCalendarName: getCalendarName,
    getOrCreateCalendar: _getCalendar
  };
})();
