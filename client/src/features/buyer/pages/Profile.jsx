import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Phone,
  Sprout,
} from "lucide-react";

import {
  fetchProfile,
  updateProfile,
  changePassword,
} from "../../auth/authThunks";

import AddressManager from "../../address/components/AddressManager";

function Profile() {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.auth);

  // =====================================================
  // Profile State
  // =====================================================

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [farmName, setFarmName] = useState("");
  const [farmDescription, setFarmDescription] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // =====================================================
  // Password State
  // =====================================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // =====================================================
  // Password Visibility
  // =====================================================

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =====================================================
  // Fetch Profile
  // =====================================================

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // =====================================================
  // Populate Profile Data
  // =====================================================

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setFarmName(user.farmName || "");
      setFarmDescription(user.farmDescription || "");
    }
  }, [user]);

  // =====================================================
  // Update Profile
  // =====================================================

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedFarmName = farmName.trim();
    const trimmedFarmDescription = farmDescription.trim();

    // -------------------------------------------------
    // Validate Name
    // -------------------------------------------------

    if (!trimmedName) {
      setProfileError("Name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setProfileError("Name must contain at least 2 characters.");
      return;
    }

    // -------------------------------------------------
    // Validate Phone
    // -------------------------------------------------

    if (trimmedPhone) {
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(trimmedPhone)) {
        setProfileError("Phone number must contain exactly 10 digits.");
        return;
      }
    }

    // -------------------------------------------------
    // Validate Farmer Fields
    // -------------------------------------------------

    if (user.role === "farmer") {
      if (trimmedFarmName && trimmedFarmName.length < 2) {
        setProfileError("Farm name must contain at least 2 characters.");
        return;
      }

      if (trimmedFarmDescription.length > 500) {
        setProfileError("Farm description cannot exceed 500 characters.");
        return;
      }
    }

    // -------------------------------------------------
    // Submit
    // -------------------------------------------------

    try {
      const result = await dispatch(
        updateProfile({
          name: trimmedName,
          phone: trimmedPhone,
          farmName: user.role === "farmer" ? trimmedFarmName : undefined,
          farmDescription:
            user.role === "farmer" ? trimmedFarmDescription : undefined,
        }),
      ).unwrap();

      setProfileMessage(result?.message || "Profile updated successfully.");
    } catch (errorMessage) {
      setProfileError(errorMessage || "Failed to update profile.");
    }
  };

  // =====================================================
  // Change Password
  // =====================================================

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    // -------------------------------------------------
    // Validate Current Password
    // -------------------------------------------------

    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    // -------------------------------------------------
    // Validate New Password
    // -------------------------------------------------

    if (!newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    // -------------------------------------------------
    // Confirm Password
    // -------------------------------------------------

    if (!confirmPassword) {
      setPasswordError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    // -------------------------------------------------
    // Prevent Same Password
    // -------------------------------------------------

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password.",
      );
      return;
    }

    // -------------------------------------------------
    // Submit
    // -------------------------------------------------

    try {
      const result = await dispatch(
        changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      ).unwrap();

      setPasswordMessage(result?.message || "Password changed successfully.");

      // -------------------------------------------------
      // Clear Password Fields
      // -------------------------------------------------

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (errorMessage) {
      setPasswordError(errorMessage || "Failed to change password.");
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading && !user) {
    return (
      <section
        className="
          mx-auto max-w-5xl
          px-6 py-12
          text-gray-900
          dark:text-gray-100
        "
      >
        <div
          className="
            rounded-2xl
            border border-gray-200
            bg-white
            p-10
            text-center
            shadow-sm

            dark:border-gray-700
            dark:bg-gray-900
          "
        >
          <p className="text-gray-600 dark:text-gray-300">
            Loading your profile...
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // No User
  // =====================================================

  if (!user) {
    return (
      <section
        className="
          mx-auto max-w-5xl
          px-6 py-12
          text-gray-900
          dark:text-gray-100
        "
      >
        <div
          className="
            rounded-2xl
            border border-gray-200
            bg-white
            p-10
            text-center
            shadow-sm

            dark:border-gray-700
            dark:bg-gray-900
          "
        >
          <p className="text-gray-600 dark:text-gray-300">
            Unable to load your profile.
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section
      className="
        min-h-screen
        bg-white
        px-6 py-12
        text-gray-900

        dark:bg-gray-950
        dark:text-gray-100
      "
    >
      <div className="mx-auto max-w-5xl">
        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-8">
          <h1
            className="
              text-4xl font-bold
              text-gray-900

              dark:text-white
            "
          >
            {user.role === "farmer" ? "Farmer Profile" : "My Profile"}
          </h1>

          <p
            className="
              mt-2
              text-gray-600

              dark:text-gray-300
            "
          >
            {user.role === "farmer"
              ? "Manage your farmer account and farm information."
              : "Manage your Hawkins Farm account."}
          </p>
        </div>

        {/* =================================================
            Global Auth Error
        ================================================= */}

        {error && (
          <div
            className="
              mb-6 rounded-xl
              border border-red-200
              bg-red-50
              p-4
              text-sm text-red-700

              dark:border-red-900
              dark:bg-red-950/40
              dark:text-red-300
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            Personal Information
        ================================================= */}

        <div
          className="
            rounded-2xl
            border border-gray-200
            bg-white
            p-7
            shadow-sm

            dark:border-gray-700
            dark:bg-gray-900
          "
        >
          {/* Section Header */}

          <div className="mb-7 flex items-center gap-4">
            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-emerald-100

                dark:bg-emerald-900/60
              "
            >
              <User
                size={24}
                className="
                  text-emerald-600
                  dark:text-emerald-400
                "
              />
            </div>

            <div>
              <h2
                className="
                  text-2xl font-bold
                  text-gray-900

                  dark:text-gray-100
                "
              >
                Personal Information
              </h2>

              <p
                className="
                  text-gray-600

                  dark:text-gray-400
                "
              >
                Your personal account details.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            {/* =================================================
                Name
            ================================================= */}

            <div>
              <label
                htmlFor="name"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700

                  dark:text-gray-300
                "
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="
                  w-full rounded-xl
                  border border-gray-300
                  bg-white
                  px-4 py-4
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/20

                  dark:border-gray-600
                  dark:bg-gray-800
                  dark:text-gray-100
                  dark:placeholder:text-gray-500
                "
                placeholder="Enter your name"
              />
            </div>

            {/* =================================================
                Email
            ================================================= */}

            <div className="mt-5">
              <label
                htmlFor="email"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700

                  dark:text-gray-300
                "
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-gray-400

                    dark:text-gray-500
                  "
                />

                <input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="
                    w-full rounded-xl
                    border border-gray-300
                    bg-gray-100
                    px-12 py-4
                    text-gray-500

                    dark:border-gray-600
                    dark:bg-gray-800
                    dark:text-gray-400
                  "
                />
              </div>

              <p
                className="
                  mt-2 text-xs
                  text-gray-500

                  dark:text-gray-400
                "
              >
                Email cannot be changed from your profile.
              </p>
            </div>

            {/* =================================================
                Phone
            ================================================= */}

            <div className="mt-5">
              <label
                htmlFor="phone"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700

                  dark:text-gray-300
                "
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={20}
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-gray-400

                    dark:text-gray-500
                  "
                />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  maxLength={10}
                  className="
                    w-full rounded-xl
                    border border-gray-300
                    bg-white
                    px-12 py-4
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/20

                    dark:border-gray-600
                    dark:bg-gray-800
                    dark:text-gray-100
                    dark:placeholder:text-gray-500
                  "
                  placeholder="Enter 10-digit phone number"
                />
              </div>
            </div>

            {/* =================================================
                Account Type
            ================================================= */}

            <div className="mt-5">
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700

                  dark:text-gray-300
                "
              >
                Account Type
              </label>

              <div
                className="
                  flex items-center gap-3
                  rounded-xl
                  border border-gray-300
                  bg-gray-50
                  px-4 py-4
                  text-gray-700

                  dark:border-gray-600
                  dark:bg-gray-800
                  dark:text-gray-300
                "
              >
                <Shield
                  size={20}
                  className="
                    text-gray-400
                    dark:text-gray-500
                  "
                />

                <span className="capitalize">{user.role || "Buyer"}</span>
              </div>
            </div>

            {/* =================================================
                Account Status
            ================================================= */}

            <div className="mt-5">
              <p
                className="
                  mb-2
                  text-sm font-medium
                  text-gray-700

                  dark:text-gray-300
                "
              >
                Account Status
              </p>

              <span
                className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${
                  user.isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* =================================================
                Farmer Information
            ================================================= */}

            {user.role === "farmer" && (
              <div
                className="
                  mt-8
                  border-t border-gray-200
                  pt-8

                  dark:border-gray-700
                "
              >
                {/* Section Header */}

                <div className="mb-6 flex items-center gap-4">
                  <div
                    className="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-full
                      bg-emerald-100

                      dark:bg-emerald-900/60
                    "
                  >
                    <Sprout
                      size={24}
                      className="
                        text-emerald-600
                        dark:text-emerald-400
                      "
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        text-2xl font-bold
                        text-gray-900

                        dark:text-gray-100
                      "
                    >
                      Farm Information
                    </h2>

                    <p
                      className="
                        text-gray-600

                        dark:text-gray-400
                      "
                    >
                      Tell buyers more about your farm.
                    </p>
                  </div>
                </div>

                {/* Farm Name */}

                <div>
                  <label
                    htmlFor="farmName"
                    className="
                      mb-2 block
                      text-sm font-medium
                      text-gray-700

                      dark:text-gray-300
                    "
                  >
                    Farm Name
                  </label>

                  <input
                    id="farmName"
                    type="text"
                    value={farmName}
                    onChange={(event) => setFarmName(event.target.value)}
                    className="
                      w-full rounded-xl
                      border border-gray-300
                      bg-white
                      px-4 py-4
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-emerald-500
                      focus:ring-2
                      focus:ring-emerald-500/20

                      dark:border-gray-600
                      dark:bg-gray-800
                      dark:text-gray-100
                      dark:placeholder:text-gray-500
                    "
                    placeholder="Enter your farm name"
                    maxLength={100}
                  />
                </div>

                {/* Farm Description */}

                <div className="mt-5">
                  <label
                    htmlFor="farmDescription"
                    className="
                      mb-2 block
                      text-sm font-medium
                      text-gray-700

                      dark:text-gray-300
                    "
                  >
                    Farm Description
                  </label>

                  <textarea
                    id="farmDescription"
                    value={farmDescription}
                    onChange={(event) => setFarmDescription(event.target.value)}
                    rows={5}
                    maxLength={500}
                    className="
                      w-full resize-none rounded-xl
                      border border-gray-300
                      bg-white
                      px-4 py-4
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-emerald-500
                      focus:ring-2
                      focus:ring-emerald-500/20

                      dark:border-gray-600
                      dark:bg-gray-800
                      dark:text-gray-100
                      dark:placeholder:text-gray-500
                    "
                    placeholder="Tell buyers about your farm, farming practices, crops, or anything else you would like them to know..."
                  />

                  <p
                    className="
                      mt-2 text-xs
                      text-gray-500

                      dark:text-gray-400
                    "
                  >
                    {farmDescription.length}/500 characters
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                Profile Error
            ================================================= */}

            {profileError && (
              <div
                className="
                  mt-5 rounded-xl
                  border border-red-200
                  bg-red-50
                  p-4
                  text-sm text-red-700

                  dark:border-red-900
                  dark:bg-red-950/40
                  dark:text-red-300
                "
              >
                {profileError}
              </div>
            )}

            {/* =================================================
                Profile Success
            ================================================= */}

            {profileMessage && (
              <div
                className="
                  mt-5 flex items-center gap-2
                  rounded-xl
                  border border-emerald-200
                  bg-emerald-50
                  p-4
                  text-sm text-emerald-700

                  dark:border-emerald-800
                  dark:bg-emerald-950/40
                  dark:text-emerald-300
                "
              >
                <CheckCircle size={18} />

                {profileMessage}
              </div>
            )}

            {/* =================================================
                Save
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-6 rounded-xl
                bg-emerald-600
                px-6 py-3
                font-semibold
                text-white
                transition
                hover:bg-emerald-700
                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:hover:bg-emerald-500
              "
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* =================================================
            Addresses
        ================================================= */}

        <div className="mt-8">
          <AddressManager />
        </div>

        {/* =================================================
            Change Password
        ================================================= */}

        <div
          className="
            mt-8 rounded-2xl
            border border-gray-200
            bg-white
            p-7
            shadow-sm

            dark:border-gray-700
            dark:bg-gray-900
          "
        >
          {/* Section Header */}

          <div className="mb-7 flex items-center gap-4">
            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-emerald-100

                dark:bg-emerald-900/60
              "
            >
              <Lock
                size={24}
                className="
                  text-emerald-600
                  dark:text-emerald-400
                "
              />
            </div>

            <div>
              <h2
                className="
                  text-2xl font-bold
                  text-gray-900

                  dark:text-gray-100
                "
              >
                Change Password
              </h2>

              <p
                className="
                  text-gray-600

                  dark:text-gray-400
                "
              >
                Keep your Hawkins Farm account secure.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            {/* =================================================
                Current Password
            ================================================= */}

            <div>
              <label
                htmlFor="currentPassword"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700

                  dark:text-gray-300
                "
              >
                Current Password
              </label>

              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="
                    w-full rounded-xl
                    border border-gray-300
                    bg-white
                    px-4 py-4 pr-12
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/20

                    dark:border-gray-600
                    dark:bg-gray-800
                    dark:text-gray-100
                    dark:placeholder:text-gray-500
                  "
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((value) => !value)}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    text-gray-400
                    transition
                    hover:text-gray-700

                    dark:text-gray-500
                    dark:hover:text-gray-300
                  "
                  aria-label={
                    showCurrentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                New Password
            ================================================= */}

            <div className="mt-5">
              <label
                htmlFor="newPassword"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700

                  dark:text-gray-300
                "
              >
                New Password
              </label>

              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="
                    w-full rounded-xl
                    border border-gray-300
                    bg-white
                    px-4 py-4 pr-12
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/20

                    dark:border-gray-600
                    dark:bg-gray-800
                    dark:text-gray-100
                    dark:placeholder:text-gray-500
                  "
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    text-gray-400
                    transition
                    hover:text-gray-700

                    dark:text-gray-500
                    dark:hover:text-gray-300
                  "
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p
                className="
                  mt-2 text-xs
                  text-gray-500

                  dark:text-gray-400
                "
              >
                Password must contain at least 6 characters.
              </p>
            </div>

            {/* =================================================
                Confirm Password
            ================================================= */}

            <div className="mt-5">
              <label
                htmlFor="confirmPassword"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700

                  dark:text-gray-300
                "
              >
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="
                    w-full rounded-xl
                    border border-gray-300
                    bg-white
                    px-4 py-4 pr-12
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/20

                    dark:border-gray-600
                    dark:bg-gray-800
                    dark:text-gray-100
                    dark:placeholder:text-gray-500
                  "
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    text-gray-400
                    transition
                    hover:text-gray-700

                    dark:text-gray-500
                    dark:hover:text-gray-300
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                Password Error
            ================================================= */}

            {passwordError && (
              <div
                className="
                  mt-5 rounded-xl
                  border border-red-200
                  bg-red-50
                  p-4
                  text-sm text-red-700

                  dark:border-red-900
                  dark:bg-red-950/40
                  dark:text-red-300
                "
              >
                {passwordError}
              </div>
            )}

            {/* =================================================
                Password Success
            ================================================= */}

            {passwordMessage && (
              <div
                className="
                  mt-5 flex items-center gap-2
                  rounded-xl
                  border border-emerald-200
                  bg-emerald-50
                  p-4
                  text-sm text-emerald-700

                  dark:border-emerald-800
                  dark:bg-emerald-950/40
                  dark:text-emerald-300
                "
              >
                <CheckCircle size={18} />

                {passwordMessage}
              </div>
            )}

            {/* =================================================
                Change Password Button
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-6 rounded-xl
                bg-emerald-600
                px-6 py-3
                font-semibold
                text-white
                transition
                hover:bg-emerald-700
                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:hover:bg-emerald-500
              "
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Profile;
