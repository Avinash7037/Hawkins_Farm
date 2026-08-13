import { Search, X } from "lucide-react";

function SearchBar({ value, onChange }) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div
      className="
        relative
        w-full
      "
    >
      <Search
        size={21}
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products, categories or locations..."
        maxLength={100}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          py-3.5
          pl-12
          pr-12
          text-sm
          text-gray-900
          outline-none
          transition

          placeholder:text-gray-400

          focus:border-emerald-500
          focus:ring-2
          focus:ring-emerald-200

          dark:border-gray-600
          dark:bg-gray-800
          dark:text-white
          dark:placeholder:text-gray-500
          dark:focus:ring-emerald-900
        "
      />

      {/* Clear Search */}

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="
            absolute
            right-3
            top-1/2
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700

            dark:hover:bg-gray-700
            dark:hover:text-gray-200
          "
          aria-label="Clear search"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
