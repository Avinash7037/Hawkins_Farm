import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));

    if (login.fulfilled.match(result)) {
      const role = result.payload.user.role;

      switch (role) {
        case "buyer":
          navigate("/buyer");
          break;

        case "farmer":
          navigate("/farmer");
          break;

        case "admin":
          navigate("/admin");
          break;

        default:
          navigate("/");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          placeholder="Enter your password"
          register={register}
          name="password"
          error={errors.password}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-[44px] text-gray-500 hover:text-emerald-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" loading={loading}>
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
