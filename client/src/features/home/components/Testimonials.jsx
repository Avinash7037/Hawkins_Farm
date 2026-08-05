import { Star } from "lucide-react";
import { testimonials } from "../data/testimonials";

function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            What Our Users Say
          </h2>

          <p className="mt-4 text-gray-600">
            Trusted by farmers and customers across India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((user) => (
            <div
              key={user.id}
              className="bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex gap-1 text-yellow-500 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="text-gray-600 leading-7">"{user.review}"</p>

              <div className="flex items-center gap-4 mt-8">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-semibold">{user.name}</h4>

                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
