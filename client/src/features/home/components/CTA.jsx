import { Link } from "react-router-dom";

function CTA() {
  return (
    <section
      className="
        bg-emerald-600
        py-24
        text-white

        dark:bg-emerald-950
      "
    >
      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* =================================================
            Heading
        ================================================= */}

        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Explore Hawkins Farm
        </h2>

        {/* =================================================
            Description
        ================================================= */}

        <p
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-lg
            leading-8
            text-emerald-100

            dark:text-emerald-200
          "
        >
          Discover agricultural products, connect with farmers, place orders,
          and participate in live auctions through one platform.
        </p>

        {/* =================================================
            Buttons
        ================================================= */}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {/* Marketplace */}

          <Link
            to="/products"
            className="
              rounded-xl
              bg-white
              px-8
              py-4
              font-semibold
              text-emerald-600
              transition
              hover:bg-gray-100

              dark:bg-gray-100
              dark:hover:bg-white
            "
          >
            Explore Marketplace
          </Link>

          {/* Register */}

          <Link
            to="/register"
            className="
              rounded-xl
              border-2
              border-white
              px-8
              py-4
              font-semibold
              text-white
              transition
              hover:bg-white
              hover:text-emerald-600

              dark:hover:bg-gray-100
            "
          >
            Join Hawkins Farm
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;
