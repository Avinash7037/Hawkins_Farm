import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="py-24 bg-emerald-600 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold">
          Ready to Experience Fresh Farm Products?
        </h2>

        <p className="mt-6 text-lg text-emerald-100">
          Join thousands of customers and farmers building a better food
          ecosystem.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/products"
            className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Explore Marketplace
          </Link>

          <Link
            to="/register"
            className="border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-emerald-600 transition"
          >
            Join Hawkins Farm
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;
