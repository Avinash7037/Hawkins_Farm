import { io } from "socket.io-client";

// =====================================================
// Socket Server URL
// =====================================================

const SOCKET_URL = "http://localhost:5000";

// =====================================================
// Socket Instance
// =====================================================

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// =====================================================
// Connect Socket
// =====================================================

export const connectSocket = (token, userId) => {
  if (!token || !userId) {
    console.warn("Socket connection skipped: token or userId missing");
    return;
  }

  // ===================================================
  // Socket Authentication
  // ===================================================

  socket.auth = {
    token,
  };

  // ===================================================
  // Connect
  // ===================================================

  if (!socket.connected) {
    socket.connect();
  }
};

// =====================================================
// Disconnect Socket
// =====================================================

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// =====================================================
// Export Socket
// =====================================================

export default socket;
