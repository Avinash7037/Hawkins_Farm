import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  User,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/farmer",
  },
  {
    name: "Products",
    icon: Package,
    path: "/farmer/products",
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    path: "/farmer/orders",
  },
  {
    name: "Reviews",
    icon: Star,
    path: "/farmer/reviews",
  },
  {
    name: "Profile",
    icon: User,
    path: "/farmer/profile",
  },
];

function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-green-700 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Hawkins Farm</h2>
      </div>

      <nav className="space-y-2 px-4">
        {menus.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 ${
                isActive ? "bg-green-900" : "hover:bg-green-600"
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
