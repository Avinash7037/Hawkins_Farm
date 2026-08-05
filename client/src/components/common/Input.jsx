function Input({ label, type = "text", placeholder, register, name, error }) {
  return (
    <div className="mb-5">
      <label className="block mb-2 font-medium text-gray-700">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="
          w-full
          px-4
          py-3
          border
          rounded-xl
          outline-none
          focus:ring-2
          focus:ring-green-500
          focus:border-green-500
          transition
        "
      />

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default Input;
import React from "react";

function Input({
  label,
  type = "text",
  placeholder,
  register,
  name,
  error,
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        {...(register && name ? register(name) : {})}
        {...props}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition
        ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-300"
            : "border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        }`}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default Input;