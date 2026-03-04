import { SessionTimeRepository } from "@/repositories/session-time.repository";
import type {
  SessionTimeInput,
  SessionTimeUpdateInput,
} from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class SessionTimeService {
  constructor(private readonly sessionTimeRepo: SessionTimeRepository) {}

  async findAll() {
    return await this.sessionTimeRepo.findAll();
  }

  async findById(id: number) {
    const sessionTime = await this.sessionTimeRepo.findOne(id);
    if (!sessionTime) {
      throw new HTTPException(404, { message: "Session time not found" });
    }
    return sessionTime;
  }

  async create(sessionTimeData: SessionTimeInput) {
    return await this.sessionTimeRepo.create(sessionTimeData);
  }

  async update(id: number, sessionTimeData: SessionTimeUpdateInput) {
    const sessionTime = await this.sessionTimeRepo.update(id, sessionTimeData);
    if (!sessionTime) {
      throw new HTTPException(404, { message: "Session time not found" });
    }
    return sessionTime;
  }

  async delete(id: number) {
    const sessionTime = await this.sessionTimeRepo.delete(id);
    if (!sessionTime) {
      throw new HTTPException(404, { message: "Session time not found" });
    }
    return sessionTime;
  }
}
