# Hebrew Anniversaries Sync for Google Calendar

This project provides a Google Apps Script to synchronize Hebrew anniversaries (like Birthdays and Yahrzeits) with your Google Calendar. It features a simple web UI for adding entries, stores the data in a Google Sheet, and automatically creates calendar events.

## Features
- Add Birthdays and Yahrzeits easily via a Web UI.
- Fetches accurate Gregorian dates from the [Hebcal API](https://www.hebcal.com/home/developer-apis).
- Syncs automatically to a dedicated "Hebrew Anniversaries" Google Calendar.
- Re-syncs dynamically if you change the desired Sync Horizon (number of years ahead).
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
   clasp create --title "Hebrew Anniversaries" --type webapp --rootDir ./src
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
   - Execute as "User accessing the web app".
   - Who has access "Anyone".
   - Deploy and open the Web App URL.

## Architecture and Long Term Plans
See the `docs/` folder for information about the architecture and long-term plans.
