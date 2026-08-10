import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllUsers, changeUserStatus } from "../adminThunks";

function AdminUsers() {
  const dispatch = useDispatch();

  const { users, usersLoading, usersError, updatingUser, updateUserError } =
    useSelector((state) => state.admin);

  // =====================================================
  // Fetch Users
  // =====================================================

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // =====================================================
  // Change Status
  // =====================================================

  const handleStatusChange = (user) => {
    const nextStatus = !user.isActive;

    const action = nextStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}'s account?`,
    );

    if (!confirmed) {
      return;
    }

    dispatch(
      changeUserStatus({
        id: user._id,
        isActive: nextStatus,
      }),
    );
  };

  // =====================================================
  // Loading
  // =====================================================

  if (usersLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">Loading users...</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>

        <p className="mt-2 text-gray-600">
          View and manage Hawkins Farm user accounts.
        </p>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {usersError && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
          {usersError}
        </div>
      )}

      {updateUserError && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
          {updateUserError}
        </div>
      )}

      {/* =================================================
          Summary
      ================================================= */}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>

          <p className="mt-2 text-3xl font-bold">{users.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Users</p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {users.filter((user) => user.isActive).length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Inactive Users</p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {users.filter((user) => !user.isActive).length}
          </p>
        </div>
      </div>

      {/* =================================================
          Users Table
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="p-4 text-center text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    {/* Name */}

                    <td className="p-4">
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </td>

                    {/* Email */}

                    <td className="p-4 text-gray-600">{user.email}</td>

                    {/* Role */}

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "farmer"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Action */}

                    <td className="p-4 text-center">
                      {user.role === "admin" ? (
                        <span className="text-sm text-gray-400">Protected</span>
                      ) : (
                        <button
                          type="button"
                          disabled={updatingUser}
                          onClick={() => handleStatusChange(user)}
                          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            user.isActive
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-600 hover:bg-green-700"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminUsers;
