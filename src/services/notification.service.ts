import { NotificationRepository } from "@/repositories/notification.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { WebSocketManager } from "@/lib/ws-manager";
import { HTTPException } from "hono/http-exception";
import type { Notification, NotificationRecipient } from "@/types/notification";

export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly studentRepo: StudentRepository,
    private readonly wsManager: WebSocketManager,
  ) {}

  async createBroadcast(data: {
    title: string;
    message: string;
    facultyId: number;
    targetDepartment?: number;
    targetGeneration?: number;
    priority?: string;
  }): Promise<Notification> {
    let notification: Notification;
    try {
      notification = await this.notificationRepo.create(data);
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to create notification",
      });
    }

    if (!notification) {
      throw new HTTPException(500, {
        message: "Failed to create notification",
      });
    }

    const targetStudents = await this.studentRepo.findByFilter({
      facultyId: data.facultyId,
      departmentId: data.targetDepartment,
      generation: data.targetGeneration,
    });

    if (targetStudents.length > 0) {
      const recipients = targetStudents.map((s) => ({
        notificationId: notification.id,
        studentId: s.id,
      }));

      await this.notificationRepo.createRecipients(recipients);

      targetStudents.forEach((s) => {
        try {
          this.wsManager.sendToUser(s.id, {
            type: "NEW_NOTIFICATION",
            data: notification,
          });
        } catch {}
      });
    }

    return notification;
  }

  async findMyNotifications(
    studentId: string,
  ): Promise<NotificationRecipient[]> {
    return this.notificationRepo.findUnreadByStudent(studentId);
  }

  async markAsRead(recipientId: number): Promise<NotificationRecipient> {
    const updated = await this.notificationRepo.markAsRead(recipientId);
    if (!updated) {
      throw new HTTPException(404, {
        message: "Notification recipient not found",
      });
    }
    return updated;
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepo.findAll();
  }

  async findById(id: number): Promise<Notification> {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) {
      throw new HTTPException(404, { message: "Notification not found" });
    }
    return notification;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.notificationRepo.delete(id);
    if (!deleted) {
      throw new HTTPException(404, { message: "Notification not found" });
    }
  }
}
