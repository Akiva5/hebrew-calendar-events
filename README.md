# Hebrew Calendar Events Sync for Google Calendar

This project provides a personal Google Apps Script web app to synchronize Hebrew calendar events such as Birthdays and Yahrzeits with Google Calendar. It features a simple web UI for adding entries, stores the data in a Google Sheet, and automatically creates all-day events in a dedicated calendar named "Hebrew Calendar Events".

## Features
- Add Birthdays and Yahrzeits easily via a Web UI.
- Fetches accurate Gregorian dates from the [Hebcal API](https://www.hebcal.com/home/developer-apis).
- Syncs automatically to a dedicated "Hebrew Calendar Events" Google Calendar.
- Runs as the deploying user by default, so events are created in the owner's calendar account.
- Re-syncs dynamically if you change the desired Sync Horizon (number of years ahead).
- Reports sync errors in the UI instead of showing false success messages.
- Configures automated time-driven triggers.

## Setup Instructions

This project uses `clasp` (Command Line Apps Script Projects) to develop locally and push to Google Apps Script.

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

## Architecture and Long Term Plans
See the `docs/` folder for information about the architecture and long-term plans.
