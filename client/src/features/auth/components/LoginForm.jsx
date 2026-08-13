import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import { loginSchema } from "../schemas/loginSchema";
import { login } from "../authThunks";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // =====================================================
  // Login
  // =====================================================

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));

    if (login.fulfilled.match(result)) {
      const role = result.payload?.user?.role;

      switch (role) {
        case "buyer":
          navigate("/buyer");
          break;

        case "farmer":
          navigate("/farmer/dashboard");
          break;

        case "admin":
          navigate("/admin/dashboard");
          break;

        default:
          navigate("/");
      }
    }
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* =================================================
          Email
      ================================================= */}

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        register={register}
        name="email"
        error={errors.email}
      />

      {/* =================================================
          Password
      ================================================= */}

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          register={register}
          name="password"
          error={errors.password}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-[44px] text-gray-500 transition hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* =================================================
          Forgot Password
      ================================================= */}

      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Forgot Password?
        </Link>
      </div>

      {/* =================================================
          Login Error
      ================================================= */}

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {/* =================================================
          Submit Button
      ================================================= */}

      <Button type="submit" loading={loading}>
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
