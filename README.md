# Hebrew Calendar Events Sync for Google Calendar

This project provides a personal [Google Apps Script](https://developers.google.com/apps-script) web app to synchronize Hebrew calendar events such as Birthdays and Yahrzeits with Google Calendar. It features a simple web UI for adding entries, stores the data in a Google Sheet, and automatically creates all-day events in a dedicated calendar named "Hebrew Calendar Events".

## Overview

The purpose of this app is to keep recurring Hebrew-date observances visible in your regular Google Calendar without manually converting each year. You enter the Hebrew date once, the app uses the [Hebcal API](https://www.hebcal.com/home/developer-apis) to find upcoming Gregorian dates, and it keeps a rolling set of all-day calendar events up to your configured sync horizon.

## Features
- **Web UI:** Add Birthdays and Yahrzeits easily via a simple web interface.
- **Accurate Conversion:** Fetches accurate Gregorian dates from the [Hebcal API](https://www.hebcal.com/home/developer-apis).
- **Dedicated Calendar:** Syncs automatically to a dedicated "Hebrew Calendar Events" Google Calendar.
- **Personalized Access:** Runs as the deploying user by default, meaning events are created in the owner's Google Calendar account.
- **Dynamic Sync Horizon:** Re-syncs dynamically if you change the desired Sync Horizon (number of years ahead to create events for).
- **Error Reporting:** Reports sync errors in the UI instead of showing false success messages.
- **Automated Sync:** Configures automated time-driven triggers to run background syncs.

## Setup Instructions

This project uses [`clasp`](https://github.com/google/clasp) (Command Line Apps Script Projects) to develop locally and push to Google Apps Script.

### Prerequisites
1. Node.js installed.
2. Clasp installed and logged in.
   ```bash
   npm install -g @google/clasp
   clasp login
   ```

### Deployment
1. Create a new Apps Script project:
   ```bash
   clasp create --title "Hebrew Calendar Events" --type webapp --rootDir ./src
   ```
   *(If you already have a project, you can update `.clasp.json` with the existing `scriptId`)*.
2. Push the files to Apps Script:
   ```bash
   clasp push
   ```
3. Open the Apps Script editor:
   ```bash
   clasp open
   ```
4. In the Apps Script editor, run the `setupTriggers` function once to initialize the time-driven trigger. This will ask for authorization scopes.
5. Deploy as a Web App:
   - Click "Deploy" -> "New deployment".
   - Select type "Web app".
   - Execute as "Me".
   - Who has access "Only myself".
   - Deploy and open the Web App URL.

## Configuration and Usage

Once deployed, the app will run and synchronize automatically.

- **Add Entries:** Open the Web App URL to add a Name, Type (Birthday/Yahrzeit), Hebrew Month, and Hebrew Day.
- **Sync Horizon:** Configure the number of future years you want to generate events for via the Web UI (default: 3). Updating this value dynamically resyncs events.
- **Data Storage:** The web app creates and uses a Google Sheet named `Hebrew_Anniversaries_DB` in your Google Drive to store all records. You can manually inspect or edit this sheet if needed.

## Sync Behavior

- Automatically creates an all-day event on your dedicated "Hebrew Calendar Events" calendar.
- Automatically handles duplicates by skipping entries if an event with the exact title already exists for that day.
- A time-driven trigger (configured via `setupTriggers`) automatically runs the synchronization every 14 days in the background to ensure upcoming years are covered.

## Manual Testing and Verification

To verify that the system is operating correctly from the Google Apps Script editor, you can run the built-in smoke tests:

1. Open the Apps Script editor (`clasp open`).
2. Open the `ManualTests.js` file.
3. Select the `runManualTests` function from the run menu.
4. Click **Run**.
5. The execution log will output a structured JSON array indicating if tests passed or failed. This tests core validation, sync result shape, duplicate skipping logic, and calendar renaming logic without affecting your primary settings.

## Architecture

See the `docs/` folder for deeper architectural information.
