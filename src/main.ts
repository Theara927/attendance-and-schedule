import { serve } from "bun";
import app from "./app";

const server = serve({
  port: 3000,
  fetch: app.fetch,
  websocket: {
    open(ws) {
      console.log("Client connected");
    },
    message(ws, message) {
      console.log("Received message:", message);
    },
    close(ws) {
      console.log("Client disconnected");
    },
  },
});

console.log(`Server running at http://${server.hostname}:${server.port}`);
