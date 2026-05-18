# Hebrew Calendar Events Sync for Google Calendar

[עברית](#עברית)

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

### Use the hosted app

If you just want to add Hebrew calendar events without setting up code, open the hosted web app:

[Open Hebrew Calendar Events Sync](https://script.google.com/macros/s/AKfycbyLAQOJct9c0D2ainZcC0ht4dar-bU1bJsG6-23TrPAySb0_tgfP10wOO4kT2XJwp0/exec)

The app helps you enter Hebrew birthdays and yahrzeits once, then syncs their upcoming Gregorian dates into a dedicated Google Calendar.

### Deploy your own copy

You do not need to fork the GitHub repository to run your own deployment. You can download or clone this project locally, create your own Google Apps Script project, and push the `src/` files to that script with `clasp`.

A personal deployment runs as your Google account and creates personal resources in that account: a Google Sheet named `Hebrew_Anniversaries_DB`, a Google Calendar named "Hebrew Calendar Events", and time-driven sync triggers.

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

## עברית

# סנכרון אירועי לוח שנה עברי עבור Google Calendar

פרויקט זה מספק אפליקציית אינטרנט אישית מבוססת [Google Apps Script](https://developers.google.com/apps-script) לסנכרון אירועים בלוח השנה העברי, כגון ימי הולדת וימי זיכרון, עם Google Calendar. האפליקציה כוללת ממשק משתמש פשוט להוספת רשומות, שומרת את הנתונים ב-Google Sheet, ויוצרת באופן אוטומטי אירועים של יום שלם ביומן ייעודי בשם "Hebrew Calendar Events" (או "אירועי לוח שנה עברי").

## סקירה כללית

מטרת האפליקציה היא לשמור על תאריכים עבריים חוזרים גלויים ב-Google Calendar הרגיל שלכם, מבלי להמיר אותם ידנית בכל שנה. אתם מזינים את התאריך העברי פעם אחת, והאפליקציה משתמשת ב-[Hebcal API](https://www.hebcal.com/home/developer-apis) כדי למצוא את התאריכים הלועזיים הקרובים, ושומרת על אירועים מתגלגלים ביומן עד לטווח הסנכרון שהוגדר.

## תכונות מפתח
- **ממשק אינטרנט:** הוספת ימי הולדת וימי זיכרון בקלות דרך ממשק דפדפן פשוט.
- **המרה מדויקת:** שולף תאריכים לועזיים מדויקים דרך [Hebcal API](https://www.hebcal.com/home/developer-apis).
- **יומן ייעודי:** מסתנכרן אוטומטית ליומן Google ייעודי.
- **גישה אישית:** רץ תחת המשתמש שלכם (Deploying User) כברירת מחדל, כלומר האירועים נוצרים בתוך חשבון ה-Google הפרטי שלכם.
- **טווח סנכרון דינמי:** מסנכרן מחדש באופן אוטומטי במקרה של שינוי טווח הסנכרון (מספר השנים קדימה ליצירת אירועים).
- **דיווח שגיאות:** מציג שגיאות סנכרון בממשק המשתמש.
- **סנכרון אוטומטי:** תמיכה בטריגרים מבוססי זמן שמריצים סנכרון רקע אוטומטי.

## הנחיות התקנה

הפרויקט משתמש ב-[`clasp`](https://github.com/google/clasp) (Command Line Apps Script Projects) לפיתוח מקומי והעלאת קוד ל-Google Apps Script.

### שימוש באפליקציה המאוחסנת

אם ברצונכם רק להוסיף אירועים מבלי להגדיר קוד, ניתן לפתוח את האפליקציה המוכנה:

[פתח את Hebrew Calendar Events Sync](https://script.google.com/macros/s/AKfycbyLAQOJct9c0D2ainZcC0ht4dar-bU1bJsG6-23TrPAySb0_tgfP10wOO4kT2XJwp0/exec)

### פריסה אישית (Deployment)

אינכם חייבים לבצע fork למאגר ב-GitHub כדי להריץ עותק משלכם. ניתן להוריד או לשכפל (clone) את הפרויקט למחשב המקומי שלכם, ליצור פרויקט Google Apps Script חדש, ולדחוף (push) את קבצי ה-`src/` לאותו סקריפט באמצעות `clasp`.

1. התקינו Node.js.
2. התקינו את Clasp והתחברו אליו:
   ```bash
   npm install -g @google/clasp
   clasp login
   ```
3. צרו פרויקט Apps Script חדש:
   ```bash
   clasp create --title "Hebrew Calendar Events" --type webapp --rootDir ./src
   ```
4. דחפו את הקבצים:
   ```bash
   clasp push
   ```
5. פתחו את העורך:
   ```bash
   clasp open
   ```
6. בעורך, הריצו פעם אחת את הפונקציה `setupTriggers` כדי להפעיל סנכרון רקע שוטף.
7. פרסו בתור Web App:
   - לחצו על Deploy -> New deployment.
   - סוג: Web app.
   - Execute as: Me.
   - Who has access: Only myself.

## הגדרות ושימוש
לאחר הפריסה, האפליקציה תרוץ ותסתנכרן אוטומטית. ניתן לפתוח את כתובת האפליקציה (Web App URL) כדי להוסיף רשומות, לעדכן את טווח הסנכרון, ולראות את התוצאות. הרשומות שלכם נשמרות בקובץ Google Sheet תחת השם `Hebrew_Anniversaries_DB` ב-Google Drive שלכם.
