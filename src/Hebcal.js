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
    var dates = [];
    var currentHebrewYear = getCurrentHebrewYear();

    // We want to get the anniversary for the current Hebrew year and the next `numYears - 1`
    for (var i = 0; i < numYears; i++) {
      var hYear = currentHebrewYear + i;
      var url = "https://www.hebcal.com/converter?cfg=json&hy=" + hYear + "&hm=" + encodeURIComponent(hebrewMonth) + "&hd=" + hebrewDay + "&h2g=1";

      try {
        var response = UrlFetchApp.fetch(url);
        var json = JSON.parse(response.getContentText());

        if (json && json.gy && json.gm && json.gd) {
          dates.push(new Date(json.gy, json.gm - 1, json.gd));
        } else {
           console.error("Hebcal API invalid response for", hYear, hebrewMonth, hebrewDay, json);
        }
      } catch (e) {
        console.error("Error fetching Hebcal date", e);
      }
    }

    return dates;
  }

  // Helper to get an approximate current Hebrew year to start from
  function getCurrentHebrewYear() {
    var today = new Date();
    var url = "https://www.hebcal.com/converter?cfg=json&gy=" + today.getFullYear() + "&gm=" + (today.getMonth() + 1) + "&gd=" + today.getDate() + "&g2h=1";
    var response = UrlFetchApp.fetch(url);
    var json = JSON.parse(response.getContentText());
    return json.hy;
  }

  return {
    getGregorianDates: getGregorianDates
  };
})();
