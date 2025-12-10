# Event System Implementation Plan

## 1. Database Schema Design

### Updated Event Model (`src/models/Event.ts`)
- **Basic Info**: `title`, `description`, `category`, `tags`, `coverImageUrl`, `language`, `timezone`.
- **Scheduling**: 
  - `startDate`, `endDate`.
  - `isRecurring`, `recurrencePattern` (daily, weekly, monthly), `recurrenceEnd`.
- **Access & Pricing**:
  - `accessType` (public, members_only, tier_specific, invite_only).
  - `allowedTiers` (array of strings).
  - `isPaid`, `price`, `currency`.
  - `capacity`, `waitlistEnabled`.
- **Location**:
  - `type` (virtual, in_person, hybrid).
  - `virtualLink`, `virtualPlatform`.
  - `address`, `mapEmbedUrl`.
- **Content**:
  - `recordingUrl`.
  - `resources` (array of { title, url, type }).
- **Status**: `status` (draft, published, cancelled, completed).
- **Host**: `hosts` (array of User refs).

### Registration Model (`src/models/Registration.ts`)
- `event`: Ref to Event.
- `user`: Ref to User.
- `status`: (registered, attended, cancelled, waitlist, refunded).
- `paymentStatus`: (paid, pending, free).
- `checkedInAt`: Date.
- `createdAt`: Date.

## 2. Server Actions (`src/lib/actions/event.actions.ts`)

### Admin Actions
- `createEvent(data)`
- `updateEvent(id, data)`
- `deleteEvent(id)`
- `getAdminEvents(filter)`
- `manageRegistration(registrationId, status)`

### User Actions
- `getUpcomingEvents(filter)`
- `getEventDetails(id)`
- `registerForEvent(eventId)`
- `cancelRegistration(eventId)`
- `getUserRegistrations(userId)`

## 3. Admin Dashboard (`/admin/events`)

### Pages
- **List Page**: Table of events with status, date, and registrant counts.
- **Create/Edit Page**: Comprehensive form with tabs:
  1. **Details**: Title, Desc, Category, Image.
  2. **Schedule**: Dates, Recurrence.
  3. **Access & Pricing**: Tiers, Price, Capacity.
  4. **Location**: Virtual/Physical details.
  5. **Resources**: Uploads/Links.
- **Event Management Page**:
  - View Registrants (Table with check-in toggle).
  - Analytics Summary.

## 4. Member Area (`/members/events` & `/members/calendar`)

### Pages
- **Events Discovery**: Card grid/list of upcoming events with filters (Category, Date).
- **Calendar View**: Monthly/Weekly view.
- **Event Detail Page**:
  - Hero section with Banner & Register button.
  - Details (Time, Host, Location).
  - "Join Live" button (active during event).
  - Resources & Replay section (post-event).
- **My Events**: Dashboard of registered/attended events.

## 5. Components Needed
- `EventCard`: Reusable card for lists.
- `EventForm`: Admin form.
- `RegistrationButton`: Handles logic for register/waitlist/cancel.
- `AttendeesList`: For admin management.
- `VideoPlayer`: For replays.

## 6. Future/Advanced (Not in V1)
- Payment Gateway Integration (Stripe).
- Email Notifications (SendGrid/Resend).
- Zoom API Integration.
