/**
 * Integration with Hebcal API to fetch Gregorian dates.
 * https://www.hebcal.com/home/developer-apis
 */
var Hebcal = (function() {

  /**
   * Fetch dates for a specific Hebrew date across a range of Gregorian years.
   * Hebcal's yahrzeit API can calculate anniversaries (birthdays and yahrzeits).
   *
   * However, a simple conversion API:
   * GET https://www.hebcal.com/converter?cfg=json&hy=[year]&hm=[month]&hd=[day]&h2g=1
   */

  function getGregorianDates(hebrewMonth, hebrewDay, numYears) {
    var result = {
      dates: [],
      errors: []
    };
    var currentHebrewYear;

    try {
      currentHebrewYear = getCurrentHebrewYear();
    } catch (e) {
      result.errors.push("Unable to determine current Hebrew year: " + _errorMessage(e));
      return result;
    }

    // We want to get the anniversary for the current Hebrew year and the next `numYears - 1`
    for (var i = 0; i < numYears; i++) {
      var hYear = currentHebrewYear + i;
      var url = "https://www.hebcal.com/converter?cfg=json&hy=" + hYear + "&hm=" + encodeURIComponent(hebrewMonth) + "&hd=" + hebrewDay + "&h2g=1";

      try {
        var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
        var responseCode = response.getResponseCode();
        if (responseCode < 200 || responseCode >= 300) {
          result.errors.push("Hebcal returned HTTP " + responseCode + " for " + hebrewDay + " " + hebrewMonth + " " + hYear + ".");
          continue;
        }

        var json = JSON.parse(response.getContentText());

        if (json && json.gy && json.gm && json.gd) {
          result.dates.push(new Date(json.gy, json.gm - 1, json.gd));
        } else {
          result.errors.push("Hebcal did not return a Gregorian date for " + hebrewDay + " " + hebrewMonth + " " + hYear + ".");
        }
      } catch (e) {
        result.errors.push("Error fetching Hebcal date for " + hebrewDay + " " + hebrewMonth + " " + hYear + ": " + _errorMessage(e));
      }
    }

    return result;
  }

  // Helper to get an approximate current Hebrew year to start from
  function getCurrentHebrewYear() {
    var today = new Date();
    var url = "https://www.hebcal.com/converter?cfg=json&gy=" + today.getFullYear() + "&gm=" + (today.getMonth() + 1) + "&gd=" + today.getDate() + "&g2h=1";
    var response = UrlFetchApp.fetch(url);
    var json = JSON.parse(response.getContentText());
    return json.hy;
  }

  function _errorMessage(e) {
    return e && e.message ? e.message : String(e);
  }

  return {
    getGregorianDates: getGregorianDates
  };
})();
