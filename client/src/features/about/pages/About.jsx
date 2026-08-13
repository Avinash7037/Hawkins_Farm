import { Leaf, ShieldCheck, Truck, Users, Heart, Sprout } from "lucide-react";

function About() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      {/* =====================================================
          Hero
      ===================================================== */}

      <section className="border-b border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Leaf size={18} />
              Fresh • Local • Trusted
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              About Hawkins Farm
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Hawkins Farm connects farmers and buyers through a trusted digital
              marketplace for fresh, local agricultural products.
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
              Our goal is simple: make it easier for farmers to sell directly
              and for buyers to discover quality products from local growers.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          Mission
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Mission */}

          <div className="rounded-3xl bg-emerald-700 p-8 text-white shadow-sm dark:bg-emerald-800">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Heart size={28} />
            </div>

            <h2 className="text-2xl font-bold">Our Mission</h2>

            <p className="mt-4 leading-7 text-emerald-50">
              To create a transparent and reliable marketplace where farmers can
              reach customers directly while buyers can purchase fresh
              agricultural products with confidence.
            </p>
          </div>

          {/* Supporting Local Agriculture */}

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Sprout size={28} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Supporting Local Agriculture
            </h2>

            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
              Hawkins Farm is designed around the relationship between farmers
              and buyers. We provide the digital tools needed to discover
              products, place orders, manage deliveries and build trusted
              relationships.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          Values
      ===================================================== */}

      <section className="border-y border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Hawkins Farm?
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Built around trust, accessibility and better connections between
              farmers and buyers.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Fresh & Local */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
              <Leaf
                className="text-emerald-600 dark:text-emerald-400"
                size={28}
              />

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                Fresh & Local
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Discover agricultural products from local farmers.
              </p>
            </div>

            {/* Trusted Marketplace */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
              <ShieldCheck
                className="text-emerald-600 dark:text-emerald-400"
                size={28}
              />

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                Trusted Marketplace
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Secure accounts, payments, orders and transparent reviews.
              </p>
            </div>

            {/* Simple Ordering */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
              <Truck
                className="text-emerald-600 dark:text-emerald-400"
                size={28}
              />

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                Simple Ordering
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                From product discovery to delivery, everything stays in one
                place.
              </p>
            </div>

            {/* Farmer & Buyer Focused */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
              <Users
                className="text-emerald-600 dark:text-emerald-400"
                size={28}
              />

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                Farmer & Buyer Focused
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Tools designed for both sides of the agricultural marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          Closing
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Growing together
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600 dark:text-gray-400">
          Hawkins Farm brings technology and agriculture together to make local
          food commerce simpler for everyone.
        </p>
      </section>
    </main>
  );
}

export default About;
