import { motion } from "framer-motion";
import { categories } from "../data/categories";

function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900">
            Browse by Category
          </h2>

          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Discover fresh farm products organized into popular categories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl p-6 cursor-pointer transition-all duration-300 text-center"
              >
                <div
                  className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto`}
                >
                  <Icon size={30} className="text-emerald-700" />
                </div>

                <h3 className="mt-5 font-semibold text-lg">{category.name}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
