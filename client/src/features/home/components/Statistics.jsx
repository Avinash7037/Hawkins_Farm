import { motion } from "framer-motion";
import { stats } from "../data/stats";

function Statistics() {
  return (
    <section
      className="
        bg-emerald-600
        py-24
        text-white

        dark:bg-emerald-950
      "
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* =================================================
            Section Header
        ================================================= */}

        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            Trusted Across India
          </h2>

          <p
            className="
              mt-4
              text-emerald-100

              dark:text-emerald-200
            "
          >
            Thousands of farmers and consumers rely on Hawkins Farm every day.
          </p>
        </div>

        {/* =================================================
            Statistics
        ================================================= */}

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                className="text-center"
              >
                <div className="flex justify-center">
                  <Icon size={40} className="text-white" />
                </div>

                <h3 className="mt-6 text-5xl font-bold text-white">
                  {item.value}
                </h3>

                <p
                  className="
                    mt-3
                    text-emerald-100

                    dark:text-emerald-200
                  "
                >
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Statistics;
