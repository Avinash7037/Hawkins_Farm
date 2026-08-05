function CategoryFilter({ value, onChange }) {
  const categories = ["", "Vegetables", "Fruits", "Grains", "Dairy", "Spices"];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
    >
      <option value="">All Categories</option>

      {categories
        .filter((category) => category)
        .map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
    </select>
  );
}

export default CategoryFilter;
