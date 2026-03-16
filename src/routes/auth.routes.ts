import { db } from "@/database";
import { students, teachers } from "@/database/schemas";
import { auth } from "@/lib/auth";
import { registerSchema } from "@/validators/auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const router = new Hono();

router.post(
  "/register/student",
  zValidator("json", registerSchema),
  async (c) => {
    const { name, email, password } = c.req.valid("json");
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: "student",
      },
    });
    await db.insert(students).values({
      id: result.user?.id,
      name,
      email,
    });
    return c.json({
      message: "Student registered successfully",
      result,
    });
  },
);

router.post(
  "/register/teacher",
  zValidator("json", registerSchema),
  async (c) => {
    const { name, email, password } = c.req.valid("json");
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: "teacher",
      },
    });
    await db.insert(teachers).values({
      id: result.user?.id,
      name,
      email,
    });
    return c.json({
      message: "Teacher registered successfully",
      result,
    });
  },
);

export default router;
