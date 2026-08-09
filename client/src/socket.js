import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// =====================================================
// Connect Socket
// =====================================================

export const connectSocket = (token, userId) => {
  if (!token || !userId) {
    return;
  }

  // Store token for socket authentication if needed later
  socket.auth = {
    token,
  };

  // Connect only if not already connected
  if (!socket.connected) {
    socket.connect();
  }

  // Join user room / register online user
  socket.emit("join", userId);
};

// =====================================================
// Disconnect Socket
// =====================================================

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
