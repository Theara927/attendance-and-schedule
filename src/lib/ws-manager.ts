import type { WSContext } from "hono/ws";

export type WSMessage = {
  type: string;
  data: unknown;
};

export class WebSocketManager {
  private clients: Map<string, Set<WSContext<WSMessage>>> = new Map();

  addClient(userId: string, ws: WSContext<WSMessage>): void {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(ws);
  }

  removeClient(userId: string, ws: WSContext<WSMessage>): void {
    const userClients = this.clients.get(userId);
    if (!userClients) return;
    userClients.delete(ws);
    if (userClients.size === 0) {
      this.clients.delete(userId);
    }
  }

  sendToUser(userId: string, message: WSMessage): void {
    const userClients = this.clients.get(userId);
    if (!userClients) return;
    const data = JSON.stringify(message);
    userClients.forEach((ws) => {
      try {
        ws.send(data);
      } catch {
        // Socket already closed — will be cleaned up on onClose
      }
    });
  }

  // Reserved for future use (e.g. system-wide announcements)
  broadcast(message: WSMessage): void {
    const data = JSON.stringify(message);
    this.clients.forEach((userClients) => {
      userClients.forEach((ws) => {
        try {
          ws.send(data);
        } catch {
          // Socket already closed — will be cleaned up on onClose
        }
      });
    });
  }
}
