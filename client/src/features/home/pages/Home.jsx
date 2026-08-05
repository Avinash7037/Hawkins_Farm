import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Features from "../components/Features";
import FeaturedProducts from "../components/FeaturedProducts";
import Statistics from "../components/Statistics";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";

function Home() {
  return (
    <>
      <Hero />
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
