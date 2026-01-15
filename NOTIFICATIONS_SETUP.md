# Notifications System Setup Guide

## Overview
This guide explains how to set up the notifications system for the hospital management dashboard. The system allows admins to create, edit, delete, and manage notifications displayed in the home dashboard.

## Database Setup

### Step 1: Create the Table in Supabase

1. Log in to your [Supabase Dashboard](https://supabase.com)
2. Navigate to your project
3. Go to the **SQL Editor** section
4. Create a new query
5. Copy and paste the contents of `backend/create_marquee_updates_table.sql`
6. Click **Run** to execute

This will create:
- The `marquee_updates` table with all required columns
- Row Level Security (RLS) policies
- Performance indexes
- User permissions

### Table Structure

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| id | serial | auto-increment | Primary key |
| message | text | - | Notification message |
| is_active | boolean | true | Whether notification is active |
| priority | integer | 0 | Priority level (0-10) |
| created_at | timestamp | now() | Creation timestamp |
| updated_at | timestamp | now() | Last update timestamp |
| created_by | varchar(100) | null | User who created |
| updated_by | varchar(100) | null | User who last updated |

## Frontend Setup

### Step 2: Environment Variables

Add these to your `.env` or `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Get these values from your Supabase project settings:
1. Go to Project Settings → API
2. Copy the URL and the `anon` public key

### Step 3: Files Created

The following files have been created for you:

1. **`src/services/notificationsApi.js`**
   - Service functions for Supabase CRUD operations
   - Functions: `getAllNotifications()`, `createNotification()`, `updateNotification()`, `deleteNotification()`, `toggleNotificationStatus()`

2. **`src/components/NotificationsSection.jsx`**
   - React component for displaying and managing notifications
   - Features: Add, Edit, Delete, Toggle Active Status
   - Includes form validation and error handling

3. **`src/Home.jsx` (Updated)**
   - NotificationsSection component integrated into home dashboard

## Features

### ✅ Add Notification
- Click "Add Notification" button
- Fill in message and priority (0-10)
- Submit to create

### ✅ Edit Notification
- Click the edit icon (pencil) on any notification
- Modify message and priority
- Click "Update" to save

### ✅ Delete Notification
- Click the delete icon (trash) on any notification
- Confirm deletion in the popup

### ✅ Toggle Status
- Click the check/x icon to activate/deactivate notifications
- Active notifications are highlighted in amber/orange
- Inactive notifications appear grayed out

### ✅ Sort by Priority
- Notifications are automatically sorted by priority (highest first)
- Then sorted by creation date (newest first)

## API Functions

### `getAllNotifications()`
Fetches all notifications from the database.

```javascript
const notifications = await getAllNotifications();
```

### `getActiveNotifications()`
Fetches only active notifications.

```javascript
const activeNotifications = await getActiveNotifications();
```

### `createNotification(message, priority, createdBy)`
Creates a new notification.

```javascript
await createNotification('System maintenance at 10 PM', 5, 'admin');
```

### `updateNotification(id, updates)`
Updates an existing notification.

```javascript
await updateNotification(1, {
  message: 'Updated message',
  priority: 3,
  updated_by: 'admin'
});
```

### `deleteNotification(id)`
Deletes a notification.

```javascript
await deleteNotification(1);
```

### `toggleNotificationStatus(id, isActive)`
Toggles the active status of a notification.

```javascript
await toggleNotificationStatus(1, false); // Deactivate
await toggleNotificationStatus(1, true);  // Activate
```

## UI Components

### Notification Item
Each notification displays:
- Message content
- Status badge (Active/Inactive)
- Priority level
- Creation date
- Action buttons (Activate/Deactivate, Edit, Delete)

### Form
When creating or editing:
- Textarea for message input
- Number input for priority (0-10)
- Submit and Cancel buttons
- Form validation

### Status Messages
- ✅ Green success messages for successful operations
- ❌ Red error messages if something goes wrong
- Auto-dismiss after 3 seconds

## Styling

The component uses:
- **Tailwind CSS** for all styling
- **Gradient backgrounds** using orange/amber colors
- **Icons** from `lucide-react` library
- **Responsive design** that works on all screen sizes
- **Smooth animations** and transitions
- **Backdrop blur** for modern glass-morphism effect

## Troubleshooting

### Q: Notifications not loading?
- Check that Supabase environment variables are set correctly
- Verify the table was created in Supabase
- Check browser console for error messages

### Q: Can't add/edit/delete notifications?
- Ensure RLS policies are enabled correctly
- Check that `VITE_SUPABASE_ANON_KEY` is a valid anon key
- Verify the user is authenticated in Supabase

### Q: Styling issues?
- Make sure Tailwind CSS is installed and configured
- Clear browser cache
- Check that lucide-react icons are installed: `npm install lucide-react`

## Next Steps

1. Create the table using the SQL file in Supabase
2. Set environment variables
3. Test adding a notification from the UI
4. Check that it appears in Supabase dashboard
5. Test edit and delete functionality

## Support

For issues or questions:
1. Check the console for error messages
2. Verify Supabase connection
3. Ensure all environment variables are set
4. Check RLS policies are properly configured
