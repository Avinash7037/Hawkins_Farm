import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import socket, { connectSocket, disconnectSocket } from "../../socket";

import {
  addMessage,
  setOnlineUsers,
  setTypingUser,
  clearTypingUser,
} from "./chatSlice";

import { addNotification } from "../notifications/notificationSlice";

import {
  fetchNotifications,
  fetchUnreadNotificationCount,
} from "../notifications/notificationThunks";

function ChatSocketManager() {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);

  // =====================================================
  // Connect Socket
  // =====================================================

  useEffect(() => {
    if (!user?._id || !token) {
      disconnectSocket();

      return;
    }

    connectSocket(token, user._id);

    // ===================================================
    // Load Existing Notifications
    // ===================================================

    dispatch(fetchNotifications());

    dispatch(fetchUnreadNotificationCount());

    // ===================================================
    // Do Not Disconnect During Navigation
    // ===================================================

    return undefined;
  }, [user?._id, token, dispatch]);

  // =====================================================
  // Socket Event Listeners
  // =====================================================

  useEffect(() => {
    if (!user?._id) {
      return undefined;
    }

    // ===================================================
    // Online Users
    // ===================================================

    const handleOnlineUsers = (users) => {
      dispatch(setOnlineUsers(users));
    };

    // ===================================================
    // Receive Message
    // ===================================================

    const handleReceiveMessage = (message) => {
      dispatch(addMessage(message));
    };

    // ===================================================
    // Typing
    // ===================================================

    const handleTyping = (data) => {
      if (data?.senderId) {
        dispatch(setTypingUser(data.senderId));
      }
    };

    // ===================================================
    // Stop Typing
    // ===================================================

    const handleStopTyping = (data) => {
      if (data?.senderId) {
        dispatch(clearTypingUser());
      }
    };

    // ===================================================
    // Message Error
    // ===================================================

    const handleMessageError = (error) => {
      console.error("Chat message error:", error?.message || error);
    };

    // ===================================================
    // Notification
    // ===================================================

    const handleNotification = (notification) => {
      console.log("🔔 New notification:", notification);

      dispatch(addNotification(notification));
    };

    // ===================================================
    // Register Listeners
    // ===================================================

    socket.on("onlineUsers", handleOnlineUsers);

    socket.on("receiveMessage", handleReceiveMessage);

    socket.on("typing", handleTyping);

    socket.on("stopTyping", handleStopTyping);

    socket.on("messageError", handleMessageError);

    socket.on("notification", handleNotification);

    // ===================================================
    // Cleanup
    // ===================================================

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);

      socket.off("receiveMessage", handleReceiveMessage);

      socket.off("typing", handleTyping);

      socket.off("stopTyping", handleStopTyping);

      socket.off("messageError", handleMessageError);

      socket.off("notification", handleNotification);
    };
  }, [dispatch, user?._id]);

  return null;
}

export default ChatSocketManager;
