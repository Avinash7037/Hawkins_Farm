import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  markNotificationRead,
  markAllNotificationsRead,
} from "../notificationThunks";

function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);

  const { notifications, unreadCount, markingRead } = useSelector(
    (state) => state.notifications,
  );

  // =====================================================
  // Close Dropdown When Clicking Outside
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =====================================================
  // Notification Click
  // =====================================================

  const handleNotificationClick = (notification) => {
    if (!notification?._id) {
      return;
    }

    if (!notification.isRead) {
      dispatch(markNotificationRead(notification._id));
    }

    const orderId = notification.order?._id || notification.order;

    if (orderId) {
      navigate(`/orders/${orderId}`);
    }

    setOpen(false);
  };

  // =====================================================
  // Mark All Read
  // =====================================================

  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      return;
    }

    dispatch(markAllNotificationsRead());
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-full p-2 text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-600 dark:text-gray-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
        aria-label="Notifications"
      >
        <Bell size={23} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount} unread
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                disabled={markingRead}
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-50 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <CheckCheck size={15} />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications */}

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                <Bell
                  size={32}
                  className="mx-auto mb-3 text-gray-300 dark:text-gray-600"
                />
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full border-b border-gray-200 px-4 py-4 text-left transition last:border-b-0 dark:border-gray-800 ${
                    !notification.isRead
                      ? "bg-emerald-50/60 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50"
                      : "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Unread Indicator */}

                    <div className="pt-1">
                      {!notification.isRead ? (
                        <span className="block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      ) : (
                        <span className="block h-2.5 w-2.5" />
                      )}
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {new Date(notification.createdAt).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
