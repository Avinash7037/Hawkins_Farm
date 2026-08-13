import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { categories } from "../data/categories";

function Categories() {
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

        <div className="mb-14 text-center">
          <h2
            className="
              text-4xl
              font-bold
              text-gray-900

              dark:text-white
            "
          >
            Browse by Category
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-gray-600

              dark:text-gray-300
            "
          >
            Discover agricultural products available from farmers on Hawkins
            Farm.
          </p>
        </div>

        {/* =================================================
            Categories
        ================================================= */}

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
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
              >
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="
                    block
                    rounded-3xl
                    bg-white
                    p-6
                    text-center
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-2xl

                    dark:bg-gray-900
                    dark:shadow-gray-950/50
                    dark:hover:shadow-black/50
                  "
                >
                  {/* =================================================
                      Category Icon
                  ================================================= */}

                  <div
                    className={`
                      mx-auto
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      ${category.color}
                    `}
                  >
                    <Icon
                      size={30}
                      className="
                        text-emerald-700

                        dark:text-emerald-300
                      "
                    />
                  </div>

                  {/* =================================================
                      Category Name
                  ================================================= */}

                  <h3
                    className="
                      mt-5
                      text-lg
                      font-semibold
                      text-gray-900

                      dark:text-gray-100
                    "
                  >
                    {category.name}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-gray-500

                      dark:text-gray-400
                    "
                  >
                    View products
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
