function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
    >
      <option value="">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="priceLow">Price: Low → High</option>
      <option value="priceHigh">Price: High → Low</option>
    </select>
  );
}

export default SortDropdown;
