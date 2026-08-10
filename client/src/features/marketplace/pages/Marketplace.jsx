import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../productThunks";

import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortDropdown from "../components/SortDropdown";

function Marketplace() {
  const dispatch = useDispatch();

  // =====================================================
  // Redux State
  // =====================================================

  const {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    count,
  } = useSelector((state) => state.products);

  // =====================================================
  // Filters
  // =====================================================

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [sort, setSort] = useState("");

  // =====================================================
  // Pagination
  // =====================================================

  const [page, setPage] = useState(1);

  // =====================================================
  // Fetch Products
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchProducts({
        search,
        category,
        sort,
        page,
      }),
    );
  }, [dispatch, search, category, sort, page]);

  // =====================================================
  // Reset Page When Filters Change
  // =====================================================

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  // =====================================================
  // Previous Page
  // =====================================================

  const handlePreviousPage = () => {
    if (page <= 1) {
      return;
    }

    setPage((current) => current - 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // Next Page
  // =====================================================

  const handleNextPage = () => {
    if (page >= totalPages) {
      return;
    }

    setPage((current) => current + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-700">
              Unable to load products
            </h2>

            <p className="mt-2 text-red-600">{error}</p>

            <button
              type="button"
              onClick={() =>
                dispatch(
                  fetchProducts({
                    search,
                    category,
                    sort,
                    page,
                  }),
                )
              }
              className="mt-5 rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Marketplace</h1>

        <p className="mt-3 text-gray-500">
          Browse fresh produce directly from local farmers.
        </p>
      </div>

      {/* =================================================
          Filters
      ================================================= */}

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <SearchBar value={search} onChange={setSearch} />

        <CategoryFilter value={category} onChange={setCategory} />

        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* =================================================
          Results Summary
      ================================================= */}

      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-800">{count}</span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">{totalProducts}</span>{" "}
          products
        </p>

        {totalPages > 1 && (
          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-semibold text-gray-800">
              {currentPage || page}
            </span>{" "}
            of <span className="font-semibold text-gray-800">{totalPages}</span>
          </p>
        )}
      </div>

      {/* =================================================
          Products
      ================================================= */}

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border bg-gray-50 px-6 text-center">
          <div>
            <div className="text-5xl">🥕</div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or category filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("");
                setSort("");
                setPage(1);
              }}
              className="mt-5 rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white transition hover:bg-emerald-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          Pagination
      ================================================= */}

      {products.length > 0 && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={page <= 1 || loading}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700">
            {currentPage || page} / {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={page >= totalPages || loading}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}

export default Marketplace;
