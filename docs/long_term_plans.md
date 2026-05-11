# Long Term Plans

As this project evolves, several improvements and architectural changes are proposed.

### 1. Data Storage Migration
- **Current State**: Entries are stored in a standalone Google Sheet created dynamically in the user's root Drive folder.
- **Future State**: Move data storage entirely to `PropertiesService` (UserProperties or DocumentProperties depending on the deployment scope) or a dedicated database (Firebase/Firestore) if the app becomes a multi-user SAAS. The Google Sheet approach is currently a temporary crutch for easy debugging but isn't robust for a packaged application.

### 2. Google Workspace Add-on
- **Current State**: Deployed as a standalone Web App accessible via a URL.
- **Future State**: Convert the UI from raw HTML into Google Workspace Card Service components and deploy as a Google Calendar Add-on. This allows users to add anniversaries directly from a sidebar while viewing their calendar, deeply integrating the experience.

### 3. Primary Calendar Integration
- **Current State**: The script creates and writes to a separate, dedicated "Hebrew Calendar Events" calendar. This is safer initially to avoid cluttering the user's main calendar.
- **Future State**: Provide a settings toggle in the UI that allows users to inject these events directly into their Primary calendar, or select an existing calendar of their choosing from a dropdown list.

### 4. Advanced Reminders & Notifications
- **Current State**: Only creates all-day events.
- **Future State**: Allow users to configure reminders (e.g., "Email me 3 days before a Yahrzeit").

### 5. Managing Deletions and Updates
- **Current State**: Events are added dynamically, but there isn't a robust sync mechanism to *delete* future calendar events if an entry is removed or the sync horizon is shortened.
- **Future State**: Implement bi-directional synchronization and event tracking. The script should store the generated Google Calendar Event IDs so it can clean up orphaned events.
