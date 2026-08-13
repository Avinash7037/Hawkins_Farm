import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Clock,
  Gavel,
  Package,
  User,
  IndianRupee,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import socket from "../../../socket";

import { fetchAuctionById, placeAuctionBid } from "../auctionThunks";

import {
  clearSelectedAuction,
  updateAuctionFromSocket,
  updateAuctionCancelledFromSocket,
  updateAuctionEndedFromSocket,
} from "../auctionSlice";

// =====================================================
// Helpers
// =====================================================

const formatTime = (milliseconds) => {
  if (milliseconds <= 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
};

// =====================================================
// Component
// =====================================================

function AuctionDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    selectedAuction,
    detailsLoading,
    detailsError,
    bidding,
    biddingAuctionId,
    bidError,
  } = useSelector((state) => state.auction);

  const { user } = useSelector((state) => state.auth);

  const [bidAmount, setBidAmount] = useState("");

  const [remainingTime, setRemainingTime] = useState(0);

  // ===================================================
  // Fetch Auction
  // ===================================================

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(fetchAuctionById(id));

    return () => {
      dispatch(clearSelectedAuction());
    };
  }, [dispatch, id]);

  // ===================================================
  // Join Auction Socket Room
  // ===================================================

  useEffect(() => {
    if (!id || !socket.connected) {
      return;
    }

    socket.emit("auction:join", id);

    return () => {
      socket.emit("auction:leave", id);
    };
  }, [id, socket.connected]);

  // ===================================================
  // Handle Socket Events
  // ===================================================

  useEffect(() => {
    if (!id) {
      return;
    }

    const handleBid = (data) => {
      if (data?.auctionId !== id) {
        return;
      }

      dispatch(updateAuctionFromSocket(data));

      toast.success(
        `New bid: ₹${data.newPrice}/${selectedAuction?.unit || "kg"}`,
      );
    };

    const handleCancelled = (data) => {
      if (data?.auctionId !== id) {
        return;
      }

      dispatch(updateAuctionCancelledFromSocket(data));

      toast.error("This auction has been cancelled.");
    };

    const handleEnded = (data) => {
      if (data?.auctionId !== id) {
        return;
      }

      dispatch(updateAuctionEndedFromSocket(data));

      toast.success("Auction has ended.");
    };

    socket.on("auction:bid", handleBid);

    socket.on("auction:cancelled", handleCancelled);

    socket.on("auction:ended", handleEnded);

    return () => {
      socket.off("auction:bid", handleBid);

      socket.off("auction:cancelled", handleCancelled);

      socket.off("auction:ended", handleEnded);
    };
  }, [dispatch, id, selectedAuction?.unit]);

  // ===================================================
  // Join Room After Socket Connect
  // ===================================================

  useEffect(() => {
    if (!id) {
      return;
    }

    const handleConnect = () => {
      socket.emit("auction:join", id);
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      socket.emit("auction:join", id);
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [id]);

  // ===================================================
  // Countdown
  // ===================================================

  useEffect(() => {
    if (!selectedAuction?.endsAt) {
      return;
    }

    const calculateRemaining = () => {
      const endTime = new Date(selectedAuction.endsAt).getTime();

      const difference = endTime - Date.now();

      setRemainingTime(Math.max(difference, 0));
    };

    calculateRemaining();

    const interval = setInterval(calculateRemaining, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAuction?.endsAt]);

  // ===================================================
  // Automatically Mark Local UI As Ended
  // ===================================================

  const auctionEnded =
    selectedAuction?.status === "ENDED" || remainingTime <= 0;

  // ===================================================
  // Product Image
  // ===================================================

  const productImage = selectedAuction?.product?.images?.[0]?.url || null;

  // ===================================================
  // Minimum Bid
  // ===================================================

  const currentPrice = Number(selectedAuction?.currentPrice || 0);

  const minimumBid = currentPrice + 1;

  // ===================================================
  // Bid Validation
  // ===================================================

  const parsedBid = Number(bidAmount);

  const isValidBid = Number.isFinite(parsedBid) && parsedBid >= minimumBid;

  // ===================================================
  // Bid Handler
  // ===================================================

  const handlePlaceBid = async (event) => {
    event.preventDefault();

    if (!selectedAuction) {
      return;
    }

    if (selectedAuction.status !== "LIVE") {
      toast.error(`Auction is ${selectedAuction.status}`);

      return;
    }

    if (remainingTime <= 0) {
      toast.error("Auction has ended.");

      return;
    }

    if (!isValidBid) {
      toast.error(
        `Bid must be at least ₹${minimumBid}/${selectedAuction.unit}`,
      );

      return;
    }

    try {
      await dispatch(
        placeAuctionBid({
          id,
          amount: parsedBid,
        }),
      ).unwrap();

      setBidAmount("");

      toast.success("Bid placed successfully!");
    } catch (error) {
      toast.error(error || "Failed to place bid");
    }
  };

  // ===================================================
  // Loading
  // ===================================================

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
        <div className="mx-auto flex min-h-96 max-w-7xl items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-green-600" />
        </div>
      </div>
    );
  }

  // ===================================================
  // Error
  // ===================================================

  if (detailsError || !selectedAuction) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate("/auctions")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 dark:text-gray-400"
          >
            <ArrowLeft size={18} />
            Back to Auctions
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-900/20">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />

            <h2 className="text-xl font-bold text-red-700 dark:text-red-400">
              Unable to load auction
            </h2>

            <p className="mt-2 text-red-600 dark:text-red-400">
              {detailsError || "Auction not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // Status
  // ===================================================

  const isCancelled = selectedAuction.status === "CANCELLED";

  const isEnded = selectedAuction.status === "ENDED" || auctionEnded;

  // ===================================================
  // Render
  // ===================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            Back Button
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate("/auctions")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-600 dark:text-gray-400"
        >
          <ArrowLeft size={18} />
          Back to Auctions
        </button>

        {/* =================================================
            Main Grid
        ================================================= */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* =================================================
              Left - Product / Auction Information
          ================================================= */}

          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {/* Product Image */}

              <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={selectedAuction.cropName}
                    className="h-80 w-full object-cover sm:h-96"
                  />
                ) : (
                  <div className="flex h-80 items-center justify-center sm:h-96">
                    <Package size={80} className="text-gray-400" />
                  </div>
                )}

                {/* Status */}

                <div className="absolute left-5 top-5">
                  {selectedAuction.status === "LIVE" && !isEnded ? (
                    <span className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                      LIVE
                    </span>
                  ) : isCancelled ? (
                    <span className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
                      <XCircle size={16} />
                      CANCELLED
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 rounded-full bg-gray-700 px-4 py-2 text-sm font-bold text-white">
                      <CheckCircle size={16} />
                      ENDED
                    </span>
                  )}
                </div>
              </div>

              {/* Product Information */}

              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedAuction.cropName}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <User size={16} />

                      {selectedAuction.farmer?.name || "Farmer"}
                    </span>

                    <span className="flex items-center gap-2">
                      <Package size={16} />
                      {selectedAuction.quantity} {selectedAuction.unit}
                    </span>

                    {selectedAuction.product?.location && (
                      <span>📍 {selectedAuction.product.location}</span>
                    )}
                  </div>
                </div>

                {/* Product Description */}

                {selectedAuction.product?.description && (
                  <div className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Product Description
                    </h2>

                    <p className="leading-7 text-gray-600 dark:text-gray-400">
                      {selectedAuction.product.description}
                    </p>
                  </div>
                )}

                {/* Auction Information */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Base Price
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      ₹{selectedAuction.basePrice}
                      <span className="ml-1 text-sm font-medium text-gray-500">
                        /{selectedAuction.unit}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Current Bid
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-400">
                      ₹{currentPrice}
                      <span className="ml-1 text-sm font-medium">
                        /{selectedAuction.unit}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Bids
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                      <Gavel size={20} />

                      {selectedAuction.bidCount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              Right - Bidding Panel
          ================================================= */}

          <div>
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {/* Countdown */}

              <div className="mb-6 rounded-2xl bg-gray-900 p-5 text-center dark:bg-black">
                <div className="mb-2 flex items-center justify-center gap-2 text-gray-400">
                  <Clock size={18} />

                  <span className="text-sm font-medium">
                    {isCancelled
                      ? "Auction Cancelled"
                      : isEnded
                        ? "Auction Ended"
                        : "Time Remaining"}
                  </span>
                </div>

                <p className="text-3xl font-bold tracking-wider text-white">
                  {isCancelled
                    ? "--:--"
                    : isEnded
                      ? "00:00"
                      : formatTime(remainingTime)}
                </p>
              </div>

              {/* Current Highest Bidder */}

              <div className="mb-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Highest Bidder
                </p>

                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {selectedAuction.highestBidderName || "No bids yet"}
                </p>
              </div>

              {/* Bidding */}

              {!isCancelled && !isEnded ? (
                <form onSubmit={handlePlaceBid}>
                  <label
                    htmlFor="bidAmount"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Your Bid
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="bidAmount"
                      type="number"
                      min={minimumBid}
                      step="0.01"
                      value={bidAmount}
                      onChange={(event) => setBidAmount(event.target.value)}
                      placeholder={`Minimum ₹${minimumBid}`}
                      disabled={bidding && biddingAuctionId === id}
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Minimum bid: ₹{minimumBid}/{selectedAuction.unit}
                  </p>

                  {(bidError || (!isValidBid && bidAmount)) && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                      <AlertCircle size={17} className="mt-0.5 shrink-0" />

                      <span>
                        {bidError || `Bid must be at least ₹${minimumBid}`}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bidding || !isValidBid}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3.5 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Gavel size={19} />

                    {bidding ? "Placing Bid..." : "Place Bid"}
                  </button>
                </form>
              ) : (
                <div
                  className={`rounded-xl p-4 text-center ${
                    isCancelled
                      ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  <p className="font-semibold">
                    {isCancelled
                      ? "This auction has been cancelled."
                      : "This auction has ended."}
                  </p>
                </div>
              )}

              {/* =================================================
                  Bid History
              ================================================= */}

              <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Bid History
                  </h2>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedAuction.bidCount || 0} bids
                  </span>
                </div>

                {selectedAuction.bids?.length > 0 ? (
                  <div className="max-h-72 space-y-3 overflow-y-auto">
                    {[...selectedAuction.bids].reverse().map((bid, index) => (
                      <div
                        key={
                          bid._id || `${bid.buyer}-${bid.createdAt}-${index}`
                        }
                        className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {bid.buyerName || "Buyer"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {bid.createdAt
                                ? new Date(bid.createdAt).toLocaleString()
                                : ""}
                            </p>
                          </div>

                          <p className="font-bold text-green-600">
                            ₹{bid.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 p-5 text-center dark:bg-gray-800">
                    <Gavel size={28} className="mx-auto mb-2 text-gray-400" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No bids yet. Be the first to bid!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            Auction Result
        ================================================= */}

        {selectedAuction.result?.status && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Auction Result
            </h2>

            {selectedAuction.result.status === "SOLD" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Status</p>

                  <p className="font-bold text-green-600">SOLD</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Winning Price</p>

                  <p className="font-bold text-gray-900 dark:text-white">
                    ₹{selectedAuction.result.winningPrice}/
                    {selectedAuction.unit}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total Value</p>

                  <p className="font-bold text-gray-900 dark:text-white">
                    ₹{selectedAuction.result.totalValue}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                This auction ended without any bids.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuctionDetails;
