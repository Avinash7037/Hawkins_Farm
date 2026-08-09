import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import socket, { connectSocket, disconnectSocket } from "../../socket";

import {
  addMessage,
  setOnlineUsers,
  setTypingUser,
  clearTypingUser,
} from "./chatSlice";

function ChatSocketManager() {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);

  const { activeUser } = useSelector((state) => state.chat);

  // =====================================================
  // Connect Socket
  // =====================================================

  useEffect(() => {
    if (!user?._id || !token) {
      disconnectSocket();
      return;
    }

    connectSocket(token);

    return () => {
      // Do not disconnect here.
      //
      // ChatSocketManager stays mounted while navigating
      // between pages.
    };
  }, [user?._id, token]);

  // =====================================================
  // Socket Event Listeners
  // =====================================================

  useEffect(() => {
    if (!user?._id) {
      return;
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

    socket.on("onlineUsers", handleOnlineUsers);

    socket.on("receiveMessage", handleReceiveMessage);

    socket.on("typing", handleTyping);

    socket.on("stopTyping", handleStopTyping);

    socket.on("messageError", handleMessageError);

    // ===================================================
    // Cleanup Listeners
    // ===================================================

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);

      socket.off("receiveMessage", handleReceiveMessage);

      socket.off("typing", handleTyping);

      socket.off("stopTyping", handleStopTyping);

      socket.off("messageError", handleMessageError);
    };
  }, [dispatch, user?._id, activeUser]);

  return null;
}

export default ChatSocketManager;
