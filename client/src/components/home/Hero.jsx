import { ArrowRight } from "lucide-react";
import heroImage from "../../assets/images/hero/hero.jpg";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}

          <div>
            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium mb-6">
              🌱 Fresh • Local • Trusted
            </span>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Connecting
              <span className="text-emerald-600"> Farmers</span>
              <br />
              Directly With Consumers
            </h1>

            <p className="mt-8 text-lg text-gray-600 leading-8">
              Buy fresh vegetables, fruits, grains and dairy products directly
              from trusted farmers. Support local agriculture while enjoying
              healthier food.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition">
                Explore Marketplace
                <ArrowRight size={20} />
              </button>

              <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-xl font-semibold transition">
                Become a Farmer
              </button>
            </div>
          </div>

          {/* Right */}

          <div>
            <img
              src={heroImage}
              alt="Farmer"
              className="
                rounded-3xl
                shadow-2xl
                object-cover
                w-full
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
