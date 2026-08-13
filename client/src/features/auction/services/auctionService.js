import api from "../../../services/api";

// =====================================================
// Get All Live Auctions
// =====================================================

export const getLiveAuctions = async () => {
  const response = await api.get("/auctions/live");

  return response.data;
};

// =====================================================
// Get Single Auction
// =====================================================

export const getAuction = async (id) => {
  const response = await api.get(`/auctions/${id}`);

  return response.data;
};

// =====================================================
// Create Auction
// Farmer only
// =====================================================

export const createAuction = async (auctionData) => {
  const response = await api.post("/auctions", auctionData);

  return response.data;
};

// =====================================================
// Get Farmer's Auctions
// Farmer only
// =====================================================

export const getMyAuctions = async () => {
  const response = await api.get("/auctions/farmer/my-auctions");

  return response.data;
};

// =====================================================
// Place Bid
// Buyer only
// =====================================================

export const placeBid = async (id, amount) => {
  const response = await api.post(`/auctions/${id}/bid`, {
    amount,
  });

  return response.data;
};

// =====================================================
// Cancel Auction
// Farmer only
// =====================================================

export const cancelAuction = async (id) => {
  const response = await api.put(`/auctions/${id}/cancel`);

  return response.data;
};
