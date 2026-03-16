import { type DrizzleDb } from "@/database";
import {
  notifications,
  notificationRecipients,
} from "@/database/schemas/notification";
import { eq, and } from "drizzle-orm";
import {
  type Notification,
  type NotificationRecipient,
} from "@/types/notification";
import type { CreateNotificationInput } from "@/validators/notification";

export class NotificationRepository {
  constructor(private readonly db: DrizzleDb) {}

  async create(data: CreateNotificationInput): Promise<Notification> {
    const [notification] = await this.db
      .insert(notifications)
      .values(data)
      .returning();
    if (!notification) {
      throw new Error("Insert did not return a record");
    }
    return notification;
  }

  async createRecipients(
    data: { notificationId: number; studentId: string }[],
  ): Promise<void> {
    await this.db.insert(notificationRecipients).values(data);
  }

  async findAll(): Promise<Notification[]> {
    return this.db.query.notifications.findMany({
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
    });
  }

  async findById(id: number): Promise<Notification | undefined> {
    return this.db.query.notifications.findFirst({
      where: eq(notifications.id, id),
    });
  }

  async findUnreadByStudent(
    studentId: string,
  ): Promise<NotificationRecipient[]> {
    return this.db.query.notificationRecipients.findMany({
      where: and(
        eq(notificationRecipients.studentId, studentId),
        eq(notificationRecipients.isRead, false),
      ),
      with: {
        notification: true,
      },
    });
  }

  async markAsRead(
    recipientId: number,
  ): Promise<NotificationRecipient | undefined> {
    const [updated] = await this.db
      .update(notificationRecipients)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notificationRecipients.id, recipientId))
      .returning();
    return updated;
  }

  async delete(id: number): Promise<Notification | undefined> {
    const [deleted] = await this.db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .returning();
    return deleted;
  }
}
