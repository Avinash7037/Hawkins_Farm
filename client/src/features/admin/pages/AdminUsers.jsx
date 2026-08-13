import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Store,
  ShoppingBag,
  RefreshCw,
  UserRound,
} from "lucide-react";

import { fetchAllUsers, changeUserStatus } from "../adminThunks";

function AdminUsers() {
  const dispatch = useDispatch();

  const {
    users = [],
    usersLoading,
    usersError,
    updatingUser,
    updateUserError,
  } = useSelector((state) => state.admin);

  // =====================================================
  // Local State
  // =====================================================

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // Fetch Users
  // =====================================================

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // =====================================================
  // Statistics
  // =====================================================

  const statistics = useMemo(() => {
    return {
      total: users.length,

      active: users.filter((user) => user.isActive).length,

      inactive: users.filter((user) => !user.isActive).length,

      farmers: users.filter((user) => user.role === "farmer").length,

      buyers: users.filter((user) => user.role === "buyer").length,

      admins: users.filter((user) => user.role === "admin").length,
    };
  }, [users]);

  // =====================================================
  // Filter Users
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // =====================================================
  // Change User Status
  // =====================================================

  const handleStatusChange = async (user) => {
    const nextStatus = !user.isActive;

    const action = nextStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}'s account?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        changeUserStatus({
          id: user._id,
          isActive: nextStatus,
        }),
      ).unwrap();
    } catch {
      // Redux stores the error.
    }
  };

  // =====================================================
  // Refresh
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchAllUsers());
  };

  // =====================================================
  // Role Badge
  // =====================================================

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return {
        label: "Admin",
        className: "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300",
        icon: ShieldCheck,
      };
    }

    if (role === "farmer") {
      return {
        label: "Farmer",
        className: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300",
        icon: Store,
      };
    }

    return {
      label: "Buyer",
      className: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300",
      icon: ShoppingBag,
    };
  };

  // =====================================================
  // Loading
  // =====================================================

  if (usersLoading && users.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <div className="h-9 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border bg-white dark:bg-gray-900"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl border bg-white dark:bg-gray-900" />
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="space-y-7">
      {/* =================================================
          Header
      ================================================= */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
              <Users size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                User Management
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage buyers, farmers, and administrator accounts.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={usersLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={17} className={usersLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* =================================================
          Errors
      ================================================= */}

      {usersError && (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm font-medium text-red-700 dark:text-red-300">
          {usersError}
        </div>
      )}

      {updateUserError && (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm font-medium text-red-700 dark:text-red-300">
          {updateUserError}
        </div>
      )}

      {/* =================================================
          Statistics
      ================================================= */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>

              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {statistics.total}
              </p>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                All registered accounts
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <Users size={21} />
            </div>
          </div>
        </div>

        {/* Active */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>

              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {statistics.active}
              </p>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Currently enabled accounts
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
              <UserCheck size={21} />
            </div>
          </div>
        </div>

        {/* Inactive */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Inactive Users
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {statistics.inactive}
              </p>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Deactivated accounts</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300">
              <UserX size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          Role Overview
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Overview</h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Distribution of accounts across the platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                <Store size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Farmers</p>

                <p className="text-xl font-bold text-emerald-900">
                  {statistics.farmers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                <ShoppingBag size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Buyers</p>

                <p className="text-xl font-bold text-blue-900 dark:text-blue-200">
                  {statistics.buyers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 dark:bg-purple-950/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Administrators
                </p>

                <p className="text-xl font-bold text-purple-900 dark:text-purple-200">
                  {statistics.admins}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          Filters
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
          {/* Search */}

          <div className="relative">
            <Search
              size={19}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 py-3 pl-11 pr-4 text-sm text-gray-900 dark:text-white outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          {/* Role */}

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="all">All Roles</option>
            <option value="farmer">Farmers</option>
            <option value="buyer">Buyers</option>
            <option value="admin">Admins</option>
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">{users.length}</span>{" "}
            users
          </p>

          {(search || roleFilter !== "all" || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
              className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          Users Table
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="border-b border-gray-100 dark:border-gray-800 px-5 py-4">
          <h2 className="font-bold text-gray-900 dark:text-white">All Users</h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Activate or deactivate platform accounts.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  User
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Role
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Status
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Joined
                </th>

                <th className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                      <UserRound size={25} />
                    </div>

                    <p className="mt-4 font-semibold text-gray-800 dark:text-gray-200">
                      No users found
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const role = getRoleBadge(user.role);
                  const RoleIcon = role.icon;

                  return (
                    <tr
                      key={user._id}
                      className="border-t border-gray-100 dark:border-gray-800 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* User */}

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 font-bold text-gray-600 dark:text-gray-400">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900 dark:text-white">
                              {user.name}
                            </p>

                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${role.className}`}
                        >
                          <RoleIcon size={13} />

                          {role.label}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            user.isActive
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                              : "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.isActive ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />

                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Joined */}

                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>

                      {/* Action */}

                      <td className="p-4 text-right">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                            <ShieldCheck size={14} />
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={updatingUser}
                            onClick={() => handleStatusChange(user)}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.isActive
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                          >
                            {updatingUser
                              ? "Updating..."
                              : user.isActive
                                ? "Deactivate"
                                : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminUsers;
