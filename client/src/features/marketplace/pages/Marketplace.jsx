import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../productThunks";

import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortDropdown from "../components/SortDropdown";

function Marketplace() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    dispatch(
      fetchProducts({
        search,
        category,
        sort,
      }),
    );
  }, [dispatch, search, category, sort]);

  if (loading) {
    return <div className="py-20 text-center text-lg">Loading products...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Marketplace</h1>

        <p className="mt-3 text-gray-500">
          Browse fresh produce directly from local farmers.
        </p>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <SearchBar value={search} onChange={setSearch} />

        <CategoryFilter value={category} onChange={setCategory} />

        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <ProductGrid products={products} />
    </section>
  );
}

export default Marketplace;
