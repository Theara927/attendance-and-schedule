import { type DrizzleDb } from "@/database";
import { sessionTimes } from "@/database/schemas";
import type { SessionTime } from "@/types/academy";
import { checkSessionTime } from "@/utils/session-time";
import type {
  SessionTimeInput,
  SessionTimeUpdateInput,
} from "@/validators/academy";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class SessionTimeRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findOne(id: number): Promise<SessionTime | undefined> {
    return this.db.query.sessionTimes.findFirst({
      where: eq(sessionTimes.id, id),
    });
  }

  async findAll(): Promise<SessionTime[]> {
    return this.db.query.sessionTimes.findMany();
  }

  async create(sessionTimeData: SessionTimeInput): Promise<SessionTime> {
    const isSessionTimeValid = checkSessionTime(
      sessionTimeData.shift,
      sessionTimeData.firstSessionStartTime,
      sessionTimeData.firstSessionEndTime,
      sessionTimeData.secondSessionStartTime,
      sessionTimeData.secondSessionEndTime,
    );
    if (!isSessionTimeValid) {
      throw new HTTPException(400, { message: "Invalid session time" });
    }
    const [newSessionTime] = await this.db
      .insert(sessionTimes)
      .values(sessionTimeData)
      .returning();
    return newSessionTime!;
  }

  async update(
    id: number,
    sessionTimeData: SessionTimeUpdateInput,
  ): Promise<SessionTime | undefined> {
    const isSessionTimeValid = checkSessionTime(
      sessionTimeData.shift!,
      sessionTimeData.firstSessionStartTime!,
      sessionTimeData.firstSessionEndTime!,
      sessionTimeData.secondSessionStartTime!,
      sessionTimeData.secondSessionEndTime!,
    );
    if (!isSessionTimeValid) {
      throw new HTTPException(400, { message: "Invalid session time" });
    }
    const [updatedSessionTime] = await this.db
      .update(sessionTimes)
      .set(sessionTimeData)
      .where(eq(sessionTimes.id, id))
      .returning();
    return updatedSessionTime;
  }

  async delete(id: number): Promise<SessionTime> {
    const [deletedSessionTime] = await this.db
      .delete(sessionTimes)
      .where(eq(sessionTimes.id, id))
      .returning();
    return deletedSessionTime!;
  }
}
