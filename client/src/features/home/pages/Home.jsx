import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Features from "../components/Features";
import FeaturedProducts from "../components/FeaturedProducts";
import CTA from "../components/CTA";

import CropPredictionCard from "../../cropRecognition/components/CropPredictionCard";
import LiveAuctionsPreview from "../components/LiveAuctionsPreview";

import WeatherCard from "../../weather/components/WeatherCard";

function Home() {
  return (
    <>
      {/* =================================================
          Hero
      ================================================= */}

      <Hero />

      {/* =================================================
          Weather
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <WeatherCard />
      </section>

      {/* =================================================
          AI Crop Recognition
      ================================================= */}

      <CropPredictionCard />

      {/* =================================================
          Product Categories
      ================================================= */}

      <Categories />

      {/* =================================================
          Platform Features
      ================================================= */}

      <Features />

      {/* =================================================
          Featured Products
      ================================================= */}

      <FeaturedProducts />

      {/* =================================================
          Live Auctions
      ================================================= */}

      <LiveAuctionsPreview />

      {/* =================================================
          Call To Action
      ================================================= */}

      <CTA />
    </>
  );
}

export default Home;
