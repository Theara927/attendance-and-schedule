import { NotificationRepository } from "@/repositories/notification.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { WebSocketManager } from "@/lib/ws-manager";
import { HTTPException } from "hono/http-exception";

export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly studentRepo: StudentRepository,
    private readonly wsManager: WebSocketManager,
  ) {}

  async createBroadcastNotification(data: {
    title: string;
    message: string;
    facultyId: number;
    targetDepartment?: number;
    targetGeneration?: number;
    priority?: string;
  }) {
    const notification = await this.notificationRepo.create(data);

    // Fetch matching students
    const allStudents = await this.studentRepo.findAll();
    const targetStudents = allStudents.filter((s) => {
      let match = s.facultyId === data.facultyId;
      if (data.targetDepartment)
        match = match && s.departmentId === data.targetDepartment;
      if (data.targetGeneration)
        match = match && s.generation === data.targetGeneration;
      return match;
    });

    // Create recipients
    const recipients = targetStudents.map((s) => ({
      notificationId: notification?.id,
      studentId: s.id,
    }));

    if (recipients.length > 0) {
      await this.notificationRepo.createRecipients(recipients);

      // Notify via WebSocket
      targetStudents.forEach((s) => {
        this.wsManager.sendToUser(s.userId!, {
          type: "NEW_NOTIFICATION",
          data: notification,
        });
      });
    }

    return notification;
  }

  async getMyNotifications(studentId: number) {
    return await this.notificationRepo.findUnreadByStudent(studentId);
  }

  async markAsRead(recipientId: number) {
    const updated = await this.notificationRepo.markAsRead(recipientId);
    if (!updated) {
      throw new HTTPException(404, {
        message: "Notification recipient not found",
      });
    }
    return updated;
  }

  async getAllNotifications() {
    return await this.notificationRepo.findAll();
  }

  async getNotification(id: number) {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) {
      throw new HTTPException(404, { message: "Notification not found" });
    }
    return notification;
  }

  async deleteNotification(id: number) {
    const deleted = await this.notificationRepo.delete(id);
    if (!deleted) {
      throw new HTTPException(404, { message: "Notification not found" });
    }
    return deleted;
  }
}
