import {
  notificationRecipients,
  notifications,
} from "@/database/schemas/notification";

export type Notification = typeof notifications.$inferSelect;
export type NotificationRecipient = typeof notificationRecipients.$inferSelect;
