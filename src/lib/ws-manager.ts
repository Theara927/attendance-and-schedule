import type { WSContext } from "hono/ws";

export type WSMessage = {
  type: string;
  data: unknown;
};

export class WebSocketManager {
  private clients: Map<string, Set<WSContext<WSMessage>>> = new Map();

  addClient(userId: string, ws: WSContext<WSMessage>) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(ws);
  }

  removeClient(userId: string, ws: WSContext<WSMessage>) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(ws);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  sendToUser(userId: string, message: WSMessage) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const data = JSON.stringify(message);
      userClients.forEach((ws) => {
        ws.send(data);
      });
    }
  }

  broadcast(message: WSMessage) {
    const data = JSON.stringify(message);
    this.clients.forEach((userClients) => {
      userClients.forEach((ws) => {
        ws.send(data);
      });
    });
  }
}
