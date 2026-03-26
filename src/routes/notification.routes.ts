import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { auth } from "@/lib/auth";
import authentication from "@/middlewares/auth";
import { markAsReadSchema } from "@/validators/notification";

const router = new Hono();

router.get("/", async (c) => {
  const { notificationService } = c.var.container;
  const notifications = await notificationService.findAll();
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
    const notification = await notificationService.createBroadcast(data);
    return c.json(notification, 201);
  },
);

router.get("/my-notifications", authentication, async (c) => {
  const { notificationService } = c.var.container;
  const { id } = c.get("user");
  const notifications = await notificationService.findMyNotifications(id);
  return c.json(notifications);
});

router.patch("/read/:id", authentication, async (c) => {
  const { notificationService } = c.var.container;
  const { id } = c.get("user");
  const { id: recipientId } = c.req.param();
  const result = await notificationService.markAsRead(Number(recipientId), id);
  return c.json(result);
});

router.get(
  "/ws",
  upgradeWebSocket(async (c) => {
    const { wsManager } = c.var.container;
    const session = await auth.api.getSession(c.req.raw);

    if (!session) {
      console.warn(`[WS] ${c.req.path} — Unauthorized`);
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const userId = session.user.id;

    return {
      onOpen(event, ws) {
        wsManager.addClient(userId, ws);
        console.log(`WebSocket opened for user: ${userId}`);
      },
      onMessage(event, ws) {
        console.log(`Message from user ${userId}: ${event.data}`);
      },
      onClose(event, ws) {
        wsManager.removeClient(userId, ws);
        console.log(`WebSocket closed for user: ${userId}`);
      },
    };
  }),
);

export default router;
