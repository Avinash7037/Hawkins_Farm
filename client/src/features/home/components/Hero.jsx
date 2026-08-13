import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import heroImage from "../../../assets/images/hero/hero.jpg";

import HeroStats from "./HeroStats";
import ScrollIndicator from "./ScrollIndicator";

function Hero() {
  return (
    <section
      className="
        flex min-h-[90vh] items-center
        bg-gradient-to-br
        from-green-50
        via-white
        to-green-100

        dark:from-gray-950
        dark:via-gray-900
        dark:to-emerald-950
      "
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* =================================================
              Left Content
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* =================================================
                Trust Badge
            ================================================= */}

            <span
              className="
                mb-8 inline-block rounded-full
                bg-emerald-100
                px-5 py-2
                font-medium
                text-emerald-700

                dark:bg-emerald-950
                dark:text-emerald-300
              "
            >
              🌱 Trusted by 1,200+ Farmers
            </span>

            {/* =================================================
                Heading
            ================================================= */}

            <h1
              className="
                text-5xl font-extrabold leading-tight
                text-gray-900
                lg:text-7xl

                dark:text-white
              "
            >
              Fresh Produce
              <span className="block text-emerald-600 dark:text-emerald-400">
                Direct From Farmers
              </span>
            </h1>

            {/* =================================================
                Description
            ================================================= */}

            <p
              className="
                mt-8 max-w-xl
                text-lg leading-8
                text-gray-600

                dark:text-gray-300
              "
            >
              Buy vegetables, fruits, grains and dairy products directly from
              trusted farmers across India while supporting local agriculture.
            </p>

            {/* =================================================
                Buttons
            ================================================= */}

            <div className="mt-10 flex flex-wrap gap-5">
              {/* Explore Marketplace */}

              <button
                type="button"
                className="
                  rounded-xl
                  bg-emerald-600
                  px-8 py-4
                  font-semibold
                  text-white
                  transition
                  hover:bg-emerald-700

                  dark:bg-emerald-600
                  dark:hover:bg-emerald-500
                "
              >
                Explore Marketplace
              </button>

              {/* Become a Farmer */}

              <button
                type="button"
                className="
                  flex items-center gap-2
                  rounded-xl
                  border-2 border-emerald-600
                  px-8 py-4
                  font-semibold
                  text-emerald-600
                  transition
                  hover:bg-emerald-50

                  dark:border-emerald-400
                  dark:text-emerald-400
                  dark:hover:bg-emerald-950
                "
              >
                Become a Farmer
                <ArrowRight size={18} />
              </button>
            </div>

            {/* =================================================
                Statistics
            ================================================= */}

            <HeroStats />
          </motion.div>

          {/* =================================================
              Right Image
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={heroImage}
              alt="Fresh produce from local farmers"
              className="
                w-full
                rounded-3xl
                object-cover
                shadow-2xl
              "
            />
          </motion.div>
        </div>

        {/* =================================================
            Scroll Indicator
        ================================================= */}

        <ScrollIndicator />
      </div>
    </section>
  );
}

export default Hero;
