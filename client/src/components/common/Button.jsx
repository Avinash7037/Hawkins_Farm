function Button({
  text,
  type = "button",
  onClick,
  loading = false,
  className = "",
  fullWidth = true,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`
        ${fullWidth ? "w-full" : ""}
        bg-green-600
        hover:bg-green-700
        text-white
        font-semibold
        py-3
        px-6
        rounded-xl
        transition-all
        duration-300
        disabled:opacity-70
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? "Please wait..." : text}
    </button>
  );
}

export default Button;
