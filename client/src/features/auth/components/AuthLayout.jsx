import { Leaf } from "lucide-react";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950 lg:grid-cols-2">
      {/* =====================================================
          Left Side
      ===================================================== */}

      <div className="hidden flex-col justify-center bg-emerald-600 p-16 text-white lg:flex">
        <div className="flex items-center gap-3">
          <Leaf size={40} />

          <h1 className="text-4xl font-bold">Hawkins Farm</h1>
        </div>

        <h2 className="mt-12 text-5xl font-bold leading-tight">
          Fresh Produce
          <br />
          Direct From Farmers
        </h2>

        <p className="mt-8 text-lg leading-8 text-emerald-100">
          Connect with trusted farmers, explore fresh products, and enjoy secure
          online shopping.
        </p>
      </div>

      {/* =====================================================
          Right Side
      ===================================================== */}

      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8 transition-colors duration-300 dark:bg-gray-950">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-3 text-gray-500 dark:text-gray-400">{subtitle}</p>

          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
