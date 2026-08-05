import { Leaf } from "lucide-react";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center bg-emerald-600 text-white p-16">
        <div className="flex items-center gap-3">
          <Leaf size={40} />
          <h1 className="text-4xl font-bold">Hawkins Farm</h1>
        </div>

        <h2 className="mt-12 text-5xl font-bold leading-tight">
          Fresh Produce
          <br />
          Direct From Farmers
        </h2>

        <p className="mt-8 text-lg text-emerald-100 leading-8">
          Connect with trusted farmers, explore fresh products, and enjoy secure
          online shopping.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>

          <p className="mt-3 text-gray-500">{subtitle}</p>

          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
