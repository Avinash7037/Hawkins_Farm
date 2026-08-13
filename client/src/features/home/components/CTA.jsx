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

        <h2 className="text-5xl font-bold text-white">
          Ready to Experience Fresh Farm Products?
        </h2>

        {/* =================================================
            Description
        ================================================= */}

        <p
          className="
            mt-6
            text-lg
            text-emerald-100

            dark:text-emerald-200
          "
        >
          Join thousands of customers and farmers building a better food
          ecosystem.
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
              px-8 py-4
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
              border-2 border-white
              px-8 py-4
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
