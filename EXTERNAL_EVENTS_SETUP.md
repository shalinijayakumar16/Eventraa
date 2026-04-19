# Other College Events Feature - Setup Guide

## Overview

This guide explains how to set up and test the "Other College Events" feature that displays events from other colleges in the student dashboard.

## Files Created

### Backend
- **Model**: `server/models/ExternalEvent.js` - Mongoose schema for external events
- **Controller**: `server/controllers/externalEventController.js` - API logic
- **Routes**: `server/routes/externalEventRoutes.js` - API endpoints
- **Seeding Script**: `scripts/seedExternalEvents.js` - Sample data insertion

### Frontend
- **Components**: 
  - `client/src/components/ExternalEventCard.jsx` - Individual event card
  - `client/src/components/OtherCollegeEvents.jsx` - Section component
- **Updates**:
  - `client/src/pages/StudentDashboard.jsx` - Integrated new section

### Server Updates
- `server/server.js` - Registered new API route

## Setup Steps

### Step 1: Update Server
The `server.js` file has been updated to register the external events route:
```javascript
app.use("/api/external-events", require("./routes/externalEventRoutes"));
```

### Step 2: Seed Initial Data

Run the seeding script to populate sample external events into the database:

```bash
cd c:\Users\shali\OneDrive\Desktop\eventraa
node scripts/seedExternalEvents.js
```

**Expected Output:**
```
📡 Connecting to MongoDB...
✅ MongoDB connected

🧹 Clearing existing external events...
✅ Cleared existing events

📝 Inserting sample events...
✅ Successfully inserted 10 events

📋 Inserted Events:
1. TechFest 2026: AI & Machine Learning Hackathon
   College: Indian Institute of Technology Bombay (IITB)
   Date: 15/5/2026
   Source: TechFest
   ...

✨ Seeding completed successfully!
```

### Step 3: Start the Application

1. **Start Backend Server:**
```bash
cd server
npm start
```

2. **Start Frontend:**
```bash
cd client
npm start
```

3. **Access Dashboard:**
Open the student dashboard at `http://localhost:3000`

## API Endpoints

### GET /api/external-events
Fetch all external events with optional pagination and sorting.

**Query Parameters:**
- `limit` (optional): Number of events to return (default: 100, max: 500)
- `skip` (optional): Number of events to skip for pagination (default: 0)
- `sort` (optional): Sort order 'asc' (upcoming first) or 'desc' (default: 'asc')

**Response:**
```json
{
  "success": true,
  "message": "External events fetched successfully",
  "data": [
    {
      "_id": "...",
      "title": "TechFest 2026: AI & Machine Learning Hackathon",
      "college_name": "Indian Institute of Technology Bombay",
      "date": "2026-05-15T00:00:00.000Z",
      "description": "...",
      "registration_link": "https://techfest.org/hackathon",
      "source": "TechFest",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 100,
    "skip": 0,
    "hasMore": false
  }
}
```

### POST /api/external-events (Admin Only)
Create a new external event.

**Body:**
```json
{
  "title": "Event Title",
  "college_name": "College Name",
  "date": "2026-05-15",
  "description": "Event description",
  "registration_link": "https://registration-url.com",
  "source": "TechFest"
}
```

### PUT /api/external-events/:id (Admin Only)
Update an external event.

### DELETE /api/external-events/:id (Admin Only)
Delete an external event.

## Database Schema

### ExternalEvent

```javascript
{
  title: String (required),
  college_name: String (required),
  date: Date (required),
  description: String,
  registration_link: String (required),
  source: String (default: "Manual"),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Frontend Features

### OtherCollegeEvents Component
- **Location**: `client/src/components/OtherCollegeEvents.jsx`
- **Features**:
  - Fetches events from `/api/external-events`
  - Responsive grid layout (4 columns on desktop, responsive on mobile)
  - Loading skeleton animation
  - Empty state message
  - Event count badge

### ExternalEventCard Component
- **Location**: `client/src/components/ExternalEventCard.jsx`
- **Displays**:
  - Event title
  - College name
  - Event date
  - Event source
  - Event description (limited to 3 lines)
  - "Register" button (opens external link in new tab)
  - Past event badge

## UI/UX Details

### Design System
- **Colors**: Matches existing Eventra color scheme (Indigo, Purple accents)
- **Typography**: Outfit (headings), DM Sans (body)
- **Spacing**: Consistent with EventCard and other components
- **Animations**: Hover effects, loading pulse, smooth transitions

### Responsive Design
- Desktop (1200px+): 4 columns
- Tablet (768px-1199px): 2-3 columns
- Mobile (<768px): 1 column

## Testing Checklist

- [ ] Seeding script runs successfully
- [ ] External events appear in student dashboard
- [ ] "Register" button opens external link in new tab
- [ ] Past events show "Closed" button
- [ ] Grid layout is responsive on different screen sizes
- [ ] Loading state shows skeleton cards
- [ ] Empty state displays proper message
- [ ] Events are sorted by date (upcoming first)
- [ ] Event cards have proper hover effects

## Manual Event Management

### Add Events Manually

In MongoDB shell or Compass, insert documents into the `externalevents` collection:

```javascript
db.externalevents.insertOne({
  title: "Your Event Title",
  college_name: "Your College Name",
  date: new Date("2026-05-15"),
  description: "Event description here",
  registration_link: "https://registration-url.com",
  source: "Your Source"
})
```

### Query Events

```javascript
// Get all events
db.externalevents.find({})

// Get upcoming events (after today)
db.externalevents.find({ date: { $gt: new Date() } })

// Get events from specific college
db.externalevents.find({ college_name: "IIT Bombay" })
```

## Future Enhancements

1. **Admin Panel**: Add UI for admins to manage external events
2. **Auto-Sync**: Integrate with LinkedIn Jobs, HackerRank, Eventbrite APIs
3. **Notifications**: Notify students about new events matching their interests
4. **Event Categories**: Add category/type filtering
5. **Wishlist**: Allow students to save external events
6. **Analytics**: Track which external events students click/register for

## Troubleshooting

### Events not showing in dashboard
1. Check MongoDB connection in `server.js`
2. Verify seeding script ran successfully
3. Check browser console for API errors
4. Ensure `/api/external-events` endpoint is accessible

### Styling issues
1. Verify `icon.jsx` component is available
2. Check if CSS imports are working in components
3. Ensure Outfit and DM Sans fonts are loaded

### Database issues
1. Verify MongoDB is running
2. Check connection string in `.env`
3. Ensure `ExternalEvent` model is properly exported

## Support

For issues or questions, refer to the component documentation in the code files.
