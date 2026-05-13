# System Architecture

This personal Google Apps Script project operates under several modular files. It runs as the deploying user and writes all-day events to a dedicated Google Calendar named "Hebrew Calendar Events".

### Backend Logic
1. **`Code.js`**: The main entry point. Provides `doGet` to serve the HTML Web App UI. Contains wrapper functions callable from the frontend via `google.script.run` and functions for managing automated triggers.
2. **`Storage.js`**: Abstraction over Google Sheets. If a database sheet (`Hebrew_Anniversaries_DB`) doesn't exist, it creates one. It also interacts with `PropertiesService` to store user settings like the Sync Horizon.
3. **`Hebcal.js`**: Integrates with the `hebcal.com/converter` API. It calculates the Hebrew to Gregorian conversion for the current year and future years based on the Sync Horizon.
4. **`Calendar.js`**: Interfaces with the `CalendarApp` service. It attempts to find a calendar named "Hebrew Calendar Events", renames the legacy "Hebrew Anniversaries" calendar if needed, or creates a new calendar, then populates it with all-day events while avoiding duplicates by checking titles.
5. **`Sync.js`**: The orchestration layer. It pulls records from `Storage`, validates entries and the sync horizon, passes valid records to `Hebcal` for date calculation, tells `Calendar` to create the events, and returns a structured summary of created, skipped, and failed items.

### Frontend
1. **`Index.html`**: The UI built with HTML/CSS and plain JavaScript. It communicates asynchronously with the backend using the `google.script.run` API.

### Data Flow
- **Adding an Entry**: User fills UI form -> `google.script.run.addEntry` -> input is validated -> `Storage.js` appends to Google Sheet -> `Sync.js` runs automatically -> the UI shows created/skipped counts or sync errors.
- **Background Sync**: `setupTriggers` creates a 14-day schedule -> Runs `syncHebrewDates` -> Calls `Sync.runSync()`.
