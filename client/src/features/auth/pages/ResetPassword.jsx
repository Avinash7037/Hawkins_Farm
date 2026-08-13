import { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, CheckCircle, XCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/common/Button";

import { resetPassword } from "../authThunks";

import { clearPasswordResetState } from "../authSlice";

function ResetPassword() {
  const { token } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { resetPasswordLoading, resetPasswordError, resetPasswordSuccess } =
    useSelector((state) => state.auth);

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    dispatch(clearPasswordResetState());

    return () => {
      dispatch(clearPasswordResetState());
    };
  }, [dispatch]);

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    setValidationError("");

    if (!token) {
      setValidationError("Invalid password reset link.");

      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");

      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");

      return;
    }

    dispatch(
      resetPassword({
        token,
        password,
      }),
    );
  };

  // =====================================================
  // Success
  // =====================================================

  if (resetPasswordSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-950">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <CheckCircle size={64} className="mx-auto text-emerald-600" />

            <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Password Reset Successful
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Your password has been updated. You can now login with your new
              password.
            </p>

            <Link
              to="/login"
              className="mt-8 block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Go To Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-950">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          {/* =================================================
              Icon
          ================================================= */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <LockKeyhole size={30} />
          </div>

          {/* =================================================
              Header
          ================================================= */}

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reset Password
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Create a new password for your Hawkins Farm account.
            </p>
          </div>

          {/* =================================================
              Form
          ================================================= */}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Password */}

            <div className="relative">
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>

              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter new password"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-[42px] text-gray-500 hover:text-emerald-600 dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}

            <div className="relative">
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-4 top-[42px] text-gray-500 hover:text-emerald-600 dark:text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Error */}

            {(validationError || resetPasswordError) && (
              <div className="flex gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <XCircle size={18} className="shrink-0" />

                <p>{validationError || resetPasswordError}</p>
              </div>
            )}

            {/* Submit */}

            <Button type="submit" loading={resetPasswordLoading}>
              Reset Password
            </Button>
          </form>

          {/* =================================================
              Login
          ================================================= */}

          <Link
            to="/login"
            className="mt-6 block text-center text-sm font-semibold text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
