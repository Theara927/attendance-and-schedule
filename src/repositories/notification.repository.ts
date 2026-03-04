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

  async create(
    data: CreateNotificationInput,
  ): Promise<Notification | undefined> {
    const [newNotification] = await this.db
      .insert(notifications)
      .values(data)
      .returning();
    return newNotification;
  }

  async createRecipients(data: any[]): Promise<void> {
    await this.db.insert(notificationRecipients).values(data);
  }

  async findAll(): Promise<Notification[]> {
    return await this.db.query.notifications.findMany({
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
    });
  }

  async findById(id: number): Promise<Notification | undefined> {
    return await this.db.query.notifications.findFirst({
      where: eq(notifications.id, id),
    });
  }

  async findUnreadByStudent(
    studentId: number,
  ): Promise<NotificationRecipient[]> {
    return await this.db.query.notificationRecipients.findMany({
      where: and(
        eq(notificationRecipients.studentId, studentId),
        eq(notificationRecipients.isRead, false),
      ),
      with: {
        notification: true,
      },
    });
  }

  async markAsRead(recipientId: number) {
    return await this.db
      .update(notificationRecipients)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notificationRecipients.id, recipientId))
      .returning();
  }

  async delete(id: number) {
    return await this.db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .returning();
  }
}
