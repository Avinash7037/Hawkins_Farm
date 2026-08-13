import AuctionCard from "./AuctionCard";

// =====================================================
// Auction List
// =====================================================

function AuctionList({ auctions }) {
  if (!auctions || auctions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          No live auctions available
        </p>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Check back later for new farmer auctions.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <AuctionCard key={auction._id} auction={auction} />
      ))}
    </div>
  );
}

export default AuctionList;
