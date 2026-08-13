import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, CheckCheck, Package, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../notificationThunks";

function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications, unreadCount, loading, markingRead, error } =
    useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const getNotificationIcon = (type) => {
    if (type === "LOW_STOCK" || type === "STOCK_EMPTY") {
      return <AlertTriangle size={20} />;
    }

    if (type?.startsWith("ORDER_")) {
      return <Package size={20} />;
    }

    return <Bell size={20} />;
  };

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
      return;
    }

    const productId = notification.product?._id || notification.product;

    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0 || markingRead) {
      return;
    }

    dispatch(markAllNotificationsRead());
  };

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-10 transition-colors duration-300 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Bell
              size={32}
              className="mx-auto mb-3 animate-pulse text-emerald-500"
            />

            <p className="text-gray-600 dark:text-gray-400">
              Loading notifications...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-10 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Stay updated with your Hawkins Farm activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              disabled={markingRead}
              onClick={handleMarkAllRead}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={17} />

              {markingRead ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Summary */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Notifications
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {notifications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Unread</p>

            <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {unreadCount}
            </p>
          </div>
        </div>

        {/* Notification List */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {notifications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Bell
                size={48}
                className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
              />

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                No notifications yet
              </h2>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                New order and stock updates will appear here.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full border-b border-gray-200 p-5 text-left transition last:border-b-0 dark:border-gray-800 ${
                    !notification.isRead
                      ? "bg-emerald-50/60 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50"
                      : "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        !notification.isRead
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <h2 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h2>

                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          )}
                        </div>

                        <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                          {notification.createdAt
                            ? new Date(notification.createdAt).toLocaleString(
                                "en-IN",
                              )
                            : ""}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>

                      {notification.type && (
                        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                          {notification.type.replaceAll("_", " ")}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Notifications;
