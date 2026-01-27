import { io, Socket } from "socket.io-client";
import { API_URL } from "../config/env"; // <-- change to your base URL

let socket: Socket | null = null;

export function connectSocket(userId: string | number) {
  if (socket) return socket;

  socket = io(API_URL.replace("/api", ""), {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    socket?.emit("join", { userId });
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function onSocket(event: string, cb: (payload: any) => void) {
  socket?.on(event, cb);
}

export function offSocket(event: string, cb?: any) {
  socket?.off(event, cb);
}
