import { ArrowDownUp } from "lucide-react";

function SortDropdown({ value, onChange }) {
  return (
    <div className="relative">
      <ArrowDownUp
        size={18}
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          w-full
          appearance-none
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          py-3
          pl-11
          pr-10
          text-sm
          font-medium
          text-gray-700
          outline-none
          transition

          focus:border-emerald-500
          focus:ring-2
          focus:ring-emerald-200

          dark:border-gray-600
          dark:bg-gray-800
          dark:text-gray-200
          dark:focus:ring-emerald-900
        "
      >
        <option value="newest">Newest First</option>

        <option value="oldest">Oldest First</option>

        <option value="priceLow">Price: Low → High</option>

        <option value="priceHigh">Price: High → Low</option>

        <option value="nameAZ">Name: A → Z</option>

        <option value="nameZA">Name: Z → A</option>
      </select>

      {/* Custom Arrow */}

      <span
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      >
        ▾
      </span>
    </div>
  );
}

export default SortDropdown;
