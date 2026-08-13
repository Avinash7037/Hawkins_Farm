const { endExpiredAuctions } = require("./auctionService");

// =====================================================
// Auction Scheduler
// =====================================================

let schedulerInterval = null;

// =====================================================
// Run Auction Expiry Check
// =====================================================

const checkExpiredAuctions = async (io) => {
  try {
    // =================================================
    // Pass Socket.IO to auction service
    // =================================================

    const endedAuctions = await endExpiredAuctions(io);

    if (!endedAuctions.length) {
      return;
    }

    console.log(`🏷️ Ended ${endedAuctions.length} expired auction(s)`);

    // =================================================
    // Notify Connected Auction Users
    // =================================================

    for (const result of endedAuctions) {
      if (!result?.auctionId) {
        continue;
      }

      if (!io) {
        continue;
      }

      io.to(`auction:${result.auctionId}`).emit("auction:ended", {
        auctionId: result.auctionId,

        status: result.status,

        cropName: result.cropName,

        quantity: result.quantity,

        unit: result.unit,

        winningPrice: result.winningPrice ?? null,

        winner: result.winner ?? null,

        winnerName: result.winnerName ?? null,

        farmerId: result.farmerId ?? null,

        totalValue: result.totalValue ?? null,

        totalBids: result.totalBids ?? 0,

        endedAt: result.endedAt ?? new Date(),
      });
    }
  } catch (error) {
    console.error("Auction scheduler error:", error);
  }
};

// =====================================================
// Start Scheduler
// =====================================================

const startAuctionScheduler = (io) => {
  // -------------------------------------------------
  // Prevent Duplicate Scheduler
  // -------------------------------------------------

  if (schedulerInterval) {
    return;
  }

  console.log("⏱️ Auction scheduler started");

  // -------------------------------------------------
  // Run Immediately
  // -------------------------------------------------

  checkExpiredAuctions(io);

  // -------------------------------------------------
  // Check Every 5 Seconds
  // -------------------------------------------------

  schedulerInterval = setInterval(() => {
    checkExpiredAuctions(io);
  }, 5000);
};

// =====================================================
// Stop Scheduler
// =====================================================

const stopAuctionScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);

    schedulerInterval = null;

    console.log("⏹️ Auction scheduler stopped");
  }
};

// =====================================================
// Export
// =====================================================

module.exports = {
  startAuctionScheduler,
  stopAuctionScheduler,
};
