function Button({
  children,
  type = "button",
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className={`
        w-full
        rounded-xl
        bg-emerald-600
        px-6
        py-3
        font-semibold
        text-white
        transition
        hover:bg-emerald-700
        disabled:cursor-not-allowed
        disabled:opacity-70
        ${className}
      `}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
