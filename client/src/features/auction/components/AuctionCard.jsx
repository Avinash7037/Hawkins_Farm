import { Link } from "react-router-dom";
import { Gavel, Clock, Package, User } from "lucide-react";

// =====================================================
// Auction Card
// =====================================================

function AuctionCard({ auction }) {
  if (!auction) {
    return null;
  }

  const productImage = auction.product?.images?.[0]?.url || null;

  const currentPrice = Number(auction.currentPrice || 0);
  const basePrice = Number(auction.basePrice || 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
      {/* =================================================
          Product Image
      ================================================= */}

      <div className="mb-4 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {productImage ? (
          <img
            src={productImage}
            alt={auction.cropName}
            className="h-52 w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-52 items-center justify-center">
            <Package size={48} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* =================================================
          Auction Status
      ================================================= */}

      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          LIVE
        </span>

        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Gavel size={16} />

          <span>{auction.bidCount || 0} bids</span>
        </div>
      </div>

      {/* =================================================
          Crop Name
      ================================================= */}

      <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
        {auction.cropName}
      </h3>

      {/* =================================================
          Farmer
      ================================================= */}

      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <User size={15} />

        <span>{auction.farmer?.name || "Farmer"}</span>
      </div>

      {/* =================================================
          Quantity
      ================================================= */}

      <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>

          <p className="font-semibold text-gray-900 dark:text-white">
            {auction.quantity} {auction.unit}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Base Price</p>

          <p className="font-semibold text-gray-900 dark:text-white">
            ₹{basePrice}/{auction.unit}
          </p>
        </div>
      </div>

      {/* =================================================
          Current Price
      ================================================= */}

      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Current Highest Bid
        </p>

        <p className="text-2xl font-bold text-green-600">
          ₹{currentPrice}
          <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            /{auction.unit}
          </span>
        </p>
      </div>

      {/* =================================================
          Ends At
      ================================================= */}

      <div className="mb-5 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Clock size={16} />

        <span>
          Ends{" "}
          {auction.endsAt ? new Date(auction.endsAt).toLocaleString() : "Soon"}
        </span>
      </div>

      {/* =================================================
          View Auction
      ================================================= */}

      <Link
        to={`/auctions/${auction._id}`}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
      >
        <Gavel size={18} />
        View & Bid
      </Link>
    </div>
  );
}

export default AuctionCard;
