import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Features from "../components/Features";
import FeaturedProducts from "../components/FeaturedProducts";
import Statistics from "../components/Statistics";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";

import CropPredictionCard from "../../cropRecognition/components/CropPredictionCard";

function Home() {
  return (
    <>
      <Hero />

      <CropPredictionCard />

      <Categories />

      <Features />

      <FeaturedProducts />

      <Statistics />

      <Testimonials />

      <CTA />
    </>
  );
}

export default Home;
