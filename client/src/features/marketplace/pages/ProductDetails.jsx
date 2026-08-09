import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { fetchProduct } from "../productThunks";
import { addItemToCart } from "../../cart/cartThunks";

import { fetchMyOrders } from "../../orders/orderThunks";

import {
  fetchProductReviews,
  createReview,
  editReview,
  removeReview,
} from "../../reviews/reviewThunks";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =====================================================
  // Redux State
  // =====================================================

  const { product, loading, error } = useSelector((state) => state.products);

  const {
    reviews,
    loading: reviewsLoading,
    submitting: reviewSubmitting,
    error: reviewError,
  } = useSelector((state) => state.reviews);

  const { orders } = useSelector((state) => state.orders);

  const { user } = useSelector((state) => state.auth);

  // =====================================================
  // Local State
  // =====================================================

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  // =====================================================
  // Fetch Product
  // =====================================================

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id]);

  // =====================================================
  // Fetch Reviews
  // =====================================================

  useEffect(() => {
    if (id) {
      dispatch(fetchProductReviews(id));
    }
  }, [dispatch, id]);

  // =====================================================
  // Fetch Buyer Orders
  // =====================================================

  useEffect(() => {
    if (user?.role === "buyer") {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, user?.role]);

  // =====================================================
  // Add To Cart
  // =====================================================

  const handleAddToCart = async () => {
    if (!product) return;

    const result = await dispatch(
      addItemToCart({
        productId: product._id,
        quantity: 1,
      }),
    );

    if (addItemToCart.fulfilled.match(result)) {
      navigate("/cart");
    }
  };

  // =====================================================
  // Chat With Farmer
  // =====================================================

  const handleChatWithFarmer = () => {
    if (!product?.farmer) {
      return;
    }

    const farmerId =
      typeof product.farmer === "object" ? product.farmer?._id : product.farmer;

    if (!farmerId) {
      return;
    }

    navigate(`/chat/${farmerId}`);
  };

  // =====================================================
  // Find Delivered Order For This Product
  // =====================================================

  const deliveredOrder = useMemo(() => {
    if (!orders || !product) {
      return null;
    }

    return (
      orders.find((order) => {
        const orderProductId =
          typeof order.product === "object"
            ? order.product?._id
            : order.product;

        return (
          orderProductId === product._id && order.orderStatus === "Delivered"
        );
      }) || null
    );
  }, [orders, product]);

  // =====================================================
  // Current Buyer's Review
  // =====================================================

  const currentUserReview = useMemo(() => {
    if (!user || !reviews) {
      return null;
    }

    return (
      reviews.find((review) => {
        const buyerId =
          typeof review.buyer === "object" ? review.buyer?._id : review.buyer;

        return buyerId === user._id;
      }) || null
    );
  }, [reviews, user]);

  // =====================================================
  // Add Review
  // =====================================================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!deliveredOrder) {
      return;
    }

    if (!comment.trim()) {
      return;
    }

    const result = await dispatch(
      createReview({
        productId: product._id,
        orderId: deliveredOrder._id,
        rating,
        comment: comment.trim(),
      }),
    );

    if (createReview.fulfilled.match(result)) {
      setRating(5);
      setComment("");

      dispatch(fetchProductReviews(product._id));
      dispatch(fetchProduct(product._id));
    }
  };

  // =====================================================
  // Start Editing Review
  // =====================================================

  const handleEditClick = (review) => {
    setEditingReview(review);

    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // =====================================================
  // Update Review
  // =====================================================

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    if (!editingReview) {
      return;
    }

    if (!editComment.trim()) {
      return;
    }

    const result = await dispatch(
      editReview({
        id: editingReview._id,
        data: {
          rating: editRating,
          comment: editComment.trim(),
        },
      }),
    );

    if (editReview.fulfilled.match(result)) {
      setEditingReview(null);
      setEditRating(5);
      setEditComment("");

      dispatch(fetchProductReviews(product._id));
      dispatch(fetchProduct(product._id));
    }
  };

  // =====================================================
  // Delete Review
  // =====================================================

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(removeReview(reviewId));

    if (removeReview.fulfilled.match(result)) {
      dispatch(fetchProductReviews(product._id));
      dispatch(fetchProduct(product._id));
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-gray-600">Loading product...</p>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </section>
    );
  }

  // =====================================================
  // Product Not Found
  // =====================================================

  if (!product) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-gray-500">Product not found.</p>
      </section>
    );
  }

  // =====================================================
  // Farmer ID
  // =====================================================

  const farmerId =
    typeof product.farmer === "object" ? product.farmer?._id : product.farmer;

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="mx-auto max-w-7xl space-y-12 px-6 py-10">
      {/* =================================================
          Product Information
      ================================================= */}

      <div className="grid gap-12 md:grid-cols-2">
        {/* Product Image */}

        <div>
          <img
            src={
              product.images?.[0]?.url ||
              "https://placehold.co/700x500?text=No+Image"
            }
            alt={product.name}
            className="h-full max-h-[550px] w-full rounded-2xl object-cover shadow-lg"
          />
        </div>

        {/* Product Details */}

        <div>
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
            {product.category}
          </span>

          <h1 className="mt-4 text-5xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-6 leading-8 text-gray-600">{product.description}</p>

          {/* Rating */}

          <div className="mt-5 flex items-center gap-3">
            <div className="flex text-xl text-yellow-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index < Math.round(product.rating || 0) ? "★" : "☆"}
                </span>
              ))}
            </div>

            <span className="text-sm text-gray-600">
              {product.rating || 0}/5
            </span>

            <span className="text-sm text-gray-500">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          <h2 className="mt-8 text-4xl font-bold text-emerald-600">
            ₹{product.price}
          </h2>

          <div className="mt-8 space-y-3 text-gray-600">
            <p>
              <strong>Quantity:</strong> {product.quantity} {product.unit}
            </p>

            <p>
              <strong>Location:</strong> {product.location}
            </p>

            <p>
              <strong>Freshness:</strong> {product.freshness}
            </p>

            <p>
              <strong>Farmer:</strong> {product.farmer?.name || "Unknown"}
            </p>
          </div>

          {/* Add To Cart */}

          <button
            onClick={handleAddToCart}
            className="mt-10 rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white transition hover:bg-emerald-700"
          >
            Add to Cart
          </button>

          {/* Chat With Farmer */}

          {user?.role === "buyer" && (
            <button
              onClick={handleChatWithFarmer}
              disabled={!farmerId}
              className="mt-3 w-full rounded-xl border-2 border-emerald-600 px-8 py-4 font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              💬 Chat with Farmer
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          Reviews Section
      ================================================= */}

      <div className="border-t pt-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>

          <p className="mt-2 text-gray-600">
            See what other buyers have to say about this product.
          </p>
        </div>

        {/* =================================================
            Add Review
        ================================================= */}

        {user?.role === "buyer" && deliveredOrder && !currentUserReview && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-10 rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold">Write a Review</h3>

            <p className="mt-1 text-sm text-gray-500">
              You purchased and received this product.
            </p>

            {/* Rating */}

            <div className="mt-5">
              <label className="mb-2 block font-medium">Rating</label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}

            <div className="mt-5">
              <label
                htmlFor="review-comment"
                className="mb-2 block font-medium"
              >
                Comment
              </label>

              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                maxLength={500}
                className="w-full rounded-lg border p-3 outline-none focus:border-emerald-500"
              />
            </div>

            {reviewError && (
              <p className="mt-3 text-sm text-red-600">{reviewError}</p>
            )}

            <button
              type="submit"
              disabled={reviewSubmitting || !comment.trim()}
              className="mt-5 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {/* =================================================
            Review Eligibility Messages
        ================================================= */}

        {user?.role === "buyer" && !deliveredOrder && !currentUserReview && (
          <div className="mb-10 rounded-xl bg-gray-50 p-5 text-gray-600">
            You can review this product after your order has been delivered.
          </div>
        )}

        {user?.role === "buyer" && currentUserReview && (
          <div className="mb-10 rounded-xl bg-emerald-50 p-5 text-emerald-700">
            You have already reviewed this product.
          </div>
        )}

        {/* =================================================
            Loading Reviews
        ================================================= */}

        {reviewsLoading ? (
          <div className="py-10 text-center text-gray-500">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-8 text-center text-gray-500">
            No reviews yet. Be the first to review this product.
          </div>
        ) : (
          <div className="space-y-5">
            {reviews.map((review) => {
              const buyerName =
                typeof review.buyer === "object" ? review.buyer?.name : "Buyer";

              const isOwnReview =
                user &&
                typeof review.buyer === "object" &&
                review.buyer?._id === user._id;

              return (
                <div
                  key={review._id}
                  className="rounded-xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {buyerName || "Buyer"}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <div className="text-yellow-500">
                          {Array.from({
                            length: 5,
                          }).map((_, index) => (
                            <span key={index}>
                              {index < review.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>

                        <span className="text-sm text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    <span className="text-sm text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  {/* Review Comment */}

                  {editingReview?._id === review._id ? (
                    <form onSubmit={handleUpdateReview} className="mt-5">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className={`text-2xl ${
                              star <= editRating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        maxLength={500}
                        rows={4}
                        className="mt-3 w-full rounded-lg border p-3"
                      />

                      <div className="mt-3 flex gap-2">
                        <button
                          type="submit"
                          disabled={reviewSubmitting || !editComment.trim()}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                          {reviewSubmitting ? "Saving..." : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingReview(null)}
                          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="mt-4 leading-7 text-gray-600">
                        {review.comment}
                      </p>

                      {isOwnReview && (
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleEditClick(review)}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            disabled={reviewSubmitting}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetails;
