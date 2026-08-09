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
      // Refresh conversation list when a new
      // message arrives.
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
    <section className="mx-auto max-w-5xl px-6 py-8">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>

        <p className="mt-2 text-gray-600">
          View and reply to your conversations.
        </p>
      </div>

      {/* =================================================
          Loading
      ================================================= */}

      {conversationsLoading ? (
        <div className="py-16 text-center text-gray-500">
          Loading conversations...
        </div>
      ) : error ? (
        /* =================================================
            Error
        ================================================= */

        <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>
      ) : conversations.length === 0 ? (
        /* =================================================
            Empty State
        ================================================= */

        <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
          <div className="text-4xl">💬</div>

          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            No conversations yet
          </h2>

          <p className="mt-2 text-gray-500">
            When a buyer sends you a message, it will appear here.
          </p>
        </div>
      ) : (
        /* =================================================
            Conversations
        ================================================= */

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {conversations.map((conversation) => {
            const otherUser = conversation.user;

            return (
              <button
                key={otherUser._id}
                type="button"
                onClick={() => handleOpenChat(otherUser._id)}
                className="flex w-full items-center gap-4 border-b p-5 text-left transition last:border-b-0 hover:bg-gray-50"
              >
                {/* Avatar */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                  {otherUser.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* Conversation */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {otherUser.name || "User"}
                      </h2>

                      <p className="text-xs text-gray-500">
                        {otherUser.role === "buyer" ? "Buyer" : "Farmer"}
                      </p>
                    </div>

                    {/* Date */}

                    <div className="shrink-0 text-xs text-gray-400">
                      {conversation.lastMessageAt
                        ? new Date(
                            conversation.lastMessageAt,
                          ).toLocaleDateString()
                        : ""}
                    </div>
                  </div>

                  {/* Last Message + Unread Count */}

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-gray-500">
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
    </section>
  );
}

export default ChatList;
