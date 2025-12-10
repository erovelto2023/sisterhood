---
description: Implementation plan for the Internal Messaging, Email, and Notification System
---

# Internal Messaging, Email & Notification System Implementation Plan

This workflow outlines the steps to build a robust messaging and notification system for the Sisterhood platform.

## Phase 1: Database Schema Design (Mongoose Models)

1.  **Create `Conversation` Model**
    *   Participants (Array of User IDs)
    *   Last Message (Preview, Timestamp)
    *   Unread Counts (Map of User ID -> Count)
    *   Status (Active, Archived)
    *   Metadata (IsGroup, Context - e.g., CourseID)

2.  **Create `Message` Model**
    *   Conversation ID
    *   Sender ID
    *   Content (Text)
    *   Attachments (Array of URLs/Types)
    *   Read By (Array of User IDs + Timestamps)
    *   Reactions (Map of Emoji -> Array of User IDs)
    *   Parent Message ID (for replies)
    *   Status (Sent, Delivered, Read, SoftDeleted)

3.  **Create `Notification` Model**
    *   Recipient ID
    *   Type (Message, System, Broadcast, Badge, Course, etc.)
    *   Title & Body
    *   Data/Payload (Link, Related ID)
    *   Status (Unread, Read)
    *   Priority (Info, Important, Critical)

4.  **Create `Broadcast` Model**
    *   Sender ID (Admin)
    *   Target Criteria (All, Course Enrolled, Tier, etc.)
    *   Content (Subject, Body)
    *   Channels (In-App, Email, Push)
    *   Status (Draft, Scheduled, Sent)
    *   Stats (Sent Count, Open Count)

5.  **Create `UserPreference` Model (or update User model)**
    *   Notification Settings (Email vs In-App per type)
    *   Privacy Settings (Who can DM)
    *   Blocked Users List

## Phase 2: Core Server Actions (Backend Logic)

1.  **Messaging Actions** (`src/lib/actions/message.actions.ts`)
    *   `sendMessage(recipientId, content, attachments)`
    *   `getConversations(userId)`
    *   `getMessages(conversationId)`
    *   `markMessagesAsRead(conversationId, userId)`

2.  **Notification Actions** (`src/lib/actions/notification.actions.ts`)
    *   `createNotification(recipientId, type, data)`
    *   `getUserNotifications(userId)`
    *   `markNotificationAsRead(notificationId)`
    *   `markAllNotificationsAsRead(userId)`

3.  **Blocking & Privacy Actions** (`src/lib/actions/user.actions.ts`)
    *   `blockUser(blockerId, targetId)`
    *   `unblockUser(blockerId, targetId)`
    *   `canMessage(senderId, recipientId)` check

4.  **Broadcast Actions** (`src/lib/actions/broadcast.actions.ts`)
    *   `createBroadcast(data)`
    *   `sendBroadcast(broadcastId)` (Handles fan-out to Notifications/Email)

## Phase 3: UI Components & Frontend

1.  **Notification System**
    *   `NotificationBell.tsx`: Header component with unread badge.
    *   `NotificationList.tsx`: Dropdown or page to view all.
    *   `NotificationToast.tsx`: Real-time popup (using Sonner or similar).

2.  **Messaging Interface**
    *   `ChatLayout.tsx`: Sidebar (Conversations) + Main Area.
    *   `ConversationList.tsx`: List of active threads.
    *   `ChatWindow.tsx`: Message bubble stream.
    *   `MessageInput.tsx`: Text area + attachment picker + emoji.

3.  **Admin Dashboard Extensions**
    *   `BroadcastManager.tsx`: UI to create and send broadcasts.
    *   `ModerationView.tsx`: View reported messages/users.

## Phase 4: Real-time & Email Integration

1.  **Real-time Updates**
    *   Implement polling hook (simple start) or integrate Pusher/Socket.io if requested.
    *   Auto-refresh inbox and notification counts.

2.  **Email Service**
    *   Integrate an email provider (e.g., Resend, SendGrid).
    *   Create email templates for notifications.
    *   Sync `sendBroadcast` to trigger emails based on user preferences.

## Phase 5: Testing & Refinement

1.  **Unit Testing**: Test server actions for logic errors.
2.  **User Testing**: Verify blocking flows, notification delivery, and real-time feel.
3.  **Optimization**: Indexing DB fields for search performance.
