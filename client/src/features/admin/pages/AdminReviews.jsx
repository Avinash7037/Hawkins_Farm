import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Star,
  MessageSquare,
  Trash2,
  User,
  Package,
  Filter,
  AlertCircle,
} from "lucide-react";

import { fetchAllAdminReviews, deleteAdminReview } from "../adminThunks";

function AdminReviews() {
  const dispatch = useDispatch();

  const {
    reviews = [],
    reviewsLoading,
    reviewsError,
    deletingReview,
    deleteReviewError,
  } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");

  // =====================================================
  // Fetch Reviews
  // =====================================================

  useEffect(() => {
    dispatch(fetchAllAdminReviews());
  }, [dispatch]);

  // =====================================================
  // Statistics
  // =====================================================

  const statistics = useMemo(() => {
    const total = reviews.length;

    const totalRating = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    const averageRating = total === 0 ? 0 : totalRating / total;

    const fiveStar = reviews.filter(
      (review) => Number(review.rating) === 5,
    ).length;

    const fourStar = reviews.filter(
      (review) => Number(review.rating) === 4,
    ).length;

    const threeStar = reviews.filter(
      (review) => Number(review.rating) === 3,
    ).length;

    const twoStar = reviews.filter(
      (review) => Number(review.rating) === 2,
    ).length;

    const oneStar = reviews.filter(
      (review) => Number(review.rating) === 1,
    ).length;

    return {
      total,
      averageRating,
      fiveStar,
      fourStar,
      threeStar,
      twoStar,
      oneStar,
    };
  }, [reviews]);

  // =====================================================
  // Filter Reviews
  // =====================================================

  const filteredReviews = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const buyerName = review.buyer?.name?.toLowerCase() || "";

      const buyerEmail = review.buyer?.email?.toLowerCase() || "";

      const productName = review.product?.name?.toLowerCase() || "";

      const comment = review.comment?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        buyerName.includes(searchValue) ||
        buyerEmail.includes(searchValue) ||
        productName.includes(searchValue) ||
        comment.includes(searchValue);

      const matchesRating =
        ratingFilter === "All" ||
        Number(review.rating) === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviews, search, ratingFilter]);

  // =====================================================
  // Delete Review
  // =====================================================

  const handleDelete = async (review) => {
    const buyerName = review.buyer?.name || "this buyer";

    const productName = review.product?.name || "this product";

    const confirmed = window.confirm(
      `Are you sure you want to delete the review by ${buyerName} for "${productName}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteAdminReview(review._id)).unwrap();
    } catch {
      // Redux stores the error
    }
  };

  // =====================================================
  // Rating Stars
  // =====================================================

  const renderStars = (rating) => {
    const numericRating = Number(rating || 0);

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            className={
              star <= numericRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  // =====================================================
  // Rating Percentage
  // =====================================================

  const getPercentage = (count) => {
    if (!statistics.total) {
      return 0;
    }

    return Math.round((count / statistics.total) * 100);
  };

  // =====================================================
  // Loading
  // =====================================================

  if (reviewsLoading) {
    return (
      <section className="space-y-6">
        <div>
          <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />

          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border bg-white dark:bg-gray-900"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl border bg-white dark:bg-gray-900" />
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="space-y-7">
      {/* =================================================
          Header
      ================================================= */}

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400">
            <MessageSquare size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Review Management
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor customer feedback and manage product reviews.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          Errors
      ================================================= */}

      {reviewsError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm font-medium text-red-700 dark:text-red-300">
          <AlertCircle size={18} />

          {reviewsError}
        </div>
      )}

      {deleteReviewError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm font-medium text-red-700 dark:text-red-300">
          <AlertCircle size={18} />

          {deleteReviewError}
        </div>
      )}

      {/* =================================================
          Summary Cards
      ================================================= */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Reviews */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reviews</p>

            <MessageSquare size={20} className="text-gray-400 dark:text-gray-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            {statistics.total}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Customer feedback</p>
        </div>

        {/* Average Rating */}

        <div className="rounded-2xl border border-yellow-100 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Rating</p>

            <Star size={20} className="fill-yellow-400 text-yellow-400" />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {statistics.averageRating.toFixed(1)}
            </p>

            <span className="text-sm text-gray-400 dark:text-gray-500">/ 5</span>
          </div>

          <div className="mt-1">
            {renderStars(Math.round(statistics.averageRating))}
          </div>
        </div>

        {/* Five Star */}

        <div className="rounded-2xl border border-emerald-100 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">5-Star Reviews</p>

            <Star size={20} className="fill-emerald-400 text-emerald-400" />
          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {statistics.fiveStar}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {getPercentage(statistics.fiveStar)}% of reviews
          </p>
        </div>

        {/* Low Ratings */}

        <div className="rounded-2xl border border-red-100 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Ratings</p>

            <AlertCircle size={20} className="text-red-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">
            {statistics.oneStar + statistics.twoStar}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">1★ and 2★ reviews</p>
        </div>
      </div>

      {/* =================================================
          Rating Distribution
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white">Rating Distribution</h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Overview of customer satisfaction
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              rating: 5,
              count: statistics.fiveStar,
            },
            {
              rating: 4,
              count: statistics.fourStar,
            },
            {
              rating: 3,
              count: statistics.threeStar,
            },
            {
              rating: 2,
              count: statistics.twoStar,
            },
            {
              rating: 1,
              count: statistics.oneStar,
            },
          ].map((item) => (
            <div key={item.rating} className="flex items-center gap-3">
              <div className="flex w-12 items-center gap-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.rating}
                </span>

                <Star size={14} className="fill-yellow-400 text-yellow-400" />
              </div>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all"
                  style={{
                    width: `${getPercentage(item.count)}%`,
                  }}
                />
              </div>

              <span className="w-10 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          Filters
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-gray-500 dark:text-gray-400" />

          <h2 className="font-semibold text-gray-900 dark:text-white">Find Reviews</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          {/* Search */}

          <div className="relative">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search buyer, product or review..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 dark:bg-gray-800/60 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Rating */}

          <select
            value={ratingFilter}
            onChange={(event) => setRatingFilter(event.target.value)}
            className="rounded-xl border border-gray-300 bg-gray-50 dark:bg-gray-800/60 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="All">All Ratings</option>

            <option value="5">5 Stars</option>

            <option value="4">4 Stars</option>

            <option value="3">3 Stars</option>

            <option value="2">2 Stars</option>

            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredReviews.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {reviews.length}
            </span>{" "}
            reviews
          </p>

          {(search || ratingFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRatingFilter("All");
              }}
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          Reviews
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Customer Reviews</h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Review activity across Hawkins Farm
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
            {filteredReviews.length} results
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <MessageSquare size={25} className="text-gray-400 dark:text-gray-500" />
            </div>

            <p className="mt-4 font-semibold text-gray-800 dark:text-gray-200">No reviews found</p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or rating filter.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredReviews.map((review) => (
              <div key={review._id} className="p-5 transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Review Content */}

                  <div className="min-w-0 flex-1">
                    {/* Buyer / Product */}

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                          <User size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {review.buyer?.name || "Unknown Buyer"}
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {review.buyer?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <div className="hidden h-8 w-px bg-gray-200 dark:bg-gray-700 sm:block" />

                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                          <Package size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {review.product?.name || "Unknown Product"}
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {review.product?.category || "Product"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {renderStars(review.rating)}

                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {Number(review.rating || 0).toFixed(1)}
                      </span>

                      {review.createdAt && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                    </div>

                    {/* Comment */}

                    <div className="mt-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4">
                      <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                        “{review.comment}”
                      </p>
                    </div>
                  </div>

                  {/* Delete */}

                  <div className="flex shrink-0 lg:pt-1">
                    <button
                      type="button"
                      disabled={deletingReview}
                      onClick={() => handleDelete(review)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {deletingReview ? "Deleting..." : "Delete Review"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminReviews;
