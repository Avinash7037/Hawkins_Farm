import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw, Gavel } from "lucide-react";

import { fetchLiveAuctions } from "../auctionThunks";

import AuctionList from "../components/AuctionList";

// =====================================================
// Live Auctions
// =====================================================

function LiveAuctions() {
  const dispatch = useDispatch();

  const { liveAuctions, loading, error } = useSelector(
    (state) => state.auction,
  );

  // ===================================================
  // Fetch Auctions
  // ===================================================

  useEffect(() => {
    dispatch(fetchLiveAuctions());
  }, [dispatch]);

  // ===================================================
  // Refresh
  // ===================================================

  const handleRefresh = () => {
    dispatch(fetchLiveAuctions());
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Gavel size={28} className="text-green-600" />

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Live Auctions
              </h1>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Bid on fresh products directly from farmers.
            </p>
          </div>

          {/* =================================================
              Refresh Button
          ================================================= */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* =================================================
            Error
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* =================================================
            Loading
        ================================================= */}

        {loading && liveAuctions.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-green-600" />
          </div>
        ) : (
          <AuctionList auctions={liveAuctions} />
        )}
      </div>
    </div>
  );
}

export default LiveAuctions;
