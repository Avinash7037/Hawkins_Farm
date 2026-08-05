import React from "react";

function Input({
  label,
  type = "text",
  placeholder = "",
  register,
  name,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        {...(register && name ? register(name) : {})}
        {...props}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition-all duration-200
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          }
          ${className}`}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export default Input;
