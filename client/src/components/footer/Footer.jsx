import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <Leaf className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">Hawkins Farm</h2>
            </div>

            <p className="mt-4 text-gray-400">
              Connecting farmers directly with consumers through a trusted
              digital marketplace.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/register">Become a Farmer</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <p>Email: support@hawkinsfarm.com</p>
            <p className="mt-2">Phone: +91 98765 43210</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500">
          © {new Date().getFullYear()} Hawkins Farm. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
