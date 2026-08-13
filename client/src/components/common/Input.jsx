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
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
        className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/40"
              : "border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/40"
          }
          ${className}`}
      />

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default Input;
