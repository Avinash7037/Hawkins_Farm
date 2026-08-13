import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Gavel,
  Plus,
  RefreshCw,
  Package,
  Clock,
  IndianRupee,
  Trophy,
  XCircle,
  Eye,
} from "lucide-react";

import { fetchMyAuctions, cancelMyAuction } from "../auctionThunks";

// =====================================================
// Helpers
// =====================================================

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleString();
};

const getStatusClasses = (status) => {
  switch (status) {
    case "LIVE":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

    case "ENDED":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

    case "CANCELLED":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

// =====================================================
// Farmer Auction Card
// =====================================================

function FarmerAuctionCard({ auction, cancelling, onCancel }) {
  if (!auction) {
    return null;
  }

  const productImage = auction.product?.images?.[0]?.url || null;

  const basePrice = Number(auction.basePrice || 0);
  const currentPrice = Number(auction.currentPrice || 0);

  const result = auction.result;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      {/* =================================================
          Product Image
      ================================================= */}

      <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {productImage ? (
          <img
            src={productImage}
            alt={auction.cropName || "Auction product"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={50} className="text-gray-400" />
          </div>
        )}

        {/* Status */}

        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
            auction.status,
          )}`}
        >
          {auction.status}
        </span>
      </div>

      {/* =================================================
          Content
      ================================================= */}

      <div className="p-5">
        {/* Product Name */}

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {auction.cropName || auction.product?.name || "Product"}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Auction ID: {auction._id}
          </p>
        </div>

        {/* =================================================
            Auction Information
        ================================================= */}

        <div className="grid grid-cols-2 gap-3">
          {/* Quantity */}

          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>

            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
              {auction.quantity} {auction.unit}
            </p>
          </div>

          {/* Base Price */}

          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Starting Price
            </p>

            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
              ₹{basePrice}/{auction.unit}
            </p>
          </div>

          {/* Current Price */}

          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {auction.status === "ENDED" ? "Final Price" : "Current Bid"}
            </p>

            <p className="mt-1 flex items-center gap-1 font-semibold text-emerald-600">
              <IndianRupee size={15} />

              {auction.status === "ENDED" && result?.winningPrice != null
                ? result.winningPrice
                : currentPrice}

              <span className="text-xs text-gray-500 dark:text-gray-400">
                /{auction.unit}
              </span>
            </p>
          </div>

          {/* Bids */}

          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Bids
            </p>

            <p className="mt-1 flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
              <Gavel size={15} />

              {auction.bidCount || 0}
            </p>
          </div>
        </div>

        {/* =================================================
            Live Auction Information
        ================================================= */}

        {auction.status === "LIVE" && (
          <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-3 dark:border-green-900/40 dark:bg-green-950/20">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <Clock size={16} />

              <span>Ends: {formatDate(auction.endsAt)}</span>
            </div>

            {auction.highestBidderName && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Highest bidder:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {auction.highestBidderName}
                </span>
              </p>
            )}
          </div>
        )}

        {/* =================================================
            Ended Auction Result
        ================================================= */}

        {auction.status === "ENDED" && (
          <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 p-4 dark:border-yellow-900/40 dark:bg-yellow-950/20">
            {result?.status === "SOLD" ? (
              <>
                <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                  <Trophy size={18} />

                  <span className="font-semibold">Auction Sold</span>
                </div>

                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    Winner:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {auction.highestBidderName || "Buyer"}
                    </span>
                  </p>

                  <p className="text-gray-600 dark:text-gray-400">
                    Winning price:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{result?.winningPrice ?? currentPrice}/{auction.unit}
                    </span>
                  </p>

                  <p className="text-gray-600 dark:text-gray-400">
                    Total value:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{result?.totalValue ?? 0}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <XCircle size={18} />

                <span className="font-semibold">
                  Auction ended without bids
                </span>
              </div>
            )}
          </div>
        )}

        {/* =================================================
            Cancelled Auction
        ================================================= */}

        {auction.status === "CANCELLED" && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            This auction was cancelled.
          </div>
        )}

        {/* =================================================
            Created / Ended Date
        ================================================= */}

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Created: {formatDate(auction.createdAt)}
        </div>

        {/* =================================================
            Actions
        ================================================= */}

        <div className="mt-5 flex gap-3">
          {/* View */}

          <Link
            to={`/auctions/${auction._id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Eye size={17} />
            View
          </Link>

          {/* Cancel */}

          {auction.status === "LIVE" && (
            <button
              type="button"
              onClick={() => onCancel(auction._id)}
              disabled={cancelling}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={17} />

              {cancelling ? "Cancelling..." : "Cancel Auction"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// My Auctions Page
// =====================================================

function MyAuctions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myAuctions, loading, error, cancelling, cancellingAuctionId } =
    useSelector((state) => state.auction);

  // ===================================================
  // Fetch Farmer Auctions
  // ===================================================

  useEffect(() => {
    dispatch(fetchMyAuctions());
  }, [dispatch]);

  // ===================================================
  // Refresh
  // ===================================================

  const handleRefresh = () => {
    dispatch(fetchMyAuctions());
  };

  // ===================================================
  // Cancel
  // ===================================================

  const handleCancel = async (auctionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this auction?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(cancelMyAuction(auctionId)).unwrap();
    } catch (err) {
      console.error("Cancel auction error:", err);
    }
  };

  // ===================================================
  // Render
  // ===================================================

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      {/* =================================================
          Header
      ================================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Gavel size={28} className="text-emerald-600" />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Auctions
            </h1>
          </div>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage the auctions you have created.
          </p>
        </div>

        <div className="flex gap-3">
          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* Create */}

          <button
            type="button"
            onClick={() => navigate("/farmer/auctions/create")}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Create Auction
          </button>
        </div>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* =================================================
          Loading
      ================================================= */}

      {loading && myAuctions.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600" />
        </div>
      ) : myAuctions.length === 0 ? (
        /* =================================================
            Empty State
        ================================================= */

        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Gavel size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
            No auctions yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500 dark:text-gray-400">
            Create your first auction and let buyers compete for your products.
          </p>

          <button
            type="button"
            onClick={() => navigate("/farmer/auctions/create")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Create Your First Auction
          </button>
        </div>
      ) : (
        /* =================================================
            Auction Grid
        ================================================= */

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {myAuctions.map((auction) => (
            <FarmerAuctionCard
              key={auction._id}
              auction={auction}
              cancelling={cancelling && cancellingAuctionId === auction._id}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MyAuctions;
