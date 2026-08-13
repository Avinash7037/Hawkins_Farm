import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import { registerSchema } from "../schemas/registerSchema";
import { register as registerThunk } from "../authThunks";

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "buyer",
    },
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;

    const result = await dispatch(registerThunk(userData));

    if (registerThunk.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        register={register}
        name="name"
        error={errors.name}
      />

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        register={register}
        name="email"
        error={errors.email}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          register={register}
          name="password"
          error={errors.password}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[44px] text-gray-500 transition hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          register={register}
          name="confirmPassword"
          error={errors.confirmPassword}
        />

        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-[44px] text-gray-500 transition hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Register As
        </label>

        <select
          {...register("role")}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-900/40"
        >
          <option value="buyer">Buyer</option>
          <option value="farmer">Farmer</option>
        </select>

        {errors.role && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">
            {errors.role.message}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      <Button type="submit" loading={loading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
