import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const router = new Hono();

router.get("/", async (c) => {
  const { notificationService } = c.var.container;
  const notifications = await notificationService.getAllNotifications();
  return c.json(notifications);
});

router.post(
  "/broadcast",
  zValidator(
    "json",
    z.object({
      title: z.string(),
      message: z.string(),
      facultyId: z.number(),
      targetDepartment: z.number().optional(),
      targetGeneration: z.number().optional(),
      priority: z.enum(["low", "normal", "high"]).optional(),
    }),
  ),
  async (c) => {
    const { notificationService } = c.var.container;
    const data = c.req.valid("json");
    const notification =
      await notificationService.createBroadcastNotification(data);
    return c.json(notification);
  },
);

router.get("/my", async (c) => {
  const { notificationService } = c.var.container;
  // In a real app, we'd get studentId from auth user
  const studentId = parseInt(c.req.query("studentId") || "0");
  const notifications = await notificationService.getMyNotifications(studentId);
  return c.json(notifications);
});

router.patch("/read/:id", async (c) => {
  const { notificationService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const result = await notificationService.markAsRead(id);
  return c.json(result);
});

// WebSocket Upgrade Endpoint
router.get(
  "/ws",
  upgradeWebSocket((c) => {
    const { wsManager } = c.var.container;
    const userId = c.req.query("userId"); // Should be from auth in production

    return {
      onOpen(event, ws) {
        if (userId) {
          wsManager.addClient(userId, ws);
          console.log(`WebSocket opened for user: ${userId}`);
        }
      },
      onMessage(event, ws) {
        console.log(`Message from user ${userId}: ${event.data}`);
      },
      onClose(event, ws) {
        if (userId) {
          wsManager.removeClient(userId, ws);
          console.log(`WebSocket closed for user: ${userId}`);
        }
      },
    };
  }),
);

export default router;
