import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

import { Gavel, ArrowRight, Clock, PlusCircle } from "lucide-react";

import { fetchLiveAuctions } from "../../auction/auctionThunks";

function LiveAuctionsPreview() {
  const dispatch = useDispatch();

  // =====================================================
  // Authentication
  // =====================================================

  const user = useSelector((state) => state.auth.user);

  const userRole = user?.role;

  const isFarmer = userRole === "farmer";

  // =====================================================
  // Auction State
  // =====================================================

  const { liveAuctions = [], loading } = useSelector((state) => state.auction);

  // =====================================================
  // Fetch Live Auctions
  // =====================================================

  useEffect(() => {
    dispatch(fetchLiveAuctions());
  }, [dispatch]);

  // =====================================================
  // Show Only First 3 Auctions
  // =====================================================

  const auctions = liveAuctions.slice(0, 3);

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="bg-white px-6 py-16 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          {/* =================================================
              Heading
          ================================================= */}

          <div>
            <div className="mb-3 flex items-center gap-2">
              <span
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-100
                  text-green-600
                  dark:bg-green-900/30
                  dark:text-green-400
                "
              >
                <Gavel size={22} />
              </span>

              <span
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  text-green-600
                  dark:text-green-400
                "
              >
                Live Now
              </span>
            </div>

            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
                dark:text-white
                sm:text-4xl
              "
            >
              Live Farm Auctions
            </h2>

            <p
              className="
                mt-3
                max-w-2xl
                text-gray-600
                dark:text-gray-400
              "
            >
              Farmers can sell their fresh produce through live bidding, while
              buyers can compete and get the best available price.
            </p>
          </div>

          {/* =================================================
              Role Based Actions
          ================================================= */}

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* =================================================
                Farmer - Create Auction
            ================================================= */}

            {isFarmer && (
              <Link
                to="/farmer/products"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-5
                  py-3
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-green-700
                  hover:shadow-md
                "
              >
                <PlusCircle size={18} />
                Create Live Auction
                <ArrowRight size={18} />
              </Link>
            )}

            {/* =================================================
                Everyone - Explore Auctions
            ================================================= */}

            <Link
              to="/auctions"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-green-600
                px-5
                py-3
                font-semibold
                text-green-600
                transition
                hover:bg-green-600
                hover:text-white
                dark:border-green-500
                dark:text-green-400
                dark:hover:bg-green-600
                dark:hover:text-white
              "
            >
              <Gavel size={18} />
              Explore Live Auctions
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* =================================================
            Loading State
        ================================================= */}

        {loading && liveAuctions.length === 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  animate-pulse
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  dark:border-gray-800
                  dark:bg-gray-900
                "
              >
                <div
                  className="
                    h-52
                    bg-gray-200
                    dark:bg-gray-800
                  "
                />

                <div className="space-y-4 p-5">
                  <div
                    className="
                      h-5
                      w-2/3
                      rounded
                      bg-gray-200
                      dark:bg-gray-800
                    "
                  />

                  <div
                    className="
                      h-4
                      w-1/2
                      rounded
                      bg-gray-200
                      dark:bg-gray-800
                    "
                  />

                  <div
                    className="
                      h-10
                      w-full
                      rounded
                      bg-gray-200
                      dark:bg-gray-800
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================================================
            No Live Auctions
        ================================================= */}

        {!loading && auctions.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
              px-6
              py-12
              text-center
              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-green-100
                text-green-600
                dark:bg-green-900/30
                dark:text-green-400
              "
            >
              <Gavel size={30} />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              No live auctions right now
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-gray-500
                dark:text-gray-400
              "
            >
              {isFarmer
                ? "There are no active auctions at the moment. You can create one for your products."
                : "Farmers haven't started any auctions at the moment. Check back soon for fresh products and new bidding opportunities."}
            </p>

            {/* =================================================
                Empty State Actions
            ================================================= */}

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {/* Farmer Create */}

              {isFarmer && (
                <Link
                  to="/farmer/products"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-green-600
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-green-700
                  "
                >
                  <PlusCircle size={18} />
                  Create Live Auction
                </Link>
              )}

              {/* Explore */}

              <Link
                to="/auctions"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-green-600
                  px-5
                  py-3
                  font-semibold
                  text-green-600
                  transition
                  hover:bg-green-600
                  hover:text-white
                  dark:border-green-500
                  dark:text-green-400
                  dark:hover:bg-green-600
                  dark:hover:text-white
                "
              >
                <Gavel size={18} />
                Explore Auctions
              </Link>
            </div>
          </div>
        )}

        {/* =================================================
            Auction Cards
        ================================================= */}

        {auctions.length > 0 && (
          <div
            className="
              grid
              gap-6
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {auctions.map((auction) => {
              const image = auction.product?.images?.[0]?.url || null;

              const currentPrice = Number(auction.currentPrice || 0);

              return (
                <article
                  key={auction._id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >
                  {/* =================================================
                      Product Image
                  ================================================= */}

                  <Link to={`/auctions/${auction._id}`}>
                    <div
                      className="
                        relative
                        h-52
                        overflow-hidden
                        bg-gray-100
                        dark:bg-gray-800
                      "
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={auction.cropName || "Auction product"}
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                          "
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            items-center
                            justify-center
                            text-5xl
                          "
                        >
                          🌱
                        </div>
                      )}

                      {/* =================================================
                          Live Badge
                      ================================================= */}

                      <div className="absolute left-4 top-4">
                        <span
                          className="
                            flex
                            items-center
                            gap-2
                            rounded-full
                            bg-green-600
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-white
                            shadow-lg
                          "
                        >
                          <span
                            className="
                              h-2
                              w-2
                              animate-pulse
                              rounded-full
                              bg-white
                            "
                          />
                          LIVE
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* =================================================
                      Content
                  ================================================= */}

                  <div className="p-5">
                    {/* =================================================
                        Product Name + Farmer
                    ================================================= */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <div className="min-w-0">
                        <h3
                          className="
                            truncate
                            text-xl
                            font-bold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {auction.cropName}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          By {auction.farmer?.name || "Farmer"}
                        </p>
                      </div>

                      {/* Bid Count */}

                      <div
                        className="
                          shrink-0
                          rounded-lg
                          bg-green-50
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                          text-green-700
                          dark:bg-green-900/30
                          dark:text-green-400
                        "
                      >
                        {auction.bidCount || 0} bids
                      </div>
                    </div>

                    {/* =================================================
                        Current Price
                    ================================================= */}

                    <div
                      className="
                        mt-5
                        rounded-xl
                        bg-gray-50
                        p-4
                        dark:bg-gray-800
                      "
                    >
                      <p
                        className="
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Current Highest Bid
                      </p>

                      <p
                        className="
                          mt-1
                          text-2xl
                          font-bold
                          text-green-600
                          dark:text-green-400
                        "
                      >
                        ₹{currentPrice.toLocaleString("en-IN")}
                        <span
                          className="
                            ml-1
                            text-sm
                            font-medium
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          /{auction.unit || "kg"}
                        </span>
                      </p>
                    </div>

                    {/* =================================================
                        Auction Information
                    ================================================= */}

                    <div
                      className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      <span>
                        {auction.quantity} {auction.unit || "kg"}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={15} />

                        {auction.endsAt
                          ? new Date(auction.endsAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Soon"}
                      </span>
                    </div>

                    {/* =================================================
                        View Auction
                    ================================================= */}

                    <Link
                      to={`/auctions/${auction._id}`}
                      className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-green-600
                        px-4
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-green-700
                      "
                    >
                      <Gavel size={18} />
                      View Auction
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =================================================
            Bottom Actions
        ================================================= */}

        {auctions.length > 0 && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {/* =================================================
                Farmer - Create Auction
            ================================================= */}

            {isFarmer && (
              <Link
                to="/farmer/products"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                "
              >
                <PlusCircle size={18} />
                Create Live Auction
                <ArrowRight size={18} />
              </Link>
            )}

            {/* =================================================
                Everyone - Explore Auctions
            ================================================= */}

            <Link
              to="/auctions"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-green-600
                px-6
                py-3
                font-semibold
                text-green-600
                transition
                hover:bg-green-600
                hover:text-white
                dark:border-green-500
                dark:text-green-400
                dark:hover:bg-green-600
                dark:hover:text-white
              "
            >
              <Gavel size={18} />
              Explore All Auctions
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default LiveAuctionsPreview;
