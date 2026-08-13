import { Star } from "lucide-react";
import { testimonials } from "../data/testimonials";

function Testimonials() {
  return (
    <section
      className="
        bg-white
        py-24

        dark:bg-gray-950
      "
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* =================================================
            Section Header
        ================================================= */}

        <div className="mb-16 text-center">
          <h2
            className="
              text-4xl font-bold
              text-gray-900

              dark:text-white
            "
          >
            What Our Users Say
          </h2>

          <p
            className="
              mt-4
              text-gray-600

              dark:text-gray-300
            "
          >
            Trusted by farmers and customers across India.
          </p>
        </div>

        {/* =================================================
            Testimonials
        ================================================= */}

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((user) => (
            <div
              key={user.id}
              className="
                rounded-3xl
                bg-gray-50
                p-8
                shadow-lg
                transition
                hover:shadow-xl

                dark:bg-gray-900
                dark:shadow-gray-950/50
                dark:hover:shadow-black/50
              "
            >
              {/* =================================================
                  Rating
              ================================================= */}

              <div className="mb-4 flex gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              {/* =================================================
                  Review
              ================================================= */}

              <p
                className="
                  leading-7
                  text-gray-600

                  dark:text-gray-300
                "
              >
                "{user.review}"
              </p>

              {/* =================================================
                  User
              ================================================= */}

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>
                  <h4
                    className="
                      font-semibold
                      text-gray-900

                      dark:text-gray-100
                    "
                  >
                    {user.name}
                  </h4>

                  <p
                    className="
                      text-sm
                      text-gray-500

                      dark:text-gray-400
                    "
                  >
                    {user.role}
                  </p>
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
