import { motion } from "framer-motion";
import { features } from "../data/features";

function Features() {
  return (
    <section
      className="
        bg-gray-50 py-24
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
            Why Choose Hawkins Farm?
          </h2>

          <p
            className="
              mx-auto mt-4 max-w-2xl
              text-gray-600

              dark:text-gray-300
            "
          >
            We connect farmers and consumers through a trusted, transparent, and
            technology-driven marketplace.
          </p>
        </div>

        {/* =================================================
            Feature Cards
        ================================================= */}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="
                  rounded-3xl
                  bg-white
                  p-8
                  shadow-lg
                  transition-all
                  duration-300
                  hover:shadow-2xl

                  dark:bg-gray-900
                  dark:shadow-gray-950/50
                  dark:hover:shadow-black/50
                "
              >
                {/* =================================================
                    Feature Icon
                ================================================= */}

                <div
                  className="
                    flex h-16 w-16
                    items-center justify-center
                    rounded-2xl
                    bg-emerald-100

                    dark:bg-emerald-950
                  "
                >
                  <Icon
                    className="
                      text-emerald-600
                      dark:text-emerald-400
                    "
                    size={30}
                  />
                </div>

                {/* =================================================
                    Feature Title
                ================================================= */}

                <h3
                  className="
                    mt-6
                    text-xl
                    font-semibold
                    text-gray-900

                    dark:text-gray-100
                  "
                >
                  {feature.title}
                </h3>

                {/* =================================================
                    Feature Description
                ================================================= */}

                <p
                  className="
                    mt-4
                    leading-7
                    text-gray-600

                    dark:text-gray-300
                  "
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
