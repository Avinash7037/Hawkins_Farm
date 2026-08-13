import {
  Leaf,
  ShieldCheck,
  Truck,
  Users,
  Heart,
  Sprout,
  Gavel,
  Bot,
  MessageCircle,
  Mail,
  ScanSearch,
} from "lucide-react";

function About() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      {/* =====================================================
          Hero
      ===================================================== */}

      <section className="border-b border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-4xl">
            {/* Tagline */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Leaf size={18} />
              Fresh • Local • Trusted
            </div>

            {/* Heading */}

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              About Hawkins Farm
            </h1>

            {/* Main Description */}

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Hawkins Farm is a digital agricultural marketplace that connects
              farmers and buyers through a simple, secure and technology-driven
              platform.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
              Our platform helps farmers showcase and sell their agricultural
              products directly while giving buyers an easy way to discover,
              compare and purchase fresh products from local farmers.
            </p>

            {/* Tagline */}

            <div className="mt-8 border-l-4 border-emerald-600 pl-5">
              <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                "Growing technology. Empowering farmers."
              </p>
            </div>
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
              To create a transparent and reliable digital marketplace where
              farmers can reach customers directly while buyers can purchase
              fresh agricultural products with confidence.
            </p>
          </div>

          {/* Supporting Agriculture */}

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Sprout size={28} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Supporting Local Agriculture
            </h2>

            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
              Hawkins Farm brings agriculture and modern technology together. We
              provide farmers and buyers with digital tools for product
              discovery, buying and selling, live auctions, communication,
              payments and more.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          Features
      ===================================================== */}

      <section className="border-y border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              What Hawkins Farm Offers
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              A complete digital platform designed to make agricultural commerce
              easier and more connected.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Fresh & Local */}

            <FeatureCard
              icon={Leaf}
              title="Fresh & Local"
              description="Discover agricultural products directly from local farmers."
            />

            {/* Trusted Marketplace */}

            <FeatureCard
              icon={ShieldCheck}
              title="Trusted Marketplace"
              description="Secure accounts, payments, orders and transparent reviews."
            />

            {/* Simple Ordering */}

            <FeatureCard
              icon={Truck}
              title="Simple Ordering"
              description="From product discovery to delivery, everything stays in one place."
            />

            {/* Farmer & Buyer */}

            <FeatureCard
              icon={Users}
              title="Farmer & Buyer Focused"
              description="Dedicated features designed for both farmers and buyers."
            />

            {/* Live Auctions */}

            <FeatureCard
              icon={Gavel}
              title="Live Auctions"
              description="Farmers can create auctions while buyers participate in real-time bidding."
            />

            {/* AI Assistant */}

            <FeatureCard
              icon={Bot}
              title="AI Agricultural Assistant"
              description="Get helpful answers to general agricultural questions using AI."
            />

            {/* Crop Recognition */}

            <FeatureCard
              icon={ScanSearch}
              title="AI Crop Recognition"
              description="Upload a crop image to identify the crop and its category."
            />

            {/* Chat */}

            <FeatureCard
              icon={MessageCircle}
              title="Real-Time Chat"
              description="Farmers and buyers can communicate directly through the platform."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          Why Hawkins Farm
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Why Hawkins Farm?
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Built with the idea of making agriculture more connected, accessible
            and technology-driven.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Sprout size={24} />
              </div>

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                Farmer Empowerment
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Helping farmers reach buyers through digital technology.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Users size={24} />
              </div>

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                Better Connections
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Creating a direct connection between farmers and buyers.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Bot size={24} />
              </div>

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                Smart Agriculture
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Using modern technologies such as AI to improve the experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          Our Team
      ===================================================== */}

      <section className="border-y border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Users size={28} />
            </div>

            <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
              Built By Us
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Hawkins Farm is a collaborative project built by two developers
              with a shared interest in technology and solving real-world
              problems through software.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {/* =================================================
                Avinash Kumar
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  AK
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Avinash Kumar
                  </h3>

                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Developer
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
                <a
                  href="mailto:avinash.20234043@gmail.com"
                  className="flex items-center gap-3 break-all text-sm text-gray-600 transition hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  <Mail size={18} className="shrink-0" />
                  avinash.20234043@gmail.com
                </a>
              </div>
            </div>

            {/* =================================================
                Deepak Kumar Gaund
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  DK
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Deepak Kumar Gaund
                  </h3>

                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Developer
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
                <a
                  href="mailto:deepakgaund2004@gmail.com"
                  className="flex items-center gap-3 break-all text-sm text-gray-600 transition hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  <Mail size={18} className="shrink-0" />
                  deepakgaund2004@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          Closing
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Growing Together
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600 dark:text-gray-400">
            We believe technology can help create stronger connections between
            farmers and buyers. Hawkins Farm is our step toward making
            agricultural commerce simpler, smarter and more accessible.
          </p>

          <p className="mt-6 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            "From the farm to the future."
          </p>

          {/* Contact */}

          <div className="mt-10">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Want to connect with us?
            </p>

            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:avinash.20234043@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <Mail size={17} />
                Avinash Kumar
              </a>

              <a
                href="mailto:deepakgaund2004@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Mail size={17} />
                Deepak Kumar Gaund
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   Feature Card
========================================================= */

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-gray-50
        p-6
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-md
        dark:border-gray-800
        dark:bg-gray-900
      "
    >
      <Icon className="text-emerald-600 dark:text-emerald-400" size={28} />

      <h3 className="mt-4 font-bold text-gray-900 dark:text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

export default About;
