import { motion } from "framer-motion";
import { stats } from "../data/stats";

function Statistics() {
  return (
    <section className="py-24 bg-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Trusted Across India</h2>

          <p className="mt-4 text-emerald-100">
            Thousands of farmers and consumers rely on Hawkins Farm every day.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <Icon size={40} />
                </div>

                <h3 className="mt-6 text-5xl font-bold">{item.value}</h3>

                <p className="mt-3 text-emerald-100">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Statistics;
