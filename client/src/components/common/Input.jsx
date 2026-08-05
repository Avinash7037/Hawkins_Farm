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
