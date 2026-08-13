import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchChatHistory, markChatAsRead } from "../chatThunks";

import {
  setActiveUser,
  clearActiveUser,
  addMessage,
  incrementUnreadCount,
} from "../chatSlice";

import socket, { connectSocket } from "../../../socket";

function Chat() {
  const { userId } = useParams();

  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // =====================================================
  // Auth State
  // =====================================================

  const { user, token } = useSelector((state) => state.auth);

  // =====================================================
  // Chat State
  // =====================================================

  const { chats, loading, onlineUsers, typingUser } = useSelector(
    (state) => state.chat,
  );

  // =====================================================
  // Connect Socket
  // =====================================================

  useEffect(() => {
    if (token && user?._id) {
      connectSocket(token, user._id);
    }
  }, [token, user?._id]);

  // =====================================================
  // Receive Real-Time Messages
  // =====================================================

  useEffect(() => {
    const handleReceiveMessage = (chat) => {
      if (!chat) {
        return;
      }

      const senderId =
        typeof chat.sender === "object" ? chat.sender?._id : chat.sender;

      const receiverId =
        typeof chat.receiver === "object" ? chat.receiver?._id : chat.receiver;

      // Ignore unrelated messages.

      if (senderId !== user?._id && receiverId !== user?._id) {
        return;
      }

      dispatch(addMessage(chat));

      // =================================================
      // Incoming message from currently open user
      // =================================================

      if (senderId === userId && receiverId === user?._id) {
        dispatch(markChatAsRead(userId));

        return;
      }

      // =================================================
      // Incoming message from another conversation
      // =================================================

      if (senderId !== user?._id && receiverId === user?._id) {
        dispatch(incrementUnreadCount());
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [dispatch, user?._id, userId]);

  // =====================================================
  // Active User / Chat History
  // =====================================================

  useEffect(() => {
    if (!userId) {
      return;
    }

    dispatch(setActiveUser(userId));

    dispatch(fetchChatHistory(userId));

    dispatch(markChatAsRead(userId));

    return () => {
      dispatch(clearActiveUser());
    };
  }, [dispatch, userId]);

  // =====================================================
  // Scroll To Latest Message
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats]);

  // =====================================================
  // Send Message
  // =====================================================

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !userId || sending) {
      return;
    }

    if (!user?._id) {
      console.error("User is not authenticated");
      return;
    }

    if (!socket.connected) {
      if (token && user?._id) {
        connectSocket(token, user._id);
      }

      console.error("Socket is not connected. Please try again.");

      return;
    }

    setSending(true);

    socket.emit("sendMessage", {
      sender: user._id,
      receiver: userId,
      message: trimmedMessage,
    });

    setMessage("");
    setSending(false);
  };

  // =====================================================
  // Enter Key
  // =====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  // =====================================================
  // Typing
  // =====================================================

  const handleTyping = (e) => {
    const value = e.target.value;

    setMessage(value);

    if (!userId || !socket.connected) {
      return;
    }

    socket.emit("typing", userId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socket.connected) {
        socket.emit("stopTyping", userId);
      }
    }, 1000);
  };

  // =====================================================
  // Cleanup Typing Timer
  // =====================================================

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // =====================================================
  // Online Status
  // =====================================================

  const isOnline = onlineUsers.includes(userId);

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="flex h-[calc(100vh-80px)] flex-col bg-white transition-colors duration-300 dark:bg-gray-950">
      {/* =================================================
          Header
      ================================================= */}

      <div className="border-b border-emerald-700 bg-emerald-600 px-6 py-4 text-white dark:bg-emerald-700 dark:border-emerald-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Chat</h1>

            <div className="mt-1 flex items-center gap-2 text-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isOnline ? "bg-green-300" : "bg-gray-300"
                }`}
              />

              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          Messages
      ================================================= */}

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6 transition-colors duration-300 dark:bg-gray-900">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Loading messages...
            </p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No messages yet.
              <br />
              Start the conversation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => {
              const senderId =
                typeof chat.sender === "object"
                  ? chat.sender?._id
                  : chat.sender;

              const isMine = senderId === user?._id;

              return (
                <div
                  key={chat._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      isMine
                        ? "rounded-br-sm bg-emerald-600 text-white"
                        : "rounded-bl-sm bg-white text-gray-800 shadow-sm dark:bg-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {chat.message}
                    </p>

                    <div
                      className={`mt-1 text-xs ${
                        isMine
                          ? "text-emerald-100"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {chat.createdAt
                        ? new Date(chat.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* =================================================
          Typing Indicator
      ================================================= */}

      {typingUser === userId && (
        <div className="border-t border-gray-200 bg-white px-6 py-2 text-sm text-gray-500 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
          User is typing...
        </div>
      )}

      {/* =================================================
          Message Input
      ================================================= */}

      <div className="border-t border-gray-200 bg-white p-4 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex gap-3">
          <textarea
            value={message}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            maxLength={1000}
            className="flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
          />

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>

        <p className="mt-2 text-right text-xs text-gray-400 dark:text-gray-500">
          Press Enter to send
        </p>
      </div>
    </section>
  );
}

export default Chat;
