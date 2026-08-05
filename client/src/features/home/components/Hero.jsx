import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import heroImage from "../../../assets/images/hero/hero.jpg";

import HeroStats from "./HeroStats";
import ScrollIndicator from "./ScrollIndicator";

function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full font-medium mb-8">
              🌱 Trusted by 1,200+ Farmers
            </span>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-gray-900">
              Fresh Produce
              <span className="block text-emerald-600">
                Direct From Farmers
              </span>
            </h1>

            <p className="mt-8 text-lg text-gray-600 leading-8 max-w-xl">
              Buy vegetables, fruits, grains and dairy products directly from
              trusted farmers across India while supporting local agriculture.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition">
                Explore Marketplace
              </button>

              <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition flex items-center gap-2">
                Become a Farmer
                <ArrowRight size={18} />
              </button>
            </div>

            <HeroStats />
          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={heroImage}
              alt="Fresh produce from local farmers"
              className="w-full rounded-3xl shadow-2xl object-cover"
            />
          </motion.div>
        </div>

        <ScrollIndicator />
      </div>
    </section>
  );
}

export default Hero;
