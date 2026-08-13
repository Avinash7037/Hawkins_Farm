import { useEffect, useState } from "react";
import { KeyRound, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import { forgotPassword } from "../authThunks";

import { clearPasswordResetState } from "../authSlice";

function ForgotPassword() {
  const dispatch = useDispatch();

  const { forgotPasswordLoading, forgotPasswordError, resetUrl } = useSelector(
    (state) => state.auth,
  );

  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(clearPasswordResetState());

    return () => {
      dispatch(clearPasswordResetState());
    };
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    dispatch(forgotPassword(email.trim()));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-950">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          {/* =================================================
              Icon
          ================================================= */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <KeyRound size={30} />
          </div>

          {/* =================================================
              Header
          ================================================= */}

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Forgot Password?
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Enter your registered email address to generate a password reset
              link.
            </p>
          </div>

          {/* =================================================
              Form
          ================================================= */}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="forgot-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            {forgotPasswordError && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {forgotPasswordError}
              </div>
            )}

            <Button type="submit" loading={forgotPasswordLoading}>
              Generate Reset Link
            </Button>
          </form>

          {/* =================================================
              Reset Link
          ================================================= */}

          {resetUrl && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                Reset link generated successfully.
              </p>

              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                This development link is valid for 15 minutes.
              </p>

              <a
                href={resetUrl}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Open Reset Password
                <ExternalLink size={16} />
              </a>

              <p className="mt-3 break-all text-xs text-emerald-700 dark:text-emerald-400">
                {resetUrl}
              </p>
            </div>
          )}

          {/* =================================================
              Back To Login
          ================================================= */}

          <Link
            to="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
