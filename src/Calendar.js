/**
 * Logic to handle Google Calendar events.
 */
var CalendarService = (function() {
  var CALENDAR_NAME = "Hebrew Anniversaries";

  function _getCalendar() {
    var calendars = CalendarApp.getCalendarsByName(CALENDAR_NAME);
    if (calendars.length > 0) {
      return calendars[0];
    } else {
      var newCal = CalendarApp.createCalendar(CALENDAR_NAME);
      return newCal;
    }
  }

  function addAllDayEvent(title, dateObj) {
    var cal = _getCalendar();

    // Check if event already exists on this day with the same title
    var events = cal.getEventsForDay(dateObj);
    for (var i = 0; i < events.length; i++) {
      if (events[i].getTitle() === title) {
        // Event exists, no need to create
        return;
      }
    }

    cal.createAllDayEvent(title, dateObj);
  }

  return {
    addAllDayEvent: addAllDayEvent
  };
})();
