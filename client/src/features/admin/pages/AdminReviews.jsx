import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllAdminReviews, deleteAdminReview } from "../adminThunks";

function AdminReviews() {
  const dispatch = useDispatch();

  const {
    reviews,
    reviewsLoading,
    reviewsError,
    deletingReview,
    deleteReviewError,
  } = useSelector((state) => state.admin);

  // =====================================================
  // Fetch Reviews
  // =====================================================

  useEffect(() => {
    dispatch(fetchAllAdminReviews());
  }, [dispatch]);

  // =====================================================
  // Delete Review
  // =====================================================

  const handleDelete = (review) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this review by ${
        review.buyer?.name || "this buyer"
      }?`,
    );

    if (!confirmed) {
      return;
    }

    dispatch(deleteAdminReview(review._id));
  };

  // =====================================================
  // Loading
  // =====================================================

  if (reviewsLoading) {
    return (
      <section className="px-6 py-10">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-600">
            Loading reviews...
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="px-6 py-10">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>

        <p className="mt-2 text-gray-600">
          Monitor and manage product reviews submitted by buyers.
        </p>
      </div>

      {/* =================================================
          Errors
      ================================================= */}

      {reviewsError && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
          {reviewsError}
        </div>
      )}

      {deleteReviewError && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
          {deleteReviewError}
        </div>
      )}

      {/* =================================================
          Summary
      ================================================= */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Reviews</p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {reviews.length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average Rating</p>

          <p className="mt-2 text-3xl font-bold text-amber-500">
            {reviews.length > 0
              ? (
                  reviews.reduce(
                    (sum, review) => sum + Number(review.rating || 0),
                    0,
                  ) / reviews.length
                ).toFixed(1)
              : "0.0"}{" "}
            ⭐
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Five Star Reviews</p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {reviews.filter((review) => review.rating === 5).length}
          </p>
        </div>
      </div>

      {/* =================================================
          Reviews
      ================================================= */}

      <div className="space-y-5">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-600">
              No reviews found.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              {/* =================================================
                  Top Section
              ================================================= */}

              <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {review.product?.name || "Unknown Product"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Review ID: {review._id}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                    {review.rating} ⭐
                  </span>

                  <button
                    type="button"
                    disabled={deletingReview}
                    onClick={() => handleDelete(review)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingReview ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {/* =================================================
                  Review Information
              ================================================= */}

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                {/* Buyer */}

                <div>
                  <p className="text-sm text-gray-500">Buyer</p>

                  <p className="mt-1 font-medium text-gray-900">
                    {review.buyer?.name || "Unknown Buyer"}
                  </p>

                  {review.buyer?.email && (
                    <p className="mt-1 text-xs text-gray-500">
                      {review.buyer.email}
                    </p>
                  )}
                </div>

                {/* Product */}

                <div>
                  <p className="text-sm text-gray-500">Product</p>

                  <p className="mt-1 font-medium text-gray-900">
                    {review.product?.name || "Unknown Product"}
                  </p>

                  {review.product?.price !== undefined && (
                    <p className="mt-1 text-xs text-gray-500">
                      ₹
                      {Number(review.product.price || 0).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  )}
                </div>

                {/* Date */}

                <div>
                  <p className="text-sm text-gray-500">Submitted</p>

                  <p className="mt-1 font-medium text-gray-900">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString("en-IN")
                      : "-"}
                  </p>
                </div>
              </div>

              {/* =================================================
                  Comment
              ================================================= */}

              <div className="mt-5 rounded-xl bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500">Review</p>

                <p className="mt-2 leading-7 text-gray-800">{review.comment}</p>
              </div>

              {/* =================================================
                  Order Information
              ================================================= */}

              {review.order && (
                <div className="mt-5 border-t pt-5">
                  <p className="text-sm text-gray-500">Related Order</p>

                  <div className="mt-2 flex flex-wrap gap-5 text-sm">
                    <span className="text-gray-700">
                      Order: <strong>{review.order._id || "-"}</strong>
                    </span>

                    {review.order.quantity !== undefined && (
                      <span className="text-gray-700">
                        Quantity: <strong>{review.order.quantity}</strong>
                      </span>
                    )}

                    {review.order.totalPrice !== undefined && (
                      <span className="text-gray-700">
                        Total:{" "}
                        <strong>
                          ₹
                          {Number(review.order.totalPrice || 0).toLocaleString(
                            "en-IN",
                          )}
                        </strong>
                      </span>
                    )}

                    {review.order.orderStatus && (
                      <span className="text-gray-700">
                        Status: <strong>{review.order.orderStatus}</strong>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AdminReviews;
