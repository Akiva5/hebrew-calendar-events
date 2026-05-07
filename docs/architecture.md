# System Architecture

This Google Apps Script project operates under several modular files:

### Backend Logic
1. **`Code.js`**: The main entry point. Provides `doGet` to serve the HTML Web App UI. Contains wrapper functions callable from the frontend via `google.script.run` and functions for managing automated triggers.
2. **`Storage.js`**: Abstraction over Google Sheets. If a database sheet (`Hebrew_Anniversaries_DB`) doesn't exist, it creates one. It also interacts with `PropertiesService` to store user settings like the Sync Horizon.
3. **`Hebcal.js`**: Integrates with the `hebcal.com/converter` API. It calculates the Hebrew to Gregorian conversion for the current year and future years based on the Sync Horizon.
4. **`Calendar.js`**: Interfaces with the `CalendarApp` service. It attempts to find a calendar named "Hebrew Anniversaries" or creates one, and populates it with all-day events, avoiding duplicates by checking titles.
5. **`Sync.js`**: The orchestration layer. It pulls records from `Storage`, passes them to `Hebcal` for date calculation, and tells `Calendar` to create the events.

### Frontend
1. **`Index.html`**: The UI built with HTML/CSS and plain JavaScript. It communicates asynchronously with the backend using the `google.script.run` API.

### Data Flow
- **Adding an Entry**: User fills UI form -> `google.script.run.addEntry` -> `Storage.js` appends to Google Sheet -> Triggers `Sync.js` automatically.
- **Background Sync**: `setupTriggers` creates a 14-day schedule -> Runs `syncHebrewDates` -> Calls `Sync.runSync()`.
