import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchMyConversations } from "../chatThunks";

import socket, { connectSocket } from "../../../socket";

function ChatList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =====================================================
  // Auth
  // =====================================================

  const { user, token } = useSelector((state) => state.auth);

  // =====================================================
  // Chat State
  // =====================================================

  const { conversations, conversationsLoading, error } = useSelector(
    (state) => state.chat,
  );

  // =====================================================
  // Connect Socket
  // =====================================================

  useEffect(() => {
    if (!token || !user?._id) {
      return;
    }

    connectSocket(token, user._id);

    return () => {
      socket.off("receiveMessage");
    };
  }, [token, user?._id]);

  // =====================================================
  // Fetch Conversations
  // =====================================================

  useEffect(() => {
    dispatch(fetchMyConversations());
  }, [dispatch]);

  // =====================================================
  // Real-Time New Message
  // =====================================================

  useEffect(() => {
    const handleReceiveMessage = () => {
      dispatch(fetchMyConversations());
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [dispatch]);

  // =====================================================
  // Open Chat
  // =====================================================

  const handleOpenChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="min-h-[calc(100vh-80px)] bg-gray-50 px-6 py-8 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl">
        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and reply to your conversations.
          </p>
        </div>

        {/* =================================================
            Loading
        ================================================= */}

        {conversationsLoading ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            Loading conversations...
          </div>
        ) : error ? (
          /* =================================================
              Error
          ================================================= */

          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        ) : conversations.length === 0 ? (
          /* =================================================
              Empty State
          ================================================= */

          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
            <div className="text-4xl">💬</div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              No conversations yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              When a buyer sends you a message, it will appear here.
            </p>
          </div>
        ) : (
          /* =================================================
              Conversations
          ================================================= */

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
            {conversations.map((conversation) => {
              const otherUser = conversation.user;

              return (
                <button
                  key={otherUser._id}
                  type="button"
                  onClick={() => handleOpenChat(otherUser._id)}
                  className="flex w-full items-center gap-4 border-b border-gray-200 p-5 text-left transition last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/70"
                >
                  {/* Avatar */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    {otherUser.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  {/* Conversation */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {otherUser.name || "User"}
                        </h2>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {otherUser.role === "buyer" ? "Buyer" : "Farmer"}
                        </p>
                      </div>

                      {/* Date */}

                      <div className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                        {conversation.lastMessageAt
                          ? new Date(
                              conversation.lastMessageAt,
                            ).toLocaleDateString()
                          : ""}
                      </div>
                    </div>

                    {/* Last Message + Unread Count */}

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {conversation.lastMessage || "No messages"}
                      </p>

                      {conversation.unreadCount > 0 && (
                        <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 px-2 text-xs font-bold text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ChatList;
